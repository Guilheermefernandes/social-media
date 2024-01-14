import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SchemaSilenceCreate = Prisma.Args<typeof prisma.silence, 'create'>['data']
export const silence = async (data: SchemaSilenceCreate) => {
    try{
        const silence = await prisma.silence.create({ data });
        return silence;
    }catch(err) { return false }
}

export const unSilence = (indentifier: string) => {
    try{
        const unSilence = prisma.silence.delete({
            where: { indentifier }
        });
        if(unSilence) return unSilence

        return { error: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false };
}

interface SchemaSilenceContacts {
    avatar: string | null,
    name_user: string,
    name: string
}
export const muted_contacts = async (id: number) => {
    try{
        const contacts = await prisma.silence.findMany({
            where: { id_user: id }
        });
        if(contacts){
            const list_contacts: SchemaSilenceContacts[] = []
            for(let i=0;i<contacts.length;i++){
                const user = await prisma.users.findFirst({
                    where: { id: contacts[i].id_silence }
                });
                if(!user) continue;
                list_contacts.push({
                    ...contacts[i],
                    avatar: user.avatar,
                    name_user: user.name_user,
                    name: user.name
                });
            }

            return list_contacts;
        }
    }catch(err) { return false }
}