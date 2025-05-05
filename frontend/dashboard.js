cd// frontend/dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username');
    document.getElementById('usernameDisplay').textContent = username;
  
    const res = await fetch(`/api/userdata/${username}`);
    const data = await res.json();
  
    if (data && data.userData) {
      document.getElementById('userDataSection').innerHTML = `
        <h2>Your Cycle Info</h2>
        <p><strong>Cycle Length:</strong> ${data.userData.cycleLength} days</p>
        <p><strong>Last Period:</strong> ${data.userData.lastPeriodDate}</p>
        <p><strong>Mood:</strong> ${data.userData.mood}</p>
      `;
    } else {
      document.getElementById('firstTimeFormSection').style.display = 'block';
    }
  
    document.getElementById('userDataForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const form = e.target;
      const userData = {
        username,
        cycleLength: form.cycleLength.value,
        lastPeriodDate: form.lastPeriodDate.value,
        mood: form.mood.value,
      };
  
      const saveRes = await fetch('/api/userdata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      const saveResult = await saveRes.json();
      alert(saveResult.message);
      location.reload();
    });
  
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/frontend/index.html';
    });
  });
  