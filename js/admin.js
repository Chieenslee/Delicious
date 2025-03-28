document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo DataTables
  $('#customersTable').DataTable({
    responsive: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
    },
    columnDefs: [
      { className: "text-center", targets: [0, 5, 6, 7] },
      { width: "120px", targets: 7 }
    ]
  });

  $('#ordersTable').DataTable({
    responsive: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
    },
    columnDefs: [
      { className: "text-center", targets: [0, 4, 5, 6] }
    ]
  });

  $('#menuTable').DataTable({
    responsive: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
    }
  });

  $('#reservationsTable').DataTable({
    responsive: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
    }
  });

  // Khởi tạo biểu đồ doanh thu
  initRevenueChart();
  
  // Khởi tạo biểu đồ món ăn phổ biến
  initPopularDishesChart();

  // Nút cuộn lên đầu trang
  initScrollToTopButton();

  // Xử lý form thêm khách hàng
  initAddCustomerForm();

  // Xử lý form thêm món ăn
  initAddDishForm();

  // Xử lý form thêm danh mục
  initAddCategoryForm();

  // Xử lý các nút xem chi tiết
  initViewDetailsButtons();

  // Xử lý các nút chỉnh sửa
  initEditButtons();

  // Xử lý các nút xóa
  initDeleteButtons();

  // Xử lý nút xác nhận đặt bàn
  initConfirmReservationButtons();

  // Xử lý nút active trên các tab
  initTabNavigation();
  
  // Xử lý scroll để highlight menu item tương ứng
  initScrollSpy();
  
  // Thêm nút cập nhật hình ảnh cho món ăn
  initUpdateImageButtons();
});

// Khởi tạo biểu đồ doanh thu
function initRevenueChart() {
  const revenueCtx = document.getElementById('revenueChart');
  if (!revenueCtx) return;
  
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      datasets: [{
        label: 'Doanh thu (triệu đồng)',
        data: [25, 30, 27, 32, 35, 42, 38, 40, 45, 48, 52, 55],
        borderColor: '#4e73df',
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        pointBackgroundColor: '#4e73df',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [2],
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false
          }
        }
      }
    }
  });
}

// Khởi tạo biểu đồ món ăn phổ biến
function initPopularDishesChart() {
  const dishesCtx = document.getElementById('popularDishesChart');
  if (!dishesCtx) return;
  
  new Chart(dishesCtx, {
    type: 'doughnut',
    data: {
      labels: ['Bò Lúc Lắc', 'Gỏi Cuốn', 'Chả Giò', 'Bún Bò', 'Cơm Tấm'],
      datasets: [{
        data: [25, 20, 15, 18, 22],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b']
      }]
    },
    options: {
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Nút cuộn lên đầu trang
function initScrollToTopButton() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  });

  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Xử lý form thêm khách hàng
function initAddCustomerForm() {
  const form = document.getElementById('addCustomerForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hiển thị thông báo thành công
    Toastify({
      text: "Khách hàng đã được thêm thành công!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#198754",
    }).showToast();
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
    modal.hide();
    
    // Reset form
    this.reset();
    
    // Tải lại bảng khách hàng (giả lập)
    setTimeout(() => {
      $('#customersTable').DataTable().ajax.reload();
    }, 500);
  });
}

// Xử lý form thêm món ăn
function initAddDishForm() {
  const form = document.getElementById('addDishForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hiển thị thông báo thành công
    Toastify({
      text: "Món ăn đã được thêm thành công!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#198754",
    }).showToast();
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addDishModal'));
    modal.hide();
    
    // Reset form
    this.reset();
    
    // Tải lại bảng món ăn (giả lập)
    setTimeout(() => {
      $('#menuTable').DataTable().ajax.reload();
    }, 500);
  });
}

// Xử lý form thêm danh mục
function initAddCategoryForm() {
  const form = document.getElementById('addCategoryForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hiển thị thông báo thành công
    Toastify({
      text: "Danh mục đã được thêm thành công!",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#198754",
    }).showToast();
    
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
    modal.hide();
    
    // Reset form
    this.reset();
  });
}

// Xử lý các nút xem chi tiết
function initViewDetailsButtons() {
  document.querySelectorAll('.btn-outline-primary[title="Xem chi tiết"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.closest('tr').querySelector('td:first-child').textContent;
      
      Swal.fire({
        title: `Chi tiết ${id}`,
        html: `<div class="text-start">
                <p><strong>ID:</strong> ${id}</p>
                <p><strong>Thông tin chi tiết sẽ được hiển thị ở đây...</strong></p>
              </div>`,
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#0d6efd',
        customClass: {
          container: 'swal-wide',
          popup: 'swal-popup-wide'
        }
      });
    });
  });
}

