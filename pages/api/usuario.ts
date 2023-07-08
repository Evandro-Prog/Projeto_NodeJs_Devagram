import type { NextApiRequest, NextApiResponse } from "next";
import { validateTokenJWT } from "../../middlewares/validateTokenJWT";
 
const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse) => {

    return res.status(200).json({msg : 'Usuario autenticado com sucesso'})
}

export default validateTokenJWT(usuarioEndpoint);