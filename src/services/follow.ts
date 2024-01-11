import { Inscriptions, PrismaClient, Users } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

type SchemaSubscribe = { me: Users, user: number }
export const subscribe = async (data: SchemaSubscribe) => {

    // ENVIAR SOLICITAÇÃO

    const send_solicitation = async (receiver: Users, enrollment_verification: Inscriptions) => {
        const inscription = await prisma.inscriptions.update({ where: { id: enrollment_verification.id }, data: 
            { accept_receiver: true, send_receiver: false} });
        
        await prisma.users.update({ where: { id: data.me.id }, data: 
            { following: data.me.following + 1 } })

        await prisma.users.update({ where: { id: receiver.id }, data: 
            { followers: receiver.followers + 1 } })

        return { message: 'Solicitação enviada!', code: 200, indentifier: inscription.indentifier };
    }

    try{
        const receiver = await prisma.users.findFirst({
            where: {
                id: data.user
            }
        });
        if(receiver){
            if(receiver.private_account){

                const resend_request = async (enrollment_verification: Inscriptions) => {
                    const inscription = await prisma.inscriptions.update({ where: { id: enrollment_verification.id }, data: 
                        { send_receiver: true } });
                    return { message: 'Solicitação enviada!', code: 200, indentifier: inscription.indentifier };        
                }

                const enrollment_verification = await prisma.inscriptions.findFirst({
                    where: {
                        OR: [
                            {
                                AND: {
                                    id_receiver: data.me.id,
                                    id_request: data.user
                                }
                            },{
                                AND: {
                                    id_receiver: data.user,
                                    id_request: data.me.id                                    
                                }
                            }
                        ]
                    }
                });

                if(enrollment_verification){
                    if(enrollment_verification.id_request === data.me.id){
                        const result = await resend_request(enrollment_verification);
                        return { result };
                    }else{
                        const update = await prisma.inscriptions.update({ where: { id: enrollment_verification.id }, data: 
                            { id_request: data.me.id, id_receiver: enrollment_verification.id_request } });
                     
                        if(update){
                            const result = await resend_request(update);
                            return { result };
                        }  
                    }
                }

                const uuid = uuidv4();
                await prisma.inscriptions.create({
                    data: {
                        id_request: data.me.id,
                        id_receiver: data.user,
                        indentifier: uuid
                    }
                });
                
                return { message: 'Solicitação enviada !', code: 201, indentification_code: uuid };
            }
            
            // Account private = false

            const enrollment_verification = await prisma.inscriptions.findFirst({
                where: {
                    OR: [
                        {
                            AND: {
                                id_receiver: data.me.id,
                                id_request: data.user
                            }
                        },{
                            AND: {
                                id_receiver: data.user,
                                id_request: data.me.id                                    
                            }
                        }
                    ]
                }
            });

            if(enrollment_verification){
                if(enrollment_verification.id_request === data.me.id){
                    const result = await send_solicitation(receiver, enrollment_verification);
                    return { result };
                }else{
                    const update = await prisma.inscriptions.update({ where: { id: enrollment_verification.id }, data: 
                        { id_request: data.me.id, id_receiver: enrollment_verification.id_request } });
                 
                    if(update){
                        const result = await send_solicitation(receiver, update);
                        return { result };
                    }  
                }
            }
            
            const uuid = uuidv4();
            const request_submited = await prisma.inscriptions.create({
                data: {
                    id_request: data.me.id,
                    id_receiver: data.user,
                    accept_receiver: true,
                    indentifier: uuid             
                }
            });

            if(request_submited){
                const request_update = await prisma.users.update({ where: { id: data.me.id }, data: {
                    following: data.me.following + 1
                }})
                
                const receiver_update = await prisma.users.update({ where: { id: receiver.id }, data: {
                    followers: receiver.followers + 1
                } });
                

                return { message: `Você esta seguindo ${request_update ? request_update.name : 'essa pessoa'}!`, 
                    code: 201,  
                    indentification_code: uuid
                };
            }
        }

    }catch(err) { return false } 
}

