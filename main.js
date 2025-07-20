// Sample product data
const products = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    category: "electronics",
    price: 199.99,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear audio quality with deep bass and crisp highs."
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    category: "electronics",
    price: 299.99,
    image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and sleep analysis. Water-resistant design perfect for all your activities."
  },
  {
    id: 3,
    title: "Designer Running Shoes",
    category: "sports",
    price: 149.99,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Lightweight running shoes with advanced cushioning technology. Perfect for long-distance running and daily workouts."
  },
  {
    id: 4,
    title: "Vintage Leather Jacket",
    category: "fashion",
    price: 249.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Classic vintage leather jacket made from premium materials. Timeless style that never goes out of fashion."
  },
  {
    id: 5,
    title: "Modern Table Lamp",
    category: "home",
    price: 89.99,
    image: "https://images.pexels.com/photos/1099816/pexels-photo-1099816.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Elegant modern table lamp with adjustable brightness. Perfect for reading and creating ambient lighting in any room."
  },
  {
    id: 6,
    title: "Professional Camera",
    category: "electronics",
    price: 899.99,
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Professional DSLR camera with high-resolution sensor and advanced autofocus system. Capture stunning photos and 4K videos."
  },
  {
    id: 7,
    title: "Casual Summer Dress",
    category: "fashion",
    price: 79.99,
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Comfortable and stylish summer dress made from breathable fabric. Perfect for casual outings and warm weather."
  },
  {
    id: 8,
    title: "Yoga Mat Set",
    category: "sports",
    price: 59.99,
    image: "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Premium yoga mat with excellent grip and cushioning. Includes carrying strap and alignment guides for perfect poses."
  },
  {
    id: 9,
    title: "Indoor Plant Collection",
    category: "home",
    price: 34.99,
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Beautiful collection of low-maintenance indoor plants. Perfect for improving air quality and adding natural beauty to your space."
  },
  {
    id: 10,
    title: "Wireless Speaker",
    category: "electronics",
    price: 129.99,
    image: "https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Portable wireless speaker with 360-degree sound and waterproof design. Perfect for outdoor adventures and pool parties."
  },
  {
    id: 11,
    title: "Designer Sunglasses",
    category: "fashion",
    price: 159.99,
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Premium designer sunglasses with UV protection and polarized lenses. Stylish and functional for any occasion."
  },
  {
    id: 12,
    title: "Tennis Racket",
    category: "sports",
    price: 189.99,
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800",
    description: "Professional tennis racket with advanced string technology. Lightweight design for improved control and power."
  }
];

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const loadingOverlay = document.getElementById('loadingOverlay');

// State
let currentFilter = 'all';
let searchTerm = '';
let filteredProducts = products;

// Theme Management
class ThemeManager {
  constructor() {
    this.initTheme();
    this.bindEvents();
  }

  initTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  bindEvents() {
    themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Product Manager
class ProductManager {
  constructor() {
    this.bindEvents();
    this.init();
  }

  init() {
    this.showLoading();
    // Simulate loading delay for better UX
    setTimeout(() => {
      this.renderProducts();
      this.hideLoading();
    }, 1000);
  }

  bindEvents() {
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.setActiveFilter(e.target);
        currentFilter = e.target.dataset.category;
        this.filterProducts();
      });
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      this.filterProducts();
    });

    // Modal events
    modalClose.addEventListener('click', () => this.closeModal());
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.closeModal();
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  setActiveFilter(activeButton) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  filterProducts() {
    filteredProducts = products.filter(product => {
      const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                           product.description.toLowerCase().includes(searchTerm) ||
                           product.category.toLowerCase().includes(searchTerm);
      
      return matchesCategory && matchesSearch;
    });

    this.renderProducts();
  }

  renderProducts() {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">No products found</h3>
          <p style="color: var(--text-muted);">Try adjusting your search or filter criteria</p>
        </div>
      `;
      return;
    }

    filteredProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index);
      productsGrid.appendChild(productCard);
    });
  }

  createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${(index % 6) * 0.1}s`;
    
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category">${this.formatCategory(product.category)}</div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price}</div>
      </div>
    `;

    card.addEventListener('click', () => this.openModal(product));
    
    return card;
  }

  formatCategory(category) {
    const categoryMap = {
      'electronics': 'Electronics',
      'fashion': 'Fashion',
      'home': 'Home & Garden',
      'sports': 'Sports & Fitness'
    };
    return categoryMap[category] || category;
  }

  openModal(product) {
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');

    modalImg.src = product.image;
    modalImg.alt = product.title;
    modalTitle.textContent = product.title;
    modalCategory.textContent = this.formatCategory(product.category);
    modalPrice.textContent = `$${product.price}`;
    modalDescription.textContent = product.description;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  showLoading() {
    loadingOverlay.classList.remove('hidden');
  }

  hideLoading() {
    loadingOverlay.classList.add('hidden');
  }
}

// Smooth Scrolling Enhancement
class SmoothScrollManager {
  constructor() {
    this.initSmoothScroll();
  }

  initSmoothScroll() {
    // Add smooth scrolling to any anchor links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.initIntersectionObserver();
    this.initImageLazyLoading();
  }

  initIntersectionObserver() {
    // Observe product cards for animation triggers
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe existing and future product cards
    const observeCards = () => {
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
      });
    };

    // Initial observation
    setTimeout(observeCards, 100);
    
    // Re-observe when products are re-rendered
    const originalRenderProducts = ProductManager.prototype.renderProducts;
    ProductManager.prototype.renderProducts = function() {
      originalRenderProducts.call(this);
      setTimeout(observeCards, 100);
    };
  }

  initImageLazyLoading() {
    // Modern browsers support loading="lazy", but we can enhance it
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  new ThemeManager();
  new ProductManager();
  new SmoothScrollManager();
  new PerformanceManager();

  // Add some nice touches
  initializeEnhancements();
});

// Additional enhancements
function initializeEnhancements() {
  // Add ripple effect to buttons
  addRippleEffect();
  
  // Add keyboard navigation
  addKeyboardNavigation();
  
  // Add focus management for accessibility
  addFocusManagement();
}

function addRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .filter-btn, .theme-toggle');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function addKeyboardNavigation() {
  // Enhanced keyboard navigation for product grid
  document.addEventListener('keydown', (e) => {
    const focusedElement = document.activeElement;
    
    if (focusedElement.classList.contains('product-card')) {
      const cards = Array.from(document.querySelectorAll('.product-card'));
      const currentIndex = cards.indexOf(focusedElement);
      let nextIndex;
      
      switch(e.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % cards.length;
          cards[nextIndex].focus();
          e.preventDefault();
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + cards.length) % cards.length;
          cards[nextIndex].focus();
          e.preventDefault();
          break;
        case 'Enter':
        case ' ':
          focusedElement.click();
          e.preventDefault();
          break;
      }
    }
  });
  
  // Make product cards focusable
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.product-card').forEach(card => {
      card.setAttribute('tabindex', '0');
    });
  });
  
  observer.observe(productsGrid, { childList: true });
}

function addFocusManagement() {
  // Trap focus in modal when open
  modalOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusableElements = modalOverlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
  
  // Focus management when modal opens/closes
  let lastFocusedElement;
  
  const originalOpenModal = ProductManager.prototype.openModal;
  ProductManager.prototype.openModal = function(product) {
    lastFocusedElement = document.activeElement;
    originalOpenModal.call(this, product);
    setTimeout(() => modalClose.focus(), 100);
  };
  
  const originalCloseModal = ProductManager.prototype.closeModal;
  ProductManager.prototype.closeModal = function() {
    originalCloseModal.call(this);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };
}