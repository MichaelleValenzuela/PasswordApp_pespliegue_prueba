
import { varsConfig } from "../Helpers/varsConfig";
import { registerUser, confirmAccount, loginUser } from "./Controller/user.controller";
// import { body } from 'express-validator';
// import { AuthIsUserAuthenticatedMiddleware } from "./mwareAuth";


export const useRoutes = (app: any, router: any): Object => {

    return {
        USER_REGISTER: app.use(router.post(`${varsConfig.URI_USER[0]}`, registerUser)),
        CONFIRM_ACCOUNT: app.use(router.get(`${varsConfig.URI_USER[1]}`, confirmAccount)),
        USER_LOGIN: app.use(router.post(`${varsConfig.URI_USER[2]}`, loginUser)),




        // USER_LOGIN: app.use(router.post(`/${dataENV.URI_USER[1]}`, expressValid("username", "password"), UserLogin)),
        // USER_GET_BY_ID: app.use(router.get(`/${dataENV.URI_USER[2]}/:id`, UserGetById))
    };
}
