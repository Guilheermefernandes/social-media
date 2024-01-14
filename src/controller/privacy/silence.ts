import { Users } from '@prisma/client';
import { RequestHandler } from 'express';
import * as silenceActions from '../../services/privacy/silence';
import { v4 as uuidv4 } from 'uuid';

const errorIndentifier: string = 'Indentificadores inválidos!';

export const silence: RequestHandler = async (req, res) => {
    const { userId, silenceId } = req.params;
    const input_userId = parseInt(userId);
    const input_silenceId = parseInt(silenceId);
    const user = req.user as Users;
    if(user.id !== input_userId) return { error: errorIndentifier };

    const indentifier = uuidv4();
    const silence = await silenceActions.silence({id_user: input_userId, id_silence: input_silenceId, indentifier});
    if(silence){
        return res.json(silence);
    }

    res.json(silence);
}

export const unSilence: RequestHandler = async (req, res) => {
    const { indentifier} = req.params;

    const unSilence = await silenceActions.unSilence(indentifier);
    if(unSilence) return res.json({unSilence, message: 'Success'});

    res.json(unSilence);
}

export const muted_contacts: RequestHandler = async (req, res) => {
    const user = req.user as Users;

    const muted_contacts = await silenceActions.muted_contacts(user.id);
    if(muted_contacts) return res.json(muted_contacts);

    res.json(muted_contacts);
}