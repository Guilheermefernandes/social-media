import { Router } from 'express';
import passport from '../validation/passport';
import * as blockedActions from '../controller/privacy/blocked';

const router = Router();

router.post('/blocked/user_blocked/:blockedId/user/:userId', passport.authenticate('jwt', {session: false}), blockedActions.blocked);

export default router;