type SchemaReplyRequest = { me: Users, user: number, operation: string, indentifier: string };
export const reply_request = async (data: SchemaReplyRequest) => {

    // ACEITAR OU RECUSAR

    try{
        const inscription = await prisma.inscriptions.findFirst({ where: {
            indentifier: data.indentifier
        }});
        if(inscription){
            const request_user = await prisma.users.findFirst({ where: {
                id: data.user
            }});
            if(request_user){
                if(request_user.private_account){  // verifica se a pessoa possui a conta privada *
                    const operation = data.operation;
                    if(operation === 'ACCEPTED'){

                        if(inscription.accept_receiver === true && inscription.id_receiver === data.me.id){
                            return { message: 'Você já acceitou essa solicitação!' };       
                        }

                        await prisma.users.update({ where: { id: data.me.id }, data: 
                            {followers: data.me.followers + 1} });

                        await prisma.users.update({ where: { id: request_user.id }, data: 
                            {following: request_user.following + 1} });

                        await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                            {accept_receiver: true, send_receiver: false } });
                            
                        if(inscription.send_request === true && inscription.id_request === data.me.id){
                            await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                                {accept_request: true, send_request: false } });        
                        }

                        return { message: `Você aceitou o pedido de ${request_user.name}`, indentifier: data.indentifier };
                    
                    }else if(operation === 'RECUSED'){
                        await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                            {accept_receiver: false, send_receiver: false} });

                        return { message: `Você recusou o pedido de ${request_user.name}` };
                    }else{
                        return { message: 'Operação inválida!' };
                    }
                }

                // Vou enviar a solicitação para a pessoas
                // Public Account
                if(inscription.accept_receiver === true && inscription.id_receiver === data.me.id){
                    return { message: 'Você já aceitou essa solicitação!' };
                }

                const inscription_update = await prisma.inscriptions.update({ where: {
                    id: inscription.id
                }, data: {send_receiver: false, accept_receiver: true, send_request: false, accept_request: false } });
                
                await prisma.users.update({ where: { id: request_user.id }, data: { following: request_user.following + 1 } });
                await prisma.users.update({ where: { id: data.me.id }, data: { followers: data.me.followers + 1 } });
                
                return { message: `${request_user.name} esta te seguindo!.`, code: 200, indentifier: data.indentifier };
            } 
        }

        return { error: 'Não encontramos!' };
    }catch(err) { return false }
}

type SchemaFollowBackPrivateAccount = {me: Users, user: number, indentifier: string}
export const follow_back_private_account = async (data: SchemaFollowBackPrivateAccount) => {
    
    // SEGUIR DE VOLTA

    try{
        const inscription = await prisma.inscriptions.findFirst({
            where: { indentifier: data.indentifier }
        });
        if(inscription){
            const request_user = await prisma.users.findFirst({ where: { id: data.user } });
            if(request_user){
                if(request_user.private_account){
                    await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                        {send_request: true} });

                    return { message: `Solicitação enviada para ${request_user.name}`, indentifier: data.indentifier };
                }

                await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                    {send_request: false, accept_request: true} });
                
                // Update usuário request
                await prisma.users.update({ where: { id: request_user.id }, data: 
                    {followers: request_user.followers + 1} });
                
                // update usuário receiver
                await prisma.users.update({ where: { id: data.me.id}, data: 
                    {following: data.me.following + 1} });

                return { message: `Você esta seguindo ${request_user.name}`, indentifier: data.indentifier };
            }

            return { message: `Esse usuário não existe!` };
        }
    }catch(err) { return false }
}

export const getAllFollowers = async (id: number) => {
    try{
        const allFollowers  = await prisma.inscriptions.findMany({
            where: {
                OR: [
                    { id_receiver: id },
                    { id_request: id }
                ]
            }
        });
        const listFollowers: number[] = [];
        for(let i=0;i<allFollowers.length;i++){
            if(allFollowers[i].id_receiver === id && allFollowers[i].accept_receiver){
                listFollowers.push(allFollowers[i].id_request);
                continue;
            }

            // Nesse caso eu enviei a solicitação, a pessoa aceitou, reenviou a solicitação,
            // e eu aceitei, por isso "accept_request" true.
            if(allFollowers[i].id_request === id && allFollowers[i].accept_request){
                listFollowers.push(allFollowers[i].id_receiver);
            }
        }

        const user_following_me: Users[] = [];
        for(let i=0;i<listFollowers.length;i++){
            const next_user = await prisma.users.findFirst({ where: { id: listFollowers[i] } });
            if(next_user){
                user_following_me.push(next_user);
                continue;
            }
            continue;
        }

        return { user_following_me };
    }catch(err) { return false }
}

