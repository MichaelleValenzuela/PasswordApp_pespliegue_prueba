import 'dotenv/config'

export const varsConfig = {
    PORT_EXPRESS: 7000,
    HOST_FRONTEND: "http://localhost:5173",
    //ADRESS_MONGO: "mongodb://127.0.0.1:27017",
    ADRESS_MONGO: "mongodb+srv://rootdraug:ufbL9vyu6N4pX4W0@cluster0.uaqdbx7.mongodb.net/",
    JWT_STR: "IÑDHASDASJDHLJSAHDJKSADHÑASJDHASDAÑHÑJÑJJKHJASDÑJÑASD",

    URI_AUTH: ["/auth/register", "/auth/confirm-account/:id", "/auth/login", "/auth/recovery",
        "/auth/reset-password/:id"],
    URI_USER: ["/user/users", "/user/desactivate-user/:id", "/user/edit-profile/:id"],
    URI_ADMIN_RESOURCE: ["/admin/create-resource", "/admin/get-resources", "/admin/edit-resource/:id",
        "/admin/delete-resource/:id"],
    URI_USER_RESOURCE: ["/user/create-resource", "/user/get-resources", "/user/get-resource/:id", "/user/edit-resource/:id",
        "/user/delete-resource/:id"],

    NODEMAILER_gmail_credential: {
        APP_SERVER_NODEMAILER_USER_MAIL: process.env.APP_SERVER_NODEMAILER_USER_MAIL,
        APP_SERVER_NODEMAILER_USER_PASSWORD: process.env.APP_SERVER_NODEMAILER_USER_PASSWORD,
        APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_ID: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_ID,
        APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_SECRET: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_SECRET,
        APP_SERVER_NODEMAILER_USER_OAUTH2_REFRESH_TOKEN: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_REFRESH_TOKEN
    }
}