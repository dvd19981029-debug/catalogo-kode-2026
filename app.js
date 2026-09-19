// ==========================================================================
// KÖDE 2026 — EXPERIENCIA Y MOTOR INTERACTIVO
// ==========================================================================

const WHATSAPP_NUMBER = '50378339470';
let CATALOG = [];
let currentSearch = '';
let currentBrand = 'todas';
let currentGender = 'hombre';
let cart = [];

// Estado por perfume para la selección de concentración en la tarjeta (true = extra shot)
const selectedConcentrations = {};

// Desactivar restauración automática nativa para control exacto
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Bloqueo total de zoom en móviles (iOS y Android) y atajos de escritorio
function blockZoomGestures() {
  document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

  let lastTouchTime = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchTime <= 300) {
      e.preventDefault();
    }
    lastTouchTime = now;
  }, { passive: false });

  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) {
      e.preventDefault();
    }
  });
}
blockZoomGestures();

// Detección precisa de recarga (reload) vs retroceso (back navigation)
function getNavigationType() {
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type; // 'navigate', 'reload', 'back_forward', 'prerender'
    }
    if (window.performance && window.performance.navigation) {
      const type = window.performance.navigation.type;
      if (type === 1) return 'reload';
      if (type === 2) return 'back_forward';
      return 'navigate';
    }
  } catch (e) {}
  return 'navigate';
}

function isPageReload() {
  return getNavigationType() === 'reload';
}

function isBackNavigation(event) {
  if (event && event.persisted) return true;
  const navType = getNavigationType();
  if (navType === 'back_forward') return true;
  try {
    if (sessionStorage.getItem('kode_nav_to_product') === 'true') return true;
    if (document.referrer && document.referrer.includes('producto.html')) return true;
  } catch (e) {}
  return false;
}

// Al recargar la página: SIEMPRE volver al inicio absoluto y descartar posiciones guardadas
if (isPageReload()) {
  try {
    sessionStorage.removeItem('kode_catalog_scroll_y');
    sessionStorage.removeItem('kode_catalog_last_k');
    sessionStorage.removeItem('kode_nav_to_product');
  } catch (e) {}
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

// Guardar y restaurar posición exacta de lectura
window.saveCatalogScrollState = function(code) {
  try {
    sessionStorage.setItem('kode_catalog_scroll_y', String(window.scrollY));
    if (code) sessionStorage.setItem('kode_catalog_last_k', String(code));
    sessionStorage.setItem('kode_nav_to_product', 'true');
  } catch (e) {}
};

function restoreCatalogScroll() {
  if (isPageReload()) return;
  try {
    const savedScroll = sessionStorage.getItem('kode_catalog_scroll_y');
    const savedCode = sessionStorage.getItem('kode_catalog_last_k');
    if (!savedScroll && !savedCode) return;

    const y = savedScroll ? parseInt(savedScroll, 10) : null;

    const tryRestore = () => {
      if (isPageReload()) return;
      if (y !== null && !isNaN(y) && y > 0) {
        window.scrollTo({ top: y, behavior: 'instant' });
      } else if (savedCode) {
        const el = document.querySelector(`article[data-id="kode-${savedCode}"]`);
        if (el) {
          el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
        }
      }
    };

    tryRestore();
    requestAnimationFrame(tryRestore);
    setTimeout(tryRestore, 50);
    setTimeout(tryRestore, 150);
    setTimeout(tryRestore, 300);

    setTimeout(() => {
      try {
        sessionStorage.removeItem('kode_nav_to_product');
      } catch (e) {}
    }, 600);
  } catch (e) {}
}

window.addEventListener('pageshow', (event) => {
  if (isPageReload()) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return;
  }
  if (isBackNavigation(event)) {
    restoreCatalogScroll();
  }
});

let scrollDebounce = null;
window.addEventListener('scroll', () => {
  if (scrollDebounce) return;
  scrollDebounce = setTimeout(() => {
    scrollDebounce = null;
    try {
      sessionStorage.setItem('kode_catalog_scroll_y', String(window.scrollY));
    } catch (e) {}
  }, 120);
}, { passive: true });

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalogData();
  setupGenderTabs();
  populateBrandSelect();
  loadCart();
  setupEventListeners();
  renderCatalog();
  if (isPageReload()) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } else if (isBackNavigation()) {
    restoreCatalogScroll();
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  setupDialogDismiss();
  setupScrollAwareFilterBar();
  initHero3DShowcase();
});

// Pools de productos: primeros 6 más vendidos (top 3 con badge) y resto aleatorio
const catalogPools = {
  hombre: [],
  mujer: [],
  unisex: []
};

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeCatalogOrder() {
  // Mantener el mismo orden durante la sesión para que al volver esté en el mismo lugar
  try {
    const savedPools = sessionStorage.getItem('kode_catalog_pools');
    if (savedPools) {
      const parsed = JSON.parse(savedPools);
      if (parsed && parsed.hombre && parsed.hombre.length > 0) {
        const savedTotal = (parsed.hombre?.length || 0) + (parsed.mujer?.length || 0) + (parsed.unisex?.length || 0);
        if (savedTotal === CATALOG.length) {
          Object.assign(catalogPools, parsed);
          return;
        }
      }
    }
  } catch (e) {}

  const genders = ['hombre', 'mujer', 'unisex'];
  genders.forEach(g => {
    const pool = CATALOG.filter(item => item.gender === g).map(item => ({ ...item }));

    // 1. Ordenar por ventas estrictamente descendente
    pool.sort((a, b) => (b.sales || 0) - (a.sales || 0));

    // 2. Los primeros 6 siempre son los más vendidos
    const top6 = pool.slice(0, 6);

    // 3. Los primeros 3 reciben su badge de top más vendido
    if (top6[0]) top6[0].topBadge = 'Top 1 Más Vendido';
    if (top6[1]) top6[1].topBadge = 'Top 2 Más Vendido';
    if (top6[2]) top6[2].topBadge = 'Top 3 Más Vendido';

    // 4. De la posición 7 en adelante (índice 6..N), orden aleatorio
    const rest = shuffleArray(pool.slice(6));

    catalogPools[g] = [...top6, ...rest];
  });

  try {
    sessionStorage.setItem('kode_catalog_pools', JSON.stringify(catalogPools));
  } catch (e) {}
}

// Cargar datos
async function loadCatalogData() {
  if (typeof window !== 'undefined' && Array.isArray(window.CATALOG_DATA) && window.CATALOG_DATA.length > 0) {
    CATALOG = window.CATALOG_DATA;
    initializeCatalogOrder();
    return;
  }
  try {
    const response = await fetch('perfumes.json?v=' + Date.now());
    if (response.ok) {
      CATALOG = await response.json();
      initializeCatalogOrder();
      return;
    }
  } catch (err) {
    console.warn('Carga de perfumes.json falló:', err);
  }
}

