import { decodeTokenUser } from "../../Helpers/generateHash";
import User from "../Model/auth.model"
import Resource from "../Model/resource.model"
import { _FindAndActionGETController } from "./_funController";


const userWithToken = (req: any) => {
    const isHeaderAuth = req.headers.usuario_autorizacion;
    const decode: any = decodeTokenUser(isHeaderAuth);
    const dateNOW: any = Date.now();

    if ((decode.exp * 1000) < dateNOW) {
        return true;
    } else {
        return false;
    }
}
export const createResource = (req: any, res: any) => {

    if (userWithToken(req)) {
        res.status(404).json({
            ok: false,
            msg: "This token went expired",
        });
    } else {
        const decode: any = decodeTokenUser(req.headers.usuario_autorizacion);

        _FindAndActionGETController("BEFORE-SEARCH", User, { _id: decode._id }, { req, res }, () => {
            const { type_resource } = req.body;
            // ....
        });

    }
}

export const getResources = (req: any, res: any) => {

    if (userWithToken(req)) {
        res.status(404).json({
            ok: false,
            msg: "This token went expired",
        });
    } else {



        _FindAndActionGETController("RESOURCES", Resource, {}, { req, res }, () => {
            res.send("no existe modelo aún")
        });

        // Resource.find({}).populate(["user_id"]).then((stored) => {
        //     res.send(stored)
        // });
    }

    // userWithToken(req, res, ()=>{

    //     console.log("NO EXPIRÓ NADA")

    // });}


    // if (isHeaderAuth === "" || (decode.exp * 1000) > dateNOW) {
    //     return res.status(404).json({
    //         ok: false,
    //         msg: "This token went expired",
    //     });
    // } else {
    //     CONTENT();
    // }


    // const isHeaderAuth = req.headers.usuario_autorizacion;

    // if (isHeaderAuth === "" || JWT_simpleVerifyExpirationTokenUser(isHeaderAuth)) {

    //     res.status(404).json({
    //         action: "POST",
    //         success: false,
    //         message: req.polyglot.t("user_token_expire_msg_status_401"),
    //         server_error: false,
    //         isTokenExpired: isHeaderAuth === "" ? false : true
    //     });

    // } else {



    // const user_id_auth = JWT_simpleDecodeTokenUser(isHeaderAuth).id;

    // const userVerified = User.findOne({ _id: user_id_auth }).exec();

    // userVerified.then((record_user) => {

    //     if (!record_user) {
    //         res.status(404).json({
    //             action: "GET",
    //             success: false,
    //             message: req.polyglot.t("id_not_found_msg_status_404"),
    //             server_error: false
    //         });

    //     } else {

    //         if (!record_user.isVerified) {
    //             res.status(404).json({
    //                 action: "GET",
    //                 success: false,
    //                 message: req.polyglot.t("user_no_verified_msg_status_404"),
    //                 server_error: false
    //             });
    //         } else {
    // console.log("resources", isHeaderAuth)

    // Resource.find({}).populate(["user_id"]).then((stored) => {
    //     res.send(stored)
    // });

    // _FindRecord("", "ALL", User, { role: req.query.role }, { req, res }, null);
    // _FindAndActionResourceController
}

export const getResourceById = (req: any, res: any) => {
    console.log("resource")
    // _FindRecord("", "DETAIL", User, { _id: req.params.id }, { req, res }, null);
}