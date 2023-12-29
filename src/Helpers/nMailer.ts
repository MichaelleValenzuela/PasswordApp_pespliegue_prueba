import { varsConfig } from "./varsConfig";

import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";


const transporterConfig = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: 'OAuth2',
            user: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_MAIL,
            pass: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_PASSWORD,
            clientId: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_ID,
            clientSecret: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_SECRET,
            refreshToken: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_OAUTH2_REFRESH_TOKEN
        }
    } as SMTPTransport.Options)
}

export const transporterSendEmail = (to: string, subject: string, dataToTemplate: object = {}) => {

    const root_project_dir = path.resolve();
    const dir_template = path.join(root_project_dir, "/src/Helpers/_templates/confirm-account.hbs");
    const read_src = fs.readFileSync(dir_template, "utf-8").toString();
    const TEMPLATE_file = handlebars.compile(read_src);

    const HTML_template = TEMPLATE_file(dataToTemplate);

    let mailOptions = {
        from: varsConfig.NODEMAILER_gmail_credential.APP_SERVER_NODEMAILER_USER_MAIL,
        to: to,
        subject: subject,
        text: HTML_template
    };

    transporterConfig().sendMail(mailOptions, function (err: any, data: any) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });
}
