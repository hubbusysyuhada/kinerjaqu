const nodemailer = require('nodemailer')

async function sendConfirmationEmail (email, code) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GOOGLE_EMAIL,
            pass: process.env.GOOGLE_PASSWORD
        }
    })
    const sendEmail = await transporter.sendMail({
        from: process.env.GOOGLE_EMAIL,
        to: email,
        subject: 'Kinerjaqu Email Verification',
        html: `Welcome to <b>Kinerjaqu</b>
        <br>
        <br>
        Your activation code is <b>${code}</b>
        <br>
        <br>
        Glad to welcome you =)
        <br>
        <br>
        <b>Kinerjaqu Team</b>
        <br>
        <br>
        For further inquirires: <a href="https://www.linkedin.com/in/hubbusysyuhada">Linkedin</a>, <a href="https://github.com/hubbusysyuhada">Github</a>, or <a href="wa.me/+6282233197540">Whatsapp</a>
        `
    })
    console.log(sendEmail)
}

module.exports = {
    sendConfirmationEmail
}