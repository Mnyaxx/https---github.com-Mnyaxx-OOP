// Define Product class
class Product {
    constructor(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

// Define ShoppingCartItem class
class ShoppingCartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    // Calculate total price for this item
    getTotalPrice() {
        return this.product.price * this.quantity;
    }
}

// Define ShoppingCart class
class ShoppingCart {
    constructor() {
        this.items = [];
    }

    // Add item to the cart
    addItem(item) {
        const existingItem = this.items.find(cartItem => cartItem.product.id === item.product.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
    }

    // Remove item from the cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    // Remove all items from the cart
    removeAllItems() {
        this.items = [];
    }

    // Get the total price of all items in the cart
    getTotal() {
        return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Load cart from localStorage
    loadFromStorage() {
        const savedItems = JSON.parse(localStorage.getItem('cart') || '[]');
        this.items = savedItems.map(item => new ShoppingCartItem(
            new Product(item.product.id, item.product.name, item.product.price),
            item.quantity
        ));
    }

    // Sort items by price
    sortItemsByPrice() {
        this.items.sort((a, b) => a.product.price - b.product.price);
    }

    // Filter items by name
    filterItemsByName(name) {
        return this.items.filter(item => item.product.name.includes(name));
    }
}

// Initialize and manage cart
document.addEventListener('DOMContentLoaded', () => {
    const cart = new ShoppingCart();
    cart.loadFromStorage();
    updateCartUI(cart);

    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);

        const product = new Product(id, name, price);
        const cartItem = new ShoppingCartItem(product, 1);
        cart.addItem(cartItem);
        cart.saveToStorage();
        updateCartUI(cart);
        addProductForm.reset();
    });

    document.getElementById('empty-cart').addEventListener('click', () => {
        cart.removeAllItems();
        cart.saveToStorage();
        updateCartUI(cart);
    });

    function updateCartUI(cart) {
        const cartItemsUl = document.getElementById('cart-items');
        cartItemsUl.innerHTML = '';
        cart.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.product.name} - $${item.product.price} x ${item.quantity}`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => {
                cart.removeItem(item.product.id);
                cart.saveToStorage();
                updateCartUI(cart);
            });
            li.appendChild(removeBtn);
            cartItemsUl.appendChild(li);
        });
        document.getElementById('cart-total').textContent = cart.getTotal().toFixed(2);
    }
});
