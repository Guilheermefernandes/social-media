import { PrismaClient, Prisma, Inscriptions, Posts, Users } from '@prisma/client';
import { userInfo } from 'os';

const prisma = new PrismaClient();

export const count_post = async (id: number) => {
    try{
        const count = await prisma.posts.count({
            where: { id_user: id }
        });
        return count;
    }catch(err) { return false }
}

export const home_count = async (id: number)  => {
    try{
        const count = await prisma.inscriptions.count({
            where: {
                OR: [
                    {
                        AND: {
                            id_request: id,
                            accept_receiver: true
                        }
                    },
                    {
                        AND: {
                            id_receiver: id,
                            accept_request: true
                        } 
                    }
                ]
            }
        });
        return count;
    }catch(err) { return false };
}

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
                const { timestamp, ...publication } = post;
                return { ...publication, timestamp_publication: timestamp.toString(), ...images_create };
            }

            const update_post = await prisma.posts.update({ where: { id: post.id }, data: 
                { disposition_status: false } });
            return { error: 'Ocorreu um erro com suas imagens! Tente novamente', post: update_post };
        }

        return { error: 'Ocorreu um ero ao criar sua publicação! Tente novamente.' };
    }catch(err) { return false }
}

export const get_one = async (id_post: number, meId: number, user_post: number) => {
    try{
        const me = await prisma.users.findFirst({ where: { id: meId } });
        const user = await prisma.users.findFirst({
            where: { id: user_post }
        });
        if(user){
            if(user.deleted || user.archive_account) return { message: 'Conta deletada ou arquivada!' }
        }else { return {message: 'Esse usuário não existe!'} }
        
        if(user.private_account){
            if(me){
                const inscription = await prisma.inscriptions.findFirst({
                    where: {
                        OR: [
                            {
                                AND: {
                                    id_request: me.id,
                                    id_receiver: user.id
                                }
                            },
                            {
                                AND: {
                                    id_request: user.id,
                                    id_receiver: me.id
                                }
                            }
                        ]
                    }
                });
                if(inscription){
                    if(inscription.id_request === user.id && inscription.accept_request === false){
                        return { message: 'Essa conta é privada!' };
                    }else if(inscription.id_request === meId && inscription.accept_receiver === false){
                        return { message: 'Essa conta é privada!' };
                    }
                }else{
                    return { message: 'Essa conta é privada!' };
                }
                
            }
        }
        const post = await prisma.posts.findFirst({
            where: { id: id_post }
        });
        if(post && post.disposition_status && !post.private && !post.deleted){
            const cout_like = await prisma.like_post.count({
                where: { id_post: post.id }
            });
            const count_comments = await prisma.comments_post.count({
                where: { id_post: post.id }
            });

            const check_like_me = await prisma.like_post.findFirst({ 
                where: { id_post: post.id, id_user: meId } 
            });
            const check_comment_me = await prisma.comments_post.findFirst({
                where: { id_post: post.id, id_user: meId }
            });
            
            const images_post = await prisma.images_posts.findMany({
                where: { id_post: post.id }
            });

            return { ...post, 
                cout_like, 
                count_comments,
                me_like: check_like_me ? true : false,
                me_comment: check_comment_me ? true : false,
                images_post
            };

        }else { return { message: 'Essa publicação não esta mais disponível!' } }

    }catch(err) { return false }
} 

export const get_all_posts = async (id: number, offset: number, limit: number, meId: number) => {
    try{
        const user = await prisma.users.findFirst({ where: { id } });
        if(user && !user.deleted && !user.archive_account){

            if(user.private_account){
                const inscription = await prisma.inscriptions.findFirst({
                    where: {
                        OR: [
                            {
                                AND:{
                                    id_request: meId,
                                    id_receiver: user.id
                                }
                            },
                            {
                                AND: {
                                    id_request: user.id,
                                    id_receiver: meId
                                }
                            }
                        ]
                    }
                });
                if(inscription){
                    if(inscription.id_request === meId && inscription.accept_receiver === false){
                        return { message: 'Essa conta é privada!' };
                    }else if(inscription.id_request === user.id && inscription.accept_request === false){
                        return { message: 'Essa conta e privada!' }
                    }
                }else { return { message: 'Essa conta é privada!' } };
            }

            const posts = await prisma.posts.findMany({ where: { 
                id_user: user.id, deleted: false, disposition_status: true, private: false}, skip: offset, take: limit });
            if(posts){
                const all_posts = [];
                for(let i=0;i<posts.length;i++){
                    if(posts[i].deleted || posts[i].private || !posts[i].disposition_status) continue;
                    
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

                    all_posts.push({ ...posts[i], like_post_count, comments_post_count, images_post,
                        my_user_liked_it, id_like, my_comment
                    });
                }

                return { all_posts };
            }

            return { message: 'Ainda não há publicações!' };
        }

        return { message: 'Esse usuario não existe!' };
    }catch(err) { return false }
}

