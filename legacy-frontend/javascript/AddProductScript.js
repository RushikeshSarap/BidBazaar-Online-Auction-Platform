// AddProductScript.js – handles the product form submission
// Dynamically determine API base (localhost for dev, Render URL for prod)
const API_BASE = (function () {
  const host = window.location.hostname;
  // If running on localhost or 127.0.0.1, use relative path; otherwise use Render URL
  if (host === "localhost" || host === "127.0.0.1") {
    return ""; // relative to same origin
  }
  // Replace with your actual Render endpoint if different
  return "https://bidbazaar-online-auction-platform.onrender.com";
})();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a product.");
      return;
    }

    const formData = new FormData(form);
    try {
      const response = await fetch(`${API_BASE}/api/add-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Product added successfully!");
        // Optionally redirect to marketplace or clear form
        form.reset();
        // window.location.href = "Marketplace.html";
      } else {
        alert(result.message || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while adding product.");
    }
  });
});
