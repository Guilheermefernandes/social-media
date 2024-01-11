import { Users } from "@prisma/client";
import { RequestHandler } from "express";
import * as follow from '../services/follow';

export const subscribe: RequestHandler = async (req, res) => {
    const { userId } = req.params
    const user = req.user as Users;

    const subscribe = await follow.subscribe({ me: user, user: parseInt(userId) });
    if(subscribe){
        return res.json({ response: subscribe });
    }

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

export const reply_request: RequestHandler = async (req, res) => {
    const { userId, indentifier } = req.params;
    let { operation } = req.query;
    const user = req.user  as Users;

    if(operation && typeof operation === 'string'){
       operation.toUpperCase(); 
    } else { return res.json({ error: 'Operação inválida!' }) };

    const reply_request = await follow.reply_request({ me: user, user: parseInt(userId), 
        operation: operation as string, indentifier: indentifier as string});
    if(reply_request){
        return res.json({ response: reply_request });
    }

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

export const follow_back_private_account: RequestHandler = async(req, res) => {
    const { userId, indentifier } = req.params;
    const user = req.user  as Users;


    const follow_back_private_account = await follow.follow_back_private_account({ me: user, user: parseInt(userId), indentifier: indentifier as string});
    if(follow_back_private_account){
        return res.json({ response: follow_back_private_account });
    }

    res.json({ error: 'Ocorreu um erro! Tente novamente.' });
}

export const allFollowers: RequestHandler = async (req, res) => {
    const { userId } = req.query;
    const user = req.user as Users;
    if(userId && typeof userId === 'string'){
        const followers = await follow.getAllFollowers(parseInt(userId));
        if(followers) return res.json({ followers });

        return res.json({ error: followers });
    }

    const followers = await follow.getAllFollowers(user.id);
    if(followers){
        const followers = await follow.getAllFollowers(user.id);
        if(followers) return res.json({ followers });
    }
    res.json({ error: followers });
}

export const allFollowing: RequestHandler = async (req, res) => {
    const { userId } = req.query;
    const user = req.user as Users;
    if(userId && typeof userId === 'string'){
        const following = await follow.getAllFollowing(parseInt(userId));
        if(following) return res.json({ following });

        return res.json({ error: following });
    }

    const following = await follow.getAllFollowing(user.id);
    if(following){
        const following = await follow.getAllFollowers(user.id);
        if(following) return res.json({ following });
    }
    res.json({ error: following });
}

export const stop_following: RequestHandler = async (req, res) => {
    const { userId } = req.params;
    const user = req.user as Users;

    const cancelation = await follow.stop_following(user.id, parseInt(userId));
    if(cancelation){
        return res.json({ cancelation });
    }

    res.json({ cancelation });
}

export const unsubscribe: RequestHandler = async (req, res) => {
    const { userId } = req.params;
    const user = req.user as Users;

    const canceled = await follow.unsubscribe(user.id, parseInt(userId));
    if(canceled){
        return res.json({ canceled });
    }

    res.json({ canceled });
}