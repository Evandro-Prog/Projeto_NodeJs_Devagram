import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "../../models/usuarioModel";
import md5 from "md5";
import { connectDatabase } from "../../middlewares/connectDatabase";

const endpointCadastro = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    if(req.method === 'POST'){
        const usuario = req.body as CadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({error : 'Nome inválido'});
        }

        if(!usuario.email || usuario.email.length < 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.')){
                return res.status(400).json({error : 'Email informado invalido'});
            }
        
        if(!usuario.senha || usuario.senha.length < 4){
            return res.status(400).json({error : 'Senha infomada invalida'});
        }

        //Validar se existe usuario cadastrado com o mesmo email
        const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
        if(usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0){
            return res.status(400).json({error : 'Já existe uma conta com o email informado'});
        }
        
        // Salvar usuario no banco de dados
        const usuarioAserSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha)
        }
        await UsuarioModel.create(usuarioAserSalvo);
        return res.status(200).json({msg : 'Usuário cadastrado com sucesso'})

    }
    return res.status(405).json({error : 'Método informado não é válido'});
}

export default connectDatabase(endpointCadastro);