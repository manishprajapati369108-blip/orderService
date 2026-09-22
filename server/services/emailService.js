import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
})

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const response = await client.transactionalEmails.sendTransacEmail(
            {
                subject,
                htmlContent,
                sender: {
                    name: "file Drive",
                    email : process.env.EMAIL_FROM,
                },
                to: [{email: to}]
            }
        );
         console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', response.messageId);
        return response;
    } catch (error) {
        console.error('❌ Email sending failed:');
        console.error('📧 Error:', error.message);
        throw error;
    }
};

export default sendEmail;