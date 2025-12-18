let supportAdded = false;
let selectedItem = null;
let basePrice = 0;

//GLOBAL UTILS
function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

//   NAVBAR TOGGLE
function shownavbar() {
  document.querySelector(".top-bar")?.classList.toggle("shownavbar");
}


//   CART PAGE
function loadCartPage() {
  const items = getCartItems();
  if (!items.length) return;

  const first = items[0];
  document.getElementById("itemName").innerText = first.name;
  document.getElementById("itemPrice").innerText = `${first.price}$`;
}
//   CHECKOUT SUMMARY
function loadCheckoutSummary() {
  const items = getCartItems();
  const list = document.getElementById("orderSummaryList");
  const template = document.getElementById("orderItemTemplate");
  if (!list || !template) return;

  list.innerHTML = "";
  let subtotal = 0;

  items.forEach((item, i) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".item-name").textContent = item.name;
    clone.querySelector(".item-qty").textContent = item.qty || 1;
    clone.querySelector(".item-total").textContent = `$ ${(item.price * (item.qty || 1)).toFixed(2)}`;
    clone.querySelector(".increase").dataset.index = i;
    clone.querySelector(".decrease").dataset.index = i;
    clone.querySelector(".remove").dataset.index = i;
    list.appendChild(clone);

    subtotal += item.price * (item.qty || 1);
  });

  updateTotals(subtotal);
  attachSummaryEvents();
}

function updateTotals(subtotal) {
  const shipping = subtotal > 0 ? 200 : 0;
  const tax = subtotal * 0.05;
  const grand = subtotal + shipping + tax;

  document.getElementById("subtotal").textContent = `$ ${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$ ${shipping}`;
  document.getElementById("tax").textContent = `$ ${tax.toFixed(2)}`;
  document.getElementById("grandTotal").textContent = `$ ${grand.toFixed(2)}`;
}
//Event Handlers for +, −, Remove
function attachSummaryEvents() {
  const items = getCartItems();

  document.querySelectorAll(".increase").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      items[i].qty = (items[i].qty || 1) + 1;
      saveCartItems(items);
      loadCheckoutSummary();
    };
  });

  document.querySelectorAll(".decrease").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      if ((items[i].qty || 1) > 1) {
        items[i].qty -= 1;
        saveCartItems(items);
        loadCheckoutSummary();
      }
    };
  });

  document.querySelectorAll(".remove").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.index;
      items.splice(i, 1);
      saveCartItems(items);
      loadCheckoutSummary();
    };
  });
}

//Handle Place Order (Address Page Validation + Continue)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".needs-validation");
  const paymentBtn = document.getElementById("paymentBtn");
  const termsCheck = document.getElementById("terms");

  // Exit if key elements are missing
  if (!form || !paymentBtn) return;

  // Load summary if the element exists
  if (document.getElementById("orderSummaryList")) {
    loadCheckoutSummary();
  }

  // Toggle button state based on terms checkbox
  termsCheck?.addEventListener("change", () => {
    paymentBtn.disabled = !termsCheck.checked;
  });

  // Handle "Continue to Payment" click
  paymentBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Validate terms agreement
    if (!termsCheck.checked) {
      alert("Please agree to the terms and conditions first!");
      return;
    }

    // Validate form fields (Bootstrap validation)
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      alert("Please fill out all required fields before continuing!");
      return;
    }

    // Construct and store order data
    const orderData = {
      name: `${form.firstName.value} ${form.lastName.value}`,
      email: form.email.value.trim(),
      phone: `${form.countryCode.value} ${form.phone.value.trim()}`,
      address: `${form.address.value}, ${form.city.value}, ${form.country.value} - ${form.postal.value}`,
      cart: getCartItems(),
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));

    window.location.href = "/payment";
  });
});

//   PAYMENT PAGE BEHAVIOR
function setupPaymentOptions() {
  const form = document.getElementById("paymentForm");
  if (!form) return;

  const method = document.getElementById("paymentMethod");
  const cardSection = document.getElementById("cardSection");

  method.addEventListener("change", () => {
    const cardFields = cardSection.querySelectorAll("input");
    const isCard = method.value === "Card";
    cardSection.style.display = isCard ? "block" : "none";
    cardFields.forEach(f => (f.required = isCard));
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = JSON.parse(localStorage.getItem("orderData")) || {};
    data.payment = method.value === "Card" ? "Card" : "Cash on Delivery";
    if (method.value === "Card") {
      const num = document.getElementById("cardNumber").value.trim();
      data.cardEnding = num.slice(-4);
    }

    localStorage.setItem("orderData", JSON.stringify(data));
    window.location.href = "/review";
  });
}

