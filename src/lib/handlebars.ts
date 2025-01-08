import handlebars from "handlebars";
import { transporter } from "./nodemailer";
import { notificationTransactionTemplate } from "../templates/NotificationTransaction";
import { forgotPasswordTemplate } from "../templates/ForgotPassword";

export const sendTransactionEmail = async (data: {
  email: string;
  name: string;
  transactionStatus: string;
  ticketQuantity: string;
  totalDiscount: string;
  totalPrice: string;
  total: string;
}) => {
  const {
    email,
    name,
    transactionStatus,
    totalDiscount,
    totalPrice,
    ticketQuantity,
    total,
  } = data;

  const template = handlebars.compile(notificationTransactionTemplate);

  const html = template({
    email,
    name,
    transactionStatus,
    ticketQuantity,
    totalDiscount,
    totalPrice,
    total,
  });

  const mailOptions = {
    from: `"Star Ticket" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: `Transaction ${transactionStatus}`,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Transaction email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending transaction email:", error);
  }
};

export const sendForgotPasswordEmail = async (data: {
  email: string;
  link: string;
}) => {
  const { email, link } = data;

  const template = handlebars.compile(forgotPasswordTemplate);

  const html = template({
    email,
    link,
  });

  const mailOptions = {
    from: `"Star Ticket" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`Forgot password email sent to ${email} successfully!`);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};
