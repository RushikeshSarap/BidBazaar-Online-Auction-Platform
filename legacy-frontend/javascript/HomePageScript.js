// Login Modal Handling
document.getElementById("loginBtn").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "flex";
});

// Close Modal
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("loginModal").style.display = "none";
});

// Close modal if clicked outside
window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("loginModal")) {
    document.getElementById("loginModal").style.display = "none";
  }
});

// // Dummy Login Function example removed. The application now uses the backend `/api/login` endpoint for authentication.

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://bidbazaar-online-auction-platform.onrender.com'; // Dynamic Render API fallback

async function submitLogin() {
  const username = document.getElementById("username").value;
  const password1 = document.getElementById("password").value;
  const usertype = document.getElementById("buyer").checked ? 'Buyer' : 'Seller';

  if (!username || !password1) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: password1, usertype })
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', result.role);
      localStorage.setItem('username', username);
      window.location.href = usertype === 'Buyer' ? 'BuyerLandingPage.html' : 'SellerLandingPage.html';
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Login request failed:", error);
    alert("Could not connect to the authentication server. Please ensure the backend is running.");
  }
}