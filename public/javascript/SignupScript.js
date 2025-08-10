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
    captcha.textContent = generated;
  
  //   document.getElementById("signupForm").addEventListener("submit", function(e) {
  //     e.preventDefault();
  
  //     const password = document.getElementById("password").value;
  //     if (password.length < 6) {
  //       alert("Password must be at least 6 characters long.");
  //       return;
  //     }
  
  //     if (captchaInput.value !== generated) {
  //       alert("Captcha does not match.");
  //       return;
  //     }
  
  //     alert("Registration Successful!");
  //     this.reset();
  //   });
  });

  document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
    

    formData.append("captcha", document.getElementById("captchaInput").value);

    // const password = document.getElementById("password").value;
    // if (password.length < 6) {
    //   alert("Password must be at least 6 characters long.");
    //   return;
    // }
    
    const response = await fetch("/api/register", {
      method: "POST",
      body: formData
    });
  
    const result = await response.json();
    alert(result.message);
    if (result.success) {
      window.location.href = "HomePage.html";
    }
  });
  