import nodemailer from "nodemailer"


const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // Use false for STARTTLS
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });
  
      const info = await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text,
      });
  
      console.log("Email sent successfully!", info);
    } catch (error) {
      console.error("Email not sent!", error);
    }
  };
export {sendEmail};
