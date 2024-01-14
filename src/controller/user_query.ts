import { Users } from "@prisma/client";
import { RequestHandler } from "express";
import * as user_query from '../services/user_query';
import z from 'zod';
import * as validator from '../../lib/validator';

type OmitUser = Omit<Users, 'password' | 'email'>;
export const getOne: RequestHandler = async (req, res) => {
    const { u } = req.query;

    const raw_user_data = req.user as Users;
    if(u){
        const consulted_user = await user_query.getOne(u as string);
        if(consulted_user){
            return res.json({ response: consulted_user });
        }
    }
    const user: OmitUser = raw_user_data; 

    return res.json({
        user
    });
}

type CountResult = { count: bigint }[];
export const search: RequestHandler = async (req ,res) => {
    const { s, load = 1 } = req.query;
    const user = req.user as Users;
    const limit = 10;

    const input_load = parseInt(load as string);

    const result: CountResult = await user_query.cout_search(s as string, user.id);
    const number_of_records = parseInt(result[0].count.toString().replace('n', '')); 
    
    const number_of_loads = Math.ceil(number_of_records / limit);

    if(input_load > number_of_loads) return res.json({ message: `Não há mais contatos com o nome ${s}!` });
    const next_load = input_load < number_of_loads ? input_load + 1 : input_load;

    const offset = (input_load * limit) - limit;

    if(typeof s === 'string'){
        const result = await user_query.search({ s: s as string, id: user.id, limit, offset });
        if(result && result.response){
            return res.json({ 
                result,
                number_of_loads,
                current_load: input_load,
                isNext: next_load === input_load ? false : true,
                next_load
            });
        }else{ return res.json({ message: 'Não há registros com esse nome!' }); }
    }

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

export const update: RequestHandler = async (req, res) => {
    const user = req.user as Users;

    const schemaUpdateUser = z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        name_user: z.string().optional(),
        private_account: z.boolean().optional(),
        web_site_link: z.string().optional()
    });
    const body = schemaUpdateUser.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    if(body.data.email){
        const result = validator.isEmail(body.data.email);
        if(result) return res.json({ error: 'Email inválido!' });
    }
    if(body.data.password){
        const result = validator.isPassword(body.data.password);
        if(result) return res.json({ error: 'Senha inválida!' });
    }

    body.data.name_user = body.data.name_user?.toLowerCase();

    const update = await user_query.update(body.data, user.id);
    if(update){
        return res.json({ update });
    }

    res.json({ error: update });
}

export const deleteUser: RequestHandler = async (req, res) => {
    const user = req.user as Users;

    const user_deleted = await user_query.deleteUser(user.id);
    if(user_deleted){
        return res.json({ response: deleteUser });
    }

    res.json({ error: deleteUser });
}