// Configurar pestañas del selector de género (Hombre / Mujer / Unisex / Maceración)
function setupGenderTabs() {
  const tabs = document.querySelectorAll('.gender-tab');
  const catalogWrap = document.getElementById('catalog-showcase-wrap');
  const maceracionWrap = document.getElementById('maceracion-blog');
  const searchWrap = document.querySelector('.search-input-wrap');

  function switchTab(gender, userInitiated = false) {
    if (gender === 'maceracion') {
      if (catalogWrap) catalogWrap.style.display = 'none';
      if (maceracionWrap) {
        maceracionWrap.style.display = 'block';
        if (userInitiated) {
          const nav = document.querySelector('.apple-nav');
          const filterBar = document.querySelector('.sticky-filter-bar');
          const offset = (nav ? nav.offsetHeight : 65) + (filterBar ? filterBar.offsetHeight : 50) + 20;
          const targetTop = maceracionWrap.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      }

      const eyebrow = document.getElementById('hero-eyebrow');
      if (eyebrow) eyebrow.textContent = 'GUÍA DE PERFUMERÍA';
    } else {
      if (catalogWrap) catalogWrap.style.display = 'block';
      if (maceracionWrap) maceracionWrap.style.display = 'none';
      if (searchWrap) searchWrap.style.display = '';

      currentGender = gender;

      const eyebrow = document.getElementById('hero-eyebrow');
      if (eyebrow) {
        if (currentGender === 'mujer') eyebrow.textContent = 'COLECCIÓN FEMENINA';
        else if (currentGender === 'hombre') eyebrow.textContent = 'COLECCIÓN MASCULINA';
        else if (currentGender === 'unisex') eyebrow.textContent = 'COLECCIÓN UNISEX';
      }

      populateBrandSelect();
      renderCatalog();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Asegurar que la pestaña activa sea visible en pantallas móviles con scroll horizontal
      try {
        tab.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      } catch (e) {}

      const selected = tab.dataset.gender || 'hombre';
      switchTab(selected, true);
    });
  });

  // Soporte para parámetro URL ?gender=mujer o ?gender=maceracion
  const urlParams = new URLSearchParams(window.location.search);
  const paramGender = urlParams.get('gender');
  if (paramGender) {
    const target = Array.from(tabs).find(t => t.dataset.gender === paramGender.toLowerCase());
    if (target) {
      target.click();
      return;
    }
  }

  // Por defecto 'hombre'
  switchTab(currentGender || 'hombre');
}

// Llenar selector de marcas / diseñadores según el género actual
function populateBrandSelect() {
  const select = document.getElementById('brand-select');
  if (!select) return;

  const pool = CATALOG.filter(item => item.gender === currentGender);

  const brands = [...new Set(pool.map(item => item.brand).filter(Boolean))].sort();

  if (currentBrand !== 'todas' && !brands.includes(currentBrand)) {
    currentBrand = 'todas';
  }

  select.innerHTML = `<option value="todas">Todos los diseñadores (${brands.length})</option>`;
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    if (b === currentBrand) opt.selected = true;
    select.appendChild(opt);
  });
}

