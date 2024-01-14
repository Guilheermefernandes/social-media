import { Users } from '@prisma/client';
import { RequestHandler } from 'express';
import * as blockedActions from '../../services/privacy/blocked';
import { v4 as uuidv4 } from 'uuid'

const errorTratament: string = 'Ocorreu um erro no tratamento! Tente novamente.';

export const blocked: RequestHandler = async (req, res) => {
    const { userId, blockedId } = req.params;
    const input_userId = parseInt(userId);
    const input_blockedId = parseInt(blockedId);
    if(Number.isNaN(input_userId) || Number.isNaN(input_blockedId)) return res.json({ error: errorTratament });

    const user = req.user as Users;
    if(user.id !== input_userId) return res.status(401).json({ code: 401, error: 'Indentificadores diferentes!' });

    const indentifier  = uuidv4();
    const blocked = await blockedActions.blocked({id_user: input_userId, id_blocked: input_blockedId, indentifier});
    if(blocked) return res.json(blocked);

    res.json({ error: blocked });
}

export const unLock: RequestHandler = async (req, res) => {
    const { indentifier } = req.params;

    const unLock = await blockedActions.unlock(indentifier);
    if(unLock) return res.json(unLock);

    res.json(unLock);
}
export const blocked_contacts: RequestHandler = async (req, res) => {
    const user = req.user as Users;

    const blocked_contacts = await blockedActions.blocked_contacts(user.id);
    if(blocked_contacts) return res.json(blocked_contacts)

    res.json(blocked_contacts);
}