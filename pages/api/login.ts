import type { NextApiRequest, NextApiResponse } from "next";
import { connectDatabase } from "../../middlewares/connectDatabase";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { LoginResposta } from "../../types/LoginResposta";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import jwt from "jsonwebtoken";

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {

    const {CHAVE_JWT} = process.env;
    if(!CHAVE_JWT){
        return res.status(500).json({error: 'ENV jwt não informada'});
    }

    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuarioEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuarioEncontrados && usuarioEncontrados.length > 0){
            const usuarioEncontrado = usuarioEncontrados[0];
            
            const token = jwt.sign({_id : usuarioEncontrado._id}, CHAVE_JWT);

            return res.status(200).json({
                nome : usuarioEncontrado.nome,
                email : usuarioEncontrado.email,
                token});
        }
        return res.status(400).json({error: 'Usuário ou senha inválidos'});
    }
    return res.status(405).json({error : 'Método informado não é válido'});
}

export default connectDatabase(endpointLogin);