// Guardar y cargar carrito desde LocalStorage
function saveCart() {
  try {
    localStorage.setItem('kode_cart_2026', JSON.stringify(cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
  updateCartBadge();
  updateAllCardBuyButtons();
  updateAllCardPrices();
}

function loadCart() {
  try {
    const saved = localStorage.getItem('kode_cart_2026');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        cart = [];
        parsed.forEach(item => {
          const qty = item.quantity || 1;
          for (let i = 0; i < qty; i++) {
            cart.push({
              ...item,
              cartItemId: (qty === 1 && item.cartItemId) ? item.cartItemId : ('c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7)),
              quantity: 1
            });
          }
        });
      }
    }
  } catch (e) {
    cart = [];
  }
  updateCartBadge();
  updateAllCardBuyButtons();
  updateAllCardPrices();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const countText = document.getElementById('cart-items-count-text');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) {
    badge.textContent = totalItems;
  }
  if (countText) {
    countText.textContent = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`;
  }
}

function updateAllCardBuyButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.getAttribute('data-id');
    if (productId) {
      updateCardBuyButton(productId);
    }
  });
}

function updateCardBuyButton(productId) {
  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (!card) return;
  const btn = card.querySelector('.apple-buy-btn');
  if (!btn) return;

  const isExtra = selectedConcentrations[productId] !== undefined ? selectedConcentrations[productId] : true;
  const qty = cart.filter(ci => (ci.productId === productId || ci.id === productId) && ci.extraShot === isExtra).length;

  if (qty > 0) {
    btn.textContent = qty === 1 ? '✓ Ya agregada (1)' : `✓ Ya agregadas (${qty})`;
    btn.classList.add('in-cart');
  } else {
    btn.textContent = 'Agregar';
    btn.classList.remove('in-cart');
  }
}

// Event listeners
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');

  function updateSearchClearBtn() {
    if (!searchClearBtn || !searchInput) return;
    if (searchInput.value.trim().length > 0) {
      searchClearBtn.classList.add('is-visible');
    } else {
      searchClearBtn.classList.remove('is-visible');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      updateSearchClearBtn();
      const catalogWrap = document.getElementById('catalog-showcase-wrap');
      const maceracionWrap = document.getElementById('maceracion-blog');
      if (currentSearch) {
        if (maceracionWrap && maceracionWrap.style.display !== 'none') {
          maceracionWrap.style.display = 'none';
          if (catalogWrap) catalogWrap.style.display = 'block';
        }
      } else {
        const activeTab = document.querySelector('.gender-tab.active');
        if (activeTab && activeTab.getAttribute('data-gender') === 'maceracion') {
          if (maceracionWrap) maceracionWrap.style.display = 'block';
          if (catalogWrap) catalogWrap.style.display = 'none';
        }
      }
      renderCatalog();
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      updateSearchClearBtn();
      const catalogWrap = document.getElementById('catalog-showcase-wrap');
      const maceracionWrap = document.getElementById('maceracion-blog');
      const activeTab = document.querySelector('.gender-tab.active');
      if (activeTab && activeTab.getAttribute('data-gender') === 'maceracion') {
        if (maceracionWrap) maceracionWrap.style.display = 'block';
        if (catalogWrap) catalogWrap.style.display = 'none';
      }
      renderCatalog();
      searchInput.focus();
    });
  }

  const brandSelect = document.getElementById('brand-select');
  if (brandSelect) {
    brandSelect.addEventListener('change', (e) => {
      currentBrand = e.target.value;
      renderCatalog();
    });
  }

  const openCartBtn = document.getElementById('open-cart-btn');
  const cartDialog = document.getElementById('cart-dialog');
  const closeCartBtn = document.getElementById('close-cart-btn');

  if (openCartBtn && cartDialog) {
    openCartBtn.addEventListener('click', () => {
      renderCart();
      cartDialog.showModal();
    });
  }

  if (closeCartBtn && cartDialog) {
    closeCartBtn.addEventListener('click', () => {
      cartDialog.close();
    });
  }

  const customerInput = document.getElementById('customer-name');
  if (customerInput) {
    const savedName = localStorage.getItem('kode_customer_name');
    if (savedName) customerInput.value = savedName;
    customerInput.addEventListener('input', (e) => {
      localStorage.setItem('kode_customer_name', e.target.value);
    });
  }

  const whatsappBtn = document.getElementById('whatsapp-order-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', sendOrderViaWhatsApp);
  }

  setupDeliveryAndPayment();

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="producto.html"]');
    if (link) {
      try {
        const url = new URL(link.href, window.location.origin);
        const code = url.searchParams.get('k') || url.searchParams.get('code');
        saveCatalogScrollState(code);
      } catch (err) {}
    }
  });
}

// Barra de búsqueda deslizante: desaparece al bajar y aparece al subir
// Los botones de género (Hombre, Mujer, Unisex) permanecen siempre visibles
function setupScrollAwareFilterBar() {
  const searchWrap = document.querySelector('.search-input-wrap');
  const searchInput = document.getElementById('search-input');
  if (!searchWrap) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let lastToggleTime = 0;
  const SCROLL_DELTA_THRESHOLD = 12; // Mínimo de desplazamiento para evitar parpadeos
  const TOGGLE_COOLDOWN_MS = 250; // Evita rebotes durante la animación de colapso/expansión

  function getScrollThreshold() {
    const hero = document.getElementById('hero-keynote');
    if (hero) {
      // La barra sólo debe comenzar a ocultarse después de haber bajado y deslizado
      // toda la parte de la animación y el hero (cuando la barra llega a la posición sticky)
      return Math.max(hero.offsetTop + hero.offsetHeight - 70, 500);
    }
    return 650;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const isInputFocused = searchInput && document.activeElement === searchInput;
        const threshold = getScrollThreshold();

        // Antes de haber bajado y deslizado la animación (o con buscador en foco): siempre visible
        if (currentScrollY <= threshold || isInputFocused) {
          if (searchWrap.classList.contains('is-hidden')) {
            searchWrap.classList.remove('is-hidden');
            lastToggleTime = performance.now();
          }
          lastScrollY = currentScrollY;
          ticking = false;
          return;
        }

        const delta = currentScrollY - lastScrollY;
        const now = performance.now();

        if (Math.abs(delta) >= SCROLL_DELTA_THRESHOLD && (now - lastToggleTime) >= TOGGLE_COOLDOWN_MS) {
          if (delta > 0 && !searchWrap.classList.contains('is-hidden')) {
            // Scroll hacia abajo después de la animación -> deslizar y ocultar sólo la barra de búsqueda
            searchWrap.classList.add('is-hidden');
            lastToggleTime = now;
          } else if (delta < 0 && searchWrap.classList.contains('is-hidden')) {
            // Scroll hacia arriba -> deslizar y mostrar la barra de búsqueda
            searchWrap.classList.remove('is-hidden');
            lastToggleTime = now;
          }
          lastScrollY = currentScrollY;
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (searchInput) {
    searchInput.addEventListener('focus', () => {
      searchWrap.classList.remove('is-hidden');
      lastToggleTime = performance.now();
    });
  }
}

// Fallback de cierre de diálogo al tocar fuera (backdrop)
function setupDialogDismiss() {
  const dialog = document.getElementById('cart-dialog');
  if (!dialog) return;

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        dialog.close();
      }
    });
  }
}

// Normalización para búsquedas sin tildes
function normalizeText(text) {
  return (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Precios dinámicos en tarjetas según estado del carrito (Oferta si ya lleva al menos 1)
function getCardPriceDisplay(productId, isExtra) {
  const totalInCart = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const hasItems = totalInCart > 0;
  const isPromo343 = productId === 'kode-343' || productId === '343';

  if (hasItems) {
    if (isExtra) {
      return {
        mainHtml: '<span class="price-original-strike">$25.00</span><span class="price-deal-val">$20.00</span>',
        subPrice: 'Oferta por 2da+ unidad'
      };
    } else {
      return {
        mainHtml: '<span class="price-original-strike">$20.00</span><span class="price-deal-val">$15.00</span>',
        subPrice: 'Oferta por 2da+ unidad'
      };
    }
  }

  if (isPromo343) {
    return {
      mainHtml: isExtra ? '<span class="price-original-strike">$25.00</span><span class="price-deal-val">$20.00</span>' : '$20.00',
      subPrice: 'o $15 adicional c/u'
    };
  } else if (isExtra) {
    return {
      mainHtml: '$25.00',
      subPrice: 'o $20 adicional c/u'
    };
  } else {
    return {
      mainHtml: '$20.00',
      subPrice: 'o $15 adicional c/u'
    };
  }
}

function updateAllCardPrices() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.id;
    if (!productId) return;
    const isExtra = selectedConcentrations[productId] !== undefined ? selectedConcentrations[productId] : true;
    const priceVal = document.getElementById(`price-val-${productId}`);
    const priceSub = document.getElementById(`price-sub-${productId}`);
    if (priceVal && priceSub) {
      const priceInfo = getCardPriceDisplay(productId, isExtra);
      priceVal.innerHTML = priceInfo.mainHtml;
      priceSub.textContent = priceInfo.subPrice;
    }
  });
}

// Obtener número de columnas del grid según el viewport
function getCatalogGridColumns() {
  const w = window.innerWidth;
  if (w <= 820) return 2;
  if (w <= 1140) return 3;
  if (w >= 1680) return 5;
  return 4;
}

let lastCatalogGridCols = getCatalogGridColumns();
window.addEventListener('resize', () => {
  const currentCols = getCatalogGridColumns();
  if (currentCols !== lastCatalogGridCols) {
    lastCatalogGridCols = currentCols;
    renderCatalog();
  }
}, { passive: true });

// Renderizar catálogo
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  const emptyState = document.getElementById('empty-results');
  const resultsCounter = document.getElementById('results-count');
  if (!grid) return;

  const activeGenderKey = (currentGender === 'maceracion' ? 'hombre' : currentGender) || 'hombre';
  const sourcePool = catalogPools[activeGenderKey] && catalogPools[activeGenderKey].length > 0
    ? catalogPools[activeGenderKey]
    : CATALOG.filter(item => item.gender === activeGenderKey);

  let filtered = [];
  if (!currentSearch) {
    filtered = sourcePool.filter(item => {
      return currentBrand === 'todas' || item.brand === currentBrand;
    });

    if (resultsCounter) {
      resultsCounter.textContent = `${filtered.length} de ${sourcePool.length} fragancias`;
    }
  } else {
    const term = normalizeText(currentSearch);
    function itemMatches(item) {
      const matchesBrand = currentBrand === 'todas' || item.brand === currentBrand;
      if (!matchesBrand) return false;
      const inCode = normalizeText(item.code).includes(term);
      const inName = normalizeText(item.name).includes(term);
      const inRef = normalizeText(item.reference).includes(term);
      const inBrand = normalizeText(item.brand).includes(term);
      const inFamily = normalizeText(item.olfactoryFamily || '').includes(term);
      return inCode || inName || inRef || inBrand || inFamily;
    }

    // 1. Resultados de la categoría activa primero
    const categoryMatches = sourcePool.filter(itemMatches);

    // 2. Resultados de las demás categorías después
    const allGenders = ['hombre', 'mujer', 'unisex'];
    const otherGenders = allGenders.filter(g => g !== activeGenderKey);
    const otherMatches = [];
    otherGenders.forEach(g => {
      const pool = catalogPools[g] && catalogPools[g].length > 0
        ? catalogPools[g]
        : CATALOG.filter(item => item.gender === g);
      pool.forEach(item => {
        if (itemMatches(item)) {
          otherMatches.push(item);
        }
      });
    });

    filtered = [...categoryMatches, ...otherMatches];

    if (resultsCounter) {
      resultsCounter.textContent = `${filtered.length} fragancia${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`;
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const cardHtmls = filtered.map(item => {
    const isPromo343 = item.code === '343';
    const isExtra = selectedConcentrations[item.id] !== undefined ? selectedConcentrations[item.id] : true;
    const priceInfo = getCardPriceDisplay(item.id, isExtra);
    const mainPrice = priceInfo.mainHtml;
    const subPrice = priceInfo.subPrice;
    const inCartQty = cart.filter(ci => (ci.productId === item.id || ci.id === item.id) && ci.extraShot === isExtra).length;
    const btnText = inCartQty > 0 ? (inCartQty === 1 ? '✓ Ya agregada (1)' : `✓ Ya agregadas (${inCartQty})`) : 'Agregar';
    const btnClass = inCartQty > 0 ? 'apple-buy-btn in-cart' : 'apple-buy-btn';

    const webpSrc = `images/kode/kode_${item.code}.webp`;
    const fallbackSrc = `images/kode/kode_${item.code}.jpg`;

    const genderKey = (item.gender || 'hombre').toLowerCase();
    const genderLabel = genderKey === 'mujer' ? 'Mujer' : (genderKey === 'unisex' ? 'Unisex' : 'Hombre');
    const genderBadgeHtml = `<span class="fragrance-gender-badge gender-badge-${genderKey}">${genderLabel}</span>`;

    let badgeHtml = '';
    if (item.topBadge) {
      let badgeClass = 'badge-top-1';
      let rankText = 'Top 1';
      let descText = ' Más Vendido';
      if (item.code === '343') {
        badgeClass = 'badge-special-offer';
        rankText = 'Oferta especial';
        descText = '';
      } else if (item.topBadge.includes('Top 2')) {
        badgeClass = 'badge-top-2';
        rankText = 'Top 2';
      } else if (item.topBadge.includes('Top 3')) {
        badgeClass = 'badge-top-3';
        rankText = 'Top 3';
      }
      badgeHtml = `<div class="top-seller-badge ${badgeClass}"><span class="badge-rank">${rankText}</span>${descText ? `<span class="badge-desc">${descText}</span>` : ''}</div>`;
    }

    const cardClass = isPromo343 ? 'product-card promo-card-gold' : 'product-card';

    return `
      <article class="${cardClass}" data-id="${item.id}">
        <a href="producto.html?k=${item.code}" class="product-card-link" onclick="saveCatalogScrollState('${item.code}')" aria-label="Ver detalles de Kódigo ${item.code}">
          <div class="product-stage">
            ${badgeHtml}
            ${genderBadgeHtml}
            <picture>
              <source srcset="${webpSrc}" type="image/webp">
              <img 
                src="${fallbackSrc}" 
                alt="Kódigo ${item.code} - ${item.reference}" 
                class="product-bottle-img" 
                loading="lazy"
                decoding="async"
                width="350"
                height="350"
                onerror="this.onerror=null;this.src='images/kode_cover.png'"
              >
            </picture>
          </div>
        </a>
        <div class="product-details">
          <a href="producto.html?k=${item.code}" class="product-title-link" onclick="saveCatalogScrollState('${item.code}')">
            <h3 class="product-title">Kódigo ${item.code}</h3>
          </a>
          <p class="product-inspiration"><span class="inspiration-label">Inspirado en:</span> <strong>${item.reference}</strong> <span class="inspiration-brand">(${item.brand})</span></p>

          <div class="segmented-control-container">
            <span class="segmented-label">Concentración de fragancia:</span>
            <div class="apple-segmented-control ${isExtra ? 'is-extra' : ''}" role="group">
              <div class="segment-slider" aria-hidden="true"></div>
              <button 
                type="button" 
                class="segment-btn ${!isExtra ? 'active' : ''}" 
                onclick="setCardConcentration('${item.id}', false)"
              >
                <span class="seg-btn-label">Normal (30%)</span>
              </button>
              <button 
                type="button" 
                class="segment-btn segment-extra ${isExtra ? 'active' : ''}" 
                onclick="setCardConcentration('${item.id}', true)"
              >
                <span class="seg-btn-label">Extra Shot (45%)</span>
                <span class="segment-badge-green">${isPromo343 ? 'GRATIS' : '+$5 MEJOR'}</span>
              </button>
            </div>
          </div>

          <div class="product-action-bar">
            <div class="price-display-wrap">
              <span class="price-hero" id="price-val-${item.id}">${mainPrice}</span>
              <span class="price-footnote" id="price-sub-${item.id}">${subPrice}</span>
            </div>
            <button type="button" class="${btnClass}" onclick="addToCart('${item.id}')">
              ${btnText}
            </button>
          </div>
        </div>
      </article>
    `;
  });

  // Tarjeta explicativa delgada después de la 4ta línea de perfumes
  const gridCols = getCatalogGridColumns();
  const insertIndex = gridCols * 4; // Exactamente después de 4 filas completas

  if (cardHtmls.length >= insertIndex) {
    const explainerCardHtml = `
      <aside class="concentration-strip" aria-label="Extra Shot vs Normal">
        <div class="cs-inner">
          <div class="cs-title-wrap">
            <span class="cs-eyebrow">Guía de Concentración</span>
            <h3 class="cs-title">Extra Shot vs Normal</h3>
          </div>
          <div class="cs-cards-grid">
            <div class="cs-card cs-card-normal">
              <div class="cs-card-header">
                <span class="cs-pill cs-pill-normal">Normal (30%)</span>
              </div>
              <p class="cs-card-desc">Formulación clásica de alta calidad. Proyección equilibrada para uso diario (6 a 8 horas de duración).</p>
            </div>
            <div class="cs-card cs-card-extra">
              <div class="cs-card-header">
                <span class="cs-pill cs-pill-extra">Extra Shot (45%)</span>
              </div>
              <p class="cs-card-desc">45% de extracto puro. Mayor fijación, máxima estela y potencia intensa para todo el día.</p>
            </div>
          </div>
        </div>
      </aside>
    `;
    cardHtmls.splice(insertIndex, 0, explainerCardHtml);
  }

  grid.innerHTML = cardHtmls.join('');
}

// Cambiar concentración en la tarjeta (Segmented Control)
window.setCardConcentration = function(productId, isExtra) {
  selectedConcentrations[productId] = isExtra;

  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  if (!card) return;

  const control = card.querySelector('.apple-segmented-control');
  if (control) {
    control.classList.toggle('is-extra', isExtra);
  }

  const buttons = card.querySelectorAll('.segment-btn');
  if (buttons.length === 2) {
    buttons[0].classList.toggle('active', !isExtra);
    buttons[1].classList.toggle('active', isExtra);
  }

  const priceVal = document.getElementById(`price-val-${productId}`);
  const priceSub = document.getElementById(`price-sub-${productId}`);

  if (priceVal && priceSub) {
    priceVal.style.transition = 'transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.16s ease';
    priceSub.style.transition = 'transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.16s ease';
    priceVal.style.transform = 'scale(0.92)';
    priceVal.style.opacity = '0.35';
    priceSub.style.opacity = '0.35';

    setTimeout(() => {
      const priceInfo = getCardPriceDisplay(productId, isExtra);
      priceVal.innerHTML = priceInfo.mainHtml;
      priceSub.textContent = priceInfo.subPrice;
      priceVal.style.transform = 'scale(1)';
      priceVal.style.opacity = '1';
      priceSub.style.opacity = '1';
    }, 85);
  }

  updateCardBuyButton(productId);
};

// Agregar al carrito
window.addToCart = function(productId) {
  const item = CATALOG.find(p => p.id === productId);
  if (!item) return;

  const isExtraShot = selectedConcentrations[productId] !== undefined ? selectedConcentrations[productId] : true;
  const newUid = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);

  cart.push({
    cartItemId: newUid,
    productId: item.id,
    code: item.code,
    name: item.name,
    reference: item.reference,
    brand: item.brand,
    image: item.image,
    extraShot: isExtraShot,
    quantity: 1
  });

  saveCart();

  // Rastreo seguro de adición a la bolsa
  try {
    if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
      window.KodeTracker.trackEvent('add_to_cart', {
        code: item.code,
        name: item.name,
        brand: item.brand || '',
        extraShot: isExtraShot
      });
    }
  } catch (e) {}

  // Microinteracción háptica en el botón
  const btn = document.querySelector(`.product-card[data-id="${productId}"] .apple-buy-btn`);
  if (btn) {
    btn.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)';
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => {
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 140);
    }, 90);
  }

  triggerFlyToCart(btn);
  showCartOrderHint();
};

let cartHintTimer = null;

function showCartOrderHint() {
  const hint = document.getElementById('cart-order-hint');
  if (!hint) return;

  hint.classList.add('active');

  if (cartHintTimer) {
    clearTimeout(cartHintTimer);
  }

  cartHintTimer = setTimeout(() => {
    hint.classList.remove('active');
  }, 1000);
}

function triggerFlyToCart(sourceElement) {
  const targetBtn = document.getElementById('open-cart-btn');
  if (!targetBtn) return;

  const targetRect = targetBtn.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  let startX = window.innerWidth / 2;
  let startY = window.innerHeight - 80;

  if (sourceElement && typeof sourceElement.getBoundingClientRect === 'function') {
    const sRect = sourceElement.getBoundingClientRect();
    if (sRect.width > 0 && sRect.height > 0) {
      startX = sRect.left + sRect.width / 2;
      startY = sRect.top + sRect.height / 2;
    }
  }

  const flyer = document.createElement('div');
  flyer.className = 'cart-flyer-particle';
  flyer.textContent = '+1';
  flyer.style.left = `${startX}px`;
  flyer.style.top = `${startY}px`;
  document.body.appendChild(flyer);

  // Animar hacia el botón de Ya Escogidos
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const deltaX = targetX - startX;
      const deltaY = targetY - startY;
      flyer.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.35)`;
      flyer.style.opacity = '0.4';
    });
  });

  setTimeout(() => {
    if (flyer.parentNode) {
      flyer.parentNode.removeChild(flyer);
    }
    targetBtn.classList.remove('cart-pulse');
    void targetBtn.offsetWidth;
    targetBtn.classList.add('cart-pulse');

    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.classList.remove('badge-pop');
      void badge.offsetWidth;
      badge.classList.add('badge-pop');
    }
  }, 480);
}

