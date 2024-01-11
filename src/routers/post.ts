import { Router } from 'express';
import passport from '../validation/passport';
import * as post from '../controller/posts';
import upload from '../utils/arq_multer';

const router = Router();

// post
router.post('/create/post', passport.authenticate('jwt', {session: false}), upload.array('images', 5), post.create_post);
router.get('/all/posts', passport.authenticate('jwt', {session: false}), post.get_all_post);
router.post('/like/user/:userId/post/:postId', passport.authenticate('jwt', {session: false}), post.like_post);
router.delete('/delete/like/:likeId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), post.delete_like_post);

// comment
router.post('/create/comment/user/:userId/post/:postId', passport.authenticate('jwt', {session: false}), post.create_comment);
router.post('/like/user/:userId/post/:postId/comment/:commentId', passport.authenticate('jwt', {session: false}), post.like_comment);

// sub
router.post('/create/sub/comment/user/:userId/post/:postId/comment/:commentId', passport.authenticate('jwt', {session: false}), post.create_sub_comment_post);
router.post('/like/sub/post/:postId/comment/:commentId/sub_comment/:subCommentId/user/:userId', passport.authenticate('jwt', {session: false}), post.like_sub_comment);
export default router;