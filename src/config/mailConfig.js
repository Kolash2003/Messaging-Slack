import nodemailer from "nodemailer";

import { EMAIL_PASSWORD, EMAIL_USER } from "./serverConfig.js";

// nodemailer expects you to create a transporter object which will be used to send emails
// this transporter object will be used to send emails
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;