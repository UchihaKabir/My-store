const products = [
  { id: 1, name: "T-Shirt", price: 19.99, image: "images/tshirt.jpg", description: "Comfortable cotton t-shirt." },
  { id: 2, name: "Jeans", price: 39.99, image: "images/jeans.jpg", description: "Slim-fit denim jeans." },
  { id: 3, name: "Sneakers", price: 59.99, image: "images/sneakers.jpg", description: "Cool sporty sneakers." },
  { id: 4, name: "Hoodie", price: 49.99, image: "images/hoodie.jpg", description: "Warm stylish hoodie." },
  { id: 5, name: "Cap", price: 14.99, image: "images/cap.jpg", description: "Stylish cap." },
  { id: 6, name: "Sunglasses", price: 29.99, image: "images/sunglasses.jpg", description: "UV-protected stylish sunglasses." },
  { id: 7, name: "Watch", price: 89.99, image: "images/watch.jpg", description: "Water-resistant wristwatch." },
  { id: 8, name: "Backpack", price: 44.99, image: "images/backpack.jpg", description: "Durable backpack for daily use." },
  { id: 9, name: "Jacket", price: 99.99, image: "images/jacket.jpg", description: "Stylish waterproof jacket." },
  { id: 10, name: "Belt", price: 24.99, image: "images/belt.jpg", description: "Leather belt." },
  { id: 11, name: "Scarf", price: 19.49, image: "images/scarf.jpg", description: "Soft wool scarf." },
  { id: 12, name: "Gloves", price: 21.99, image: "images/gloves.jpg", description: "Winter gloves." },
  { id: 13, name: "Boots", price: 69.99, image: "images/boots.jpg", description: "Stylish boots." },
  { id: 14, name: "Shorts", price: 29.99, image: "images/shorts.jpg", description: "Lightweight summer shorts." },
  { id: 15, name: "Sandals", price: 22.99, image: "images/sandals.jpg", description: "Comfortable beach sandals." },
  { id: 16, name: "Wallet", price: 17.99, image: "images/wallet.jpg", description: "Leather wallet." },
  { id: 17, name: "Beanie", price: 12.99, image: "images/beanie.jpg", description: "Knitted beanie hat." }
];

let isLoggedIn = false;
const validUser = { username: "user", password: "1234" };

function toggleLoginModal(show) {
  const modal = document.getElementById("login-modal");
  modal.style.display = show ? "flex" : "none";
}

function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  if (username === validUser.username && password === validUser.password) {
    isLoggedIn = true;
    toggleLoginModal(false);
    updateLoginUI();
    alert("Logged in successfully!");
  } else {
    alert("Invalid credentials");
  }
}

function logoutUser() {
  isLoggedIn = false;
  updateLoginUI();
  clearCart();
  alert("You have logged out.");
}

function updateLoginUI() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const cartBox = document.getElementById("cart");

  loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
  logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  cartBox.style.display = isLoggedIn && cart.length > 0 ? "block" : "none";
}

// ------------------------------
// Cart and Modal Logic
// ------------------------------
let cart = [];

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  const discount = 0.2;

  products.forEach(product => {
    const discountedPrice = (product.price * (1 - discount)).toFixed(2);
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onclick='openProductModal(${JSON.stringify(product)})' />
      <h3>${product.name}</h3>
      <p class="description">${product.description}</p>
      <p><span class="price">৳${product.price.toFixed(2)}</span>
         <span class="discount-label">20% OFF</span></p>
      <p class="discounted-price">৳${discountedPrice}</p>
      <button onclick="addToCart(${product.id})" class="add-to-cart-btn">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

function addToCart(id) {
  if (!isLoggedIn) return alert("Please log in to add items to cart.");
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const cartBox = document.getElementById("cart");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ৳${item.price.toFixed(2)} 
    <button class="remove-btn" onclick="removeFromCart(${index})">❌</button>`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `৳${total.toFixed(2)}`;
  cartCount.textContent = cart.length;
  cartBox.style.display = isLoggedIn && cart.length > 0 ? "block" : "none";
}

function openProductModal(product) {
  if (!isLoggedIn) return alert("Please login to view product details.");

  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-title").textContent = product.name;
  document.getElementById("modal-description").textContent = product.description;
  document.getElementById("modal-price").textContent = `৳${product.price.toFixed(2)}`;

  const reviewsHTML = product.reviews?.length
    ? `<h3>Customer Reviews</h3><ul>${product.reviews.map(r => `<li>${r}</li>`).join('')}</ul>`
    : `<p>No reviews yet.</p>`;

  document.getElementById("modal-reviews").innerHTML = reviewsHTML;

  const modal = document.getElementById("product-modal");
  modal.style.display = "flex";

  document.getElementById("modal-add-to-cart").onclick = () => {
    addToCart(product.id);
    modal.style.display = "none";
  };
}

window.onload = () => {
  renderProducts();
  updateLoginUI();

  document.querySelector(".cart-icon").addEventListener("click", () => {
    const cartBox = document.getElementById("cart");
    cartBox.style.display = cartBox.style.display === "none" ? "block" : "none";
  });

  document.getElementById("clear-cart").addEventListener("click", clearCart);

  document.getElementById("buy-now").addEventListener("click", () => {
    if (!isLoggedIn) return alert("Please log in first.");
    if (cart.length === 0) {
      alert("Your cart is empty!");
    } else {
      alert("🎉 Purchase successful! Thank you for your order.");
      clearCart();
    }
  });

  document.getElementById("login-btn").addEventListener("click", () => toggleLoginModal(true));
  document.getElementById("logout-btn").addEventListener("click", logoutUser);
  document.getElementById("login-submit").addEventListener("click", loginUser);
  document.getElementById("login-close").addEventListener("click", () => toggleLoginModal(false));
};
