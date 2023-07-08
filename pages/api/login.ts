import type { NextApiRequest, NextApiResponse } from "next";
import { connectDatabase } from "../../middlewares/connectDatabase";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import md5 from "md5";
import { UsuarioModel

} from "../../models/usuarioModel";
const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        const usuarioEncontrados = await UsuarioModel.find({email : login, senha : md5(senha)});
        if(usuarioEncontrados && usuarioEncontrados.length > 0){
            const usuarioEncontrado = usuarioEncontrados[0];        
            return res.status(200).json({msg: `Usuário ${usuarioEncontrado.nome} autenticado com sucesso`});
        }
        return res.status(400).json({error: 'Usuário ou senha inválidos'});
    }
    return res.status(405).json({error : 'Método informado não é válido'});
}

export default connectDatabase(endpointLogin);