const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const recipient = options.email || options.to;
        const body = options.message || options.text || '';

        const transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: options.subject,
            text: body
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;