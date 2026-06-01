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

loadLocalStorage();
function renderMarketplace() {
  const container = document.getElementById("marketplace-container");
  container.innerHTML = "";

  allProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>Price: ₹${product.price}</p>
      <p>Bids: ${product.bids}</p>
      <button class="button" onclick="addToCart(${product.id})">Add to Cart</button>
      <button class="button" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function addToWishlist(id) {
  const product = allProducts.find(p => p.id === id);
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  wishlist.push(product);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to wishlist");
}
