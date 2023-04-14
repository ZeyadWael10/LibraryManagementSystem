import nodemailer from "nodemailer"
export const sendEmail = async ({ to = "", subject = "", message = "" }) => {
    let transporter = nodemailer.createTransport({
        host: "localhost",
        port: 587,
        secure: false, // true for 465, false for other ports
        service: "gmail",
        auth: {
            user: process.env.SENDEREMAIL, // generated ethereal user
            pass: process.env.SENDERPASSWORD, // generated ethereal password
        }, tls: {
            rejectUnauthorized: false,
        },
    });
    let info = await transporter.sendMail({
        from: `E-Library ${process.env.SENDEREMAIL}`,
        to,
        subject,
        html: message
    })
    if (info.accepted.length) {
        return true;
    }
    return false;
}