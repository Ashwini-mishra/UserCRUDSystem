// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');

function sendMail(email , code, name){
    console.log('Credentials obtained, sending message...');
// console.log("email",email);
// console.log("name",name);
// console.log("code", code);
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.email",
        port: 587,
        secure: false,
        auth: {
            user: "keymouseitashwini@gmail.com",
            pass: "keymouseit@225"
        }
    });

    // Message object
    let message = {
        from: 'Sender Name <keymouseitashwini@gmail.com>',
        to: email,
        subject: 'verification of email',
        text: code,
        html: '<p><b>Hello </b>'+name+' '+code+'</p>'
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
module.exports = { sendMail };