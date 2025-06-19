import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendInactivityEmail = async (studentName, studentEmail) => {
    try {
        const mailOptions = {
            from: `"Student Progress System" <${process.env.MAIL_USER}>`,
            to: studentEmail,
            subject: "A Gentle Reminder to Get Back to Coding! 💪",
            html: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Hey ${studentName},</h2>
                    <p>Just a friendly nudge from the Student Progress System!</p>
                    <p>We noticed you haven't made any submissions on Codeforces in the last 7 days. Consistency is key to improvement in competitive programming.</p>
                    <p>Why not try solving a problem today? Here's a link to get you started:</p>
                    <a href="https://codeforces.com/problemset" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Go to Codeforces</a>
                    <p>Happy coding!</p>
                    <br>
                    <p>Best,</p>
                    <p>Your Friendly Automated System</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Inactivity email sent successfully to ${studentEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${studentEmail}:`, error);
        throw new Error("Failed to send email.");
    }
};