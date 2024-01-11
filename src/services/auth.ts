import { PrismaClient, Prisma, Users } from '@prisma/client';
import * as bcrypt from '../utils/bcrypt';
import { generateJwt } from '../validation/jwt';

const prisma = new PrismaClient();

type SchemaCredentials = { email: string, password: string };
export const login = async (credentials: SchemaCredentials) => {
    try{
        const raw_user_data = await prisma.users.findFirst({
            where: {
                email: credentials.email
            }
        });
        if(raw_user_data){
            const result = await bcrypt.validation({ 
                currentpassword: credentials.password, password: raw_user_data.password });
            if(!result){
                return { error: 'Senha inválida!' };
            }

            const { password, email, ...user } = raw_user_data;
            const token = generateJwt(user.id);
            return { code: 200, user, token };
        }

        return { error: 'Usuário não existente', code: 404 };
    }catch(err) { return false };
}

type SchemaCreateUser = Prisma.Args<typeof prisma.users, 'create'>['data'];
export const signup = async (data: SchemaCreateUser) => {
    try{
        const check_for_user_existence = await prisma.users.findFirst({
            where: {
                OR: [
                    { email: data.email },
                    { name_user: data.name_user }
                ]
            }
        });
        if(check_for_user_existence){
            return { error: 'email e/ou nome de usuário já existente!' };
        }

        const password = await bcrypt.createBcrypt(data.password);
        data.password = password;
        const raw_user_data = await prisma.users.create({ data });
        if(raw_user_data){
            const { password, email, ...user } = raw_user_data;
            const token = generateJwt(user.id);
            return { code: 201, user, token };
        }
        return { error: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false };
}