// ==========================================================================
// MOTOR DE CÁLCULO DE PRECIOS EXACTO (KÖDE)
// Reglas:
// - 1er perfume: $20 (Normal) o $25 (Extra Shot)
// - Perfumes adicionales: $15 (Normal) o $20 (Extra Shot)
// - Jerarquía: Siempre se toma primero la unidad más cara (Extra Shot) como referencia principal.
// ==========================================================================
function calculateOrderPricing() {
  const bottles = [];
  cart.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      bottles.push({
        extraShot: item.extraShot,
        name: item.name,
        code: item.code
      });
    }
  });

  if (bottles.length === 0) {
    return {
      total: 0,
      totalCount: 0,
      extraCount: 0,
      normalCount: 0,
      firstBottlePrice: 0,
      firstBottleExtra: false,
      additionalExtraCount: 0,
      additionalNormalCount: 0
    };
  }

  // Ordenar para cobrar primero la más cara (Extra Shot primero)
  bottles.sort((a, b) => (b.extraShot ? 1 : 0) - (a.extraShot ? 1 : 0));

  const hasPromo343 = bottles.some(b => b.code === '343');

  let total = 0;
  const firstBottleExtra = bottles[0].extraShot;
  // Promoción 343: si la orden incluye 343, Extra Shot queda siempre a $20 (no hay cobro de $25)
  const firstBottlePrice = firstBottleExtra ? (hasPromo343 ? 20 : 25) : 20;
  total += firstBottlePrice;

  let additionalExtraCount = 0;
  let additionalNormalCount = 0;

  for (let i = 1; i < bottles.length; i++) {
    if (bottles[i].extraShot) {
      additionalExtraCount++;
      total += 20;
    } else {
      additionalNormalCount++;
      total += 15;
    }
  }

  const extraCount = bottles.filter(b => b.extraShot).length;
  const normalCount = bottles.filter(b => !b.extraShot).length;

  return {
    total,
    totalCount: bottles.length,
    extraCount,
    normalCount,
    firstBottlePrice,
    firstBottleExtra,
    additionalExtraCount,
    additionalNormalCount,
    hasPromo343
  };
}

