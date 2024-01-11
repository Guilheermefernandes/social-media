import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type SchemaCreatePost = Prisma.Args<typeof prisma.posts, 'create'>['data'];
interface SchemaImagesReceiver { image_indentifier: string, id_user: number }[];
interface SchemaImagesCreate extends SchemaImagesReceiver {
    id_post: number
    order: number
}
export const create_post = async (data: SchemaCreatePost, dataImages: SchemaImagesReceiver[]) => {
    try{
        const post = await prisma.posts.create({ data });
        if(post){
            const listImages: SchemaImagesCreate[] = [];
            for(let i=0;i<dataImages.length;i++){
                const image: SchemaImagesCreate = { ...dataImages[i], id_post: post.id, order: i+1 };  
                listImages.push(image);
            } 
            const images_create = await prisma.images_posts.createMany({ data: listImages });
            if(images_create){
                return { ...post, ...images_create };
            }

            const update_post = await prisma.posts.update({ where: { id: post.id }, data: 
                { disposition_status: false } });
            return { error: 'Ocorreu um erro com suas imagens! Tente novamente', post: update_post };
        }

        return { error: 'Ocorreu um ero ao criar sua publicação! Tente novamente.' };
    }catch(err) { return false }
}

export const get_all_posts = async (id: number, meId: number) => {
    try{
        const user = await prisma.users.findFirst({ where: { id } });
        if(user){
            const posts = await prisma.posts.findMany({ where: { 
                id_user: user.id, deleted: false, disposition_status: true, private: false} });
            if(posts){
                const all_posts = [];
                for(let i=0;i<posts.length;i++){
                    const like_post_count = await prisma.like_post.count({
                        where: { id_post: posts[i].id }
                    });
                    const query_like = await prisma.like_post.findFirst({
                        where: { id_post: posts[i].id, id_user: meId }
                    });

                    let my_user_liked_it: boolean = false;
                    let id_like: number | null = null;
                    if(query_like){
                        my_user_liked_it = true;
                        id_like = query_like.id;
                    }

                    const comments_post_count = await prisma.comments_post.count({
                        where: { id_post: posts[i].id }
                    });
                    const query_comment = await prisma.comments_post.findFirst({
                        where: { id_post: posts[i].id, id_user: meId }
                    });
                    const my_comment = query_comment ? true : false;

                    const images_post = await prisma.images_posts.findMany({
                        where: { id_post: posts[i].id }
                    });

                    /*
                    const comments_post = await prisma.comments_post.findMany({ where: 
                        { id_post: posts[i].id }, skip: 0, take: 10 }); // TODO pagination

                    const comments = [];
                    if(comments_post){
                        for(let j=0;j<comments_post.length;j++){
                            const sub_comments_count = await prisma.sub_comments_post.count({
                                where: { id_post: posts[i].id, id_comment: comments_post[j].id }
                            });

                            comments.push({ ...comments_post[j], sub_comments_count });
                        }

                    }
                    */

                    all_posts.push({ ...posts[i], like_post_count, comments_post_count, images_post,
                        my_user_liked_it, id_like, my_comment
                    });
                }

                return { all_posts };
            }

            return { message: 'Esse post não existe!' };
        }

        return { message: 'Esse usuario não existe!' };
    }catch(err) { return false }
}

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

// TODO delete like

type SchemaCreateComment = Prisma.Args<typeof prisma.comments_post, 'create'>['data']
export const create_comment = async (data: SchemaCreateComment) => {
    try{
        const comment = await prisma.comments_post.create({data});
        return { comment };
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

// TODO delete like_comment

type SchemaCreateSubComment = Prisma.Args<typeof prisma.sub_comments_post, 'create'>['data']
export const create_sub_comment_post = async (data: SchemaCreateSubComment) => {
    try{
        const sub_comment = await prisma.sub_comments_post.create({ data });
        return { sub_comment };
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

// TODO Paginação comments