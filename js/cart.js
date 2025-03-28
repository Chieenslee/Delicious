
let cart = JSON.parse(localStorage.getItem('cart')) || [];


function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}


function addToCart(id, name, price, quantity = 1) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Đã thêm món ăn vào giỏ hàng!');
}


function showNotification(message) {

    Swal.fire({
        title: message,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}


function updateCartTable() {
    const cartTable = document.getElementById('cartItems');
    if (!cartTable) return;

    cartTable.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;

        cartTable.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                    <div class="input-group" style="width: 120px">
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control form-control-sm text-center" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>${total.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeItem(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });


    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = subtotal.toLocaleString('vi-VN') + ' VNĐ';
        document.getElementById('total').textContent = (subtotal + 30000).toLocaleString('vi-VN') + ' VNĐ';
    }
}

function updateQuantity(id, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) {
        removeItem(id);
        return;
    }

    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartTable();
    }
}


function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTable();
}


document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartTable();


    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const card = this.closest('.card');
            const name = card.querySelector('.card-title').textContent;
            const priceText = card.querySelector('.text-primary').textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            
            addToCart(id, name, price, 1);
        });
    });


    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!cart.length) {
                alert('Giỏ hàng của bạn đang trống!');
                return;
            }

            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!isLoggedIn) {
                window.location.href = 'login.html';
                return;
            }
  
            alert('Chức năng thanh toán đang được phát triển!');
        });
    }
}); 