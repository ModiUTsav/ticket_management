import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// configure email notification

const transporter = nodemailer.createTransport({
    service:"gmail", 
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
});

// function to send eamil to user

export const sendEmail = async (to,subject,text)=>{
    console.log("mail,,,,,,,,,,,,,",sendEmail);
    console.log("📧 Sending email to:", to);
    console.log("📌 Subject:", subject);
    console.log("📝 Message:", text);
    try{

        if (!to) {
            throw new Error("Recipient email is missing!"); // ✅ Prevent sending without recipient
        }
        
        const mailOptions = {
            from:process.env.USER_EMAIL,
            to,
            subject,
            text,

        }

        await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}`);


    }
    catch(error){
        console.log("email can't be send ",error);

    }

}