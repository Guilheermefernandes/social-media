import { PrismaClient, Prisma, Blocked } from '@prisma/client';

const prisma = new PrismaClient();

type SchemaCreateBlocked = Prisma.Args<typeof prisma.blocked, 'create'>['data'];
export const blocked = async (data: SchemaCreateBlocked) => {
    try{
        const blocked = await prisma.blocked.create({ data });
        if(blocked) return blocked;

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

export const unlock = async (indentifier: string) => {
    try{
        const unlock = await prisma.blocked.delete({
            where: { indentifier }
        });
        if(unlock) return unlock;

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

interface ScehmaBlockedContacts extends Blocked {
    avatar: string | null,
    name_user: string,
    name: string
}
export const blocked_contacts = async (id: number) => {
    try{
        const contacts = await prisma.blocked.findMany({
            where: { id_user: id }
        });
        if(contacts){
            const list_contacts: ScehmaBlockedContacts[] = [];
            for(let i=0;i<contacts.length;i++){
                const user = await prisma.users.findFirst({
                    where: { id: contacts[i].id_blocked }
                });

                // TODO update avatar
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

        return { message: 'Não há nenhum contato bloqueado!'};
    }catch(err) { return false }
}