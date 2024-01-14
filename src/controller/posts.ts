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

    const date_created = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour12: false });

    const { id_user, ...omit_post } = body.data; 
    const data_post = { ...body.data, date_created, id_user: parseInt(id_user) };

    const files = req.files;
    const full_image_data: SchemaImage[] = [];
    if(Array.isArray(files)){
        for(let i=0;i<files.length;i++){
            const image = { image_indentifier: files[i].filename, id_user: user.id };
            full_image_data.push(image);
        }
    }

    const post = await postServices.create_post(data_post, full_image_data);
    if(post){
        return res.json(post);
    }

    res.json({ error: post });
}

export const get_all_post: RequestHandler = async (req, res) => {
    const { userId } = req.query;
    const user = req.user as Users;

    if(userId){
        const posts = await postServices.get_all_posts(parseInt(userId as string), user.id);
        return res.json(posts);
    }

    /*
    const posts = await postServices.get_all_posts(user.id);
    if(posts){
        return res.json(posts);
    }

    res.json({ error: posts });
    */
}

// TODO (GET ONE POST)(GET ALL POST)(POSTS HOME)(EDIT POST)(DELETE POST)