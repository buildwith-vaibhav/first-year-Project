/* ===== MELLOW — Full Cart + Customization + Reviews (₹) ===== */

const MENU = [
  // Signature Drinks
  { id: 'd1', name: 'Blush Latte', desc: 'Rose · espresso · oat · soft foam', price: 220, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false, popular: true },
  { id: 'd2', name: 'Soft Matcha', desc: 'Ceremonial grade · oat · light foam', price: 240, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false },
  { id: 'd3', name: 'Strawberry Cloud', desc: 'Strawberry cream cold foam · espresso', price: 260, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false, popular: true },
  { id: 'd4', name: 'Lavender Honey Latte', desc: 'Lavender · local honey · oat', price: 240, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false },
  { id: 'd5', name: 'Classic Latte', desc: 'Espresso · steamed milk', price: 180, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false },
  { id: 'd6', name: 'Cold Brew', desc: '18-hour steep', price: 170, category: 'drinks', hasSize: true, hasSauce: false, hasCheese: false },

  // Chinese
  { id: 'c1', name: 'Soft Dumplings (6)', desc: 'Pork & chive · steamed', price: 280, category: 'chinese', hasSize: false, hasSauce: true, hasCheese: false },
  { id: 'c2', name: 'Veggie Spring Rolls', desc: 'Crispy · sweet chili dip', price: 220, category: 'chinese', hasSize: false, hasSauce: true, hasCheese: false },
  { id: 'c3', name: 'Mapo Tofu (mild)', desc: 'Soft tofu · gentle spice · rice', price: 340, category: 'chinese', hasSize: true, hasSauce: true, hasCheese: false, popular: true },
  { id: 'c4', name: 'Chicken Fried Rice', desc: 'Egg · soft veggies · sesame', price: 320, category: 'chinese', hasSize: true, hasSauce: true, hasCheese: false },

  // Italian
  { id: 'i1', name: 'Margherita Pizza', desc: 'Fresh mozzarella · basil · soft crust', price: 420, category: 'italian', hasSize: true, hasSauce: true, hasCheese: true, popular: true },
  { id: 'i2', name: 'Creamy Carbonara', desc: 'Egg · pecorino · black pepper', price: 390, category: 'italian', hasSize: true, hasSauce: false, hasCheese: true },
  { id: 'i3', name: 'Caprese Soft Toast', desc: 'Tomato · mozzarella · balsamic', price: 260, category: 'italian', hasSize: false, hasSauce: false, hasCheese: true },
  { id: 'i4', name: 'Pesto Pasta', desc: 'Basil pesto · pine nuts · parmesan', price: 360, category: 'italian', hasSize: true, hasSauce: false, hasCheese: true },

  // Mexican
  { id: 'm1', name: 'Soft Tacos (3)', desc: 'Choice of chicken or veggie', price: 310, category: 'mexican', hasSize: false, hasSauce: true, hasCheese: true },
  { id: 'm2', name: 'Guacamole & Chips', desc: 'Fresh avocado · lime · cilantro', price: 240, category: 'mexican', hasSize: false, hasSauce: true, hasCheese: false },
  { id: 'm3', name: 'Quesadilla', desc: 'Cheese · optional chicken', price: 290, category: 'mexican', hasSize: true, hasSauce: true, hasCheese: true, popular: true },
  { id: 'm4', name: 'Burrito Bowl', desc: 'Rice · beans · soft veggies · salsa', price: 340, category: 'mexican', hasSize: true, hasSauce: true, hasCheese: true },

  // Indian
  { id: 'n1', name: 'Butter Chicken', desc: 'Creamy tomato · soft naan', price: 420, category: 'indian', hasSize: true, hasSauce: true, hasCheese: false, popular: true },
  { id: 'n2', name: 'Palak Paneer', desc: 'Spinach · soft paneer · rice', price: 380, category: 'indian', hasSize: true, hasSauce: true, hasCheese: false },
  { id: 'n3', name: 'Vegetable Samosas (2)', desc: 'Crispy · mint chutney', price: 160, category: 'indian', hasSize: false, hasSauce: true, hasCheese: false },
  { id: 'n4', name: 'Chicken Biryani', desc: 'Fragrant rice · mild spices', price: 390, category: 'indian', hasSize: true, hasSauce: true, hasCheese: false }
];

