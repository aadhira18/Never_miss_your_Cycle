// Signup Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

    // Basic validation
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

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        // Redirect to login or dashboard
        window.location.href = '/login.html'; // Optional
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

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        // Redirect on successful login
        window.location.href = '/dashboard.html';
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Something went wrong during login. Please try again.');
    }
  });
}

