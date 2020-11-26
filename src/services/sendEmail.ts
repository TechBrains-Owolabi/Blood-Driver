var nodemailer = require('nodemailer'); 

export class EmailUtil {
    static async sendEmail(toEmail: string, emailSubject: string, emailBody: string) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'owo.ezekiel@gmail.com',
              pass: 'intheend1'
            }
        });
          
        var mailOptions = {
            from: 'blooddrive@gmail.com',
            to: toEmail,
            subject: emailSubject,
            text: emailBody
        };
        
        transporter.sendMail(mailOptions, function(error: any, info: any){
            if (error) {
                console.log("Error sending email");
            } else {
                console.log('Email sent successfully');
            }
        }); 
    }
}