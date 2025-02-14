import {createTransport } from "nodemailer";
const sendMail= async (email, subject, text )=>{
    const transport= createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        tls :{
          rejectUnauthorized: false  
        },
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GPASS,
        },

    });
    // send mail 
    await transport.sendMail({
        from:process.env.GMAIL,
        to : email,
        subject,
        text,
    });
        
};

export default sendMail;