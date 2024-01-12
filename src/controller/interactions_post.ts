import { RequestHandler } from "express";
import z, { array } from 'zod';
import * as interactionsPost from '../services/interactions_post';
import { Users } from "@prisma/client";

const errorIndentifier: string = 'Indentificador diferentes!';

export const like_post: RequestHandler = async (req, res) => {
    const { userId, postId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like = await interactionsPost.like_post({
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
    const deleted_like = await interactionsPost.delete_like_post({
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

    const comment = await interactionsPost.create_comment(data);
    if(comment){
        return res.json(comment);
    }

    res.json({ error: comment });
}

export const edit_comment: RequestHandler = async (req, res) => {
    const { postId, commentId, userId } = req.params;
    const user = req.user as Users;
    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const schemaEditComment = z.object({
        comment: z.string().optional()
    });
    const body = schemaEditComment.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    const release_date = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo', hour12: false});

    const comment_update = await interactionsPost.edit_comment({
        id: parseInt(commentId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    }, { ...body.data, release_date }) 
    if(comment_update) return res.json(comment_update);

    res.json({ error: comment_update });
}

export const delete_comment: RequestHandler = async (req, res) => {
    const { postId, commentId, userId } = req.params;
    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const deleted_comment = await interactionsPost.delete_comment({
        id: parseInt(commentId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    });
    if(deleted_comment){
        return res.json(deleted_comment);
    }

    res.json({ error: delete_comment });
}

export const like_comment: RequestHandler = async (req, res) => {
    const { userId, postId, commentId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like_comment = await interactionsPost.like_comment({
        id_user: parseInt(userId),
        id_post: parseInt(postId),
        id_comment: parseInt(commentId)
    });
    if(like_comment){
        return res.json(like_comment);
    }

    res.json({ error: like_comment });
}

export const delete_like_comment: RequestHandler = async (req, res) => {
    const { postId, commentId, likeId, userId } = req.params;
    const user = req.user as Users;
    
    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const deleted_like_comment = await interactionsPost.delete_like_comment({
        id: parseInt(likeId),
        id_post: parseInt(postId),
        id_comment: parseInt(commentId),
        id_user: parseInt(userId)
    });
    if(deleted_like_comment) return res.json(deleted_like_comment);
    
    res.json({ error: deleted_like_comment });
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

    const sub_comment = await interactionsPost.create_sub_comment_post(data);
    if(sub_comment){
        return res.json(sub_comment);
    }

    res.json({ error: sub_comment });
}

export const edit_sub_comment: RequestHandler = async (req, res) => {
    const { subCommentId, commentId, postId, userId } = req.params;
    const user = req.user as Users;
    
    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const schemaUpdateSubComment = z.object({
        comment: z.string().optional()
    });
    const body = schemaUpdateSubComment.safeParse(req.body);
    if(!body.success) return res.json({ error: 'Dados inválidos!' });

    const release_date = new Date().toLocaleString('en-US', {timeZone: 'America/Sao_Paulo', hour12: false});

    const sub_comment_update = await interactionsPost.edit_sub_comment({
        id: parseInt(subCommentId),
        id_comment: parseInt(commentId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    }, { ...body.data, release_date });
    if(sub_comment_update) return res.json(sub_comment_update);

    res.json({ error: sub_comment_update });
}

export const delete_sub_comment: RequestHandler = async (req, res) => {
    const { subCommentId, commentId, postId, userId } = req.params;
    const user = req.user as Users;
    
    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const deleted_sub_comment = await interactionsPost.delete_sub_comment({
        id: parseInt(subCommentId),
        id_comment: parseInt(commentId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    });
    if(deleted_sub_comment) return res.json(deleted_sub_comment);

    res.json({ error: deleted_sub_comment });
}

export const like_sub_comment: RequestHandler = async (req, res) => {
    const { postId, commentId, subCommentId, userId } = req.params;

    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.json({ error: errorIndentifier });

    const like_sub_comment = await interactionsPost.like_sub_comment({
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

export const delete_like_sub_comment: RequestHandler = async (req, res) => {
    const { likeId, subCommentId, commentId, postId, userId } = req.params;
    const user = req.user as Users;

    if(user.id !== parseInt(userId)) return res.status(401).json({ code: 401, error: errorIndentifier });

    const deleted_like_sub_comment = await interactionsPost.delete_like_sub_comment({
        id: parseInt(likeId),
        id_sub_comment: parseInt(subCommentId),
        id_comment: parseInt(commentId),
        id_post: parseInt(postId),
        id_user: parseInt(userId)
    });
    if(deleted_like_sub_comment) return res.json(deleted_like_sub_comment);

    res.json({ error: deleted_like_sub_comment });
}