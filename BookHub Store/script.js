/* =====================================================
   GLOBAL LOAD
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    updateHeader();
    loadCartTotal();
    initPaymentPage();
});

/* =====================================================
   LOGIN HEADER
===================================================== */
function updateHeader() {
    const authSection = document.getElementById("authSection");
    if (!authSection) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName");

    if (isLoggedIn && userName) {
        authSection.innerHTML = `
            <div class="login-btn">
                <i class="fa-solid fa-circle-user"></i>
                <a href="account.html" style="color:black;text-decoration:none;">
                    Hi, ${userName}
                </a>
                <button onclick="logout()" style="border:none;background:none;color:red;font-weight:bold;margin-left:8px;cursor:pointer;">
                    Logout
                </button>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <a href="account.html" class="login-btn">
                <i class="fa-solid fa-user"></i> Login
            </a>
        `;
    }
}

function logout() {
    localStorage.clear();
    location.reload();
}

/* =====================================================
   CART TOTAL (ALL PAGES)
===================================================== */
let total = parseFloat(localStorage.getItem("cartTotal")) || 0;

function loadCartTotal() {
    const el = document.getElementById("cartTotal");
    if (el) el.textContent = total.toFixed(2);
}

function getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function saveCartItems(items) {
    localStorage.setItem("cartItems", JSON.stringify(items));
    updateCartTotal();
}

function updateCartTotal() {
    const items = getCartItems();
    total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    localStorage.setItem("cartTotal", total.toFixed(2));
    loadCartTotal();
}

function addBookToCart(title, price) {
    const items = getCartItems();
    const existingItem = items.find(item => item.title === title);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        items.push({ title, price, qty: 1 });
    }
    
    saveCartItems(items);
}

function removeFromCart(title) {
    let items = getCartItems();
    items = items.filter(item => item.title !== title);
    saveCartItems(items);
}

document.querySelectorAll("button[data-price], button[price]").forEach(btn => {
    btn.addEventListener("click", () => {
        const price = parseFloat(btn.dataset.price);
        if (isNaN(price)) return;

        total += price;
        localStorage.setItem("cartTotal", total.toFixed(2));
        loadCartTotal();
    });
});

/* =====================================================
   AUTHORS SEARCH
===================================================== */
function filterAuthors() {
    const input = document.getElementById("authorSearch");
    if (!input) return;

    const keyword = input.value.toLowerCase();
    document.querySelectorAll(".author-card").forEach(card => {
        card.style.display = card.dataset.name.toLowerCase().includes(keyword)
            ? ""
            : "none";
    });
}

/* =====================================================
   GLOBAL BOOK SEARCH
===================================================== */
function globalSearch(event) {
    if (event && event.key && event.key !== 'Enter') return;
    
    const searchInput = document.getElementById("globalSearch");
    if (!searchInput) return;
    
    const keyword = searchInput.value.trim();
    if (keyword) {
        window.location.href = `categories.html?search=${encodeURIComponent(keyword)}`;
    }
}

/* =====================================================
   FAQ ACCORDION
===================================================== */
document.querySelectorAll(".faq-question").forEach(q => {
    q.addEventListener("click", () => {
        const ans = q.nextElementSibling;
        if (!ans) return;
        ans.style.display = ans.style.display === "block" ? "none" : "block";
    });
});

/* =====================================================
   CONTACT FORM
===================================================== */
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("Your message has been submitted successfully!");
        contactForm.reset();
    });
}

/* =====================================================
   PAYMENT PAGE LOGIC
===================================================== */
let qty = 1;
let unitPrice = 0;

function initPaymentPage() {
    const cartValue = parseFloat(localStorage.getItem("cartTotal"));
    if (!isNaN(cartValue)) {
        unitPrice = cartValue;
        calculatePrice();
    }
}

function changeQty(val) {
    qty += val;
    if (qty < 1) qty = 1;

    const q = document.getElementById("qtyDisplay");
    if (q) q.textContent = qty;

    calculatePrice();
}

function calculatePrice() {
    const subtotal = qty * unitPrice;
    const sst = subtotal * 0.06;
    const totalPay = subtotal + sst;

    document.getElementById("subtotal").textContent = `RM ${subtotal.toFixed(2)}`;
    document.getElementById("sst").textContent = `RM ${sst.toFixed(2)}`;
    document.getElementById("totalDisplay").textContent = `RM ${totalPay.toFixed(2)}`;

    localStorage.setItem("finalTotal", totalPay.toFixed(2));
}

/* =====================================================
   PAYMENT METHOD ACCORDION
===================================================== */
function toggleAcc(id) {
    document.querySelectorAll(".acc-content").forEach(c => c.style.display = "none");
    const target = document.getElementById(id);
    if (target) target.style.display = "block";
}

/* =====================================================
   ORDER SUBMIT
===================================================== */
const orderForm = document.getElementById("orderForm");
if (orderForm) {
    orderForm.addEventListener("submit", e => {
        e.preventDefault();

        const pay = document.querySelector('input[name="pay_group"]:checked');
        if (!pay) {
            alert("Please select a payment method!");
            return;
        }

        const overlay = document.getElementById("loadingOverlay");
        if (overlay) overlay.style.display = "flex";

        setTimeout(() => {
            localStorage.removeItem("cartTotal");
            window.location.href = "success.html";
        }, 3000);
    });
}
