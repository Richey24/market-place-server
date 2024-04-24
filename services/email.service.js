const nodemailer = require("nodemailer");
const pug = require("pug");
const { ServerError } = require("../utils/error");

const defaultEmailConfig = nodemailer.createTransport({
     host: "smtp.office365.com",
     port: 587,
     secure: false,
     auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
     },
});

class EmailService {
     constructor(transporter = defaultEmailConfig) {
          this.transporter = transporter;
     }

     /**
      * email payload
      *
      * @typedef {Object} Payload
      * @property {string} from - The sender's email address.
      * @property {string} to - The recipient's email address.
      * @property {Object} data - The email data object.
      * @property {string} templatePath - The email template path.
      */

     /**
      * @param {Payload} payload - The email payload.
      * @returns {Promise<string>} The response from Nodemailer.
      * @throws {ServerError} If the email sending fails.
      */
     async sendEmail(payload) {
          try {
               // Render the email template with Pug

               const compiledFunction = pug.compileFile(`${process.cwd()}/${payload.templatePath}`);

               const html = compiledFunction({
                    ...payload.data,
                    to: payload.to,
                    from: payload.from,
               });

               // Send email using Nodemailer
               const info = await this.transporter.sendMail({
                    from: payload.from,
                    to: payload.to,
                    subject: payload.data.subject,
                    text: payload.data.content,
                    html: html,
                    ...(payload.inReplyTo && { inReplyTo: payload.inReplyTo }),
                    ...(payload.references && { references: payload.references }),
               });
               return info;
          } catch (error) {
               console.log({ err: error });

               throw new ServerError("Failed to send email", error);
          }
     }
}

module.exports = new EmailService();
