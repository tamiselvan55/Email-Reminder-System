async function scheduleReminder() {
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const time = document.getElementById("sendTime").value;
  const status = document.getElementById("status");

  // Basic validation
  if (!email || !subject || !message || !time) {
    status.textContent = "⚠️ Please fill out all fields.";
    status.style.color = "orange";
    return;
  }

  status.textContent = "⏳ Scheduling reminder...";
  status.style.color = "#ddd";

  try {
    // ✅ Replace this URL with your backend Render URL
    const response = await fetch("https://email-reminder-system-7ory.onrender.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        subject,
        message,
        time,
      }),
    });

    const data = await response.json();

    if (data.success) {
      status.textContent = "✅ Reminder scheduled successfully!";
      status.style.color = "lightgreen";
      document.getElementById("email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("message").value = "";
      document.getElementById("sendTime").value = "";
    } else {
      status.textContent = "⚠️ Failed to schedule reminder.";
      status.style.color = "orange";
    }
  } catch (error) {
    console.error("Error:", error);
    status.textContent = "❌ Unable to connect to server.";
    status.style.color = "red";
  }
}
