
function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('sanrio_cart')) || [];
    const counterElement = document.getElementById('cart-counter');
    const cartCountElement = document.getElementById('cart-count'); 
    
    if (counterElement) counterElement.innerText = cart.length;
    if (cartCountElement) cartCountElement.innerText = cart.length;
}


function toggleMenu() {
    const menu = document.querySelector('.main-menu');
    if (menu) menu.classList.toggle('menu-active');
}


function toggleDropdown(event) {
    const item = event.currentTarget.closest('.faq-item');
    if (!item) return;
    const dropdown = item.querySelector('.dropdown');
    const icon = item.querySelector('.toggle-icon');

    if (dropdown && icon) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            icon.textContent = '+';
        } else {
            dropdown.style.display = 'block';
            icon.textContent = '–';
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();

    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            let name, price, image;

            
            const card = e.target.closest('.product-card');
            const detailContainer = e.target.closest('.product-detail-container');

            if (card) {
                
                name = card.querySelector('h3').innerText;
                const priceText = card.querySelector('.price').innerText;
                price = parseFloat(priceText.replace(' €', '').replace(',', '.'));
                image = card.querySelector('img').getAttribute('src');
            } else if (detailContainer) {
                
                name = detailContainer.querySelector('.product-info-detailed h2').innerText;
                const priceText = detailContainer.querySelector('.price').innerText;
                price = parseFloat(priceText.replace(' €', '').replace(',', '.'));
                image = detailContainer.querySelector('.product-image-large img').getAttribute('src');
            }

            if (name && !isNaN(price)) {
                let cart = JSON.parse(localStorage.getItem('sanrio_cart')) || [];
                cart.push({ name, price, image });
                localStorage.setItem('sanrio_cart', JSON.stringify(cart));
                updateCartCounter();
                
                setTimeout(() => {
                    alert(`${name} on edukalt ostukorvi lisatud! 🌸`);
                }, 50);
            }
        });
    });

    
    if (document.getElementById('cart-items-list')) {
        loadCart();
    }
});


function loadCart() {
    let cart = JSON.parse(localStorage.getItem('sanrio_cart')) || [];
    const listContainer = document.getElementById('cart-items-list');
    const summarySection = document.getElementById('cart-summary-section');
    
    if (!listContainer) return;

    if (cart.length === 0) {
        listContainer.innerHTML = '<div class="empty-cart"><p>Sinu ostukorv on tühi.</p><a href="../index.html" class="checkout-btn">Tagasi poodi</a></div>';
        if (summarySection) summarySection.style.display = 'none';
        return;
    }

    if (summarySection) summarySection.style.display = 'block';
    listContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        let imgPath = item.image;
        
        if (!imgPath.startsWith('../') && window.location.pathname.includes('/pages/')) {
            imgPath = '../' + imgPath;
        }

        listContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${imgPath}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)} €</p>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Eemalda</button>
            </div>
        `;
    });

    const totalElem = document.getElementById('cart-total');
    if (totalElem) totalElem.innerText = total.toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('sanrio_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('sanrio_cart', JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}



function getCartData() {
    return JSON.parse(localStorage.getItem('sanrio_cart')) || [];
}

function calculatePrices() {
    const shippingSelect = document.getElementById('shipping');
    if (!shippingSelect) return;

    let cart = getCartData();
    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let shippingVal = shippingSelect.value;
    let shippingCost = 3.50; 
    
    if (shippingVal === 'omniva') shippingCost = 2.99;
    if (shippingVal === 'courier') shippingCost = 6.00;
    if (shippingVal === 'pickup') shippingCost = 0.00;

    let isFreeShipping = false;
    if (subtotal >= 50 && shippingVal !== 'pickup') {
        shippingCost = 0.00;
        isFreeShipping = true;
    }

    const subtotalElem = document.getElementById('subtotal-price');
    if (subtotalElem) subtotalElem.innerText = subtotal.toFixed(2);
    
    const shippingPriceElement = document.getElementById('shipping-price');
    if (shippingPriceElement) {
        if (isFreeShipping) {
            shippingPriceElement.innerHTML = '<span style="color: #ff4d94; font-weight: bold;">0.00 € (Tasuta alates 50 €!)</span>';
        } else {
            shippingPriceElement.innerText = shippingCost.toFixed(2) + ' €';
        }
    }

    const finalTotalElem = document.getElementById('final-total-price');
    if (finalTotalElem) finalTotalElem.innerText = (subtotal + shippingCost).toFixed(2);
}

function initCheckout() {
    let cart = getCartData();
    let listContainer = document.getElementById('checkout-items-list');
    if (!listContainer) return;
    
    if (cart.length === 0) {
        alert('Sinu ostukorv on tühi!');
        window.location.href = 'ostukorv.html';
        return;
    }

    listContainer.innerHTML = '';
    cart.forEach(item => {
        listContainer.innerHTML += `<div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9em;">
            <span>${item.name}</span>
            <span><b>${item.price.toFixed(2)} €</b></span>
        </div>`;
    });

    updateTotal(); 
}

function updateTotal() {
    const shippingSelect = document.getElementById('shipping');
    if (!shippingSelect) return;

    let shippingVal = shippingSelect.value;
    let lockerGroup = document.getElementById('locker-group');
    let addressGroup = document.getElementById('address-group');
    let lockerInput = document.getElementById('locker');
    let addressInput = document.getElementById('address');
    let lockerLabel = document.getElementById('locker-label');

    if (lockerInput) lockerInput.innerHTML = '';

    if (shippingVal === 'courier') {
        if (lockerGroup) lockerGroup.style.display = 'none';
        if (addressGroup) addressGroup.style.display = 'block';
        if (addressInput) addressInput.required = true;
        if (lockerInput) lockerInput.required = false;
    } else if (shippingVal === 'pickup') {
        if (lockerGroup) lockerGroup.style.display = 'none';
        if (addressGroup) addressGroup.style.display = 'none';
        if (lockerInput) lockerInput.required = false;
        if (addressInput) addressInput.required = false;
    } else {
        if (lockerGroup) lockerGroup.style.display = 'block';
        if (addressGroup) addressGroup.style.display = 'none';
        if (lockerInput) lockerInput.required = true;
        if (addressInput) addressInput.required = false;

        if (lockerInput && lockerLabel) {
            if (shippingVal === 'smartpost') {
                lockerLabel.innerText = 'Vali SmartPOST pakiautomaat *';
                lockerInput.innerHTML = `
                    <option value="smartpost-rocca">Tallinn - Rocca al Mare Itella SmartPOST</option>
                    <option value="smartpost-tasku">Tartu - Tasku Keskuse SmartPOST</option>
                    <option value="smartpost-astri">Narva - Astri Keskuse SmartPOST</option>
                `;
            } else if (shippingVal === 'omniva') {
                lockerLabel.innerText = 'Vali Omniva pakiautomaat *';
                lockerInput.innerHTML = `
                    <option value="omniva-sikupilli">Tallinn - Sikupilli Prisma Omniva</option>
                    <option value="omniva-lounakeskus">Tartu - Lõunakeskuse Omniva</option>
                    <option value="omniva-fama">Narva - Fama Keskuse Omniva</option>
                `;
            }
        }
    }

    calculatePrices();
}

function submitOrder(event) {
    event.preventDefault();
    localStorage.removeItem('sanrio_cart');
    alert('Aitäh tellimuse eest! Sinu tellimus on edukalt esitatud.');
    window.location.href = '../index.html';
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('checkout-form')) {
        initCheckout();
    }
});