type SchemaPostOmitTimeStamp = Omit<Posts, 'timestamp'>;
export const home = async (id: number, offset_inscription: number, limit_inscription: number) => {
    try{

        let next_offset: number = 0;

        const get_inscriptions = async (meId: number, skip: number, take: number) => {
            const inscriptions = await prisma.inscriptions.findMany({
                where: {
                    OR: [
                        {
                            AND: {
                                id_request: meId,
                                accept_receiver: true
                            }
                        },
                        {
                            AND: {
                                id_receiver: meId,
                                accept_request: true
                            }
                        }
                    ]
                }, skip, take
            });
            return inscriptions;
        }

        const inscriptions = await get_inscriptions(id, offset_inscription, limit_inscription);

        
        if(inscriptions){

            // Function
            const get_id = async (inscriptions: Inscriptions[]): Promise<{ id: number, timestamp: bigint | null, id_post:number }[]> => {
                const following_id: { id: number, timestamp: bigint | null }[] = [];
                for(let i=0;i<inscriptions.length;i++){
                    if(inscriptions[i].id_request === id && inscriptions[i].accept_receiver === true){
                        following_id.push({ id: inscriptions[i].id_receiver, timestamp: inscriptions[i].request_receiver});
                    }else if(inscriptions[i].id_receiver === id && inscriptions[i].accept_request === true){
                        following_id.push({id: inscriptions[i].id_request, timestamp: inscriptions[i].receiver_request});
                    }
                }

                const list_id: { id: number, timestamp: bigint | null, id_post: number }[] = [];
                for(let i=0;i<following_id.length;i++){
                    const user = await prisma.users.findFirst({
                        where: { id: following_id[i].id }
                    });

                    if(user){
                        // Verifica se o usuario tem novos posts
                        const posts: { id: number }[]= await prisma.$queryRaw`
                        SELECT posts.id
                        FROM posts 
                        LEFT JOIN views ON posts.id = views.id_post AND views.id_user = ${id}
                        WHERE posts.id_user = ${user.id} AND posts.timestamp > ${following_id[i].timestamp}
                        AND views.id_post IS NULL LIMIT 1`;

                        if(Array.isArray(posts) && posts.length > 0){
                            // check view publication
                            for(let j=0;j<posts.length;j++){
                                const isView = await prisma.views.findFirst({ where: { id_user: id, id_post: posts[j].id } });
                                if(!isView){
                                    list_id.push({ ...following_id[i], id_post: posts[i].id });
                                }
                            }
                        }else { continue };
                    }
                }

                return list_id;
            }

            const expected_ids: { id: number, timestamp: bigint | null, id_post: number }[] = [];
            const verification = async (take: number) => {
                const lack = take;
                const jump = offset_inscription + limit_inscription;
                next_offset += jump + limit_inscription;
                const remaining_inscriptions = await get_inscriptions(id, jump, lack);
                if(Array.isArray(remaining_inscriptions) && remaining_inscriptions.length > 0){
                    const fered_ids: { id: number, timestamp: bigint | null, id_post: number }[] = await get_id(remaining_inscriptions);
                    for(let i in fered_ids){
                        expected_ids.push(fered_ids[i]);
                    }
                    if(expected_ids.length === take){
                        return expected_ids;
                    }else {
                        verification(take - expected_ids.length); 
                    }
                }
            }

            const ids_with_pulications: { id: number, timestamp: bigint | null, id_post: number }[] = await get_id(inscriptions);
            if(ids_with_pulications.length < limit_inscription){
                const new_ids: { id: number, timestamp: bigint | null, id_post: number }[] | undefined = await verification(ids_with_pulications.length - limit_inscription);
                if(Array.isArray(new_ids) && new_ids.length === limit_inscription){
                    for(let i=0;i<new_ids.length;i++){
                        ids_with_pulications.push(new_ids[i]);
                    }
                }
            }

            const posts: SchemaPostOmitTimeStamp[] = [];
            for(let i=0;i<ids_with_pulications.length;i++){
                const user = await prisma.users.findFirst({ where: { id: ids_with_pulications[i].id } });
                if(!user) continue;
                    
                const post = await prisma.posts.findFirst({ where: { id: ids_with_pulications[i].id_post } });

                if(post){
                    // add visualization
                    const view = await prisma.views.create({ data: { id_user: id, id_post: post.id } });
                    const { timestamp, ...publication } = post;
                    posts.push(publication);
                }
            }

            return { posts, next_offset };
        }

        return { message: 'Não você ainda não está seguindo ninguém!' }
    }catch(err) { return false }
}

type SchemaUpdatePost = Prisma.Args<typeof prisma.posts, 'update'>['data'];
export const update_post = async (id: number, meId: number, data: SchemaUpdatePost) => {
    try{
        const post = await prisma.posts.update({
            where: { id, id_user: meId, deleted: false }, data
        });
        if(post) return post;
        return { message: 'Não existe essa publicação!' };
    }catch(err) { return false }
}

// TODO (GET ONE POST)(GET ALL POST)(POSTS HOME)(EDIT POST)(DELETE POST)