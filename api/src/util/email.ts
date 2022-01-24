import nodemailer from 'nodemailer';
import {htmlToText} from 'html-to-text';
import { PRODUCTION_ENV } from '@ranjodhbirkaur/constants';

export class Email {

    private to = "";
    private name = "";
    private from = "";
    private userMessage = "";
    private userSubject = "";
    private userEmail = "";

    constructor(user: {
        to: string,
        message?: string,
        subject?: string,
        userEmail?: string,
        name: string
    
    }, url = '') {

        const {to, message = "", subject = "", name= "", userEmail = ""} = user;

       this.to = to;
       this.name = name.split(' ')[0];
       // we can easily customise email to send from
       this.from = `Blumne <grimSquad@yandex.com>`;

       // FOR CONTACT
       if (user.message) this.userMessage = user.message;
       if (user.subject) this.userSubject = user.subject;
       if (user.userEmail) this.userEmail = user.userEmail;
    }
    // have different transport for prod and dev
    newTransport() {
       // free plan 100/day
       return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
           user: "apikey",
           pass: "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"
        }
        });
    }
    // to create diff emails for diff situations
    async send(html: any, subject: any) {
       // send the actual email
       // 1) render HTML for email based on pug template
       //renderFile -Compile a Pug template from a file and render it with locals to html string. and passing in locals to pug file
       // const html = "hello test email";
       // 2) define the email options
       const mailOptions = {
          from: this.from,
          to: this.to,
          subject: subject,
          html: html,
          // convert html string to text
          text: htmlToText(html)
       };
       // 3) create a transport and send email

       if(process.env.ENVIORNMENT === PRODUCTION_ENV) {
            await this.newTransport().sendMail(mailOptions);
       }
    }
    // sendWelcome email
    async sendWelcome(name: string) {
       await this.send('welcome', `Thank you ${name} for joining Blumne!`);
    }
    // paswordReset email
    async sendPasswordReset() {
       await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes.)');
    }
    // contact email
    async sendTicket() {
       await this.send('ticket', 'Ticket for Coders League.');
    }
    // send top articles email
    async sendTopArticles() {
       await this.send('topArticles', 'Top Articles this week curated for you.');
    }
 }