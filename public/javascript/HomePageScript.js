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

// // Dummy Login Function
// function submitLogin() {
//   let username = document.getElementById("username").value;
//   let password1 = document.getElementById("password").value;
//   var usertype1 = document.getElementById("buyer");
//   var usertype2 = document.getElementById("seller");

//   if (username === "" || password1 === "") {
//     alert("Please enter a valid username and password.");
//   }

//   var mysql = require("mysql");

//   var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "SQLpassword",
//   });


//   con.connect(function (err) {
//     if (err) throw err;
//     con.query(`SELECT (UserPassword,UserRole) FROM User_dtls WHERE UserUserName = ${username}`, function (err, result) {
//     if (err) throw err;
//     end: {
//         console.log(result[0],result[1]);
//         if(result === null)
//         {
//         alert("Please enter a valid username");
//         break end;
//         }
//         if(result[0] != password1)
//         {
//         alert("Please enter the correct password.");
//         break end;
//         }
//         if((usertype1.checked == true && result[1] != 'Buyer') || (usertype2.checked == true && result[1] != 'Seller'))
//         {
//         alert("Please enter the correct User Type.");
//         break end;
//         }

//         if(usertype1.checked == true){
//             window.location.replace("BuyerLandingPage.html");
//             document.getElementById('loginModal').style.display = 'none';
//         }
//         else if(usertype2.checked == true){
//             window.location.replace("SellerLandingPage.html");
//             document.getElementById('loginModal').style.display = 'none';
//         }

//     }
//         });
//     });

// }

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