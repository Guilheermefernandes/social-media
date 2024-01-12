import { RequestHandler } from 'express';
import * as retrievePost from '../services/retrieve_post_data'

export const get_comments: RequestHandler = async (req, res) => {
    const { postId } = req.params;
    const { load = 1 } = req.query;
    const default_load = 10;

    const number_of_comments = await retrievePost.count_comment(parseInt(postId));
    let number_of_loads: number = 0;
    if(number_of_comments){
        number_of_loads = Math.ceil(number_of_comments / default_load);
    }

    const salt = default_load - (parseInt(load as string) * default_load);
    
    const comments = await retrievePost.get_comments(parseInt(postId), salt, default_load);
    if(comments) return res.json({comments, current_load: parseInt(load as string), number_of_loads});

    res.json({ message: 'Não há nenhum comentário!' });
}

export const get_sub_comments: RequestHandler = async (req, res) => {
    
}