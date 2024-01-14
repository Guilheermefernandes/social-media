import { Comments_post, PrismaClient, Sub_comments_post } from '@prisma/client';

const prisma = new PrismaClient();

export const count_comment = async (id_post: number) => {
    try{
        const count = await prisma.comments_post.count({
            where: { id_post }
        });
        return count;
    }catch(err) { return false}
}

export const cout_sub_comments = async (id_post: number, id_comment: number) => {
    try{
        const count = await prisma.sub_comments_post.count({
            where: { id_post, id_comment }
        });
        return count;
    }catch(err) { return false }
}

interface SchemaCommentsPost extends Comments_post {
    name_user: string,
    name: string,
    date_created_comment: string,
    likes: number,
    there_is_sub_comments: boolean,
    count_sub_comments: number
} 
export const get_comments = async (id_post: number, id_user: number, skip: number, take: number) => {
    try{
        const comments = await prisma.comments_post.findMany({
            where: { id_post, deleted: false }, skip, take
        });
        if(comments){
            const list_comments: SchemaCommentsPost[] = [];
            for(let i=0;i<comments.length;i++){
                const count_sub_comments = await prisma.sub_comments_post.count({
                    where: { id_comment: comments[i].id, id_post, deleted: false }
                });
                const likes = await prisma.like_comment_post.count({
                    where: { id_comment: comments[i].id, id_post }
                });

                const user_comment = await prisma.users.findFirst({
                    where: { id: comments[i].id_user,  }
                });

                if(user_comment == null || user_comment.archive_account === true || user_comment.deleted === true) continue;
            
                const isBlocked = await prisma.blocked.findFirst({
                    where: { id_user, id_blocked: user_comment.id }
                });
                if(!isBlocked) continue;
                
                if(count_sub_comments >= 0){
                    list_comments.push({
                        ...comments[i],
                        name_user: user_comment.name_user,
                        name: user_comment.name,
                        date_created_comment: comments[i].date_created,
                        likes,
                        there_is_sub_comments: true,
                        count_sub_comments
                    });
                }
                
            }

            const count_comments = await count_comment(id_post);
            let remaining_comments: number = 0;
            if(count_comments && count_comments > 0){
                remaining_comments = count_comments - (skip + 10);
                remaining_comments = remaining_comments > 0 ? remaining_comments : 0;
            }

            return  { list_comments, remaining_comments};
        }
        return comments;
    } catch(err) { return false };
}

interface SchemaSubComments extends Sub_comments_post {
    likes: number
} 
export const get_sub_comments = async (id_post: number, id_comment: number, skip: number, take: number) => {
    try{
        // TODO update
        const sub_comments = await prisma.sub_comments_post.findMany({
            where: { id_post, id_comment }, skip, take
        });
        if(sub_comments){
            const list_sub_comments: SchemaSubComments[] = [];
            for(let i=0;i<sub_comments.length;i++){
                const likes = await prisma.sub_like_comments_post.count({
                    where: { id_sub_comment: sub_comments[i].id, id_comment, id_post }
                });
                list_sub_comments.push({ ...sub_comments[i], likes });
            }
            
            return list_sub_comments;
        }

        return sub_comments;
    }catch(err) { return false }
}