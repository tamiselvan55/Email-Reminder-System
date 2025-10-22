function scheduleReminder() {
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;
  const sendTime = document.getElementById("sendTime").value;
  const status = document.getElementById("status");

  if (!email || !subject || !message || !sendTime) {
    status.style.color = "red";
    status.textContent = "⚠️ Please fill out all fields.";
    return;
  }

  const reminder = { email, subject, message, sendTime };
  localStorage.setItem(Date.now(), JSON.stringify(reminder));

  status.style.color = "lightgreen";
  status.textContent = "✅ Reminder scheduled successfully!";
}

window.onload = function () {
  const list = document.getElementById("reminderList");
  if (!list) return;
  const keys = Object.keys(localStorage);
  list.innerHTML = "";

  if (keys.length === 0) {
    list.innerHTML = "<p>No reminders found.</p>";
  } else {
    keys.forEach((key) => {
      const { email, subject, message, sendTime } = JSON.parse(localStorage.getItem(key));
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h4>${subject}</h4><p><strong>Email:</strong> ${email}</p><p>${message}</p><p><strong>Time:</strong> ${sendTime}</p>`;
      list.appendChild(div);
    });
  }
};
