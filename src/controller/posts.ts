import { RequestHandler } from "express";
import z, { array } from 'zod';
import * as postServices from '../services/posts';
import * as interactionsPost from '../services/interactions_post';
import { Comments_post, Users } from "@prisma/client";

const errorIndentifier: string = 'Indentificador diferentes!';

type SchemaImage = { image_indentifier: string, id_user: number };

export const create_post: RequestHandler = async (req, res) => {

    const user = req.user as Users;

    const schemaCreatePost = z.object({
        describe: z.string(),
        id_user: z.string(),
    });

    const body = schemaCreatePost.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });
    if(parseInt(body.data.id_user) !== user.id) return res.json({ error: 'Indentificadores inválidos!' });

    const date_created = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: false });
    const timestamp: number = new Date().getTime();

    const { id_user, ...omit_post } = body.data; 
    const data_post = { ...body.data, date_created, id_user: parseInt(id_user), timestamp };

    const files = req.files;
    const full_image_data: SchemaImage[] = [];
    if(Array.isArray(files) && files.length > 0){
        for(let i=0;i<files.length;i++){
            const image = { image_indentifier: files[i].filename, id_user: user.id };
            full_image_data.push(image);
        }
    }else{
        return res.json({ error: 'Envie ao menos 1 imagem!' });
    }

    const post = await postServices.create_post(data_post, full_image_data);
    if(post){
        return res.json(post);
    }

    res.json({ error: post });
    
}

export const get_one: RequestHandler = async (req, res) =>{
    const { postId, userIdPost } = req.params
    const input_postId = parseInt(postId);
    const input_userIdPost = parseInt(userIdPost);
    if(Number.isNaN(input_postId) || Number.isNaN(input_userIdPost)) return res.json({ error: 'Dados de entrada inválidos!' });

    const user = req.user as Users;

    const post = await postServices.get_one(input_postId, user.id, input_userIdPost);
    if(post) return res.json(post);

    res.json({ error: 'Ocorreu um erro! Tente novamente.'});
}   

export const get_all_post: RequestHandler = async (req, res) => {
    const { userId, load = 1 } = req.query;
    const input_userId = parseInt(userId as string);
    const input_load = parseInt(load as string);
    if(Number.isNaN(input_userId) || Number.isNaN(input_load)) return res.json({ error: 'Dados de entrada inválidos!' });

    const user = req.user as Users;
    const default_load = 10

    const number_of_posts = await postServices.count_post(input_userId);
    let number_of_loads:number = 0;
    if(number_of_posts && number_of_posts > 0){
        number_of_loads = Math.ceil(number_of_posts / default_load);
    }else { return res.json({ message: 'Não há nenhuma publicação!' }) };

    if(input_load > number_of_loads) return res.json({ message: 'Não há mais publicações!' });

    const offset = (input_load * default_load) - default_load;

    
    const posts = await postServices.get_all_posts(input_userId, offset, default_load, user.id);
    if(posts){
        return res.json(posts);
    }
    
    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

export const home: RequestHandler = async (req, res) => {
    const { load = 1 } = req.query;
    const user = req.user as Users;

    const input_load = parseInt(load as string);
    if(Number.isNaN(input_load)) return res.json({ error: 'Parâmetros inválidos!' });
    const default_load = 4;

    const count = await postServices.home_count(user.id);

    const posts = await postServices.home(user.id, 0, default_load);
    if(posts) return res.json(posts);

    res.json({ error: 'Ocorreu um erro! Tente novamente.' })
}

export const update_post: RequestHandler = async (req, res) => {
    const { postId } = req.params;
    const input_postId = parseInt(postId);
    if(Number.isNaN(input_postId)) return res.json({ error: 'Parâmetro inválido!' });
    const user = req.user as Users;

    const schemaUpdatePost = z.object({
        describe: z.string().optional(),
        disposition_status: z.boolean().optional(),
        private: z.boolean().optional(),
        deleted: z.boolean().optional()
    });
    const body = schemaUpdatePost.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados de inválidos!' }); 

    const edited = true;
    const edition_date = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo', hour12: false});

    const post = await postServices.update_post(input_postId, user.id, {
        ...body.data,
        edited,
        edition_date
    });
    if(post) return res.json(post);

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

// TODO (GET ONE POST)(GET ALL POST)(POSTS HOME)(EDIT POST)(DELETE POST)