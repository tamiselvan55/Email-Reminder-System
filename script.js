// Schedule Reminder
async function scheduleReminder() {
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const time = document.getElementById("sendTime").value;
  const status = document.getElementById("status");

  if (!email || !subject || !message || !time) {
    status.textContent = "⚠️ Fill all fields";
    status.style.color = "orange";
    return;
  }

  status.textContent = "⏳ Scheduling...";
  status.style.color = "#ddd";

  try {
    const res = await fetch("/api/setReminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message, time }),
    });
    const data = await res.json();
    if (data.success) {
      status.textContent = "✅ Reminder scheduled!";
      status.style.color = "lightgreen";
      document.getElementById("email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("message").value = "";
      document.getElementById("sendTime").value = "";
    } else {
      status.textContent = "⚠️ Failed";
      status.style.color = "orange";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Server error";
    status.style.color = "red";
  }
}

// Fetch and show reminders
async function loadReminders() {
  const container = document.getElementById("reminder-list");
  const res = await fetch("/api/reminders");
  const reminders = await res.json();
  container.innerHTML = reminders.map(r => `
    <div class="reminder-card ${r.sent ? 'sent' : ''}">
      <p><strong>${r.subject}</strong></p>
      <p>${r.message}</p>
      <p>${new Date(r.time).toLocaleString()}</p>
      <p>Status: ${r.sent ? 'Sent ✅' : 'Pending ⏳'}</p>
    </div>
  `).join('');
}

// Call loadReminders on reminders.html
if (document.getElementById("reminder-list")) {
  loadReminders();
}
