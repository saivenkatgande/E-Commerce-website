// Array of product objects
const products = [
    { id: 1, name: "Bhagavad-gita As It Is", price: 14.99, image: "./assets/1.jpg", description: "The definitive edition of Bhagavad-gita, presenting the sacred text with original Sanskrit, Roman transliterations, English equivalents, and purports." },
    { id: 2, name: "Srimad-Bhagavatam Vol 1", price: 19.99, image: "./assets/2.jpg", description: "The first volume of the timeless classic, introducing the reader to the transcendental pastimes of the Lord." },
    { id: 3, name: "Sri Isopanisad", price: 9.99, image: "./assets/3.jpg", description: "A concise and profound Vedic scripture that sets forth the perfect vision of God and the living entity." },
    { id: 4, name: "Nectar of Instruction", price: 7.50, image: "./assets/4.jpg", description: "Eleven essential instructions for advancing in spiritual life, compiled by Srila Rupa Goswami." },
    { id: 5, name: "Teachings of Lord Caitanya", price: 12.00, image: "./assets/5.jpg", description: "An summary study of the life and precepts of Sri Caitanya Mahaprabhu." },
];

let cart = [];

const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items'); // For desktop sidebar
const mobileCartItemsContainer = document.getElementById('mobile-cart-items'); // For mobile overlay
const cartTotalSpan = document.getElementById('cart-total'); // For desktop total
const mobileCartTotalSpan = document.getElementById('mobile-cart-total'); // For mobile total
const notificationDiv = document.getElementById('notification');
const notificationMessageSpan = document.getElementById('notification-message');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartItemCount = document.getElementById('cart-item-count');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const mobileCartOverlay = document.getElementById('mobile-cart-overlay');
const closeMobileCartBtn = document.getElementById('close-mobile-cart-btn');
const desktopCartSidebar = document.getElementById('cart-sidebar'); // Reference to desktop sidebar

/**
 * Renders all products from the `products` array into the `productsContainer`.
 * Creates HTML elements dynamically for each product.
 */
function renderProducts() {
    productsContainer.innerHTML = ''; // Clear existing products to prevent duplicates on re-render

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'; // Apply common product card styling

        // Construct the inner HTML for the product card
        productCard.innerHTML = `
            <div class="product-image-wrapper">
                <img class="product-image" src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x200/cccccc/333333?text=Image+Error';">
            </div>
            <div class="product-info">
                <div>
                    <div class="product-category">${product.name}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    // Attach event listeners to all "Add to Cart" buttons after they are rendered
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.productId); // Get product ID from data attribute
            const productToAdd = products.find(p => p.id === productId); // Find the product object
            if (productToAdd) {
                addToCart(productToAdd); // Add product to cart if found
            }
        });
    });
}

/** 
 * Adds a product to the cart or increments its quantity if already present.
 * @param {Object} product - The product object to add.
 */
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++; // Increment quantity if item already exists
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item to cart with quantity 1
    }
    updateCartDisplay(); // Update the cart UI
    showNotification(`${product.name} added to cart!`); // Show confirmation notification
}

/**
 * Removes an item from the cart based on its product ID.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); // Filter out the item to be removed
    updateCartDisplay(); // Update the cart UI
    showNotification('Item removed from cart.', 'notification-red'); // Show removal notification (using a specific class)
}

/**
 * Updates the display of the shopping cart on both desktop and mobile views.
 * Recalculates total cost and item count.
 */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = ''; // Clear desktop cart items
    mobileCartItemsContainer.innerHTML = ''; // Clear mobile cart items

    // Show/hide empty cart message
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden'); // 'hidden' class should be defined in CSS for display: none;
    } else {
        emptyCartMessage.classList.add('hidden');
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity; // Calculate total cost

        // Create the HTML for a single cart item
        const cartItemHtml = `
            <div class="cart-item">
                <div class="cart-item-details">
                    <img class="cart-item-image" src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='https://placehold.co/48x48/cccccc/333333?text=Img';">
                    <div>
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price-quantity">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <button class="remove-from-cart-btn" data-product-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;

        // Append to desktop cart
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
        // Append to mobile cart
        mobileCartItemsContainer.insertAdjacentHTML('beforeend', cartItemHtml);
    });

    // Update total amounts and item count
    cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    mobileCartTotalSpan.textContent = `$${total.toFixed(2)}`;
    cartItemCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Re-attach event listeners for remove buttons because content was re-rendered
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.currentTarget.dataset.productId);
            removeFromCart(productId);
        });
    });
}

// Variable to store the timeout ID for the notification
let notificationTimeout;

/**
 * Shows a temporary notification message.
 * @param {string} message - The message to display.
 * @param {string} [bgColorClass='notification-green'] - CSS class for background color (e.g., 'notification-red').
 */
function showNotification(message, bgColorClass = 'notification-green') {
    clearTimeout(notificationTimeout); // Clear any previous notification timeout

    // Remove existing color classes and add the new one
    notificationDiv.classList.remove('notification-green', 'notification-red');
    notificationDiv.classList.add(bgColorClass);

    notificationMessageSpan.textContent = message; // Set the message text
    notificationDiv.classList.add('show'); // Add 'show' class to make it visible and animate

    // Set a timeout to hide the notification after 3 seconds
    notificationTimeout = setTimeout(() => {
        notificationDiv.classList.remove('show');
    }, 3000);
}

// Event listener for the cart toggle button (primarily for mobile view)
cartToggleBtn.addEventListener('click', () => {
    mobileCartOverlay.classList.toggle('visible'); // Toggle 'visible' class
});

// Event listener for closing the mobile cart overlay
closeMobileCartBtn.addEventListener('click', () => {
    mobileCartOverlay.classList.remove('visible'); // Hide mobile overlay
});

/**
 * Adjusts the visibility of the desktop sidebar and mobile overlay based on screen width.
 */
function handleResize() {
    if (window.innerWidth >= 1024) { // Equivalent to Tailwind's 'lg' breakpoint
        desktopCartSidebar.classList.remove('hidden'); // Show desktop sidebar
        mobileCartOverlay.classList.remove('visible'); // Ensure mobile overlay is hidden
    } else {
        desktopCartSidebar.classList.add('hidden'); // Hide desktop sidebar
    }
}

// Initial render of products and cart display when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
    handleResize(); // Perform initial check for screen size
});

// Listen for window resize events to adjust cart display
window.addEventListener('resize', handleResize);
hy