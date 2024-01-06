import AdminResource from "../Model/AdminResource.model"
import User from "../Model/User.model"

import { decodeTokenUser } from "../../Helpers/generateHash";


export const adminCreateResource = async (req: any, res: any) => {

    const { name_type, fields } = req.body;

    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    const src = await new AdminResource();

    let arr_err: string[] = [];

    if (name_type === "") arr_err.push(`El campo 'Nombre' es requerido`);

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {
        await User.findOne({ _id: HEADER._id, role: 'ADMINISTRADOR' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {
                AdminResource.findOne({ name_type: name_type }).exec().then((dat: any) => {
                    if (dat) res.status(404).json({ ok: false, msg: "Ya se enuentra esa información almacenada" })
                    else {
                        src.user_id = data._id;
                        src.name_type = name_type;
                        fields.forEach((e: any) => {
                            delete e._id;
                        });
                        src.fields = fields;
                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
                    }
                });
            }
        });
    }
}

export const adminGetResources = async (req: any, res: any) => {
    await AdminResource.find({}).select(["-__v"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored.", data: [] })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}

export const adminEditResource = async (req: any, res: any) => {

    const { name_type, fields } = req.body;

    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    const src = await new AdminResource();

    let arr_err: string[] = [];

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {
        await User.findOne({ _id: HEADER._id, role: 'ADMINISTRADOR' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {
                fields.forEach((e: any) => delete e._id);

                AdminResource.findOneAndUpdate({ _id: req.params.id }, {
                    name_type: name_type,
                    fields: fields
                }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Se ha actualizado el recurso" }));

            }
        });
    }
}

export const adminDeleteResource = async (req: any, res: any) => {

    console.log("ELIMINANDO!", req.params.id)
    await AdminResource.findOne({ _id: req.params.id }).exec().then((data: any) => {
        console.log(data)
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {
            AdminResource.findByIdAndDelete({ _id: req.params.id }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Resource deleted." }));
        }
    });
}
