// Khởi tạo các biến và hàm chung
const DEFAULT_ADMIN = {
    email: 'admin@gmail.com',
    password: '0000'
};

// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Các hàm xác thực người dùng
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

function login(email, password) {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    window.location.href = 'login.html';
}

function checkAuth() {
    if (!isLoggedIn() && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'admin-customers.html';
    }
}

// Các hàm tiện ích
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? "#198754" : "#dc3545",
    }).showToast();
}

// Các hàm xử lý loading
function showLoading() {
    // Không làm gì cả - vô hiệu hóa loading
}

function hideLoading() {
    // Không làm gì cả - vô hiệu hóa loading
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Các hàm xử lý giỏ hàng
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

// Khởi tạo các chức năng khi trang web load
$(document).ready(function() {
    // Khởi tạo AOS với thời gian ngắn hơn
    AOS.init({
        duration: 400,
        once: true
    });

    // Xóa màn hình loading ngay lập tức
    document.querySelector('.loading').style.display = 'none';

    // Thêm hiệu ứng cho menu items
    $('.menu-item').addClass('animate__animated animate__fadeInUp');
    $('.team-member').addClass('animate__animated animate__fadeInUp');

    // Xử lý form đặt bàn
    $('#reservationForm').submit(function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var phone = $('#phone').val();
        var date = $('#date').val();
        var time = $('#time').val();
        var guests = $('#guests').val();
        var email = $('#email').val();

        Swal.fire({
            title: 'Đặt bàn thành công!',
            html: `Cảm ơn <b>${name}</b> đã đặt bàn!<br>Chúng tôi sẽ liên hệ với bạn qua số điện thoại <b>${phone}</b> để xác nhận.`,
            icon: 'success',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#e74c3c'
        });

        this.reset();
    });

    // Xử lý form liên hệ
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();

        Swal.fire({
            title: 'Gửi tin nhắn thành công!',
            html: `Cảm ơn <b>${name}</b> đã gửi tin nhắn!<br>Chúng tôi sẽ phản hồi qua email <b>${email}</b> trong thời gian sớm nhất.`,
            icon: 'success',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#e74c3c'
        });

        this.reset();
    });

    // Xử lý đếm số
    function startCounter() {
        $('.counter').each(function() {
            var $this = $(this);
            var countTo = $this.attr('data-count');
            
            $({ countNum: 0 }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'linear',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    }

    // Bắt đầu đếm khi phần tử hiển thị trong viewport
    var counterStarted = false;
    $(window).scroll(function() {
        var hT = $('.counter-section').offset().top,
            hH = $('.counter-section').outerHeight(),
            wH = $(window).height(),
            wS = $(this).scrollTop();
        if (wS > (hT+hH-wH) && !counterStarted){
            startCounter();
            counterStarted = true;
        }
    });

    // Tự động chuyển slide cho carousel
    $('.carousel').carousel({
        interval: 5000
    });

    // Hiệu ứng smooth scroll
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').not('[data-bs-toggle="tab"]').not('[data-bs-toggle="carousel"]').click(function(event) {
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && 
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
            }
        }
    });

    // Hiệu ứng hover cho menu items
    $('.menu-item').hover(
        function() {
            $(this).find('.card-img-top').css('transform', 'scale(1.05)');
            $(this).css('box-shadow', '0 10px 20px rgba(0,0,0,0.2)');
        },
        function() {
            $(this).find('.card-img-top').css('transform', 'scale(1)');
            $(this).css('box-shadow', '0 0 0 rgba(0,0,0,0.1)');
        }
    );

    // Nút back-to-top
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // Thêm nút back-to-top vào body
    $('body').append('<a id="back-to-top" class="btn btn-primary btn-lg back-to-top" role="button"><i class="fas fa-arrow-up"></i></a>');

    // Xử lý sự kiện click cho nút back-to-top
    $('#back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Thêm CSS cho nút back-to-top
    $('<style>.back-to-top { position: fixed; bottom: 25px; right: 25px; display: none; z-index: 99; }</style>').appendTo('head');

    // Hiệu ứng parallax cho header
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        $('.hero-section, .page-header').css('background-position', 'center ' + (scrollTop * 0.5) + 'px');
    });

    // Xử lý nút đặt món
    $('.order-btn').click(function() {
        var dishName = $(this).closest('.card-body').find('.card-title').text();
        var dishPrice = $(this).closest('.card-body').find('.text-primary').text();
        
        Swal.fire({
            title: 'Đặt món thành công!',
            html: `Bạn đã đặt món: <b>${dishName}</b> - <b>${dishPrice}</b><br>Món ăn sẽ được chuẩn bị và phục vụ trong thời gian sớm nhất!`,
            icon: 'success',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#e74c3c'
        });
    });

    // Xử lý gallery ảnh
    if ($('.gallery-item').length) {
        $('.gallery-item').click(function() {
            var imgSrc = $(this).find('img').attr('src');
            var imgAlt = $(this).find('img').attr('alt');
            
            Swal.fire({
                imageUrl: imgSrc,
                imageAlt: imgAlt,
                showCloseButton: true,
                showConfirmButton: false
            });
        });
    }

    // Xử lý đăng ký sự kiện
    $('#eventRegistrationForm').submit(function(e) {
        e.preventDefault();
        
        var name = $('#name').val();
        var email = $('#email').val();
        var eventName = $('#eventName').val();
        
        Swal.fire({
            title: 'Đăng ký thành công!',
            html: `Cảm ơn <b>${name}</b> đã đăng ký tham gia sự kiện <b>${eventName}</b>!<br>Chúng tôi sẽ gửi thông tin chi tiết qua email <b>${email}</b>.`,
            icon: 'success',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#e74c3c'
        });
        
        this.reset();
    });

    // Thêm hiệu ứng cho các phần tử khi scroll
    function animateOnScroll() {
        $('.animate-on-scroll').each(function() {
            var position = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            
            if (scroll + windowHeight > position) {
                var delay = $(this).data('delay') ? $(this).data('delay') : 0;
                setTimeout(function() {
                    $(this).addClass('animated');
                }.bind(this), delay);
            }
        });
    }

    $(window).scroll(animateOnScroll);
    animateOnScroll();

    // Lọc menu theo danh mục
    document.querySelectorAll('.btn-group .btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.btn-group .btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            const category = this.dataset.filter;
            const menuItems = document.querySelectorAll('.menu-item');

            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lọc gallery theo danh mục
    document.querySelectorAll('.btn-group .btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.btn-group .btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            const category = this.dataset.filter;
            const galleryItems = document.querySelectorAll('.gallery-item');

            galleryItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Cấu hình lightbox
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': 'Ảnh %1 / %2'
        });
    }

    // Khởi tạo giỏ hàng
    updateCartCount();
    updateCartTable();

    // Xử lý nút thêm vào giỏ hàng
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

    // Xử lý nút thanh toán
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

    // Xử lý form đăng nhập
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        var email = $('#email').val();
        var password = $('#password').val();
        
        if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminEmail', email);
            
            Swal.fire({
                title: 'Đăng nhập thành công!',
                text: 'Chào mừng bạn quay trở lại!',
                icon: 'success',
                confirmButtonText: 'Đóng',
                confirmButtonColor: '#e74c3c'
            }).then((result) => {
                window.location.href = 'admin-customers.html';
            });
        } else {
            Swal.fire({
                title: 'Đăng nhập thất bại!',
                text: 'Email hoặc mật khẩu không chính xác.',
                icon: 'error',
                confirmButtonText: 'Thử lại',
                confirmButtonColor: '#e74c3c'
            });
        }
    });

    // Kiểm tra trạng thái đăng nhập
    if (isLoggedIn() && window.location.pathname.includes('login.html')) {
        window.location.href = 'admin-customers.html';
    }
});