import User from "../Model/User.model"
import bcrypt from "bcrypt";

import { varsConfig } from "../../Helpers/varsConfig";
import { transporterSendEmail } from "../../Helpers/nMailer"
import { generateHashBcrypt, generateTokenUser } from "../../Helpers/generateHash";

export const registerUser = async (req: any, res: any) => {

    const { name, lastname, email, password, confirm_password, birth } = req.body;

    const DATA_save: any = { email: email.toLowerCase(), password: password };

    if (DATA_save.email.includes("admin" || "administrador")) DATA_save.role = "ADMINISTRADOR";
    else DATA_save.role = "USUARIO";

    let arr_err: string[] = [];
    for (let c in req.body) {
        if (req.body[c].trim() === "") arr_err.push(`El campo ${c} es requerido`);
    }

    if (password !== confirm_password) arr_err.push(`Las contraseñas ingresadas deben ser iguales`);

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {
        DATA_save.name = name;
        DATA_save.lastname = lastname;
        DATA_save.username = ""
        DATA_save.birth = birth;
        DATA_save.userActive = false;
        DATA_save.type_encrypt = "JWT (HS256-Alg)-Default";
        DATA_save.userIsActiveByAdmin = true;
        const TOKEN_gen = generateTokenUser(DATA_save)

        DATA_save.token_confirm_account = TOKEN_gen;

        await User.findOne({ email: email }).exec().then((data: any) => {
            if (data) res.status(404).json({ ok: false, msg: "El E-mail ingresado ya se encuentra almacenado" })
            else {
                transporterSendEmail(DATA_save.email, `Hola ${name} ${lastname} por favor, confirma tu cuenta`, {
                    name: DATA_save.name,
                    lastname: DATA_save.lastname,
                    uriToken: `${varsConfig.HOST_FRONTEND}/confirm/${TOKEN_gen}`
                });
                generateHashBcrypt("REGISTER", DATA_save.password, DATA_save, User, res);
            }
        });
    }
}

export const confirmAccount = async (req: any, res: any) => {
    await User.findOne({ token_confirm_account: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "El token ingresado no se encuentra disponible" })
        else {
            if (!data.userActive) {
                User.findOneAndUpdate({ token_confirm_account: req.params.id }, {
                    token_confirm_account: "", userActive: true
                }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "AHORA. Esta cuenta se encuentra activada" }));
            } else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
        }
    });
}

export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "" || password.trim() === "") arr_err.push(`Todos los campos son requeridos`);

    if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
    else {
        await User.findOne({ email: email }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El E-mail ingresado no se encuentra almacenado" })
            else {
                if (data.userIsActiveByAdmin) {
                    if (data.userActive) {
                        const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)));
                        const obj_data = {
                            ...JSON.parse(JSON.stringify(data)),
                            token_auth: TOKEN_gen
                        };
                        delete obj_data.__v;
                        delete obj_data.token_confirm_account;
                        generateHashBcrypt("LOGIN", password, obj_data, null, res);
                    }
                    else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
                } else res.status(404).json({ ok: false, msg: "Esta cuenta ha sido deshabilitada por el Admin" });
            }
        });
    }
}

export const recoveryUser = async (req: any, res: any) => {

    const { email } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "") arr_err.push(`El campo E-mail es requerido`);

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {

        await User.findOne({ email: email }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El E-mail ingresado no se encuentra almacenado" })
            else {
                const new_data = {
                    ...JSON.parse(JSON.stringify(data)),
                    token_confirm_account: ""
                };

                const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(new_data)));

                User.findOneAndUpdate({ email: email }, { token_confirm_account: TOKEN_gen }).exec().then((success: any) => {
                    transporterSendEmail(data.email, `Hola ${data.name} ${data.lastname} por favor, ${!data.userActive ? "confirma tu cuenta" : "cambia tu contraseña"}`, {
                        name: data.name,
                        lastname: data.lastname,
                        uriToken: `${varsConfig.HOST_FRONTEND}/${!data.userActive ? "confirm" : "reset"}/${TOKEN_gen}`
                    });
                });

                if (!data.userActive) res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada. Se te ha enviado un mensaje a tu correo para que puedas activar tu cuenta" })
                else res.status(201).json({ ok: true, msg: "Se te ha enviado un mensaje a tu correo para que puedas cambiar tu contraseña" });
            }
        });
    }
}

export const resetPasswordUser = async (req: any, res: any) => {

    const { password, confirm_password } = req.body;

    let arr_err: string[] = [];

    if (password.trim() === "") arr_err.push(`El campo 'contraseña' es requerido`);

    if (password !== confirm_password) arr_err.push(`Las contraseñas ingresadas deben ser iguales`);

    if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
    else {
        await User.findOne({ token_confirm_account: req.params.id }).exec().then((data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "El usuario ingresado no se encuentra registrado" })
            else {
                if (data.userActive) {
                    bcrypt.hash(password, 10, async function (err, hash) {
                        User.findOneAndUpdate({ token_confirm_account: req.params.id }, { token_confirm_account: "", password: hash }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "La contraseña fue cambiada con éxito" }));
                    });
                }
                else res.status(404).json({ ok: false, msg: "Esta cuenta no se encuentra activada" });
            }
        });
    }
}