// Actualizar desglose y totales del carrito sin recargar imágenes
function updateCartTotalsAndPricing() {
  const breakdownContainer = document.getElementById('pricing-breakdown');
  const totalAmountElem = document.getElementById('cart-total-amount');
  const savingsElem = document.getElementById('cart-total-savings');

  if (cart.length === 0) {
    if (breakdownContainer) breakdownContainer.innerHTML = '';
    if (totalAmountElem) totalAmountElem.textContent = '$0.00';
    if (savingsElem) {
      savingsElem.textContent = '';
      savingsElem.style.display = 'none';
    }
    return;
  }

  const pricing = calculateOrderPricing();

  if (breakdownContainer) {
    let rowsHtml = '';
    const firstLabel = (pricing.hasPromo343 && pricing.firstBottleExtra)
      ? '1ra unidad (Extra Shot - Oferta Kódigo 343):'
      : `1ra unidad (${pricing.firstBottleExtra ? 'Extra Shot 45%' : 'Normal 30%'}):`;
    rowsHtml += `
      <div class="breakdown-line">
        <span>${firstLabel}</span>
        <strong>$${pricing.firstBottlePrice.toFixed(2)}</strong>
      </div>
    `;

    if (pricing.additionalExtraCount > 0) {
      const sub = pricing.additionalExtraCount * 20;
      rowsHtml += `
        <div class="breakdown-line">
          <span>${pricing.additionalExtraCount} adicional(es) Extra Shot ($20.00 c/u):</span>
          <strong>$${sub.toFixed(2)}</strong>
        </div>
      `;
    }

    if (pricing.additionalNormalCount > 0) {
      const sub = pricing.additionalNormalCount * 15;
      rowsHtml += `
        <div class="breakdown-line">
          <span>${pricing.additionalNormalCount} adicional(es) Normal ($15.00 c/u):</span>
          <strong>$${sub.toFixed(2)}</strong>
        </div>
      `;
    }

    if (pricing.hasPromo343 && pricing.extraCount > 0) {
      rowsHtml += `
        <div class="breakdown-line promo-gold-line">
          <span>✨ Oferta Kódigo 343: Extra Shot Gratis ($20 c/u en todas)</span>
          <strong>Ahorras $5.00</strong>
        </div>
      `;
    }

    rowsHtml += `
      <div class="breakdown-line">
        <span>Envío:</span>
        <strong style="color: #15803d;">Gratuito</strong>
      </div>
    `;

    breakdownContainer.innerHTML = rowsHtml;
  }

  if (totalAmountElem) {
    totalAmountElem.textContent = `$${pricing.total.toFixed(2)}`;
  }

  if (savingsElem) {
    const baseSingleTotal = (pricing.extraCount * 25) + (pricing.normalCount * 20);
    const savings = Math.max(0, baseSingleTotal - pricing.total);
    if (pricing.totalCount > 1 && savings > 0) {
      savingsElem.textContent = `Ahorras $${savings.toFixed(2)} llevando varios`;
      savingsElem.style.display = 'block';
    } else {
      savingsElem.textContent = '';
      savingsElem.style.display = 'none';
    }
  }

  updateAllCardPrices();
}

