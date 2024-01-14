import { RequestHandler } from 'express';
import * as retrievePost from '../services/retrieve_post_data'
import { Users } from '@prisma/client';

// TODO refactor
export const get_comments: RequestHandler = async (req, res) => {
    const { postId } = req.params;
    const { load = 1 } = req.query;
    const default_load = 10;

    const user = req.user as Users; 

    const input_postId = parseInt(postId);
    const input_load = parseInt(load as string);
    if(Number.isNaN(input_load) || Number.isNaN(input_postId) 
        ) return res.json({ error: 'Ocorreu um erro no tratamento! Tente novamente.' });

    const number_of_comments = await retrievePost.count_comment(input_postId);
    let number_of_loads: number = 0;
    if(number_of_comments){
        number_of_loads = Math.ceil(number_of_comments / default_load);
        if(input_load > number_of_loads) return res.json({ message: 'Não há mais comentários!' });
    }

    const salt = default_load - (input_load * default_load);
    
    const comments = await retrievePost.get_comments(input_postId, user.id, salt, default_load);
    const next_load: number | null = (input_load + 1) <= number_of_loads ? input_load + 1 : null; 

    if(comments) return res.json({comments, current_load: input_load, number_of_loads, next_load});

    res.json({ message: 'Não há nenhum comentário!' });
}

export const get_sub_comments: RequestHandler = async (req, res) => {
    const { postId, commentId } = req.params;
    const { load = 1 } = req.query;
    const default_load = 10
    
    const input_postId = parseInt(postId);
    const input_commentId = parseInt(commentId);
    const input_load = parseInt(load as string);
    if(Number.isNaN(input_postId) || Number.isNaN(input_commentId) 
        || Number.isNaN(input_load)) return res.json({ error: 'Ocorreu um erro no tratamento! Tente novamente.' });


    const number_of_sub_comments = await retrievePost.cout_sub_comments(input_postId, input_commentId);
    let number_of_loads: number = 0;
    if(number_of_sub_comments){
        number_of_loads = Math.ceil(number_of_sub_comments / default_load);
        if(input_load > number_of_loads) return res.json({ message: 'Não há mais subcomentários!' })
    }

    const jump = default_load - (input_load * default_load);

    const sub_comments = await retrievePost.get_sub_comments(input_postId, input_commentId, jump, default_load);
    if(sub_comments) return res.json(sub_comments);

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}