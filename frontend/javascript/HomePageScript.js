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

async function submitLogin() {
  const username = document.getElementById("username").value;
  const password1 = document.getElementById("password").value;
  const usertype = document.getElementById("buyer").checked ? 'Buyer' : 'Seller';

  if (!username || !password1) {
    alert("Please enter username and password.");
    return;
  }

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: password1, usertype })
  });

  const result = await response.json();

  if (result.success) {
    window.location.href = usertype === 'Buyer' ? 'BuyerLandingPage.html' : 'SellerLandingPage.html';
  } else {
    alert(result.message);
  }
}