// Initialize all modules from localStorage if not present
function loadLocalStorage() {
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
    if (!localStorage.getItem("wishlist")) localStorage.setItem("wishlist", JSON.stringify([]));
    if (!localStorage.getItem("transactions")) localStorage.setItem("transactions", JSON.stringify([]));
    if (!localStorage.getItem("myProducts")) {
      const sample = [{ id: 4, name: "Old Painting", price: 1500, bids: 4 }];
      localStorage.setItem("myProducts", JSON.stringify(sample));
    }
  }

  const allProducts = [
    { id: 1, name: "Vintage Clock", price: 1200, bids: 2 },
    { id: 2, name: "Antique Vase", price: 900, bids: 5 },
    { id: 3, name: "Rare Coin", price: 500, bids: 1 },
  ];
  
  function loadLocalStorage() {
    if (!localStorage.getItem("cart")) localStorage.setItem("cart", "[]");
    if (!localStorage.getItem("wishlist")) localStorage.setItem("wishlist", "[]");
    if (!localStorage.getItem("transactions")) localStorage.setItem("transactions", "[]");
    if (!localStorage.getItem("myProducts")) localStorage.setItem("myProducts", JSON.stringify([{ id: 4, name: "Old Painting", price: 1500, bids: 4 }]));
  }
  
  
  // Helper: Get product by ID from main list
  function getProductById(id) {
    const all = [
      { id: 1, name: "Vintage Clock", price: 1200, bids: 2 },
      { id: 2, name: "Antique Vase", price: 900, bids: 5 },
      { id: 3, name: "Rare Coin", price: 500, bids: 1 },
      { id: 4, name: "Old Painting", price: 1500, bids: 4 }
    ];
    return all.find(p => p.id === id);
  }
  
  // Show temporary alert message
  function showAlert(msg) {
    const div = document.createElement("div");
    div.className = "alert";
    div.innerText = msg;
    document.body.insertBefore(div, document.body.firstChild);
    setTimeout(() => div.remove(), 2500);
  }
  