// Renderizar Carrito (Apple Sheet)
function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="dialog-empty">Tu bolsa está vacía.</p>';
    updateCartTotalsAndPricing();
    return;
  }

  // Comprobar filas existentes para reutilizar elementos DOM y evitar recarga/parpadeo de imágenes
  const existingRows = Array.from(container.querySelectorAll('.cart-row[data-cart-item-id]'));
  const existingMap = new Map();
  existingRows.forEach(r => existingMap.set(r.getAttribute('data-cart-item-id'), r));

  const currentIds = cart.map(i => i.cartItemId);
  const existingIds = existingRows.map(r => r.getAttribute('data-cart-item-id'));
  const isSameList = currentIds.length === existingIds.length && currentIds.every((id, idx) => id === existingIds[idx]);

  if (isSameList) {
    cart.forEach(item => {
      const row = existingMap.get(item.cartItemId);
      if (!row) return;
      const normalBtn = row.querySelector('.cart-conc-pill[data-conc="normal"]');
      const extraBtn = row.querySelector('.cart-conc-pill[data-conc="extra"]');
      if (normalBtn) normalBtn.classList.toggle('active', !item.extraShot);
      if (extraBtn) extraBtn.classList.toggle('active', item.extraShot);
      const valSpan = row.querySelector('.stepper-val');
      if (valSpan) valSpan.textContent = item.quantity;
    });
    updateCartTotalsAndPricing();
    return;
  }

  // Lista de items con estructura que preserva el título y provee botones táctiles claros
  container.innerHTML = cart.map(item => {
    return `
      <div class="cart-row" data-cart-item-id="${item.cartItemId}">
        <img src="${item.image}" alt="${item.name}" class="cart-row-img" width="64" height="64" onerror="this.src='images/kode_cover.png'">
        <div class="cart-row-content">
          <div class="cart-row-top">
            <div class="cart-row-titles">
              <span class="cart-row-code">KÓDIGO ${item.code}</span>
              <h4 class="cart-row-name">${item.name}</h4>
            </div>
            <button type="button" class="cart-row-delete" onclick="removeCartItem('${item.cartItemId}')" aria-label="Eliminar producto">✕</button>
          </div>
          <div class="cart-row-bottom">
            <div class="cart-conc-pills" role="group" aria-label="Concentración">
              <button type="button" 
                      class="cart-conc-pill ${!item.extraShot ? 'active' : ''}" 
                      data-conc="normal"
                      onclick="setCartItemConcentration('${item.cartItemId}', false)">
                Normal (30%)
              </button>
              <button type="button" 
                      class="cart-conc-pill ${item.extraShot ? 'active' : ''}" 
                      data-conc="extra"
                      onclick="setCartItemConcentration('${item.cartItemId}', true)">
                Extra Shot (45%)
              </button>
            </div>
            <div class="cart-row-stepper">
              <button type="button" class="stepper-btn" onclick="changeCartQty('${item.cartItemId}', -1)" aria-label="Disminuir">−</button>
              <span class="stepper-val">${item.quantity}</span>
              <button type="button" class="stepper-btn" onclick="changeCartQty('${item.cartItemId}', 1)" aria-label="Aumentar">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateCartTotalsAndPricing();
}

window.changeCartQty = function(cartItemId, delta) {
  const index = cart.findIndex(ci => ci.cartItemId === cartItemId);
  if (index === -1) return;

  if (delta < 0) {
    cart.splice(index, 1);
    saveCart();
    const row = document.querySelector(`.cart-row[data-cart-item-id="${cartItemId}"]`);
    if (row) {
      row.remove();
      if (cart.length === 0) {
        renderCart();
      } else {
        updateCartTotalsAndPricing();
      }
    } else {
      renderCart();
    }
  } else if (delta > 0) {
    const src = cart[index];
    const newUid = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    cart.push({
      ...src,
      cartItemId: newUid,
      quantity: 1
    });
    saveCart();
    renderCart();
  }
};

window.setCartItemConcentration = function(cartItemId, isExtra) {
  const item = cart.find(ci => ci.cartItemId === cartItemId);
  if (!item) return;
  item.extraShot = !!isExtra;
  saveCart();

  // Actualización quirúrgica inmediata sin recargar imágenes ni DOM completo
  const row = document.querySelector(`.cart-row[data-cart-item-id="${cartItemId}"]`);
  if (row) {
    const normalBtn = row.querySelector('.cart-conc-pill[data-conc="normal"]');
    const extraBtn = row.querySelector('.cart-conc-pill[data-conc="extra"]');
    if (normalBtn) normalBtn.classList.toggle('active', !item.extraShot);
    if (extraBtn) extraBtn.classList.toggle('active', item.extraShot);
    updateCartTotalsAndPricing();
  } else {
    renderCart();
  }
};

window.removeCartItem = function(cartItemId) {
  cart = cart.filter(ci => ci.cartItemId !== cartItemId);
  saveCart();
  const row = document.querySelector(`.cart-row[data-cart-item-id="${cartItemId}"]`);
  if (row) {
    row.remove();
    if (cart.length === 0) {
      renderCart();
    } else {
      updateCartTotalsAndPricing();
    }
  } else {
    renderCart();
  }
};

let selectedPaymentMethod = null;

function setupDeliveryAndPayment() {
  const toggleBtn = document.getElementById('toggle-delivery-btn');
  const collapse = document.getElementById('delivery-fields-collapse');
  const arrow = document.getElementById('delivery-arrow');
  const custNameInput = document.getElementById('customer-name');
  const delivNameInput = document.getElementById('delivery-name');

  if (toggleBtn && collapse) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = collapse.style.display === 'none';
      collapse.style.display = isHidden ? 'block' : 'none';
      toggleBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
    });
  }

  // Sincronizar nombre de cliente con nombre de entrega
  if (custNameInput && delivNameInput) {
    if (custNameInput.value && !delivNameInput.value) {
      delivNameInput.value = custNameInput.value;
    }
    custNameInput.addEventListener('input', () => {
      delivNameInput.value = custNameInput.value;
    });
    delivNameInput.addEventListener('input', () => {
      custNameInput.value = delivNameInput.value;
      try {
        localStorage.setItem('kode_customer_name', delivNameInput.value);
      } catch (e) {}
    });
  }

  // Selección opcional de métodos de pago
  const paymentBtns = document.querySelectorAll('.payment-opt-btn');
  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const method = btn.getAttribute('data-method');
      if (selectedPaymentMethod === method) {
        selectedPaymentMethod = null;
        btn.classList.remove('active');
      } else {
        paymentBtns.forEach(b => b.classList.remove('active'));
        selectedPaymentMethod = method;
        btn.classList.add('active');
      }
    });
  });
}

// Enviar pedido por WhatsApp
function sendOrderViaWhatsApp() {
  if (cart.length === 0) {
    alert('Tu bolsa está vacía. Selecciona al menos una fragancia.');
    return;
  }

  const pricing = calculateOrderPricing();
  const custNameInput = document.getElementById('customer-name');
  const delivNameInput = document.getElementById('delivery-name');
  const delivPhoneInput = document.getElementById('delivery-phone');
  const delivAddressInput = document.getElementById('delivery-address');
  const delivRefInput = document.getElementById('delivery-reference');
  const delivMuniInput = document.getElementById('delivery-municipality');
  const delivDeptInput = document.getElementById('delivery-department');

  const customerName = (delivNameInput && delivNameInput.value.trim()) || 
                       (custNameInput && custNameInput.value.trim()) || '';
  const phone = delivPhoneInput ? delivPhoneInput.value.trim() : '';
  const address = delivAddressInput ? delivAddressInput.value.trim() : '';
  const reference = delivRefInput ? delivRefInput.value.trim() : '';
  const municipality = delivMuniInput ? delivMuniInput.value.trim() : '';
  const department = delivDeptInput ? delivDeptInput.value.trim() : '';

  // 1. Saludo inicial exacto solicitado
  let message = `Hola, quiero hacer un pedido desde el sitio web.\n\n`;

  // 2. Lo que lleva (productos, desglose y total)
  let itemsText = '';
  cart.forEach(item => {
    const conc = item.extraShot ? 'Extra Shot 45%' : 'Normal 30%';
    const inspiration = item.reference || item.name;
    const brandPart = item.brand ? ` (${item.brand})` : '';
    itemsText += `• *${item.code} Inspirada en ${inspiration}${brandPart}*\n  [${conc}] x${item.quantity}\n\n`;
  });
  message += `*Productos:*\n${itemsText}`;

  let breakdownText = '';
  if (pricing.hasPromo343 && pricing.extraCount > 0) {
    breakdownText += `• *Oferta Especial Kódigo 343:* Extra Shot Gratis a $20 c/u en todas\n`;
  }
  breakdownText += `• 1ra unidad (${pricing.firstBottleExtra ? 'Extra Shot' : 'Normal'}): $${pricing.firstBottlePrice.toFixed(2)}\n`;
  if (pricing.additionalExtraCount > 0) {
    breakdownText += `• ${pricing.additionalExtraCount} adicional(es) Extra Shot: $${(pricing.additionalExtraCount * 20).toFixed(2)} ($20 c/u)\n`;
  }
  if (pricing.additionalNormalCount > 0) {
    breakdownText += `• ${pricing.additionalNormalCount} adicional(es) Normal: $${(pricing.additionalNormalCount * 15).toFixed(2)} ($15 c/u)\n`;
  }
  breakdownText += `• *Envío:* Gratuito\n`;

  message += `*Resumen de la orden:*\n${breakdownText}`;
  message += `*Total a pagar:* $${pricing.total.toFixed(2)}\n\n`;

  // 3. Información que haya llenado (Datos de entrega)
  const hasDeliveryDetails = phone || address || reference || municipality || department;
  if (hasDeliveryDetails) {
    message += `*Datos de entrega:*\n`;
    if (customerName) message += `• *Nombre:* ${customerName}\n`;
    if (phone) message += `• *Teléfono WhatsApp (C807):* ${phone}\n`;
    if (address) message += `• *Dirección:* ${address}\n`;
    if (reference) message += `• *Punto de referencia:* ${reference}\n`;
    if (municipality) message += `• *Municipio:* ${municipality}\n`;
    if (department) message += `• *Departamento:* ${department}\n`;
    message += `\n`;
  } else if (customerName) {
    message += `*Cliente:* ${customerName}\n\n`;
  }

  // 4. Método de pago (opcional)
  if (selectedPaymentMethod) {
    let paymentPhrase = '';
    const m = selectedPaymentMethod.toLowerCase();
    if (m === 'transferencia') {
      paymentPhrase = 'y quiero pagar por transferencia';
    } else if (m === 'efectivo') {
      paymentPhrase = 'y quiero pagar en efectivo';
    } else if (m === 'tarjeta') {
      paymentPhrase = 'y quiero pagar con tarjeta';
    } else {
      paymentPhrase = `y quiero pagar por ${selectedPaymentMethod}`;
    }
    message += `${paymentPhrase}\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Rastreo de conversión clave: Carrito enviado a WhatsApp con datos completos
  try {
    if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
      window.KodeTracker.trackEvent('whatsapp_checkout', {
        total: pricing.total,
        itemsCount: cart.reduce((acc, i) => acc + (i.quantity || 1), 0),
        items: cart.map(i => ({
          code: i.code,
          name: i.name,
          brand: i.brand || '',
          extraShot: !!i.extraShot,
          qty: i.quantity || 1,
          inspiration: i.reference || i.name
        })),
        customerName: customerName || 'Sin especificar',
        phone: phone || '',
        address: address || '',
        reference: reference || '',
        municipality: municipality || '',
        department: department || '',
        paymentMethod: selectedPaymentMethod || 'No seleccionado'
      });
    }
  } catch (e) {}

  window.open(whatsappUrl, '_blank');
}

