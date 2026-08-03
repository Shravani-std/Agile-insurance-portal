const nodemailer = require("nodemailer");

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.EMAIL_PORT) || 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
} else {
    // Development fallback: use JSON transport so sendMail succeeds but doesn't send real email.
    // This prevents registration from failing during local development when SMTP creds are not set.
    console.warn("EMAIL_USER/EMAIL_PASS not set — using JSON transport (dev fallback)");
    transporter = nodemailer.createTransport({ jsonTransport: true });
}


module.exports = {
    transporter,
};