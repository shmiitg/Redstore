//customer add to cart
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.querySelector('#cart-counter');
const alertSuccess = document.querySelector('.alert-success');
const alertError = document.querySelector('.alert-error');
const cartUrl = '/products/update';

//using fetch
function updateCart(stock) {
    const methods = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(stock)
    }
    fetch(cartUrl, methods)
        .then(res => res.json())
        .then(data => {
            cartCounter.innerText = data.totalQty;
            alertSuccess.style.display = 'flex';
            setTimeout(() => { alertSuccess.style.display = 'none' }, 1000);
        })
        .catch(err => {
            alertError.style.display = 'flex';
            setTimeout(() => { alertError.style.display = 'none' }, 1000);
        });
}

addToCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let stock = JSON.parse(btn.dataset.stock);
        updateCart(stock);
    })
})

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

const navLink = document.querySelectorAll(".nav-link");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

// cart items update
const cartContainer = document.querySelector('.cart-container');
const items = document.querySelectorAll('.item');
const increement = document.querySelectorAll('.increement');
const decreement = document.querySelectorAll('.decreement');
const remove = document.querySelectorAll('.remove-btn');
const itemQty = document.querySelectorAll('.item-qty');
const itemPrice = document.querySelectorAll('.item-price');
const totalAmount = document.querySelector('#total-amount');

function increase(stock, index) {
    const methods = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(stock)
    }
    fetch("/cart/increase", methods)
        .then(res => res.json())
        .then(data => {
            cartCounter.innerText = data.totalQty;
            itemQty[index].innerText = data.qty;
            itemPrice[index].innerText = data.price + '.00';
            totalAmount.innerText = '$ ' + data.totalAmount + '.00';
        })
        .catch(err => {
            console.log(err);
        });
}

function decrease(stock, index) {
    const methods = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(stock)
    }
    fetch("/cart/decrease", methods)
        .then(res => res.json())
        .then(data => {
            cartCounter.innerText = data.totalQty;
            itemQty[index].innerText = data.qty;
            itemPrice[index].innerText = data.price + '.00';
            totalAmount.innerText = '$ ' + data.totalAmount + '.00';
            if (data.qty === 0) {
                console.log(index);
                items[index].remove();
            }
            if (data.totalQty === 0) {
                cartCounter.innerText = '';
                cartContainer.innerHTML = `<div class="empty-cart">
                                            <img src="/images/emptycart.png" alt="">
                                            <p>Your cart is empty</p>
                                            <a class="btn" href="/products">Start Shopping &#8594</a>
                                        </div>`
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function del(stock, index) {
    const methods = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(stock)
    }
    fetch("/cart/delete", methods)
        .then(res => res.json())
        .then(data => {
            cartCounter.innerText = data.totalQty;
            totalAmount.innerText = '$ ' + data.totalAmount + '.00';
            items[index].remove();
            if (data.totalQty === 0) {
                cartCounter.innerText = '';
                cartContainer.innerHTML = `<div class="empty-cart">
                                            <img src="/images/emptycart.png" alt="">
                                            <p>Your cart is empty</p>
                                            <a class="btn" href="/products">Start Shopping &#8594</a>
                                        </div>`
            }
        })
        .catch(err => {
            console.log(err);
        });
}

increement.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let stock = JSON.parse(btn.dataset.stock);
        increase(stock, index);
    })
})

decreement.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let stock = JSON.parse(btn.dataset.stock);
        decrease(stock, index);
    })
})

remove.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let stock = JSON.parse(btn.dataset.stock);
        del(stock, index);
    })
})
