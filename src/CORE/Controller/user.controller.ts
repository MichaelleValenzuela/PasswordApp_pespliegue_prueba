import User from "../Model/auth.model"

import { varsConfig } from "../../Helpers/varsConfig";
import { transporterSendEmail } from "../../Helpers/nMailer"
import { generateHashBcrypt, generateTokenUser } from "../../Helpers/generateHash";


export const registerUser = async (req: any, res: any) => {

    const { name, lastname, username, email, password, confirm_password, birth } = req.body;

    const data: any = {
        name: name,
        lastname: lastname,
        username: username,
        email: email.toLowerCase(),
        password: password,
        birth: birth,
        type_encrypt: "JWT (HS256-Alg)-Default",
        role: "",
        userActive: false
    }

    if (data.email.includes("admin" || "administrador")) {
        data.role = "ADMINISTRADOR";
    } else {
        data.role = "USUARIO";
    }

    let arr_err: string[] = [];
    for (let c in data) {
        // console.log(`${data[c]}`);

        if (typeof data.userActive !== "boolean") {
            if (data[c].trim() === "") {
                arr_err.push(`The field ${c} is required`);
            }
        }
    }

    if (password !== confirm_password) {
        arr_err.push(`The password must be the same`);
    }

    if (arr_err.length > 0) {
        res.status(404).json({
            ok: false,
            errors: arr_err
        })
    } else {

        const TOKEN_gen = generateTokenUser(data)

        data.token_confirm_account = TOKEN_gen;

        const user = new User(data);
        transporterSendEmail(data.email, `Hi ${name} ${lastname} please, confirm your account`, {
            name: data.name,
            lastname: data.lastname,
            uriToken: `${varsConfig.HOST_FRONTEND}/confirm-account/${TOKEN_gen}`
        });

        generateHashBcrypt("REGISTER", data.password, data, User, res);
    }
}


export const confirmAccount = async (req: any, res: any) => {

    await User.findOne({ token_confirm_account: req.params.id }).exec().then((data) => {
        if (!data) {
            res.status(404).json({
                ok: false,
                msg: "There is not token exists for that user or already this account is activated"
            })
        } else {
            if (!data.userActive) {
                User.findOneAndUpdate({ token_confirm_account: req.params.id }, {
                    token_confirm_account: "",
                    userActive: true
                }).exec().then((success) => {
                    res.status(201).json({
                        ok: true,
                        msg: "This account is activated"
                    });
                });

            } else {
                res.status(404).json({
                    ok: false,
                    msg: "There is not token exists for that user or already this account is activated"
                })
            }
        }
    });
}

export const loginUser = async (req: any, res: any) => {

    const { email, password } = req.body;

    await User.findOne({ email: email, userActive: true }).exec().then((data) => {
        if (!data) {
            res.status(404).json({
                ok: false,
                msg: "The email does not exist or must be activated"
            })
        } else {

            const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)))

            const obj_data = {
                ...JSON.parse(JSON.stringify(data)),
                token_auth: TOKEN_gen
            }

            delete obj_data.__v;

            generateHashBcrypt("LOGIN", password, obj_data, null, res);
        }
    });
}