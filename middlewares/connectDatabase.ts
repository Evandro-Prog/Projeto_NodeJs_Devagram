import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";

export const connectDatabase = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    //Verificar se o banco ja esta conectado 
    //Se estiver seguir para o endpoint ou proximo middleware
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    //Se não estiver conectado, conectar
    //Obter a variavel de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env;

    //Se a env estiver vazia aborta o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
        return res.status(500).json({error : 'String de conexão vazia. Favor preencher corretamente'})
    }

    mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
    mongoose.connection.on('error', error => console.log('Ocorreu um erro ao conectar no banco de dados'));
    await mongoose.connect(DB_CONEXAO_STRING);

    //Agora pode seguir para o endpoint pois estamos conectados com o banco de dados
    return handler(req, res);
    
}