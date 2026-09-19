// ==========================================================================
// KÖDE — EXPERIENCIA DE DETALLE DE PRODUCTO (PRODUCT.JS)
// ==========================================================================

const WHATSAPP_NUMBER = '50378339470';
let currentPerfume = null;
let isExtraShot = true; // Por defecto seleccionada con extra shot siempre
let cart = [];

// Desactivar restauración automática nativa
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

// Manejador del botón "Catálogo" para volver exactamente a la posición previa
document.addEventListener('click', (e) => {
  const backLink = e.target.closest('.nav-back-link, .nav-brand');
  if (backLink) {
    if (window.history.length > 1 && (document.referrer === '' || document.referrer.includes(window.location.host))) {
      e.preventDefault();
      window.history.back();
    }
  }
});

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  loadCart();
  setupCartDialogEvents();
  await loadAndRenderProduct();
});

// Animación de confetti que nace directamente de la caja de promoción en el producto 343
function launchConfetti() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const promoBanner = document.querySelector('.product-promo-banner-343');
  const rect = promoBanner ? promoBanner.getBoundingClientRect() : null;

  const canvas = document.createElement('canvas');
  canvas.id = 'promo-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);

  const colors = ['#ffd700', '#d4af37', '#f59e0b', '#10b981', '#ffffff', '#eab308', '#38bdf8', '#ec4899'];
  const pieces = [];
  const count = Math.min(110, Math.max(65, Math.floor(width / 4)));

  // Punto de origen: exactamente de la caja que explica la promoción dentro del producto
  const originCenterX = rect ? rect.left + rect.width * 0.5 : width * 0.5;
  const originBaseY = rect ? rect.top + Math.min(45, rect.height * 0.3) : height * 0.4;
  const originSpreadX = rect ? rect.width * 0.7 : 220;

  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * originSpreadX;
    const angleRatio = offsetX / (originSpreadX * 0.5 || 1);
    const vx = angleRatio * (Math.random() * 7 + 4) + (Math.random() - 0.5) * 5;
    const vy = -(Math.random() * 12 + 6); // Impulso hacia arriba saliendo de la promoción

    pieces.push({
      x: originCenterX + offsetX,
      y: originBaseY + (Math.random() - 0.5) * 15,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: vx,
      vy: vy,
      gravity: 0.28,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  const startTime = Date.now();
  const duration = 3200;

  function frame() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      window.removeEventListener('resize', onResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const fadeStart = duration * 0.65;
    const globalAlpha = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / (duration - fadeStart) : 1;

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rotation += p.vRotation;

      ctx.save();
      ctx.globalAlpha = Math.max(0, globalAlpha * p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// Precios dinámicos en página de detalle según estado del carrito (Oferta si ya lleva al menos 1)
function getDetailPriceDisplay(extra) {
  const totalInCart = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const hasItems = totalInCart > 0;
  const isPromo343 = currentPerfume && currentPerfume.code === '343';

  if (hasItems) {
    if (extra) {
      return {
        mainHtml: '<span class="detail-price-strike">$25.00</span><span class="detail-price-deal">$20.00</span>',
        subPrice: 'Oferta por 2da+ unidad aplicada',
        badgeNotice: '🎉 Oferta activa: Extra Shot a $20.00',
        badgeColor: '#15803d',
        badgeBorder: 'rgba(21, 128, 61, 0.25)',
        badgeBg: '#f0fdf4',
        hint: '+$5 c/u (45% concentración)'
      };
    } else {
      return {
        mainHtml: '<span class="detail-price-strike">$20.00</span><span class="detail-price-deal">$15.00</span>',
        subPrice: 'Oferta por 2da+ unidad aplicada',
        badgeNotice: '🎉 Oferta activa: Formulación clásica a $15.00',
        badgeColor: '#15803d',
        badgeBorder: 'rgba(21, 128, 61, 0.25)',
        badgeBg: '#f0fdf4',
        hint: 'Sin recargo de concentración'
      };
    }
  }

  if (isPromo343) {
    return {
      mainHtml: extra ? '<span class="detail-price-strike">$25.00</span><span class="detail-price-deal">$20.00</span>' : '$20.00',
      subPrice: 'o $15.00 adicional c/u',
      badgeNotice: extra ? '🎉 45% Extra Shot GRATIS ($20.00)' : '30% Formulación clásica ($20.00)',
      badgeColor: extra ? '#15803d' : '#6e6e73',
      badgeBorder: extra ? 'rgba(21, 128, 61, 0.25)' : 'rgba(0, 0, 0, 0.08)',
      badgeBg: extra ? '#f0fdf4' : '#f5f5f7',
      hint: extra ? '¡Extra Shot GRATIS por ser el más vendido!' : 'Mismo precio: ¡Aprovecha el Extra Shot gratis!'
    };
  } else if (extra) {
    return {
      mainHtml: '$25.00',
      subPrice: 'o $20.00 adicional c/u',
      badgeNotice: '45% Extra Shot activo',
      badgeColor: '#15803d',
      badgeBorder: 'rgba(21, 128, 61, 0.25)',
      badgeBg: '#f0fdf4',
      hint: '+$5 c/u (45% concentración)'
    };
  } else {
    return {
      mainHtml: '$20.00',
      subPrice: 'o $15.00 adicional c/u',
      badgeNotice: '30% Formulación clásica',
      badgeColor: '#6e6e73',
      badgeBorder: 'rgba(0, 0, 0, 0.08)',
      badgeBg: '#f5f5f7',
      hint: 'Sin recargo de concentración'
    };
  }
}

// Cargar producto según parámetro de URL (?k=343 o ?id=kode-343)
async function loadAndRenderProduct() {
  const root = document.getElementById('product-content');
  if (!root) return;

  // 1. Obtener catálogo
  let catalog = [];
  if (typeof window !== 'undefined' && Array.isArray(window.CATALOG_DATA) && window.CATALOG_DATA.length > 0) {
    catalog = window.CATALOG_DATA;
  } else {
    try {
      const res = await fetch('perfumes.json?v=' + Date.now());
      if (res.ok) {
        catalog = await res.json();
      }
    } catch (e) {
      console.error('Error cargando catálogo:', e);
    }
  }

  if (!catalog || catalog.length === 0) {
    root.innerHTML = `
      <div class="empty-showcase">
        <h3>No se pudo cargar el catálogo</h3>
        <p><a href="index.html" class="nav-back-link">Volver al catálogo</a></p>
      </div>
    `;
    return;
  }

  // 2. Extraer código o ID de la URL
  const params = new URLSearchParams(window.location.search);
  const codeParam = (params.get('k') || params.get('code') || params.get('id') || '').trim();

  // Buscar por código o por ID
  let found = null;
  if (codeParam) {
    found = catalog.find(p => String(p.code) === codeParam || p.id === codeParam || p.id === `kode-${codeParam}`);
  }

  // Si no se encuentra o no se pasó parámetro, mostrar el top 1
  if (!found) {
    found = catalog[0]; // Kódigo 343 Sauvage Elixir
  }

  currentPerfume = found;
  document.title = `KöDE — Kódigo ${found.code}`;

  // Determinar si es Top 1, Top 2 o Top 3
  const isPromo343 = found.code === '343';
  const sortedBySales = [...catalog].sort((a, b) => (b.sales || 0) - (a.sales || 0));
  const rankIndex = sortedBySales.findIndex(p => p.code === found.code);
  let topBadgeHtml = '';
  if (isPromo343) {
    topBadgeHtml = `<div class="top-seller-badge badge-special-offer"><span class="badge-rank">Oferta Especial</span><span class="badge-desc"> Más Vendido</span></div>`;
  } else if (rankIndex === 0) {
    topBadgeHtml = `<div class="top-seller-badge badge-top-1"><span class="badge-rank">Top 1</span><span class="badge-desc"> Más Vendido</span></div>`;
  } else if (rankIndex === 1) {
    topBadgeHtml = `<div class="top-seller-badge badge-top-2"><span class="badge-rank">Top 2</span><span class="badge-desc"> Más Vendido</span></div>`;
  } else if (rankIndex === 2) {
    topBadgeHtml = `<div class="top-seller-badge badge-top-3"><span class="badge-rank">Top 3</span><span class="badge-desc"> Más Vendido</span></div>`;
  }

  // Badge de género (Hombre / Mujer / Unisex)
  const genderKey = (found.gender || 'hombre').toLowerCase();
  const genderLabel = genderKey === 'mujer' ? 'Mujer' : (genderKey === 'unisex' ? 'Unisex' : 'Hombre');
  const genderBadgeHtml = `<span class="fragrance-gender-badge gender-badge-${genderKey}">${genderLabel}</span>`;

  // Banner promocional para Kódigo 343
  const promoBannerHtml = isPromo343 ? `
    <div class="product-promo-banner-343">
      <div class="promo-banner-header">
        <span class="promo-banner-tag">⭐ Oferta Especial</span>
        <span class="promo-banner-reason">Por ser el perfume más vendido</span>
      </div>
      <h2 class="promo-banner-title">EXTRA SHOT (45%) TOTALMENTE GRATIS</h2>
      <p class="promo-banner-text">
        Por ser nuestro perfume #1 más vendido, en este <strong>Kódigo 343</strong> la concentración <strong>Extra Shot (45%)</strong> queda siempre a <strong>$20.00</strong> (a precio de Normal, te ahorras los +$5).
      </p>
      <div class="promo-banner-bonus">
        <svg class="promo-bonus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span><strong>Promoción en tu orden:</strong> Si llevas este perfume y agregas otros con Extra Shot, <strong>¡todas las fragancias con Extra Shot te quedan a $20.00 c/u!</strong></span>
      </div>
    </div>
  ` : '';

  // 3. Renderizar Acordes Olfativos
  const accords = found.accords || [];
  const accordsHtml = accords.map(acc => `
    <div class="accord-item">
      <span class="accord-name">${acc.name}</span>
      <div class="accord-track">
        <div class="accord-fill" style="width: ${acc.percentage}%;"></div>
      </div>
    </div>
  `).join('');

  // 4. Renderizar Pirámide Olfativa (Salida, Corazón, Fondo)
  const pyramid = found.pyramid || { top: [], heart: [], base: [] };

  function renderTier(tierTitle, notes) {
    if (!notes || notes.length === 0) return '';
    const items = notes.map(n => `
      <div class="note-item">
        <div class="note-img-wrap">
          <img src="${n.image}" alt="${n.name}" class="note-img" loading="lazy" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='https://raw.githubusercontent.com/dvd19981029-debug/catalogo-kode-2026/main/'+this.getAttribute('src');}">
        </div>
        <span class="note-name">${n.name}</span>
      </div>
    `).join('');

    return `
      <div class="pyramid-tier">
        <div class="tier-label-wrap">
          <span class="tier-title">${tierTitle}</span>
        </div>
        <div class="notes-items-wrap">
          ${items}
        </div>
      </div>
    `;
  }

  const pyramidHtml = `
    <div class="pyramid-block">
      ${renderTier('Salida', pyramid.top)}
      ${renderTier('Corazón', pyramid.heart)}
      ${renderTier('Fondo', pyramid.base)}
    </div>
  `;

  window.updateDetailPriceDisplay = function() {
    const priceAmount = document.getElementById('detail-price-amount');
    const priceSub = document.getElementById('detail-price-sub');
    const badgeNotice = document.getElementById('price-badge-notice');
    const hint = document.getElementById('concentration-hint');
    if (!priceAmount || !priceSub || !badgeNotice) return;

    const info = getDetailPriceDisplay(isExtraShot);
    priceAmount.innerHTML = info.mainHtml;
    priceSub.textContent = info.subPrice;
    badgeNotice.textContent = info.badgeNotice;
    badgeNotice.style.color = info.badgeColor;
    badgeNotice.style.borderColor = info.badgeBorder;
    badgeNotice.style.backgroundColor = info.badgeBg;
    if (hint) hint.textContent = info.hint;
  };

  const priceInfo = getDetailPriceDisplay(isExtraShot);
  const initPrice = priceInfo.mainHtml;
  const initSubPrice = priceInfo.subPrice;
  const initBadgeNotice = priceInfo.badgeNotice;
  const initHint = priceInfo.hint;

  // 5. Renderizar vista completa
  root.innerHTML = `
    <!-- Tarjeta Principal del Producto -->
    <section class="product-hero-card">
      <!-- Fila Superior: Botella a la izquierda y Acordes Olfativos al costado -->
      <div class="product-hero-top">
        <div class="detail-stage-box">
          ${topBadgeHtml}
          ${genderBadgeHtml}
          <picture>
            <source srcset="images/kode/kode_${found.code}.webp" type="image/webp">
            <img 
              src="images/kode/kode_${found.code}.jpg" 
              alt="Kódigo ${found.code}" 
              class="detail-bottle-img"
              onerror="this.onerror=null;this.src='images/kode_cover.png'"
            >
          </picture>
        </div>

        <div class="product-col-accords">
          <h2 class="olfactory-section-title">Acordes Principales</h2>
          <div class="accords-list">
            ${accordsHtml}
          </div>
        </div>
      </div>

      <!-- Nombre del Perfume (Kódigo), Inspiración y Botones de Compra -->
      <div class="detail-buy-section">
        <div class="detail-info-box">
          <h1 class="detail-title">Kódigo ${found.code}</h1>
          <p class="detail-inspiration">
            Inspirado en <strong>${found.reference}</strong> <span class="detail-brand">(${found.brand})</span>
          </p>
        </div>

        ${promoBannerHtml}

        <div class="detail-concentration-section">
          <div class="concentration-header-row">
            <span class="concentration-label">Concentración de fragancia:</span>
            <span class="concentration-promo-hint" id="concentration-hint">${initHint}</span>
          </div>

          <div class="detail-segmented-control ${isExtraShot ? 'is-extra' : ''}" id="detail-segmented-control" role="group">
            <div class="detail-segment-slider" aria-hidden="true"></div>
            <button 
              type="button" 
              id="btn-opt-normal" 
              class="detail-segment-btn ${!isExtraShot ? 'active' : ''}" 
              onclick="setProductConcentration(false)"
            >
              <span class="seg-title">Normal (30%)</span>
              <span class="seg-desc">Fijación clásica diaria</span>
            </button>
            <button 
              type="button" 
              id="btn-opt-extra" 
              class="detail-segment-btn segment-extra ${isExtraShot ? 'active' : ''}" 
              onclick="setProductConcentration(true)"
            >
              <div class="seg-title-row">
                <span class="seg-title">Extra Shot (45%)</span>
                <span class="detail-badge-green">${isPromo343 ? 'GRATIS' : '+$5'}</span>
              </div>
              <span class="seg-desc">Máxima fijación y estela</span>
            </button>
          </div>
        </div>

        <div class="detail-price-panel">
          <div class="price-unit-col">
            <span id="detail-price-amount" class="detail-price-main">
              ${initPrice}
            </span>
            <span id="detail-price-sub" class="detail-price-sub">
              ${initSubPrice}
            </span>
          </div>
          <span class="price-extra-badge" id="price-badge-notice">
            ${initBadgeNotice}
          </span>
        </div>

        <div class="detail-actions-row">
          <button type="button" class="btn-add-cart-large ${cart.some(ci => (ci.productId === found.id || ci.id === found.id) && ci.extraShot === isExtraShot) ? 'in-cart' : ''}" id="btn-add-to-cart" onclick="addProductToCart()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span id="btn-add-text">${(() => {
              const q = cart.filter(ci => (ci.productId === found.id || ci.id === found.id) && ci.extraShot === isExtraShot).length;
              return q > 0 ? (q === 1 ? '✓ Ya agregada (1)' : `✓ Ya agregadas (${q})`) : 'Agregar al Carrito';
            })()}</span>
          </button>

          <a href="#" class="btn-whatsapp-direct" id="btn-whatsapp-direct" onclick="orderCurrentViaWhatsApp(event)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>Pedir ya por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Sección Inferior: Pirámide Olfativa Desplegada, Experiencia Sensorial y Garantías -->
    <section class="product-bottom-card">
      <div class="pyramid-section-wrap">
        <h2 class="olfactory-section-title">Pirámide Olfativa</h2>
        ${pyramidHtml}
      </div>

      <div class="sensory-box">
        <h2 class="sensory-title">Experiencia Sensorial</h2>
        <p class="sensory-text">${found.description}</p>
      </div>

      <div class="detail-trust-row">
        <div class="trust-item">
          <span class="trust-icon">📦</span>
          <span class="trust-text">Envío a todo El Salvador con C807</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">💵</span>
          <span class="trust-text">Pago contra entrega en efectivo o transferencia</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">✨</span>
          <span class="trust-text">Fijación de alta perfumería francesa</span>
        </div>
      </div>
    </section>
  `;

  if (isPromo343) {
    setTimeout(launchConfetti, 220);
  }
}

// Selector de concentración (Normal vs Extra Shot)
window.setProductConcentration = function(extra) {
  isExtraShot = extra;

  const control = document.getElementById('detail-segmented-control');
  if (control) {
    control.classList.toggle('is-extra', extra);
  }

  const btnNormal = document.getElementById('btn-opt-normal');
  const btnExtra = document.getElementById('btn-opt-extra');
  const priceAmount = document.getElementById('detail-price-amount');
  const priceSub = document.getElementById('detail-price-sub');
  const badgeNotice = document.getElementById('price-badge-notice');
  const hint = document.getElementById('concentration-hint');

  if (btnNormal && btnExtra) {
    btnNormal.classList.toggle('active', !extra);
    btnExtra.classList.toggle('active', extra);
  }

  if (priceAmount && priceSub && badgeNotice) {
    priceAmount.style.transition = 'transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.16s ease';
    priceSub.style.transition = 'transform 0.16s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.16s ease';
    priceAmount.style.transform = 'scale(0.92)';
    priceAmount.style.opacity = '0.35';
    priceSub.style.opacity = '0.35';

    setTimeout(() => {
      const info = getDetailPriceDisplay(extra);
      priceAmount.innerHTML = info.mainHtml;
      priceSub.textContent = info.subPrice;
      badgeNotice.textContent = info.badgeNotice;
      badgeNotice.style.color = info.badgeColor;
      badgeNotice.style.borderColor = info.badgeBorder;
      badgeNotice.style.backgroundColor = info.badgeBg;
      if (hint) hint.textContent = info.hint;

      priceAmount.style.transform = 'scale(1)';
      priceAmount.style.opacity = '1';
      priceSub.style.opacity = '1';
    }, 85);
  }

  updateProductBuyButton();
};

function updateProductBuyButton() {
  const btn = document.getElementById('btn-add-to-cart');
  const btnText = document.getElementById('btn-add-text');
  if (!btn || !btnText || !currentPerfume) return;

  const qty = cart.filter(ci => (ci.productId === currentPerfume.id || ci.id === currentPerfume.id) && ci.extraShot === isExtraShot).length;

  if (qty > 0) {
    btnText.textContent = qty === 1 ? '✓ Ya agregada (1)' : `✓ Ya agregadas (${qty})`;
    btn.classList.add('in-cart');
  } else {
    btnText.textContent = 'Agregar al Carrito';
    btn.classList.remove('in-cart');
  }
}

// Agregar a la bolsa
window.addProductToCart = function() {
  if (!currentPerfume) return;

  const newUid = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
  cart.push({
    cartItemId: newUid,
    productId: currentPerfume.id,
    code: currentPerfume.code,
    name: currentPerfume.name,
    reference: currentPerfume.reference,
    brand: currentPerfume.brand,
    image: currentPerfume.image,
    extraShot: isExtraShot,
    quantity: 1
  });

  saveCart();
  updateProductBuyButton();
  if (window.updateDetailPriceDisplay) window.updateDetailPriceDisplay();

  // Rastreo seguro de adición a la bolsa
  try {
    if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
      window.KodeTracker.trackEvent('add_to_cart', {
        code: currentPerfume.code,
        name: currentPerfume.name,
        brand: currentPerfume.brand || '',
        extraShot: isExtraShot
      });
    }
  } catch (e) {}

  // Feedback háptico en el botón
  const btn = document.getElementById('btn-add-to-cart');
  if (btn) {
    btn.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)';
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1.03)';
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

// Pedido instantáneo por WhatsApp para este producto
window.orderCurrentViaWhatsApp = function(event) {
  if (event) event.preventDefault();
  if (!currentPerfume) return;

  const isPromo343 = currentPerfume.code === '343';
  const conc = isPromo343
    ? (isExtraShot ? 'Extra Shot 45% (¡GRATIS por Oferta Especial!)' : 'Normal 30%')
    : (isExtraShot ? 'Extra Shot 45% (+$5.00)' : 'Normal 30%');
  const price = isPromo343 ? '$20.00' : (isExtraShot ? '$25.00' : '$20.00');

    const brandPart = currentPerfume.brand ? ` (${currentPerfume.brand})` : '';
    const inspiration = currentPerfume.reference || currentPerfume.name;
    const text = 
      `¡Hola KöDE El Salvador! Deseo ordenar la siguiente fragancia:\n\n` +
      `• *${currentPerfume.code} Inspirada en ${inspiration}${brandPart}*\n` +
      `  Concentración: *${conc}*\n` +
      `  Precio: *${price}*\n\n` +
    `Por favor confírmenme disponibilidad para coordinar la entrega con C807. ¡Muchas gracias!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  // Rastreo de conversión directa
  try {
    if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
      window.KodeTracker.trackEvent('whatsapp_checkout', {
        total: price === '$20.00' ? 20 : (isExtraShot && !isPromo343 ? 25 : 20),
        itemsCount: 1,
        items: [{
          code: currentPerfume.code,
          name: currentPerfume.name,
          brand: currentPerfume.brand || '',
          extraShot: isExtraShot,
          qty: 1,
          inspiration: currentPerfume.reference || currentPerfume.name
        }],
        customerName: 'Compra directa 1-clic',
        phone: '',
        address: '',
        reference: '',
        municipality: '',
        department: '',
        paymentMethod: 'Por coordinar'
      });
    }
  } catch (e) {}

  window.open(url, '_blank');
};

// ==========================================================================
// CARRITO COMPARTIDO Y MODAL DRAWER
// ==========================================================================

function saveCart() {
  try {
    localStorage.setItem('kode_cart_2026', JSON.stringify(cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
  updateCartBadge();
  updateProductBuyButton();
  if (window.updateDetailPriceDisplay) window.updateDetailPriceDisplay();
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
  updateProductBuyButton();
  if (window.updateDetailPriceDisplay) window.updateDetailPriceDisplay();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const countText = document.getElementById('cart-items-count-text');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  }

  if (countText) {
    countText.textContent = `${totalCount} ${totalCount === 1 ? 'producto' : 'productos'}`;
  }
}

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

function renderCart() {
  const container = document.getElementById('cart-items');
  const breakdownContainer = document.getElementById('pricing-breakdown');
  const totalAmountElem = document.getElementById('cart-total-amount');
  const savingsElem = document.getElementById('cart-total-savings');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="dialog-empty">Tu bolsa está vacía.</p>';
    if (breakdownContainer) breakdownContainer.innerHTML = '';
    if (totalAmountElem) totalAmountElem.textContent = '$0.00';
    if (savingsElem) {
      savingsElem.textContent = '';
      savingsElem.style.display = 'none';
    }
    if (window.updateDetailPriceDisplay) window.updateDetailPriceDisplay();
    return;
  }

  const pricing = calculateOrderPricing();

  // Lista de items
  container.innerHTML = cart.map(item => {
    const imgSrc = item.image || `images/kode/kode_${item.code}.webp`;
    return `
      <div class="cart-row">
        <img src="${imgSrc}" alt="${item.name}" class="cart-row-img" onerror="this.src='images/kode_cover.png'">
        <div class="cart-row-info">
          <div class="cart-row-code">KÓDIGO ${item.code}</div>
          <h4 class="cart-row-name">${item.name}</h4>
          <div class="cart-conc-toggle">
            <button type="button" 
                    class="cart-conc-btn ${!item.extraShot ? 'active' : ''}" 
                    onclick="setCartItemConcentration('${item.cartItemId}', false)">
              Normal (30%)
            </button>
            <button type="button" 
                    class="cart-conc-btn ${item.extraShot ? 'active' : ''}" 
                    onclick="setCartItemConcentration('${item.cartItemId}', true)">
              Extra Shot (45%)
            </button>
          </div>
        </div>
        <div class="cart-row-stepper">
          <button type="button" class="stepper-btn" onclick="changeCartQty('${item.cartItemId}', -1)" aria-label="Disminuir">−</button>
          <span class="stepper-val">${item.quantity}</span>
          <button type="button" class="stepper-btn" onclick="changeCartQty('${item.cartItemId}', 1)" aria-label="Aumentar">+</button>
        </div>
        <button type="button" class="cart-row-delete" onclick="removeCartItem('${item.cartItemId}')" aria-label="Eliminar producto">✕</button>
      </div>
    `;
  }).join('');

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

  if (window.updateDetailPriceDisplay) window.updateDetailPriceDisplay();
}

window.changeCartQty = function(cartItemId, delta) {
  const index = cart.findIndex(ci => ci.cartItemId === cartItemId);
  if (index === -1) return;

  if (delta < 0) {
    cart.splice(index, 1);
  } else if (delta > 0) {
    const src = cart[index];
    const newUid = 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    cart.push({
      ...src,
      cartItemId: newUid,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
};

window.setCartItemConcentration = function(cartItemId, isExtra) {
  const item = cart.find(ci => ci.cartItemId === cartItemId);
  if (!item) return;
  item.extraShot = !!isExtra;
  saveCart();
  renderCart();
};

window.removeCartItem = function(cartItemId) {
  cart = cart.filter(ci => ci.cartItemId !== cartItemId);
  saveCart();
  renderCart();
};

function openCartDialog() {
  const dialog = document.getElementById('cart-dialog');
  if (!dialog) return;
  renderCart();
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

function closeCartDialog() {
  const dialog = document.getElementById('cart-dialog');
  if (!dialog) return;
  if (typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

function setupCartDialogEvents() {
  const openBtn = document.getElementById('open-cart-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const dialog = document.getElementById('cart-dialog');
  const waBtn = document.getElementById('whatsapp-order-btn');

  if (openBtn) openBtn.addEventListener('click', openCartDialog);
  if (closeBtn) closeBtn.addEventListener('click', closeCartDialog);

  if (dialog) {
    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) closeCartDialog();
    });
  }

  if (waBtn) {
    waBtn.addEventListener('click', sendOrderViaWhatsApp);
  }

  setupDeliveryAndPayment();
}

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

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

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

  window.open(waUrl, '_blank');
}

// Pausa al tocar el carrusel en móviles y reanudación automática
document.addEventListener('DOMContentLoaded', () => {
  const fbTrack = document.querySelector('.fb-carousel-track');
  if (fbTrack) {
    let resumeTimer = null;
    fbTrack.addEventListener('touchstart', () => {
      fbTrack.style.animationPlayState = 'paused';
      clearTimeout(resumeTimer);
    }, { passive: true });

    fbTrack.addEventListener('touchend', () => {
      resumeTimer = setTimeout(() => {
        fbTrack.style.animationPlayState = 'running';
      }, 2000);
    }, { passive: true });
  }
});

