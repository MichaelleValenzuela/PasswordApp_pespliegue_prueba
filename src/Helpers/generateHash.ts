import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { varsConfig } from "./varsConfig";

export const generateHashBcrypt = async (inTheCase: string, text: string, data: any, User: any, res: any) => {

    const SALT = 10;

    switch (inTheCase) {

        case "REGISTER":
            bcrypt.hash(text, SALT, async function (err, hash) {
                // Store hash in your password DB.
                data.password = hash;

                const user = new User(data);

                await user.save();

                res.status(201).json({
                    ok: true,
                    msg: "[POST] Sucess"
                });
            });
            break;

        case "LOGIN":
            await bcrypt.compare(text, data.password).then((result) => {
                console.log(result)
                if (!result) {
                    res.status(404).json({
                        ok: true,
                        msg: "Email or Password icorrect"
                    });
                } else {
                    delete data.password;
                    res.status(201).json({
                        ok: true,
                        data: data,
                        msg: "[POST] Sucess"
                    });
                }
            });
            break;
    }
}

export const generateTokenUser = (dataUser: object) => {
    return JWT.sign(dataUser, varsConfig.JWT_STR, { expiresIn: '1h' });
}

export const decodeTokenUser = (TOKEN: string) => {
    JWT.verify(TOKEN, varsConfig.JWT_STR, function (err, decoded) {
        // console.log(decoded.foo) // bar
    });
}
