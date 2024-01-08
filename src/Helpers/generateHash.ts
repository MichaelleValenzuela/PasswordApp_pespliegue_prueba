import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { varsConfig } from "./varsConfig";

export const generateHashBcrypt = async (TYPE: string, text: string, data: any, User: any, res: any, req: any = "") => {

    const SALT = 10;

    switch (TYPE) {
        case "REGISTER":
            bcrypt.hash(text, SALT, async function (err, hash) {
                data.password = hash;
                const user = new User(data);
                await user.save();
                res.status(201).json({
                    ok: true,
                    msg: "Registered user"
                });
            });
            break;

        case "LOGIN":
            await bcrypt.compare(text, data.password).then((result) => {
                if (!result) {
                    res.status(404).json({
                        ok: true,
                        msg: "Los datos ingresados son inválidos. Verifique y vuelva a intentar"
                    });
                } else {
                    delete data.password;
                    res.status(201).json({
                        ok: true,
                        data: data,
                        msg: "User logged in"
                    });
                }
            });
            break;

        case "RESET_PASSWORD":
            bcrypt.hash(text, SALT, async function (err, hash) {
                User.findOneAndUpdate({ token_confirm_account: req.params.id }, {
                    token_confirm_account: hash,
                }).exec().then((success: any) => {
                    res.status(201).json({
                        ok: true,
                        msg: "Password updated"
                    });
                });
            });
            break;
    }
}

export const generateTokenUser = (dataUser: object) => {
    return JWT.sign(dataUser, varsConfig.JWT_STR, { expiresIn: '1h' });
}


export const decodeTokenUser = (TOKEN: string) => {
    return JWT.verify(TOKEN, varsConfig.JWT_STR);
}
