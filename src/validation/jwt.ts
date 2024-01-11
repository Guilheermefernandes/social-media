import jwt from 'jsonwebtoken';

export const generateJwt = (id: number) => {
    return jwt.sign({ id }, process.env.SECRET_KEY as string);
};