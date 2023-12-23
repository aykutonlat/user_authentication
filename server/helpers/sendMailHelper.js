import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { userConfig } from "../config/userConfig.js";

dotenv.config();

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: userConfig.serverEmail,
      pass: userConfig.serverEmailPassword,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const mailOptions = {
    from: userConfig.serverEmail,
    to: email,
    subject: "Hesap Doğrulama",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hesap Doğrulama</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #fafafa;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.05);
              text-align: center;
          }
          h1 {
              color: #333;
          }
          .button {
              display: inline-block;
              padding: 12px 24px;
              margin: 25px 0;
              background-color: #4CAF50; /* Green */
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-size: 16px;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #45a049;
          }
          .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 0.9em;
              color: #666;
          }
      </style>
      </head>
      <body>
      <div class="container">
          <h1>Hesap Doğrulama</h1>
          <p>Hesabınızı doğrulamak ve başlamak için lütfen aşağıdaki düğmeyi tıklayın:</p>
          <a href="${process.env.CLIENT_URL}/user/activate/${token}" class="button">Hesabı Doğrula</a>
          <div class="footer">
              <p>Bu e-postayı talep etmediyseniz, lütfen dikkate almayın.</p>
          </div>
      </div>
      </body>
      </html>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Email gönderilirken hata oluştu:", err);
    return false;
  }
};
