const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const path = require("path");
const Reminder = require("./models/Reminder");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

transporter.verify((error, success) => {
  if (error) console.log("❌ Nodemailer verify failed:", error);
  else console.log("📧 Nodemailer transporter ready");
});

// Routes
app.post("/api/reminders", async (req, res) => {
  try {
    const { email, subject, message, sendTime } = req.body;
    console.log("Incoming data:", req.body);

    const reminder = new Reminder({ email, subject, message, sendTime });
    await reminder.save();

    const delay = new Date(sendTime) - new Date();
    if (delay > 0) {
      setTimeout(() => {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject,
          text: message,
        }, (err, info) => {
          if (err) console.error("Error sending email:", err);
          else console.log("✅ Email sent:", info.response);
        });
      }, delay);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
