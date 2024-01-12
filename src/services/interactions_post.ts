import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SchemaLikePost = Prisma.Args<typeof prisma.like_post, 'create'>['data'];
export const like_post = async (data: SchemaLikePost, id: number) => {
    try{
        const search_like_user = await prisma.like_post.findFirst({
            where: { id_post: data.id_post, id_user: id }
        });
        if(!search_like_user){
            const like = await prisma.like_post.create({ data });
            return like
        }

        return { message: 'Você já curtiu esse post!' };
    }catch(err) { return false };
}

type SchemaIndentifierDeleteLikePost = { id: number, id_post: number, id_user: number };
export const delete_like_post = async (indentifier: SchemaIndentifierDeleteLikePost) => {
    try{
        const deleted_like = await prisma.like_post.delete({
            where: { id:indentifier.id, id_post: indentifier.id_post, id_user: indentifier.id_user }
        });
        return { deleted_like };
    }catch(err) { return false }
}

type SchemaCreateComment = Prisma.Args<typeof prisma.comments_post, 'create'>['data']
export const create_comment = async (data: SchemaCreateComment) => {
    try{
        const comment = await prisma.comments_post.create({data});
        return { comment };
    }catch(err) { return false }
}

type SchemaIndentifierUpdateComment = { id: number, id_post: number, id_user: number };
type SchemaDataUpdateComment = Prisma.Args<typeof prisma.comments_post, 'update'>['data']
export const edit_comment = async (indentifier: SchemaIndentifierUpdateComment, data: SchemaDataUpdateComment) => {
    try{
        data.comment_edited = true;
        const update = await prisma.comments_post.update({
            where: { id: indentifier.id, id_post: indentifier.id_post, id_user: indentifier.id_user }, 
            data
        });
        if(update) return {update};

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

type SchemaIndentifierDeleteComment = { id: number, id_post: number, id_user: number }
export const delete_comment = async (indentifier: SchemaIndentifierDeleteComment) => {
    try{
        const isRelation_like = await prisma.like_comment_post.findFirst({
            where: { id_comment: indentifier.id, id_post: indentifier.id_post }
        });
        const isRelation_sub_comment = await prisma.sub_comments_post.findFirst({
            where: { id_comment: indentifier.id, id_post: indentifier.id_post }
        });
        if(isRelation_like || isRelation_sub_comment){
            const deleted = await prisma.comments_post.update({
                where: { id: indentifier.id, id_post: indentifier.id_post, id_user: indentifier.id_user}, 
                data: { deleted: true }
            });
            if(deleted) return { message: 'Publicação deletada!', deleted };

            return { message: 'Ocorreu um erro! Tente novamente.' };
        }

        const deleted = await prisma.comments_post.delete({ 
            where: { id: indentifier.id, id_post: indentifier.id_post, id_user: indentifier.id_user }
        });
        if(deleted) return { deleted, message: 'success' };

        return { error: 'Ocorreu um erro ao deletar essa publicação!' };
    }catch(err) { return false }
}

type SchemaLikeComment = Prisma.Args<typeof prisma.like_comment_post, 'create'>['data']
export const like_comment = async (data: SchemaLikeComment) => {
    try{
        const search_comment_like = await prisma.like_comment_post.findFirst({
            where: { id_post: data.id_post, id_comment: data.id_comment, id_user: data.id_user }
        });
        if(!search_comment_like){
            const like_comment = await prisma.like_comment_post.create({ data });
            return { like_comment }
        }

        return { message: 'Você já curtiu esse comentário!' };
    }catch(err) { return false }
}

type SchemaIndentifierDeleteLikeComment = {
    id: number,
    id_post: number,
    id_comment: number,
    id_user: number
}
export const delete_like_comment = async (indentifier: SchemaIndentifierDeleteLikeComment) => {
    try{
        const deleted_like_comment = await prisma.like_comment_post.delete({
            where: {
                id: indentifier.id,
                id_post: indentifier.id_post,
                id_comment: indentifier.id_comment,
                id_user: indentifier.id_user
            }
        });
        if(deleted_like_comment) return { deleted_like_comment };

        return { error: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

type SchemaCreateSubComment = Prisma.Args<typeof prisma.sub_comments_post, 'create'>['data']
export const create_sub_comment_post = async (data: SchemaCreateSubComment) => {
    try{
        const sub_comment = await prisma.sub_comments_post.create({ data });
        return { sub_comment };
    }catch(err) { return false }
}

type SchemaIndentifierUpdateSubComment = { id: number, id_comment: number, id_post: number, id_user: number }; 
type SchemaDataUpdateSubComment = Prisma.Args<typeof prisma.sub_comments_post, 'update'>['data']
export const edit_sub_comment = async (indentifier: SchemaIndentifierUpdateSubComment, data: SchemaDataUpdateSubComment) => {
    try{
        data.comment_edited = true;
        const update = await prisma.sub_comments_post.update({
            where: { id: indentifier.id, id_comment: indentifier.id_comment, id_post: indentifier.id_post, id_user: indentifier.id_user },
            data
        });
        if(update) return { update };

        return { message: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

type SchemaIndentifierDeleteSubComment = {
    id: number,
    id_comment: number,
    id_post: number,
    id_user: number
}
export const delete_sub_comment = async (indentifier: SchemaIndentifierDeleteSubComment) => {
    try{
        const isRelation_like = await prisma.sub_like_comments_post.findFirst({
            where: { id_sub_comment: indentifier.id, id_comment: indentifier.id_comment,
                id_post: indentifier.id_post, id_user: indentifier.id_user }
        });
        if(isRelation_like){
            const deleted = await prisma.sub_comments_post.update({
                where: { 
                    id: indentifier.id,
                    id_comment: indentifier.id_comment,
                    id_post: indentifier.id_post,
                    id_user: indentifier.id_user 
                }, data: { deleted: true }
            });
            if(deleted) return { message: 'Pubicação deletada', deleted }

            return { message: 'Ocorreu um erro! Tente novamente.' }
        }

        const deleted_sub_comment = await prisma.sub_comments_post.delete({
            where: {
                id: indentifier.id,
                id_comment: indentifier.id_comment,
                id_post: indentifier.id_post,
                id_user: indentifier.id_user
            }
        });
        if(deleted_sub_comment) return { message: 'Publicação deletada!', deleted_sub_comment };

        return { error: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

type SchemaLikeSubComment = Prisma.Args<typeof prisma.sub_like_comments_post, 'create'>['data']
export const like_sub_comment = async (data: SchemaLikeSubComment) => {
    try{
        const search_for_sub_comment_like = await prisma.sub_like_comments_post.findFirst({
            where: { id_post: data.id_post, id_comment: data.id_comment, id_sub_comment: data.id_sub_comment, id_user: data.id_user }
        });
        if(!search_for_sub_comment_like){
            const like_sub_comment = await prisma.sub_like_comments_post.create({ data });
            return { like_sub_comment };
        }

        return { message: 'Você já curtiu esse comentário!' };
    }catch(err) { return false }
}

type SchemaIndentifierDeleteLikeSubComment = {
    id: number,
    id_sub_comment: number,
    id_comment: number,
    id_post: number,
    id_user: number
}
export const delete_like_sub_comment = async (indentifier: SchemaIndentifierDeleteLikeSubComment) => {
    try{
        const deleted_like_sub_comment = await prisma.sub_like_comments_post.delete({
            where: {
                id: indentifier.id,
                id_sub_comment: indentifier.id_sub_comment,
                id_comment: indentifier.id_comment,
                id_post: indentifier.id_post,
                id_user: indentifier.id_user
            }
        });
        if(deleted_like_sub_comment) return { deleted_like_sub_comment };

        return { error: 'Ocorreu um erro! Tente novamente.' };
    }catch(err) { return false }
}

// TODO Paginação comments