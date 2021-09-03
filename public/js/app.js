let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cart-counter');
let alertSuccess = document.querySelector('.alert-success');
let alertError = document.querySelector('.alert-error');
let url = '/products/update';

//using axios
// function updateCart(stock) {
//     axios.post(url, stock)
//         .then(res => {
//             cartCounter.innerText = res.data.totalQty;
//             alertSuccess.style.display = 'flex';
//             setTimeout(() => { alertSuccess.style.display = 'none' }, 1500);
//         }).catch(e => {
//             alertError.style.display = 'flex';
//             setTimeout(() => { alertError.style.display = 'none' }, 1500);
//         })
// }

//using fetch
function updateCart(stock) {
    let methods = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(stock)
    }
    fetch(url, methods)
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