
import { decodeTokenUser } from "../Helpers/generateHash";
import { varsConfig } from "../Helpers/varsConfig";
import { createResource, getResources, getResourceById } from "./Controller/resources.controller";
import {
    registerUser, confirmAccount, loginUser, recoveryUser, resetPasswordUser
} from "./Controller/user.controller";

const authMiddleware = (req: any, res: any, next: any) => {

    if (!req.headers.usuario_autorizacion) {
        return res.status(403).json({
            ok: false,
            message: "No token in header"
        });
    }

    try {

        const token_header = req.headers.usuario_autorizacion.replace(/['"]+/g, "");
        const decode: any = decodeTokenUser(token_header);
        const dateNOW: any = Date.now();

        if ((decode.exp * 1000) > dateNOW) {
            if (decode.role === "ADMINISTRADOR") {
                req.user = decode;
            } else {
                return res.status(404).json({
                    ok: false,
                    msg: "You are not administrator"
                });
            }
        }
    } catch (error: any) {
        res.status(404).json({
            ok: false,
            msg: error.message
        });
    }
    next();
}


export const useRoutes = (app: any, router: any): Object => {

    return {
        USER_REGISTER: app.use(router.post(`${varsConfig.URI_USER[0]}`, registerUser)),
        CONFIRM_ACCOUNT: app.use(router.get(`${varsConfig.URI_USER[1]}`, confirmAccount)),
        USER_LOGIN: app.use(router.post(`${varsConfig.URI_USER[2]}`, loginUser)),
        RECOVERY_USER: app.use(router.post(`${varsConfig.URI_USER[3]}`, recoveryUser)),
        RESET_PASSWORD_USER: app.use(router.post(`${varsConfig.URI_USER[4]}`, resetPasswordUser)),

        CREATE_RESOURCE: app.use(router.post(`${varsConfig.URI_RESOURCE[0]}`, authMiddleware, createResource)),
        GET_RESOURCES: app.use(router.get(`${varsConfig.URI_RESOURCE[1]}`, authMiddleware, getResources)),
        GET_RESOURCE_BY_ID: app.use(router.get(`${varsConfig.URI_RESOURCE[2]}`, getResourceById)),
    };
}