// Xử lý các nút chỉnh sửa
function initEditButtons() {
  document.querySelectorAll('.btn-outline-warning[title="Chỉnh sửa"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.closest('tr').querySelector('td:first-child').textContent;
      
      Swal.fire({
        title: `Chỉnh sửa ${id}`,
        html: `<div class="text-start">
                <p>Form chỉnh sửa sẽ được hiển thị ở đây...</p>
              </div>`,
        confirmButtonText: 'Lưu thay đổi',
        confirmButtonColor: '#198754',
        showCancelButton: true,
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          Toastify({
            text: `Đã cập nhật thông tin ${id} thành công!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#198754",
          }).showToast();
        }
      });
    });
  });
}

// Xử lý các nút xóa
function initDeleteButtons() {
  document.querySelectorAll('.btn-outline-danger[title="Xóa"], .btn-outline-danger[title="Hủy đơn"], .btn-outline-danger[title="Hủy đặt bàn"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const id = row.querySelector('td:first-child').textContent;
      
      Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa ${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          // Giả lập xóa dòng
          $(row).fadeOut(400, function() {
            const table = $(this).closest('table').DataTable();
            table.row($(this)).remove().draw();
            
            Toastify({
              text: `Đã xóa ${id} thành công!`,
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "#dc3545",
            }).showToast();
          });
        }
      });
    });
  });
}

// Xử lý nút xác nhận đặt bàn
function initConfirmReservationButtons() {
  document.querySelectorAll('.btn-outline-success[title="Xác nhận"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const row = this.closest('tr');
      const id = row.querySelector('td:first-child').textContent;
      
      Swal.fire({
        title: 'Xác nhận đặt bàn',
        text: `Bạn có chắc chắn muốn xác nhận ${id}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy'
      }).then((result) => {
        if (result.isConfirmed) {
          // Cập nhật trạng thái
          const statusCell = row.querySelector('td:nth-last-child(2)');
          statusCell.innerHTML = '<span class="badge bg-success">Đã Xác Nhận</span>';
          
          // Thay nút xác nhận bằng nút chỉnh sửa
          this.outerHTML = `<button class="btn btn-sm btn-outline-warning me-1" title="Chỉnh sửa">
                          <i class="bi bi-pencil"></i>
                        </button>`;
          
          Toastify({
            text: `Đã xác nhận ${id} thành công!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#198754",
          }).showToast();
        }
      });
    });
  });
}

// Xử lý nút active trên các tab
function initTabNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      // Tạo hiệu ứng active cho header menu khi scroll đến section
      if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
        const sectionId = this.getAttribute('href').substring(1);
        document.querySelectorAll('.nav-item .nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
}

// Xử lý scroll để highlight menu item tương ứng
function initScrollSpy() {
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 100; // Offset để làm cho menu active sớm hơn
    
    // Tìm section hiện tại
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop - 80; // Trừ header height
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const id = section.previousElementSibling?.id;
        if (id) {
          document.querySelectorAll('.nav-item .nav-link').forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('href') === `#${id}`) {
              navLink.classList.add('active');
            }
          });
        }
      }
    });
  });
}

// Xử lý nút cập nhật hình ảnh cho món ăn
function initUpdateImageButtons() {
  // Thêm nút cập nhật hình ảnh vào mỗi hàng của bảng món ăn
  document.querySelectorAll('#menuTable tbody tr').forEach(row => {
    const actionsCell = row.querySelector('td:last-child .d-flex');
    if (!actionsCell) return;
    
    const updateImageBtn = document.createElement('button');
    updateImageBtn.className = 'btn btn-sm btn-outline-info me-1';
    updateImageBtn.title = 'Cập nhật hình ảnh';
    updateImageBtn.innerHTML = '<i class="bi bi-image"></i>';
    
    // Chèn nút vào trước nút xóa
    const deleteBtn = actionsCell.querySelector('.btn-outline-danger');
    if (deleteBtn) {
      actionsCell.insertBefore(updateImageBtn, deleteBtn);
    } else {
      actionsCell.appendChild(updateImageBtn);
    }
    
    // Xử lý sự kiện click cho nút cập nhật hình ảnh
    updateImageBtn.addEventListener('click', function() {
      handleUpdateImage(row);
    });
  });
}

function handleUpdateImage(row) {
  const id = row.querySelector('td:first-child').textContent;
  const name = row.querySelector('td:nth-child(3)').textContent;
  const currentImage = row.querySelector('td:nth-child(2) img').src;
  
  Swal.fire({
    title: `Cập nhật hình ảnh món ăn`,
    html: `
      <div class="text-center mb-3">
        <img src="${currentImage}" alt="${name}" class="img-fluid rounded mb-3" style="max-height: 150px;">
        <h6 class="mb-3">${name} (${id})</h6>
      </div>
      <div class="mb-3">
        <label class="form-label text-start d-block">Chọn hình ảnh mới</label>
        <input type="file" class="form-control" id="newDishImage" accept="image/*">
      </div>
      <div id="imagePreviewContainer" class="d-none mt-3">
        <p class="text-muted small">Xem trước:</p>
        <div class="text-center">
          <img id="imagePreview" src="" alt="Xem trước hình ảnh" class="img-fluid rounded" style="max-height: 150px;">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Cập nhật',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#0dcaf0',
    didOpen: () => {
      const fileInput = document.getElementById('newDishImage');
      const previewContainer = document.getElementById('imagePreviewContainer');
      const imagePreview = document.getElementById('imagePreview');
      
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.classList.remove('d-none');
          };
          reader.readAsDataURL(this.files[0]);
        } else {
          previewContainer.classList.add('d-none');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const fileInput = document.getElementById('newDishImage');
      if (fileInput.files && fileInput.files[0]) {
        // Giả lập cập nhật hình ảnh thành công
        const reader = new FileReader();
        reader.onload = function(e) {
          // Cập nhật hình ảnh trong bảng
          row.querySelector('td:nth-child(2) img').src = e.target.result;
          
          Toastify({
            text: `Đã cập nhật hình ảnh cho ${name} thành công!`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#0dcaf0",
          }).showToast();
        };
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        Toastify({
          text: "Vui lòng chọn hình ảnh để cập nhật!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#dc3545",
        }).showToast();
      }
    }
  });
} 