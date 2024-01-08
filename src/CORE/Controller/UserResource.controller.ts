import User from "../Model/User.model"
import UserResource from "../Model/UserResource.model"
import { decodeTokenUser } from "../../Helpers/generateHash";

export const userCreateResource = async (req: any, res: any) => {

    const { resource_admin_id, resource } = req.body;
    /*
        TODO: VALIDAR (solo backend para arrojar una respuesta) campos que traigan PASSWORDS,
        nro_tarjeta, pin, y datos sensibles.
    */
    let arr_err: string[] = []; // <-- validar?
    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);
    const src = await new UserResource();

    if (false) res.status(404).json({ ok: false, errors: arr_err });
    else {
        await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {
                src.user_id = data._id;
                src.resource = resource;
                if (src.resource_admin_id === undefined) {
                    src.resource_admin_id = resource_admin_id;
                }
                src.save();
                res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
            }
        });
    }
}

export const userGetResources = async (req: any, res: any) => {
    await UserResource.find({}).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored." })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}

export const userGetResourceById = async (req: any, res: any) => {
    await UserResource.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
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

