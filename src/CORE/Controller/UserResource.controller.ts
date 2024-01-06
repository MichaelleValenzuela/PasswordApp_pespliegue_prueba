import UserResource from "../Model/UserResource.model"
import { decodeTokenUser } from "../../Helpers/generateHash";

export const userCreateResource = async (req: any, res: any) => {

    const { fields } = req.body;

    let arr_err: string[] = [];

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {
        // await UserResource.findOne({}).exec().then(async (data: any) => {
        //     if (data) res.status(404).json({ ok: false, msg: "Record already stored." })
        //     else {
        const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);
        const src = new UserResource({ user_id: HEADER._id, resource_admin_id: req.body.resource_admin_id, fields: fields });
        await src.save();
        res.status(201).json({ ok: true, msg: "Resources added" });
        // }
        // });
    }
}

export const userGetResources = async (req: any, res: any) => {
    await UserResource.find({}).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored." })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}

export const userEditResource = async (req: any, res: any) => {
    res.json({
        msg: "USER: EDITANDO RESOURCE"
    })
}

export const userDeleteResource = async (req: any, res: any) => {
    res.json({
        msg: "USER: ELIMINANDO RESOURCE"
    })
}

