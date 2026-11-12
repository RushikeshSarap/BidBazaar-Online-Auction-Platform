const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? ''
  : 'https://bidbazaar-online-auction-platform.onrender.com'; // Dynamic Render API fallback

document.addEventListener("DOMContentLoaded", () => {
  const captcha = document.getElementById("captcha");
  const captchaInput = document.getElementById("captchaInput");

  function generateCaptcha() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const generated = generateCaptcha();
  if (captcha) {
    captcha.textContent = generated;
  }

  document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (captchaInput.value.toUpperCase() !== generated) {
      alert("Captcha does not match.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    formData.append("captcha", captchaInput.value);

    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      alert(result.message);
      if (result.success) {
        window.location.href = "HomePage.html";
      }
    } catch (error) {
      console.error("Registration request failed:", error);
      alert("Failed to submit registration. Please verify that the backend is running.");
    }
  });
});