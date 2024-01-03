import 'dotenv/config'

export const varsConfig = {
    ROLES: ["ADMINISTRADOR", "USUARIO"],
    PORT_EXPRESS: 7000,
    HOST_FRONTEND: "http://localhost:5173",
    ADRESS_MONGO: "mongodb://127.0.0.1:27017/app-password",
    JWT_STR: "IÑDHASDASJDHLJSAHDJKSADHÑASJDHASDAÑHÑJÑJJKHJASDÑJÑASD",
    NODEMAILER_gmail_credential: {
        APP_SERVER_NODEMAILER_USER_MAIL: process.env.APP_SERVER_NODEMAILER_USER_MAIL,
        APP_SERVER_NODEMAILER_USER_PASSWORD: process.env.APP_SERVER_NODEMAILER_USER_PASSWORD,
        APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_ID: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_ID,
        APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_SECRET: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_CLIENT_SECRET,
        APP_SERVER_NODEMAILER_USER_OAUTH2_REFRESH_TOKEN: process.env.APP_SERVER_NODEMAILER_USER_OAUTH2_REFRESH_TOKEN
    },
    URI_USER: ["/register", "/confirm-account/:id", "/login", "/recovery", "/reset-password/:id", "/users"],
    URI_RESOURCE: ["/create-resource", "/resources", "/resource/:id"]
}