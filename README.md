# Email Reminder App (Node.js + Express + MongoDB + Nodemailer)

## What this project contains
- `server.js` — Express server, API endpoints, periodic sender
- `models/Reminder.js` — Mongoose model
- `public/index.html` and `public/app.js` — Simple frontend (HTML + JS)
- `.env.example` — environment variables example
- `package.json` — dependencies & scripts

## Requirements
- Node.js (v14+ recommended)
- npm
- MongoDB (local or Atlas)
- A Gmail account (use App Password if you have 2FA enabled)

## Setup & Run (step by step)
1. Download and unzip the project.
2. Open the project folder in VS Code.
3. Copy `.env.example` to `.env` and edit:
   - `MONGO_URI` — e.g. `mongodb://localhost:27017/email_reminder` or your MongoDB Atlas connection string.
   - `EMAIL_USER` — your Gmail address (e.g. `you@gmail.com`)
   - `EMAIL_PASS` — your Gmail password **or** an app password (recommended if 2FA enabled).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start MongoDB if running locally. For Ubuntu/macOS, e.g.:
   ```bash
   sudo service mongod start
   ```
   or use Docker / MongoDB Atlas.
6. Start the server:
   ```bash
   npm start
   ```
   or during development:
   ```bash
   npm run dev
   ```
7. Open your browser to `http://localhost:3000` and schedule reminders using the form.
8. The server checks for due reminders every 30 seconds and sends them using the configured Gmail account.

## Notes & Security
- For Gmail, enable "Less secure apps" is deprecated — use App Passwords if you have 2FA enabled. See Google account settings.
- Do **not** commit your `.env` with real credentials to a public repo.
- This implementation uses a simple polling loop (setInterval). For production use consider robust job schedulers like `agenda`, `bull`, or serverless scheduled functions.

## Troubleshooting
- If emails do not send, check server logs for Nodemailer errors and verify `EMAIL_USER`/`EMAIL_PASS`.
- If MongoDB fails to connect, verify `MONGO_URI` and that the DB server is accessible.

## That's it!
Schedule reminders from the web form and the backend will send them at the scheduled time.
