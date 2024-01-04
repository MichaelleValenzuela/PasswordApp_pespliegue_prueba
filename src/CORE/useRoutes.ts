import { varsConfig } from "../Helpers/varsConfig";
import { decodeTokenUser } from "../Helpers/generateHash";
import { getUsers, desactivateUser, editProfileUser } from "../CORE/Controller/User.controller";
import { registerUser, confirmAccount, loginUser, recoveryUser, resetPasswordUser } from "../CORE/Controller/Auth.controller";
import { userCreateResource, userGetResources, userEditResource, userDeleteResource } from "../CORE/Controller/UserResource.controller";
import { adminCreateResource, adminGetResources, adminEditResource, adminDeleteResource } from "../CORE/Controller/AdminResource.controller";


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
        AUTH_REGISTER: app.use(router.post(`${varsConfig.URI_AUTH[0]}`, registerUser)),
        AUTH_CONFIRM_ACCOUNT: app.use(router.get(`${varsConfig.URI_AUTH[1]}`, confirmAccount)),
        AUTH_LOGIN: app.use(router.post(`${varsConfig.URI_AUTH[2]}`, loginUser)),
        AUTH_RECOVERY: app.use(router.post(`${varsConfig.URI_AUTH[3]}`, recoveryUser)),
        AUTH_RESET: app.use(router.post(`${varsConfig.URI_AUTH[4]}`, resetPasswordUser)),

        USER_GET: app.use(router.get(`${varsConfig.URI_USER[0]}`, getUsers)),
        USER_DESACTIVATE: app.use(router.put(`${varsConfig.URI_USER[1]}`, desactivateUser)),
        USER_EDIT_PROFILE: app.use(router.put(`${varsConfig.URI_USER[2]}`, editProfileUser)),

        ADMIN_CRETE_RESOURCE: app.use(router.post(`${varsConfig.URI_USER[0]}`, adminCreateResource)),
        ADMIN_GET_RESOURCES: app.use(router.get(`${varsConfig.URI_USER[1]}`, adminGetResources)),
        ADMIN_EDIT_RESOURCE: app.use(router.put(`${varsConfig.URI_USER[2]}`, adminEditResource)),
        ADMIN_DELETE_RESOURCE: app.use(router.delete(`${varsConfig.URI_USER[3]}`, adminDeleteResource)),

        USER_CRETE_RESOURCE: app.use(router.post(`${varsConfig.URI_USER[0]}`, userCreateResource)),
        USER_GET_RESOURCES: app.use(router.get(`${varsConfig.URI_USER[1]}`, userGetResources)),
        USER_EDIT_RESOURCE: app.use(router.put(`${varsConfig.URI_USER[2]}`, userEditResource)),
        USER_DELETE_RESOURCE: app.use(router.delete(`${varsConfig.URI_USER[3]}`, userDeleteResource)),
    };
}
