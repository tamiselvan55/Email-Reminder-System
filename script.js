document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reminderForm');
  const reminderList = document.getElementById('reminderList');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      const sendTime = document.getElementById('sendTime').value;

      const reminder = { email, subject, message, sendTime };
      const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
      reminders.push(reminder);
      localStorage.setItem('reminders', JSON.stringify(reminders));

      alert('✅ Reminder Saved!');
      form.reset();
    });
  }

  if (reminderList) {
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    if (reminders.length === 0) {
      reminderList.innerHTML = "<p>No reminders yet.</p>";
    } else {
      reminderList.innerHTML = reminders.map(r => `
        <div class="card">
          <h3>${r.subject}</h3>
          <p>${r.message}</p>
          <small>📅 ${r.sendTime}</small>
        </div>
      `).join('');
    }
  }
});