//   REVIEW PAGE LOADER (FIXED)
function loadReviewPage() {
  const data = JSON.parse(localStorage.getItem("orderData"));
  const list = document.getElementById("orderSummaryList");

  // Fill shipping details
  document.getElementById("reviewName").textContent = data.name || "N/A";
  document.getElementById("reviewAddress").textContent = data.address || "N/A";
  document.getElementById("reviewPhone").textContent = data.phone || "N/A";

  // Payment details
  const paymentText =
    data.payment === "Card"
      ? `Credit / Debit Card ending in ${data.cardEnding}`
      : data.payment || "N/A";
  document.getElementById("reviewPayment").textContent = paymentText;

  // Cart summary inside orderSummaryList
  list.innerHTML = "";
  let subtotal = 0;

  if (data.cart && Array.isArray(data.cart)) {
    data.cart.forEach((item) => {
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${item.name}</strong><br>
          <small class="text-muted">Qty: ${item.qty || 1}</small>
        </div>
        <span>$. ${item.price}</span>
      `;
      list.appendChild(li);
      subtotal += Number(item.price) * (item.qty || 1);
    });
  }

  // ====== CALCULATE TOTALS ======
  const shipping = subtotal > 500 ? 0 : 200; 
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + shipping + tax;

  // ====== UPDATE TOTAL FIELDS ======
  document.getElementById("subtotal").textContent = `$ ${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent = `$ ${shipping.toFixed(2)}`;
  document.getElementById("tax").textContent = `$ ${tax.toFixed(2)}`;
  document.getElementById("grandTotal").textContent = `$ ${grandTotal.toFixed(2)}`;
}

//   PLACE ORDER BUTTON
function setupPlaceOrder() {
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const data = JSON.parse(localStorage.getItem("orderData"));
    if (!data || !data.cart || data.cart.length === 0) {
      alert("No items found in your order. Please go back and try again.");
      return;
    }

    alert(" Your order has been placed successfully!");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("orderData");
    setTimeout(() => (window.location.href = "/"), 500);
  });
}

//   PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("itemName")) loadCartPage();
  if (document.getElementById("paymentForm")) setupPaymentOptions();
  if (document.getElementById("orderSummaryList")) loadReviewPage();
  if (document.getElementById("placeOrderBtn")) setupPlaceOrder();
});

// ===== MongoDB BuyNow Integration =====
const productDropdown = document.getElementById("productDropdown");

if (productDropdown) {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      productDropdown.innerHTML = "";

      data.products.forEach(p => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between px-3";

        li.innerHTML = `
          <a class="dropdown-item" href="#" onclick="selectMongoProduct('${p.name}', ${p.price})">
            ${p.name}
          </a>
          <span class="fw-bold">$${p.price}</span>
        `;

        productDropdown.appendChild(li);
      });
    });
}

// MUST be global
function selectMongoProduct(name, price) {
  selectedItem = name;
  basePrice = price;

  document.getElementById("dropdownMenuButton1").innerText = name;
  updatePrice();
}
function updatePrice() {
  let total = basePrice;

  const supportCheck = document.getElementById("supportCheck");
  if (supportCheck && supportCheck.checked) {
    total += 18;
  }

  document.getElementById("price").innerText = `$${total}`;
}
function addToCart() {
  if (!selectedItem) {
    alert("Please select a product first!");
    return;
  }

  const supportAdded = document.getElementById("supportCheck")?.checked || false;
  const finalPrice = basePrice + (supportAdded ? 18 : 0);

  const cartItems = getCartItems();

  const existing = cartItems.find(
    i => i.name === selectedItem && i.support === supportAdded
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      name: selectedItem,
      price: finalPrice,
      qty: 1,
      support: supportAdded
    });
  }

  saveCartItems(cartItems);
  window.location.href = "/cart";
}

