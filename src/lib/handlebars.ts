import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { transporter } from "./nodemailer";

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

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "NotificationTransaction.hbs"
  );

  const source = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(source);

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
