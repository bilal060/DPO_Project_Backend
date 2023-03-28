import ejs from 'ejs'; 
import  nodemailer from 'nodemailer';

export const sendEmailWithLink = async (data: any) => {
    const { email, resetPasswordLink, appName, email_subject, emailTemplateLink } = data;
    const result: any = await ejs.renderFile(emailTemplateLink, { resetPasswordLink, appName })
    if (result && result.err) {
      return false
    } else {
      const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });
      
      const mailOptions = {
        from: `"${appName}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: email_subject,
        html: result
      };
      const response = await transporter.sendMail(mailOptions)
      if (response) {
        return response;
      }
      return false;
    }
}
  