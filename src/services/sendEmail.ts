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
                return true
            }
        }); 
    }
}



//Using MailTrap
// var nodemailer = require('nodemailer'); 

// export class EmailUtil {
//     static async sendEmail(toEmail: string, emailSubject: string, emailBody: string) {
   
//         let transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: process.env.SMTP_PORT,
//             auth: {
//               user: process.env.SMTP_EMAIL,
//               pass: process.env.SMTP_PASSWORD,
//             },
//         });
          
//         var mailOptions = {
//             from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
//             to: toEmail,
//             subject: emailSubject,
//             text: emailBody
//         };
        

//         transporter.sendMail(mailOptions, function(error: any, info: any){
//             if (error) {
//                 console.log("Error sending email");
//             } else {
//                 return true
//             }
//         }); 
//     }
// }