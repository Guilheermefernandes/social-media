import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SchemaCreateBlocked = Prisma.Args<typeof prisma.blocked, 'create'>['data'];
export const blocked = async (data: SchemaCreateBlocked) => {
    try{
        const blocked = await prisma.blocked.create({ data });
        if(blocked) return blocked;

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

export const unlock = async (id: number) => {
    try{
        const unlock = await prisma.blocked.delete({
            where: { id }
        });
        if(unlock) return unlock;

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

export const blocked_contacts = async (id: number) => {
    try{
        const contacts = await prisma.blocked.findMany({
            where: { id_user: id }
        });
        if(contacts) return contacts;

        return { message: 'Não há nenhum contato bloqueado!'};
    }catch(err) { return false }
}