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