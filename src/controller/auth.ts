import { RequestHandler } from 'express';
import z from 'zod';
import * as validator from '../../lib/validator';
import * as auth from '../services/auth';
import { Users } from '@prisma/client';

const credentialsError: string = 'Email e/ou senha inválidos!';
const fatalError: string = 'Ocorreu um erro! Tente novamente.'

const generate_user_name = (name: string, date_birth: string) => {
    const first_name = name.split(' ')[0];
    const birth = date_birth.replace('/', '').replace('/', '');
    return `${first_name}${birth}`;
}

export const login: RequestHandler = async (req, res) => {
    const schemaLogin = z.object({
        email: z.string(),
        password: z.string()
    });
    const body = schemaLogin.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    const isEmail = validator.isEmail(body.data.email);
    if(!isEmail) return res.json({ error: credentialsError });

    const isPassword = validator.isPassword(body.data.password);
    if(!isPassword) return res.json({ error: credentialsError });

    const response = await auth.login(body.data);
    if(response){
        return res.status(200).json({ user: response });
    }

    res.json({ response });
}

export const signup: RequestHandler = async (req, res) => {
    const schemaCreateUser = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        date_of_birth: z.string()
    });
    const body = schemaCreateUser.safeParse(req.body);
    if(!body.success) return res.json({ error: credentialsError });

    const isEmail = validator.isEmail(body.data.email);
    if(!isEmail) return res.json({ error: 'Email inválido!' });

    const isPassword = validator.isPassword(body.data.password);
    if(!isPassword) return res.json({ error: 'Senha inválida!' });

    const name_user = generate_user_name(body.data.name, body.data.date_of_birth).toLowerCase();
    const describe = '';

    const data = {...body.data, name_user, describe};

    const response = await auth.signup(data);
    if(response){
        return res.json({ response });
    }

    return res.json({ response });
}