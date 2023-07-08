import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao";
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from "md5";
import { connectDatabase } from "../../middlewares/connectDatabase";
import { upload, uploarImagemCosmic } from "../../services/uploadImagemCosmic";
import nc from "next-connect";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        try {            

            const usuario = req.body as CadastroRequisicao;

            if (!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({ error: 'Nome inválido' });
            }

            if (!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')) {
                return res.status(400).json({ error: 'Email informado invalido' });
            }

            if (!usuario.senha || usuario.senha.length < 4) {
                return res.status(400).json({ error: 'Senha infomada invalida' });
            }

            //Validar se existe usuario cadastrado com o mesmo email
            const usuariosComMesmoEmail = await UsuarioModel.find({ email: usuario.email });
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({ error: 'Já existe uma conta com o email informado' });
            }

            //Enviar a imagem do multer para o cosmic
            const image = await uploarImagemCosmic(req);

            // Salvar usuario no banco de dados
            const usuarioAserSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: md5(usuario.senha),
                avatar: image?.media?.url
            }
            await UsuarioModel.create(usuarioAserSalvo);
            return res.status(200).json({ msg: 'Usuário cadastrado com sucesso' })

        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Erro ao cadastrar usuario' })
        }
    });


export const config = {
    api: {
        bodyParser: false
    }
}


export default connectDatabase(handler);