require('dotenv').config();

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: process.env.MAILHOST,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

async function sendmailInvite(req, res) {
    const userProps = req.body;
    const sender = userProps.sender;
    const recipients = userProps.recipients;
    const reviewid = userProps.reviewid;

    let toList = recipients.join(',');

    const options = {
        from: 'ihomertest@hotmail.com',
        to: toList,
        subject: 'Review invitation from ' + sender,
        html:
            '<h2>' +
            sender +
            ' wants you to review him! Use the link below</h2><a href="http://localhost:8080/#/reviews/' +
            reviewid +
            '">Review</a>',
    };

    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Sent: ' + info.response);
    });
}

module.exports = {
    sendmailInvite,
};
