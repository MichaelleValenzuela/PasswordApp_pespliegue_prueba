import User from "../Model/auth.model"

import { varsConfig } from "../../Helpers/varsConfig";
import { transporterSendEmail } from "../../Helpers/nMailer"
import { generateHashBcrypt, generateTokenUser } from "../../Helpers/generateHash";
import { _FindAndActionAuthController, _FindAndActionGETController } from "./_funController";

export const registerUser = async (req: any, res: any, next: any) => {

    const { name, lastname, email, password, confirm_password, birth } = req.body;

    const data: any = { email: email.toLowerCase(), password: password };

    if (data.email.includes("admin" || "administrador")) data.role = "ADMINISTRADOR";
    else data.role = "USUARIO";

    let arr_err: string[] = [];

    for (let c in req.body) {
        if (req.body[c].trim() === "") arr_err.push(`The field ${c} is required`);
    }

    if (password !== confirm_password) arr_err.push(`The password must be the same`);

    if (arr_err.length > 0) {
        res.status(404).json({
            ok: false,
            errors: arr_err
        });
    } else {
        data.name = name;
        data.lastname = lastname;
        data.username = ""
        data.birth = birth;
        data.userActive = false;
        data.type_encrypt = "JWT (HS256-Alg)-Default";

        const TOKEN_gen = generateTokenUser(data)

        data.token_confirm_account = TOKEN_gen;

        await _FindAndActionAuthController("REGISTER", User, { email: email }, { req, res }, () => {

            transporterSendEmail(data.email, `Hi ${name} ${lastname} please, confirm your account`, {
                name: data.name,
                lastname: data.lastname,
                uriToken: `${varsConfig.HOST_FRONTEND}/confirm/${TOKEN_gen}`
            });

            generateHashBcrypt("REGISTER", data.password, data, User, res);
        });
    }
}

export const confirmAccount = async (req: any, res: any) => {

    await _FindAndActionAuthController("CONFIRM", User, { token_confirm_account: req.params.id }, { req, res }, () => {
        res.status(201).json({
            ok: true,
            msg: "NOW. This account is activated"
        });
    });
}

export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "" || password.trim() === "") arr_err.push(`All fields are required`);

    if (arr_err.length > 0) {
        res.status(404).json({
            ok: false,
            errors: arr_err
        });
    } else {
        await _FindAndActionAuthController("LOGIN", User, { email: email }, { req, res }, () => password);
    }
}

export const recoveryUser = async (req: any, res: any) => {

    const { email } = req.body;

    let arr_err: string[] = [];

    if (email.trim() === "") arr_err.push(`The email field is required`);

    if (arr_err.length > 0) {
        res.status(404).json({
            ok: false,
            errors: arr_err
        });
    } else {

        await _FindAndActionAuthController("RECOVERY", User, { email: email }, { req, res }, null);
    }
}

export const resetPasswordUser = async (req: any, res: any) => {

    const { password, confirm_password } = req.body;

    let arr_err: string[] = [];

    if (password.trim() === "") arr_err.push(`Field password are required`);

    if (password !== confirm_password) arr_err.push(`The password must be the same`);

    if (arr_err.length > 0) {
        res.status(404).json({
            ok: false,
            errors: arr_err
        });
    } else {

        await _FindAndActionAuthController("RESET", User, { token_confirm_account: req.params.id }, { req, res }, () => password);
    }
}

export const getUsers = async (req: any, res: any) => {
    _FindAndActionGETController("USERS", User, { role: "USUARIO" }, { req, res }, null);
}   