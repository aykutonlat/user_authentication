import cron from "node-cron";
import { User } from "../models/userModel.js";
import { sendReminderVerificationEmail } from "./sendMailHelper.js";
import { generateAccessToken } from "./tokenHelper.js";

cron.schedule("46 0 * * *", async () => {
  console.log("Running cron job to send reminder emails.");
  const currentDate = new Date();
  const reminderThreshold = new Date();
  reminderThreshold.setDate(currentDate.getDate() - 27);

  const usersToRemind = await User.find({
    emailVerified: false,
    registrationDate: { $lte: reminderThreshold },
  });
  console.log(usersToRemind);

  usersToRemind.forEach(async (user) => {
    const daysLeft =
      30 -
      Math.floor((currentDate - user.registrationDate) / (1000 * 60 * 60 * 24));
    const verificationToken = generateAccessToken({ email: user.email });
    await sendReminderVerificationEmail(
      user.email,
      daysLeft,
      verificationToken
    );
  });
});
