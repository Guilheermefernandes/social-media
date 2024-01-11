import { RequestHandler } from "express";
import z, { array } from 'zod';
import * as postServices from '../services/posts';
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

export const like_post: RequestHandler = async (req, res) => {
    const { userId, postId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like = await postServices.like_post({
        id_user: parseInt(userId),
        id_post: parseInt(postId)
    }, user.id);
    if(like){
        return res.json(like);
    }

    res.json({ error: like });
}

export const delete_like_post: RequestHandler = async (req, res) => {
    const { likeId, postId, userId } = req.params;
    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });
    const deleted_like = await postServices.delete_like_post({
        id: parseInt(likeId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    });
    if(deleted_like) return res.json(deleted_like);

    res.json({ error:deleted_like })
}

export const create_comment: RequestHandler = async (req, res) => {
    const { userId, postId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const schemaCreateComment = z.object({
        comment: z.string()
    });
    const body = schemaCreateComment.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    const date_created = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo', hour12: false});

    const data = {
        id_user: parseInt(userId),
        id_post: parseInt(postId),
        comment: body.data.comment,
        date_created
    }

    const comment = await postServices.create_comment(data);
    if(comment){
        return res.json(comment);
    }

    res.json({ error: comment });
}

export const like_comment: RequestHandler = async (req, res) => {
    const { userId, postId, commentId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like_comment = await postServices.like_comment({
        id_user: parseInt(userId),
        id_post: parseInt(postId),
        id_comment: parseInt(commentId)
    });
    if(like_comment){
        return res.json(like_comment);
    }

    res.json({ error: like_comment });
}

export const create_sub_comment_post: RequestHandler = async (req, res) => {
    const { userId, postId, commentId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const schemaCreateSubComment = z.object({
        comment: z.string()
    });
    const body = schemaCreateSubComment.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    const date_created = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo', hour12: false});

    const data = {
        id_post: parseInt(postId),
        id_comment: parseInt(commentId),
        id_user: parseInt(userId),
        comment: body.data.comment,
        date_created
    }

    const sub_comment = await postServices.create_sub_comment_post(data);
    if(sub_comment){
        return res.json(sub_comment);
    }

    res.json({ error: sub_comment });
}

export const like_sub_comment: RequestHandler = async (req, res) => {
    const { postId, commentId, subCommentId, userId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like_sub_comment = await postServices.like_sub_comment({
        id_post: parseInt(postId),
        id_comment: parseInt(commentId),
        id_sub_comment: parseInt(subCommentId),
        id_user: parseInt(userId)
    });
    if(like_sub_comment){
        return res.json(like_sub_comment);
    }

    res.json({ error: like_sub_comment });
}