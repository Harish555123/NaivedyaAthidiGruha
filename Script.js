const BASE_URL = 'http://localhost:3000';

// Signup
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) window.location.href = 'login.html';
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
  if (res.ok) window.location.href = 'booking.html';
});

// Booking
document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('bname').value;
  const email = document.getElementById('bemail').value;
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const guests = document.getElementById('guests').value;

  const res = await fetch(`${BASE_URL}/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, checkin, checkout, guests })
  });

  const data = await res.json();
  alert(data.message);
});