// ==========================================================================
// SHOWCASE 3D DE LA BOTELLA ESTILO APPLE (ROTACIÓN Y DESAPARICIÓN ELEGANTE)
// ==========================================================================
function initHero3DShowcase() {
  const bottleTop = document.getElementById('hero-bottle-top');
  const wrapper = document.getElementById('bottle-3d-wrapper');
  const canvas = document.getElementById('bottle-3d-canvas');
  const indicator = document.getElementById('scroll-indicator');

  if (!bottleTop || !wrapper || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const TOTAL_FRAMES = 36;
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let lastDrawnIndex = -1;

  function loadFrame(idx, isPriority = false) {
    const img = new Image();
    const pad = String(idx).padStart(2, '0');
    img.src = `images/turntable/frame_${pad}.webp`;
    img.onerror = () => {
      img.src = `images/turntable/frame_${pad}.jpg`;
    };
    img.onload = () => {
      loadedCount++;
      if (idx === 4 && lastDrawnIndex === -1) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnIndex = 4;
      }
    };
    frames[idx] = img;
  }

  // 1. Cargar el fotograma frontal inicial (frame 04) de inmediato para pintura instantánea
  loadFrame(4, true);

  // 2. Cargar los fotogramas restantes sin competir con el render inicial del catálogo
  const scheduleRemaining = typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback
    : (cb) => setTimeout(cb, 40);

  scheduleRemaining(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i !== 4) loadFrame(i);
    }
  });

  // Click en flechas para deslizar suavemente y activar la animación
  if (indicator) {
    indicator.addEventListener('click', () => {
      window.scrollTo({ top: 440, behavior: 'smooth' });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  // Micro-parallax interactivo con el cursor
  window.addEventListener('mousemove', (e) => {
    if (window.pageYOffset > 550) return;
    const { innerWidth, innerHeight } = window;
    targetMouseX = ((e.clientX / innerWidth) - 0.5) * 2;
    targetMouseY = ((e.clientY / innerHeight) - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    targetMouseX = 0;
    targetMouseY = 0;
  });

  // Distancia de scroll compacta y calibrada para completar el recorrido y salida
  const ANIM_SCROLL_DISTANCE = window.innerWidth < 768 ? 260 : 300;

  // Bucle de renderizado a 60/120fps con requestAnimationFrame
  function update3DFrame() {
    currentMouseX += (targetMouseX - currentMouseX) * 0.08;
    currentMouseY += (targetMouseY - currentMouseY) * 0.08;

    const urlParams = new URLSearchParams(window.location.search);
    const debugScroll = urlParams.get('testScroll');
    const scrollY = debugScroll !== null ? parseFloat(debugScroll) : (window.pageYOffset || document.documentElement.scrollTop || 0);

    const rawProgress = Math.min(Math.max(scrollY / ANIM_SCROLL_DISTANCE, 0), 1);

    // 1. Flechitas indicadoras: se desvanecen suavemente en los primeros 35px
    if (indicator) {
      const indOpacity = Math.max(0, 1 - (scrollY / 35));
      indicator.style.opacity = indOpacity.toFixed(2);
      indicator.style.pointerEvents = indOpacity > 0.05 ? 'auto' : 'none';
    }

    // 2. Rotación cilíndrica de fotogramas (de frame 4 a 35 en el primer 50% del recorrido)
    const rotProgress = Math.min(rawProgress / 0.50, 1);
    const rotEase = rotProgress * rotProgress * (3 - 2 * rotProgress);

    const baseScrollFrame = 4 + rotEase * (TOTAL_FRAMES - 1 - 4);
    const mouseFrameOffset = currentMouseX * 3.5;
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(baseScrollFrame + mouseFrameOffset)));

    const targetImg = frames[frameIndex];
    if (targetImg && targetImg.complete && frameIndex !== lastDrawnIndex) {
      ctx.drawImage(targetImg, 0, 0, canvas.width, canvas.height);
      lastDrawnIndex = frameIndex;
    }

    // 3. Animación de salida: gira más aún en 3D y se desliza hacia arriba para desaparecer
    let opacity = 1.0;
    let scale = 1.0;
    let exitUpSlide = 0;
    let exitSpinY = 0;
    let exitSpinZ = 0;

    if (rawProgress > 0.40) {
      const exitProgress = (rawProgress - 0.40) / 0.60;
      const exitEase = exitProgress * exitProgress * (3 - 2 * exitProgress);
      opacity = Math.max(0, 1 - Math.pow(exitProgress, 1.15));
      scale = 1 - (exitEase * 0.10);
      exitUpSlide = exitEase * 150; // Deslizándose hacia arriba para salir
      exitSpinY = exitEase * 55;    // Gira más aún durante la salida
      exitSpinZ = exitEase * -8;    // Leve inclinación dinámica al salir
    }

    const transY = -exitUpSlide;
    const transX = currentMouseX * 6;
    const rotX = currentMouseY * -2.5;
    const rotY = (currentMouseX * 3.5) + exitSpinY;
    const rotZ = (currentMouseX * -1.0) + exitSpinZ;

    wrapper.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    wrapper.style.opacity = opacity.toFixed(3);

    if (opacity <= 0.01) {
      wrapper.style.visibility = 'hidden';
      wrapper.style.pointerEvents = 'none';
    } else {
      wrapper.style.visibility = 'visible';
      wrapper.style.pointerEvents = 'auto';
    }

    requestAnimationFrame(update3DFrame);
  }

  requestAnimationFrame(update3DFrame);
}

