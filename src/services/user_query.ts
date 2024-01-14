import { PrismaClient, Prisma, Users } from '@prisma/client';

const prisma = new PrismaClient();

type CountResult = { count: bigint }[];
export const cout_search = async (s: string, id: number) => {
    const count: CountResult = await prisma.$queryRaw`SELECT COUNT(*) FROM users WHERE UPPER(name) LIKE UPPER(${`%${s}%`}) and deleted = false and archive_account = false and NOT id = ${id}`;
    return count;
}

type UserOmit = Omit<Users, 'password'>;
export const getOne = async (name_user: string) => {
    try{
        const raw_user_data = await prisma.users.findFirst({
            where: {
                name_user
            }
        });
        if(raw_user_data){
            const { password, email, ...user } = raw_user_data
            return { user, code: 200 };
        }

        return { error: 'Este usuário não existe!', code: 404 };
    }catch(err) { return false } 
}

type SchemaQuery = { s?: string, id?: number, limit: number, offset: number };
export const search = async (query: SchemaQuery) => {
    try{
        if(query.s){
            const result: Users[] = await prisma.$queryRaw`SELECT * FROM users WHERE UPPER(name) LIKE UPPER(${`%${query.s}%`}) OR UPPER(name_user) LIKE UPPER(${`%${query.s}%`}) LIMIT ${query.limit} OFFSET ${query.offset}`;
            if(result){
                const blocked = await prisma.blocked.findFirst(
                    { where: { id_blocked: query.id } });
                if(blocked){
                    const new_result = result.filter(item => item.id !== blocked.id_user)
                        .filter(item => item.deleted === false && item.archive_account === false);
                    if(new_result.length === 0) return { result_list: new_result, response: false};
                    return { result_list: new_result, response: true };
                }
                
                const new_result = result.filter(item => item.deleted === false && item.archive_account === false && item.id !== query.id); 
                if(new_result.length === 0) return { result_list: new_result, response: false };
                return { result_list: new_result, response: true };
            }
        }

        return { erro: 'Ocorreu um erro! Tente novamente.' }
    }catch(err) { false }
}

type SchemaUpdateUser = Prisma.Args<typeof prisma.users, 'update'>['data'];
export const update = async (data: SchemaUpdateUser, id: number) => {
    try{
        if(data.email){
            const result = await prisma.users.findFirst({
                where: {
                    email: data.email as string
                }
            });
            if(result) return { error: 'Esse email já existe! Tente outro.' };
        }

        if(data.name_user){
            const result = await prisma.users.findFirst({
                where: {
                    name_user: data.name_user as string
                }
            });
            if(result) return { error: 'Esse nome de usuario já existe!' };
        }

        const update = await prisma.users.update({ where: { id }, data });
        const { password, email, ...user } = update;
        return { code: 201, user };
    }catch(err) { return false }
}

export const deleteUser = async (id: number) => {
    try{
        return await prisma.users.delete({ where: { id } });
    }catch(err) { return false }
}