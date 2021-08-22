let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cart-counter');
let alertSuccess = document.querySelector('.alert-success');
let alertError = document.querySelector('.alert-error');


function updateCart(stock) {
    axios.post('/products/update', stock)
        .then(res => {
            cartCounter.innerText = res.data.totalQty;
            alertSuccess.style.display = 'flex';
            setTimeout(() => { alertSuccess.style.display = 'none' }, 1500);
        }).catch(e => {
            alertError.style.display = 'flex';
            setTimeout(() => { alertError.style.display = 'none' }, 1500);
        })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let stock = JSON.parse(btn.dataset.stock);
        updateCart(stock);
    })
})