export const getAllFollowing = async (id: number) => {
    try{
        const allFollowing = await prisma.inscriptions.findMany({
            where: {
                OR: [
                    { id_receiver: id },
                    { id_request: id }
                ]
            }
        });
        const listFollowing: number[] = [];
        for(let i=0;i<allFollowing.length;i++){
            // Eu recebo a solicitação como "receiver", e reenvio uma solicitação como request,
            // Se a pessoa acceitar minha solicitação "accept_request" fica true, e eu estou seguindo ele.
            if(allFollowing[i].id_receiver === id && allFollowing[i].accept_request === true){
                listFollowing.push(allFollowing[i].id_request);
                continue;
            }
            // Se eu enviei a solicitação e a pessoas aceitou, eu estou seguindo ela.
            if(allFollowing[i].id_request === id && allFollowing[i].accept_receiver === true){
                listFollowing.push(allFollowing[i].id_receiver);
            }
        }

        const im_following: Users[] = []
        for(let i=0;i<listFollowing.length;i++){
            const user = await prisma.users.findFirst({ where: { id: listFollowing[i] } });
            if(user){
                im_following.push(user);
                continue;
            }
            continue;
        }

        return { im_following };
    }catch(err) { return false }
}

// Para de seguir algum usuario
export const stop_following = async (id: number, id_deleted: number) => {
    try{
        const inscription = await prisma.inscriptions.findFirst({
            where: {    
                OR: [
                    {
                        AND: {
                            id_request: id,
                            id_receiver: id_deleted
                        }
                    }, {
                        AND: {
                            id_request: id_deleted,
                            id_receiver: id
                        }
                    }
                ]
            }
        });
        if(inscription){

            // TODO UPDATE
            if(inscription.id_request === id){    
                const update_inscription = await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                    { accept_receiver: false } });
            }

            if(inscription.id_receiver === id){    
                const update_inscription = await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                    { accept_request: false } });
            }

            const user_desinscribed = await prisma.users.findFirst({ where: { id: id_deleted } });
            if(user_desinscribed){
                const desinscribed = await prisma.users.update({ where: { id: user_desinscribed.id }, data: 
                    { followers: user_desinscribed.followers - 1 } });
            }
            const user = await prisma.users.findFirst({ where: { id } });
            if(user){
                const user_update = await prisma.users.update({ where: { id: user.id }, data: 
                    { following: user.following - 1 } });
            }

            return { message: `Você não esta mais seguindo ${user_desinscribed ? user_desinscribed.name : 'este usuário'}!` };
        }

        return { message: 'Não há nenhuma ligação entre as duas entidades!' };
    }catch(err) { return false }
}

// Cancelar inscriçao de algum usuario te seguindo
export const unsubscribe = async (id: number, id_deleted: number) => {
    try{
        const inscription = await prisma.inscriptions.findFirst({
            where: {
                OR: [
                    {
                        AND: {
                            id_request: id,
                            id_receiver: id_deleted
                        }
                    },{
                        AND:{
                            id_request: id_deleted,
                            id_receiver: id
                        }
                    }
                ]
            }
        });
        if(inscription){
            if(inscription.id_receiver === id && inscription.accept_receiver === true){
                const update_inscription = await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                    { accept_receiver: false } });
            }

            if(inscription.id_request === id && inscription.accept_request === true){
                const update_inscription = await prisma.inscriptions.update({ where: { id: inscription.id }, data: 
                    { accept_request: false } });
            }

            // UPDATE USERS
            const canceled = await prisma.users.findFirst({ where: { id: id_deleted } });
            if(canceled){
                const desinscribed = await prisma.users.update({ where: { id: canceled.id }, data: 
                    { following: canceled.following - 1 } });
            }
            const user = await prisma.users.findFirst({ where: { id } });
            if(user){
                const user_update = await prisma.users.update({ where: { id: user.id }, data: 
                    { followers: user.followers - 1 } });
            }

            return { message: `Você cancelou a inscrição ${canceled ? 'de '+canceled.name : 'desse usuário' }!` }
        }

        return { message: 'Não há nenhuma ligação entre as duas entidades!' };
    }catch(err) { return false }
}

