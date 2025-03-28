// Common JavaScript Functions

// User Authentication
const commonFunctions = {
  // Kiểm tra xác thực
  checkAuth: function() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },
  
  // Kiểm tra đã đăng nhập chưa
  isLoggedIn: function() {
    const adminToken = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    return !!adminToken || adminEmail === 'admin@gmail.com';
  },
  
  // Admin authentication check
  isAdminLoggedIn: function() {
    return localStorage.getItem('adminEmail') !== null;
  },
  
  // Login function for admin
  adminLogin: function(email, password) {
    // In a real application, we'd check credentials against a server
    // For demo purposes, we'll use a simple check
    if (email === 'admin@delicious.com' && password === 'admin123') {
      localStorage.setItem('adminEmail', email);
      return true;
    }
    return false;
  },
  
  // Đăng xuất
  logout: function() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = 'login.html';
  },
  
  // Login function for regular users
  userLogin: function(email, password) {
    // In a real application, we'd check credentials against a server
    // For demo purposes, we'll use a simple check
    if (email && password.length >= 6) {
      const user = {
        email: email,
        name: email.split('@')[0]
      };
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }
    return false;
  },
  
  // User logout
  userLogout: function() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    // Redirect to home page
    window.location.href = 'index.html';
  },
  
  // Get current user
  getCurrentUser: function() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Cart management
  getCart: function() {
    const cartStr = localStorage.getItem('cart');
    return cartStr ? JSON.parse(cartStr) : [];
  },
  
  addToCart: function(product) {
    const cart = this.getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += product.quantity || 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
    return cart;
  },
  
  removeFromCart: function(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
    return cart;
  },
  
  updateCartItemQuantity: function(productId, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        return this.removeFromCart(productId);
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateCartCount();
    return cart;
  },
  
  clearCart: function() {
    localStorage.removeItem('cart');
    this.updateCartCount();
    return [];
  },
  
  getCartTotal: function() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  },
  
  updateCartCount: function() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
      const cart = this.getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      cartCountElement.textContent = count;
    }
  },
  
  // Format price to VND
  formatPrice: function(price) {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  },
  
  // Generate random ID
  generateId: function(prefix = '') {
    return prefix + Math.random().toString(36).substr(2, 9);
  },
  
  // Lấy thông tin email admin
  getAdminEmail: function() {
    return localStorage.getItem('adminEmail') || 'admin@gmail.com';
  }
};

// Export functions to window object
window.commonFunctions = commonFunctions;

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  commonFunctions.updateCartCount();
});