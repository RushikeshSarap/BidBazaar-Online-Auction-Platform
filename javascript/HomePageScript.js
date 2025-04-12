// Login Modal Handling
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'flex';
});

// Close Modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
});

// Close modal if clicked outside
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('loginModal')) {
        document.getElementById('loginModal').style.display = 'none';
    }
});

// Dummy Login Function
function submitLogin() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let usertype = document.getElementsByName('usertype').value;

    if (username === "" || password === "") {
        alert("Please enter a valid username and password.");
    }
    else if(usertype === "1"){
        window.location.replace("BuyerLandingPage.html");
        document.getElementById('loginModal').style.display = 'none';
    }
    else{
        window.location.replace("SellerLandingPage.html");
        document.getElementById('loginModal').style.display = 'none';
    }
}