const SIZE_PRICES = { mini: 0, medium: 40, large: 80 };
const SAUCE_PRICE = 30;
const CHEESE_PRICE = 40;

const STAFF = [
  { name: 'Maya', role: 'Head Barista & Soft Drinks', bio: 'Loves floral lattes and quiet mornings.' },
  { name: 'Leo', role: 'Kitchen Lead', bio: 'Keeps every plate soft and balanced.' },
  { name: 'Priya', role: 'Spice & Indian Specialist', bio: 'Gentle heat, big comfort.' },
  { name: 'Marco', role: 'Pasta & Pizza', bio: 'Dough, cheese, and patience.' },
  { name: 'Sofia', role: 'Tacos & Fresh Prep', bio: 'Fresh herbs, bright salsas.' },
  { name: 'Kai', role: 'Dumplings & Wok', bio: 'Steam, wok, and soft folds.' }
];

const OWNER = {
  name: 'Aria Chen',
  role: 'Founder & Owner',
  bio: 'Started Mellow to create a soft place to land — good coffee, gentle food, and no rush. She still makes the first batch of cold brew every morning.'
};

let cart = JSON.parse(localStorage.getItem('mellow_cart') || '[]');
let currentOrder = JSON.parse(localStorage.getItem('mellow_last_order') || 'null');
let allOrders = JSON.parse(localStorage.getItem('mellow_orders') || '{}');
let reviews = JSON.parse(localStorage.getItem('mellow_reviews') || '[]');
let selectedItem = null;

function saveCart() {
  localStorage.setItem('mellow_cart', JSON.stringify(cart));
  updateCartCount();
}

