import bcrypt from "bcrypt";
import { varsConfig } from "../../Helpers/varsConfig";
import { transporterSendEmail } from "../../Helpers/nMailer";
import { generateHashBcrypt, generateTokenUser } from "../../Helpers/generateHash";

const _FindAndUpdateData = (MODEL: any, QUERY: any, FIELDS_UPDATE: any, FUNC: any) => {
    MODEL.findOneAndUpdate(QUERY, FIELDS_UPDATE).exec().then((success: any) => {
        if (FUNC !== null) {
            FUNC();
        }
    });
}

export const _FindAndActionAuthController = async (TYPE: any, MODEL: any, QUERY: any, rq: any, FUNC: any) => {
    return await MODEL.findOne(QUERY).exec().then((data: any) => {
        switch (TYPE) {
            case "REGISTER":
                if (data) rq.res.status(404).json({ ok: false, msg: "Record already stored." })
                else FUNC();
                break;

            case "CONFIRM":
                if (!data) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {
                    if (!data.userActive) _FindAndUpdateData(MODEL, QUERY, { token_confirm_account: "", userActive: true }, FUNC)
                    else {
                        rq.res.status(404).json({
                            ok: false,
                            msg: "This account is not activated"
                        });
                    }
                }
                break;

            case "LOGIN":
                if (!data) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {
                    if (data.userActive) {
                        const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)));

                        const obj_data = {
                            ...JSON.parse(JSON.stringify(data)),
                            token_auth: TOKEN_gen
                        };
                        delete obj_data.__v;
                        delete obj_data.token_confirm_account;
                        generateHashBcrypt("LOGIN", FUNC(), obj_data, null, rq.res);
                    }
                    else {
                        rq.res.status(404).json({
                            ok: false,
                            msg: "This account is not activated"
                        });
                    }
                }
                break;

            case "RECOVERY":
                if (!data) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {

                    const new_data = {
                        ...JSON.parse(JSON.stringify(data)),
                        token_confirm_account: ""
                    };

                    const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(new_data)));

                    _FindAndUpdateData(MODEL, QUERY, { token_confirm_account: TOKEN_gen }, () => {
                        transporterSendEmail(data.email, `Hi ${data.name} ${data.lastname} please, ${!data.userActive ? "confirm your account" : "reset your password"}`, {
                            name: data.name,
                            lastname: data.lastname,
                            uriToken: `${varsConfig.HOST_FRONTEND}/${!data.userActive ? "confirm" : "reset"}/${TOKEN_gen}`
                        });
                    });

                    if (!data.userActive) {
                        rq.res.status(404).json({
                            ok: false,
                            msg: "This account is not activated. A message was sent to your email"
                        });
                    } else {
                        rq.res.status(201).json({
                            ok: true,
                            msg: "Message sent to reset password"
                        });
                    }
                }
                break;

            case "RESET":
                if (!data) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {
                    if (data.userActive) {
                        bcrypt.hash(FUNC(), 10, async function (err, hash) {
                            _FindAndUpdateData(MODEL, QUERY, { token_confirm_account: "", password: hash }, () => {
                                rq.res.status(201).json({
                                    ok: true,
                                    msg: "Password changed"
                                });
                            });
                        });
                    }
                    else {
                        rq.res.status(404).json({
                            ok: false,
                            msg: "This account is not activated"
                        });
                    }
                }
                break;
        }
    });
}

export const _FindAndActionGETController = async (TYPE: any, MODEL: any, QUERY: any, rq: any, FUNC: any) => {
    // .populate(TYPE === "RESOURCES" ? ["user_id"] : [])
    return await MODEL.find(QUERY).select(TYPE === "USERS" ? "-password" : "").exec().then((data: any) => {
        switch (TYPE) {
            case "USERS":
                if (data.length === 0) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {
            console.log("?")
                    rq.res.status(201).json({
                        ok: true,
                        msg: "Data obtained",
                        data: data
                    });
                }
                break;
            case "BEFORE-SEARCH":
                if (!data) rq.res.status(404).json({ ok: false, msg: "No record found." })
                else {
                    if (!data.userActive) {
                        rq.res.status(404).json({
                            ok: false,
                            msg: "This account is not activated"
                        });
                    } else {
                        // FUNC();
                        console.log(data);
                    }
                }
                break;

            case "CREATE":
                console.log("CREATE")
                break;

            case "RESOURCES":
                // console.log(data)
                break;
        }
    });

}