import { Router } from "express";
import * as auth from '../controller/auth';
import * as user_query from '../controller/user_query';
import passport from '../validation/passport';
import * as follow from '../controller/follow';

const router = Router();

router.post('/login', auth.login);
router.post('/signup', auth.signup);

router.get('/user', passport.authenticate('jwt', {session: false}),user_query.getOne);
router.get('/user/search', passport.authenticate('jwt', {session: false}), user_query.search);
router.put('/user/update', passport.authenticate('jwt', {session: false}), user_query.update);

// ENVIA 
router.post('/submit/request/:userId', passport.authenticate('jwt', {session: false}), follow.subscribe);

// ACEITA repete
router.post('/request/:userId/:indentifier', passport.authenticate('jwt', {session: false}), follow.reply_request);

// ENVIAR REQUISIÇÃO PRIVADA
router.post('/follow_back/:userId/:indentifier', passport.authenticate('jwt', {session: false}), follow.follow_back_private_account);

router.get('/all/followers', passport.authenticate('jwt', {session: false}), follow.allFollowers);

router.get('/all/following', passport.authenticate('jwt', {session: false}), follow.allFollowing);

router.put('/cancelation/following/:userId', passport.authenticate('jwt', {session: false}), follow.stop_following);

router.put('/unsubscribe/:userId', passport.authenticate('jwt', {session: false}), follow.unsubscribe);

export default router;