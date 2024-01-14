import { Router } from 'express';
import passport from '../validation/passport';
import * as post from '../controller/posts';
import * as interactions from '../controller/interactions_post';
import * as retrievePost from '../controller/retrieve_post_data';
import upload from '../utils/arq_multer';

const router = Router();

// post
router.post('/create/post', passport.authenticate('jwt', {session: false}), upload.array('images', 5), post.create_post);
router.get('/all/posts', passport.authenticate('jwt', {session: false}), post.get_all_post);
router.post('/like/user/:userId/post/:postId', passport.authenticate('jwt', {session: false}), interactions.like_post);
router.delete('/delete/like/:likeId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.delete_like_post);

// comment
router.post('/create/comment/user/:userId/post/:postId', passport.authenticate('jwt', {session: false}), interactions.create_comment);
router.post('/like/user/:userId/post/:postId/comment/:commentId', passport.authenticate('jwt', {session: false}), interactions.like_comment);
router.put('/update/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.edit_comment);
router.delete('/delete/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.delete_comment);
router.delete('/delete/like/:likeId/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.delete_like_comment);

// sub
router.post('/create/sub/comment/user/:userId/post/:postId/comment/:commentId', passport.authenticate('jwt', {session: false}), interactions.create_sub_comment_post);
router.post('/like/sub/post/:postId/comment/:commentId/sub_comment/:subCommentId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.like_sub_comment);
router.put('/update/sub_comment/:subCommentId/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.edit_sub_comment);
router.delete('/delete/sub_comment/:subCommentId/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.delete_sub_comment);
router.delete('/delete/like/:likeId/sub_comment/:subCommentId/comment/:commentId/post/:postId/user/:userId', passport.authenticate('jwt', {session: false}), interactions.delete_like_sub_comment);

router.get('/all/comments/post/:postId', passport.authenticate('jwt', {session: false}), retrievePost.get_comments);
router.get('/all/sub_comments/comment/:commentId/post/:postId', passport.authenticate('jwt', {session: false}), retrievePost.get_sub_comments)
export default router;

// delete sub_comment
// delete like_sub_comment