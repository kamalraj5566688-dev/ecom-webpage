document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');

    // Define a map of product names to their respective page URLs
    // All product names are converted to lowercase for case-insensitive matching.
    const productPageMap = {
        // T-shirts (from t-shirt.html and index.html featured section)
        "akatsuki cloud tee": "t-shirt.html",
        "itachi uchiha tee": "t-shirt.html",
        "naruto shippuden tee": "t-shirt.html",
        "konoha symbol tee": "t-shirt.html",
        "puma f1 edtion": "t-shirt.html",
        "vans hylane": "t-shirt.html",
        "onitsuka mexcio 66": "t-shirt.html",

        // Shoes (from index.html featured section)
        "onitsuka 66": "shoes.html",
        "converse chuck taylor": "shoes.html",
        "addidas wine edition": "shoes.html",
        "onitsuka 66 shoe": "shoes.html",
        "converse chuck taylor shoe": "shoes.html",
        "addidas wine edition shoe": "shoes.html",
        "akatsuki runner": "shoes.html",

        // Shirts
        "akatsuki button-up": "shirts.html",
        "uchiha clan kimono shirt": "shirts.html",
        "hidden leaf flannel": "shirts.html",
        "jiraiya sage mode shirt": "shirts.html",

        // Jeans
        "akatsuki slim fit jeans": "jeans.html",
        "konoha distressed denim": "jeans.html",
        "sharingan black jeans": "jeans.html",
        "naruto uzumaki cargo pants": "jeans.html",

        // Accessories
        "akatsuki headband": "accessories.html",
        "sharingan necklace": "accessories.html",
        "konoha leaf village wallet": "accessories.html",
        "itachi crow keychain": "accessories.html"
    };

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (productPageMap[query]) {
                window.open(productPageMap[query], '_blank'); // Open in a new tab
            } else {
                alert('Coming soon');
            }
        });
    }

    // Add to Cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button action if any

            // Find the closest parent product card to get its data attributes
            const productCard = this.closest('.product-card-detailed') || this.closest('.product-card');

            if (!productCard) {
                console.error("Could not find parent product card for 'Add to Cart' button.");
                return;
            }

            const productId = productCard.dataset.productId;
            const productName = productCard.dataset.productName;
            const productPrice = parseFloat(productCard.dataset.productPrice); // Parse price to a number
            const productImage = productCard.dataset.productImage;

            if (!productId || !productName || isNaN(productPrice) || !productImage) {
                console.error("Missing product data attributes for 'Add to Cart'.", productCard.dataset);
                alert("Error: Product information incomplete.");
                return;
            }

            // Retrieve cart from localStorage
            let cart = JSON.parse(localStorage.getItem('duskwearCart')) || [];

            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.id === productId);

            if (existingProductIndex > -1) {
                // Product exists, increment quantity
                cart[existingProductIndex].quantity += 1;
            } else {
                // Product is new, add to cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            localStorage.setItem('duskwearCart', JSON.stringify(cart));
            alert(`${productName} added to cart!`);
            console.log("Current Cart:", cart);
        });
    });

    // --- CART PAGE LOGIC (Remove, -, + buttons) ---
    function renderCart() {
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalElement = document.getElementById('cart-total');
        if (!cartContainer) return; // Only execute if on the cart page

        let cart = JSON.parse(localStorage.getItem('duskwearCart')) || [];
        cartContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; font-size: 1.2rem; color: #fff;">Your cart is empty.</p>';
            if (cartTotalElement) cartTotalElement.textContent = '$0.00';
            return;
        }

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItemHTML = `
                <div class="cart-item" data-product-id="${item.id}" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                    <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
                    <div style="flex-grow: 1; padding: 0 1.5rem;">
                        <h4 style="margin: 0; color: #fff;">${item.name}</h4>
                        <p style="margin: 0.5rem 0 0; color: #ff6b6b; font-weight: bold;">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="quantity-controls" style="display: flex; align-items: center; gap: 0.5rem;">
                        <button class="btn decrease-btn" style="padding: 0.2rem 0.7rem; font-size: 1.2rem; background: #5a0606;">-</button>
                        <span style="color: #fff; font-size: 1.2rem; min-width: 30px; text-align: center;">${item.quantity}</span>
                        <button class="btn increase-btn" style="padding: 0.2rem 0.7rem; font-size: 1.2rem; background: #5a0606;">+</button>
                    </div>
                    <div style="margin-left: 2rem;">
                        <button class="btn remove-btn" style="background: transparent; border: 1px solid #ff6b6b; color: #ff6b6b;">Remove</button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return;

        cartContainer.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartQuantity(this.closest('.cart-item').dataset.productId, -1);
            });
        });

        cartContainer.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                updateCartQuantity(this.closest('.cart-item').dataset.productId, 1);
            });
        });

        cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removeCartItem(this.closest('.cart-item').dataset.productId);
            });
        });
    }

    function updateCartQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('duskwearCart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove from cart if quantity hits 0
            }
            localStorage.setItem('duskwearCart', JSON.stringify(cart));
            renderCart(); // Re-render the cart UI
        }
    }

    function removeCartItem(productId) {
        let cart = JSON.parse(localStorage.getItem('duskwearCart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('duskwearCart', JSON.stringify(cart));
        renderCart(); // Re-render the cart UI
    }

    // Call renderCart initially (it will automatically skip if not on cart.html)
    renderCart();

    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('duskwearCart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty! Please add some items before checking out.');
            } else {
                alert('Opening payment gateway... Proceeding to checkout!');
            }
        });
    }
});