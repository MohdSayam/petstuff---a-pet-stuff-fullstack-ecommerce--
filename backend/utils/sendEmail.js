const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD        
    },
    });

    // email options
    const mailOptions = { 
        from: '"Petstuff support" <sayamansari78300@gmail.com>',
        to: options.email,
        subject : options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;