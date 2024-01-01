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

                    const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)));

                    transporterSendEmail(data.email, `Hi ${data.name} ${data.lastname} please, ${!data.userActive ? "confirm your account" : "reset your password"}`, {
                        name: data.name,
                        lastname: data.lastname,
                        uriToken: `${varsConfig.HOST_FRONTEND}/${!data.userActive ? "confirm-account" : "reset-password"}/${TOKEN_gen}`
                    });

                    _FindAndUpdateData(MODEL, QUERY, { token_confirm_account: TOKEN_gen }, null);

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
                                rq.res.status(404).json({
                                    ok: false,
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

export const _FindAndActionResourceController = async (TYPE: any, MODEL: any, QUERY: any, rq: any, FUNC: any) => {

    return await MODEL.findOne(QUERY).populate(TYPE === "RESOURCES" ? ["user_id"] : []).exec().then((data: any) => {
        switch (TYPE) {
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




    // await MODEL.find(OBJ_SEARCH).select({
    //     "password": 0,
    //     "token_confirm_account": 0,
    //     "__v": 0
    // }).exec().then((data: any) => {
    //     if (data.length > 0) {
    //         reqORres.res.status(201).json({
    //             ok: false,
    //             data: data,
    //             msg: "Data obtained"
    //         });
    //     } else {
    //         reqORres.res.status(404).json({
    //             ok: false,
    //             msg: "No record found"
    //         });
    //     }
    // });
    // break;

}



export const _FindRecord = async (TYPE: string, QUANTITY: string, MODEL: any, OBJ_SEARCH: any,
    reqORres: any, func: any) => {

    switch (QUANTITY) {
        case "UNIQUE":
            await MODEL.findOne(OBJ_SEARCH).exec().then((data: any) => {
                if (TYPE === "REGISTER") {
                    if (data) {
                        reqORres.res.status(404).json({
                            ok: false,
                            msg: "Record already stored"
                        });
                    } else {
                        func();
                    }
                } else if (TYPE === "CONFIRM") {
                    if (!data) {
                        reqORres.res.status(404).json({
                            ok: false,
                            msg: "No record found"
                        });
                    } else {
                        if (!data.userActive) {
                            MODEL.findOneAndUpdate(OBJ_SEARCH, {
                                token_confirm_account: "",
                                userActive: true
                            }).exec().then((success: any) => {
                                func();
                            });
                        } else {
                            reqORres.res.status(404).json({
                                ok: false,
                                msg: "This account is not activated"
                            });
                        }
                    }
                } else if (TYPE === "LOGIN") {
                    if (!data) {
                        reqORres.res.status(404).json({
                            ok: false,
                            msg: "No record found"
                        });
                    } else {
                        if (data.userActive) {
                            func();

                            const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)))

                            const obj_data = {
                                ...JSON.parse(JSON.stringify(data)),
                                token_auth: TOKEN_gen
                            }
                            delete obj_data.__v;
                            console.log(obj_data)
                            generateHashBcrypt("LOGIN", func(), obj_data, null, reqORres.res);

                        } else {
                            reqORres.res.status(404).json({
                                ok: false,
                                msg: "This account is not activated"
                            });
                        }
                    }
                } else if (TYPE === "RECOVERY") {
                    if (!data) {
                        reqORres.res.status(404).json({
                            ok: false,
                            msg: "No record found"
                        });
                    } else {
                        const TOKEN_gen = generateTokenUser(JSON.parse(JSON.stringify(data)));
                        transporterSendEmail(data.email, `Hi ${data.name} ${data.lastname} please, ${!data.userActive ? "confirm your account" : "reset your password"}`, {
                            name: data.name,
                            lastname: data.lastname,
                            uriToken: `${varsConfig.HOST_FRONTEND}/${!data.userActive ? "confirm-account" : "reset-password"}/${TOKEN_gen}`
                        });

                        if (!data.userActive) {
                            reqORres.res.status(404).json({
                                ok: false,
                                msg: "This account is not activated. A message was sent to your email"
                            });
                        } else {
                            MODEL.findOneAndUpdate({ email: data.email }, {
                                token_confirm_account: TOKEN_gen
                            }).exec().then((success: any) => {
                                func();
                            });
                        }
                    }
                } else if (TYPE === "RESET") {
                    if (!data) {
                        reqORres.res.status(404).json({
                            ok: false,
                            msg: "No record found"
                        });
                    } else {
                        console.log(data)
                        if (!data.userActive) {

                            reqORres.res.status(404).json({
                                ok: false,
                                msg: "This account is not activated"
                            });

                        } else {
                            bcrypt.hash(func(), 10, async function (err, hash) {
                                MODEL.findOneAndUpdate(OBJ_SEARCH, {
                                    token_confirm_account: "",
                                    password: hash,
                                }).exec().then((success: any) => {
                                    reqORres.res.status(404).json({
                                        ok: false,
                                        msg: "Password changed"
                                    });
                                });
                            });
                        }
                    }
                }
            });
            break;

        case "ALL":
            await MODEL.find(OBJ_SEARCH).select({
                "password": 0,
                "token_confirm_account": 0,
                "__v": 0
            }).exec().then((data: any) => {
                if (data.length > 0) {
                    reqORres.res.status(201).json({
                        ok: false,
                        data: data,
                        msg: "Data obtained"
                    });
                } else {
                    reqORres.res.status(404).json({
                        ok: false,
                        msg: "No record found"
                    });
                }
            });
            break;

        case "DETAIL":
            await MODEL.findOne(OBJ_SEARCH).select({
                "password": 0,
                "token_confirm_account": 0,
                "__v": 0
            }).exec().then((data: any) => {

                if (!data) {
                    reqORres.res.status(404).json({
                        ok: false,
                        msg: "No record found"
                    });
                } else {
                    reqORres.res.status(201).json({
                        ok: true,
                        data: data,
                        msg: "Data obtained"
                    });
                }
            });
            break;
    }
}