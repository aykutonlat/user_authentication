import dotenv from "dotenv";

dotenv.config();

export const userConfig = {
  serverEmail: process.env.SERVER_EMAIL,
  serverEmailPassword: process.env.SERVER_EMAIL_PASSWORD,
};
