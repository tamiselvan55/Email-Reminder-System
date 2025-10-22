import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cron from "node-cron";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public"))); // Put HTML/CSS/JS in "public" folder

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/email_reminder", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Reminder model
const reminderSchema = new mongoose.Schema({
  email: String,
  subject: String,
  message: String,
  time: Date,
  sent: { type: Boolean, default: false },
});
const Reminder = mongoose.model("Reminder", reminderSchema);

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

// API routes
app.post("/api/setReminder", async (req, res) => {
  const { email, subject, message, time } = req.body;
  if (!email || !subject || !message || !time) {
    return res.json({ success: false, msg: "All fields required" });
  }
  const reminder = new Reminder({ email, subject, message, time });
  await reminder.save();
  res.json({ success: true, msg: "Reminder scheduled!" });
});

app.get("/api/reminders", async (req, res) => {
  const reminders = await Reminder.find().sort({ time: -1 });
  res.json(reminders);
});

// Cron job every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const reminders = await Reminder.find({ time: { $lte: now }, sent: false });

  for (const r of reminders) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: r.email,
        subject: r.subject,
        text: r.message,
      });
      r.sent = true;
      await r.save();
      console.log("✅ Email sent to", r.email);
    } catch (err) {
      console.error("❌ Error sending email:", err);
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
