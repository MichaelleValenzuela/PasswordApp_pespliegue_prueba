import User from "../Model/User.model"
import bcrypt from "bcrypt";


export const getUsers = async (req: any, res: any) => {
    await User.find({ role: "USUARIO" }).select(["-password", "-__v", "-token_confirm_account"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored." })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}

export const desactivateUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                userIsActiveByAdmin: req.body.userIsActiveByAdmin
            }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Status changed." }));
        }
    });
}

export const editProfileUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {

            if (data.role === "ADMINISTRADOR") {
                const { username, password, confirm_password, } = req.body;
                let arr_err: string[] = [];
                if (password !== confirm_password) arr_err.push(`The password must be the same`);

                if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
                else {
                    bcrypt.hash(password, 10, async function (err, hash) {
                        User.findOneAndUpdate({ _id: req.params.id }, {
                            password: hash, username: username
                        }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Data changed" }));
                    });
                }
            } else {
                console.log("usuario común...")
            }



            // const { name, lastname, email, password, confirm_password, birth, username } = req.body;

            // let arr_err: string[] = [];
            // if (password !== confirm_password) arr_err.push(`The password must be the same`);

            // if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
            // else {
            //     bcrypt.hash(password, 10, async function (err, hash) {
            //         User.findOneAndUpdate({ _id: req.params.id }, {
            //             name: name, lastname: lastname, email: email, password: hash, birth: birth, username: username
            //         }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Data changed" }));
            //     });
            // }
        }
    });
}