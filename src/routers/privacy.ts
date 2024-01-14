import { Router } from 'express';
import passport from '../validation/passport';
import * as blockedActions from '../controller/privacy/blocked';
import * as silenceActions from '../controller/privacy/silence';

const router = Router();

router.post('/blocked/user_blocked/:blockedId/user/:userId', passport.authenticate('jwt', {session: false}), blockedActions.blocked);
router.get('/all/blocked', passport.authenticate('jwt', {session: false}), blockedActions.blocked_contacts);
router.delete('/delete/blocked/indentifier/:indentifier', passport.authenticate('jwt', {session: false}), blockedActions.unLock);

router.post('/silence/:silenceId/user/:userId', passport.authenticate('jwt', {session: false}), silenceActions.silence);
router.get('/all/silence', passport.authenticate('jwt', {session: false}), silenceActions.muted_contacts);
router.delete('/delete/silence/indentifier/:indentifier', passport.authenticate('jwt', {session: false}), silenceActions.unSilence);
export default router;
