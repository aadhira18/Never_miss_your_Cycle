// Signup Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      console.error('Signup Error:', err);
      alert('Something went wrong during signup. Please try again.');
    }
  });
}

// Login Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;

    if (!username || !password) {
      alert('Please enter both username/email and password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Something went wrong during login. Please try again.');
    }
  });
}

// Period Tracking Handler
const periodForm = document.getElementById("periodForm");
if (periodForm) {
  periodForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const periodLength = document.getElementById("periodLength").value;
    const cycleLength = document.getElementById("cycleLength").value;

    try {
      const response = await fetch("/api/periods/track-period", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, periodLength, cycleLength })
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error("Server did not return valid JSON.");
      }

      const data = await response.json();
       document.getElementById("calendarView").innerText = `Next Period Starts: ${data.nextPeriod}`;

      // Update calendar UI with past cycle history
      updateCalendar(data.history || []);

    } catch (err) {
      console.error("Period Tracking Error:", err);
      alert("There was an error tracking your period. Please try again.");
    }
  });
}

// Function to update the calendar and show scrollable history
function updateCalendar(history) {
  const resultDiv = document.getElementById("calendarView");

  const calendarHTML = history.map(entry => `
    <div class="calendar-entry">
      <strong>Cycle Start:</strong> ${entry.startDate}<br>
      <strong>Period Length:</strong> ${entry.periodLength} days<br>
      <strong>Cycle Length:</strong> ${entry.cycleLength} days<br>
      <strong>Predicted Next:</strong> ${entry.nextPeriod}<br><hr>
    </div>
  `).join("");

  //design calender

  function showOnCalendar(nextDate) {
  const calendarEl = document.getElementById('calendarView');
  calendarEl.innerHTML = ''; // Reset old calendar

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: nextDate,
    height: 400,
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,next today'
    },
    events: [
      {
        title: 'Next Period',
        start: nextDate,
        display: 'background',
        backgroundColor: '#f06292',
        borderColor: '#ec407a'
      }
    ]
  });

  calendar.render();
}


  resultDiv.innerHTML += `
    <div class="calendar-history" style="margin-top: 20px; max-height: 300px; overflow-y: auto; text-align: left; padding: 10px; border: 1px solid #ccc; border-radius: 10px; background: #ffeef5;">
      ${calendarHTML}
    </div>
  `;
}