function formatPrice(n) {
  return '₹' + n.toFixed(0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function generateOrderId() {
  return 'M-' + Math.floor(1000 + Math.random() * 9000);
}

function getETA(minutes) {
  if (minutes === 'asap') return 20 + Math.floor(Math.random() * 10);
  return parseInt(minutes) || 25;
}

function calcItemPrice(item, opts = {}) {
  let p = item.price;
  if (opts.size && SIZE_PRICES[opts.size] !== undefined) p += SIZE_PRICES[opts.size];
  if (opts.sauce) p += SAUCE_PRICE;
  if (opts.cheese) p += CHEESE_PRICE;
  return p;
}

// ---------- RENDER MENU ----------
function renderMenu(category = 'all') {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  const items = category === 'all' ? MENU : MENU.filter(i => i.category === category);

  grid.innerHTML = items.map(item => `
    <article class="menu-card pop-card" data-id="${item.id}">
      ${item.popular ? '<span class="badge-popular">Popular</span>' : ''}
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p class="item-desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="price">${formatPrice(item.price)}</span>
          <button class="btn btn-add" data-id="${item.id}">Customize</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-add') || e.target.closest('.btn-add')) {
        openCustomize(card.dataset.id);
      } else {
        openCustomize(card.dataset.id);
      }
    });
  });
}

// ---------- CUSTOMIZE MODAL ----------
function openCustomize(id) {
  selectedItem = MENU.find(i => i.id === id);
  if (!selectedItem) return;

  const modal = document.getElementById('customize-modal');
  document.getElementById('cust-name').textContent = selectedItem.name;
  document.getElementById('cust-desc').textContent = selectedItem.desc;
  document.getElementById('cust-base-price').textContent = formatPrice(selectedItem.price);

  // Size
  const sizeWrap = document.getElementById('cust-size-wrap');
  sizeWrap.style.display = selectedItem.hasSize ? 'block' : 'none';
  if (selectedItem.hasSize) {
    document.querySelector('input[name="cust-size"][value="medium"]').checked = true;
  }

  // Sauce
  const sauceWrap = document.getElementById('cust-sauce-wrap');
  sauceWrap.style.display = selectedItem.hasSauce ? 'block' : 'none';
  document.getElementById('cust-sauce').checked = false;

  // Cheese
  const cheeseWrap = document.getElementById('cust-cheese-wrap');
  cheeseWrap.style.display = selectedItem.hasCheese ? 'block' : 'none';
  document.getElementById('cust-cheese').checked = false;

  document.getElementById('cust-qty').value = 1;
  updateCustTotal();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCustomize() {
  document.getElementById('customize-modal').classList.remove('open');
  document.body.style.overflow = '';
  selectedItem = null;
}

function getCustOptions() {
  const size = selectedItem?.hasSize
    ? (document.querySelector('input[name="cust-size"]:checked')?.value || 'medium')
    : null;
  const sauce = selectedItem?.hasSauce && document.getElementById('cust-sauce').checked;
  const cheese = selectedItem?.hasCheese && document.getElementById('cust-cheese').checked;
  const qty = Math.max(1, parseInt(document.getElementById('cust-qty').value) || 1);
  return { size, sauce, cheese, qty };
}

function updateCustTotal() {
  if (!selectedItem) return;
  const opts = getCustOptions();
  const unit = calcItemPrice(selectedItem, opts);
  document.getElementById('cust-total').textContent = formatPrice(unit * opts.qty);
}

function addCustomizedToCart() {
  if (!selectedItem) return;
  const opts = getCustOptions();
  const unitPrice = calcItemPrice(selectedItem, opts);

  const labelParts = [];
  if (opts.size) labelParts.push(opts.size);
  if (opts.sauce) labelParts.push('sauce');
  if (opts.cheese) labelParts.push('extra cheese');
  const label = labelParts.length ? ` (${labelParts.join(', ')})` : '';

  const cartId = selectedItem.id + '|' + (opts.size || '') + '|' + (opts.sauce ? '1' : '0') + '|' + (opts.cheese ? '1' : '0');

  const existing = cart.find(c => c.cartId === cartId);
  if (existing) {
    existing.qty += opts.qty;
  } else {
    cart.push({
      cartId,
      id: selectedItem.id,
      name: selectedItem.name + label,
      price: unitPrice,
      qty: opts.qty,
      size: opts.size,
      sauce: opts.sauce,
      cheese: opts.cheese
    });
  }
  saveCart();
  showToast(`${selectedItem.name} added to cart`);
  closeCustomize();
}

// ---------- CART ----------
function addToCart(id) {
  openCustomize(id);
}

function removeFromCart(cartId) {
  cart = cart.filter(c => c.cartId !== cartId);
  saveCart();
  renderCart();
}

function changeQty(cartId, delta) {
  const item = cart.find(c => c.cartId === cartId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(cartId);
  else {
    saveCart();
    renderCart();
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

function renderCart() {
  const empty = document.getElementById('cart-empty');
  const content = document.getElementById('cart-content');
  const itemsEl = document.getElementById('cart-items');
  if (!empty || !content || !itemsEl) return;

  if (cart.length === 0) {
    empty.classList.remove('hidden');
    content.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  content.classList.remove('hidden');

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)} each</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="minus" data-id="${item.cartId}">−</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-btn" data-action="plus" data-id="${item.cartId}">+</button>
        <button class="remove-btn" data-id="${item.cartId}">Remove</button>
      </div>
      <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('cart-subtotal').textContent = formatPrice(total);
  document.getElementById('cart-total').textContent = formatPrice(total);

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(btn.dataset.id, btn.dataset.action === 'plus' ? 1 : -1);
    });
  });
  itemsEl.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
  });
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkout-items');
  if (!el) return;
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  el.innerHTML = cart.map(i => `
    <div class="checkout-line">
      <span>${i.qty}× ${i.name}</span>
      <span>${formatPrice(i.price * i.qty)}</span>
    </div>
  `).join('');
  document.getElementById('checkout-total').textContent = formatPrice(total);
}

// ---------- ORDER ----------
function placeOrder(formData) {
  const orderId = generateOrderId();
  const etaMin = getETA(formData.time);
  const staff = STAFF[Math.floor(Math.random() * STAFF.length)];

  const order = {
    id: orderId,
    customer: formData.name,
    phone: formData.phone,
    email: formData.email || '',
    notes: formData.notes || '',
    chefNotes: formData.chefNotes || '',
    items: [...cart],
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    etaMinutes: etaMin,
    createdAt: Date.now(),
    status: 'received',
    staff
  };

  allOrders[orderId] = order;
  localStorage.setItem('mellow_orders', JSON.stringify(allOrders));
  localStorage.setItem('mellow_last_order', JSON.stringify(order));
  currentOrder = order;

  cart = [];
  saveCart();

  document.getElementById('order-number').textContent = orderId;
  document.getElementById('order-eta').textContent = `${etaMin} minutes`;
  document.getElementById('order-customer').textContent = formData.name;

  location.hash = 'confirmation';
}

function showOrderStatus(orderId) {
  const order = allOrders[orderId];
  const result = document.getElementById('status-result');
  const notFound = document.getElementById('status-not-found');
  if (!result) return;

  if (!order) {
    result.classList.add('hidden');
    notFound?.classList.remove('hidden');
    return;
  }

  notFound?.classList.add('hidden');
  result.classList.remove('hidden');

  document.getElementById('status-order-id').textContent = order.id;
  document.getElementById('status-customer-name').textContent = order.customer;
  document.getElementById('staff-name').textContent = order.staff.name;
  document.getElementById('staff-role').textContent = order.staff.role;

  const elapsed = (Date.now() - order.createdAt) / 60000;
  let status = 'received';
  if (elapsed > order.etaMinutes * 0.8) status = 'ready';
  else if (elapsed > order.etaMinutes * 0.5) status = 'almost';
  else if (elapsed > 2) status = 'preparing';

  order.status = status;
  allOrders[orderId] = order;
  localStorage.setItem('mellow_orders', JSON.stringify(allOrders));

  const steps = [
    { key: 'received', label: 'Order Received' },
    { key: 'preparing', label: 'Being Prepared' },
    { key: 'almost', label: 'Almost Ready' },
    { key: 'ready', label: 'Ready for Pickup' }
  ];
  const currentIdx = steps.findIndex(s => s.key === status);
  document.getElementById('status-timeline').innerHTML = steps.map((s, i) => `
    <div class="timeline-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}">
      <div class="dot"></div><span>${s.label}</span>
    </div>
  `).join('');

  const remaining = Math.max(0, Math.ceil(order.etaMinutes - elapsed));
  document.getElementById('status-eta').textContent = remaining > 0 ? `${remaining} min` : 'Ready now!';
}

// ---------- TEAM / OWNER ----------
function renderTeam() {
  const el = document.getElementById('team-grid');
  if (!el) return;
  el.innerHTML = `
    <article class="team-card owner-card pop-card">
      <div class="team-avatar owner-avatar">${OWNER.name.charAt(0)}</div>
      <h3>${OWNER.name}</h3>
      <p class="team-role">${OWNER.role}</p>
      <p class="team-bio">${OWNER.bio}</p>
    </article>
    ${STAFF.map(s => `
      <article class="team-card pop-card">
        <div class="team-avatar">${s.name.charAt(0)}</div>
        <h3>${s.name}</h3>
        <p class="team-role">${s.role}</p>
        <p class="team-bio">${s.bio}</p>
      </article>
    `).join('')}
  `;
}

// ---------- REVIEWS ----------
function renderReviews() {
  const list = document.getElementById('reviews-list');
  if (!list) return;
  if (reviews.length === 0) {
    list.innerHTML = '<p class="reviews-empty">No reviews yet. Be the first to share a soft thought.</p>';
    return;
  }
  list.innerHTML = reviews.slice().reverse().map(r => `
    <div class="review-card">
      <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      <p class="review-text">${r.text}</p>
      <div class="review-meta">— ${r.name} · ${r.date}</div>
    </div>
  `).join('');
}

function submitReview(e) {
  e.preventDefault();
  const name = document.getElementById('rev-name').value.trim() || 'Anonymous';
  const rating = parseInt(document.getElementById('rev-rating').value) || 5;
  const text = document.getElementById('rev-text').value.trim();
  if (!text) return showToast('Please write a short review');
  reviews.push({
    name,
    rating,
    text,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  localStorage.setItem('mellow_reviews', JSON.stringify(reviews));
  document.getElementById('review-form').reset();
  renderReviews();
  showToast('Thank you for your review!');
}

// ---------- NAV ----------
function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active-section');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (id === 'cart') renderCart();
  if (id === 'checkout') renderCheckoutSummary();
  if (id === 'menu') renderMenu(document.querySelector('.filter.active')?.dataset.category || 'all');
  if (id === 'team') renderTeam();
  if (id === 'reviews') renderReviews();
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderMenu();
  renderTeam();
  renderReviews();

  // Filters
  document.querySelectorAll('#category-tabs .filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#category-tabs .filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(btn.dataset.category);
    });
  });

  // Customize modal events
  document.getElementById('close-customize')?.addEventListener('click', closeCustomize);
  document.getElementById('customize-modal')?.addEventListener('click', e => {
    if (e.target.id === 'customize-modal') closeCustomize();
  });
  document.querySelectorAll('input[name="cust-size"], #cust-sauce, #cust-cheese, #cust-qty').forEach(el => {
    el?.addEventListener('change', updateCustTotal);
    el?.addEventListener('input', updateCustTotal);
  });
  document.getElementById('add-customized')?.addEventListener('click', addCustomizedToCart);

  // Cart
  document.getElementById('open-cart-btn')?.addEventListener('click', () => location.hash = 'cart');
  document.getElementById('hero-cart-btn')?.addEventListener('click', () => location.hash = 'cart');
  document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
    cart = []; saveCart(); renderCart(); showToast('Cart cleared');
  });
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) return showToast('Cart is empty');
    location.hash = 'checkout';
  });

  // Checkout
  document.getElementById('checkout-form')?.addEventListener('submit', e => {
    e.preventDefault();
    if (cart.length === 0) return showToast('Cart is empty');
    placeOrder({
      name: document.getElementById('c-name').value.trim(),
      phone: document.getElementById('c-phone').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      time: document.getElementById('c-time').value,
      notes: document.getElementById('c-notes').value.trim(),
      chefNotes: document.getElementById('c-chef')?.value.trim() || ''
    });
  });

  document.getElementById('go-to-status')?.addEventListener('click', () => {
    if (currentOrder) {
      document.getElementById('lookup-order').value = currentOrder.id;
      location.hash = 'order-status';
      showOrderStatus(currentOrder.id);
    }
  });

  document.getElementById('lookup-btn')?.addEventListener('click', () => {
    const id = document.getElementById('lookup-order').value.trim().toUpperCase();
    if (id) showOrderStatus(id);
  });

  document.getElementById('review-form')?.addEventListener('submit', submitReview);
  // Home-page image slider
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.slider-dot'));
const slider = document.querySelector('.hero-slider');

let activeSlide = 0;
let sliderTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === activeSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === activeSlide);
  });
}

function startSlider() {
  clearInterval(sliderTimer);

  sliderTimer = setInterval(() => {
    showSlide(activeSlide + 1);
  }, 5000);
}

document.getElementById('slider-prev')?.addEventListener('click', () => {
  showSlide(activeSlide - 1);
  startSlider();
});

document.getElementById('slider-next')?.addEventListener('click', () => {
  showSlide(activeSlide + 1);
  startSlider();
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startSlider();
  });
});

slider?.addEventListener('mouseenter', () => clearInterval(sliderTimer));
slider?.addEventListener('mouseleave', startSlider);

startSlider();
  // Mobile nav
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  toggle?.addEventListener('click', () => { nav.classList.toggle('open'); toggle.classList.toggle('open'); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
  }));

  function handleHash() {
    const hash = location.hash.slice(1) || 'home';
    showSection(hash);
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();

  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt?.classList.toggle('visible', window.scrollY > 400);
    document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 40);
  });
  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCustomize();
  });
});
