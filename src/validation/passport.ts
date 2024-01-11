import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import * as user_query from '../services/user_query';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY as string
}

passport.use(new JwtStrategy(options, async (payload, done) => {
    const user = await prisma.users.findUnique({
        where: { id: payload.id }
    });
    if(user){
        return done(null, user);
    }else{
        return done(null, false);
    }
}));

export default passport;