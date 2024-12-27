const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    res.send("Server is Running");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from Latest Portfolio ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  const welcomeMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Ankush Kumar's Portfolio",
    text: `Hi ${name},\n\nThank you for connecting with Ankush Kumar. I will contact you back soon.\n\nBest Regards,\nAnkush Kumar`,
  };

  try {
    // Send admin email
    await transporter.sendMail(mailOptions);
    // Send welcome email to user
    await transporter.sendMail(welcomeMailOptions);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
