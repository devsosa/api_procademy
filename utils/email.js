const nodemailer = require('nodemailer');

const sendEmail = async (option) => {

    // 1. create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    
    // 2. define email options
    const emailOptions = {
        from: 'nodejsApi support<support@nodejs-api.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    // console.log(await transporter.sendMail(emailOptions));

    await transporter.sendMail(emailOptions);


}

module.exports = sendEmail;