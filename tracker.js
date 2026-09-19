/**
 * KöDE Scents - Analítica y Rastreo de Rendimiento (Ultra-Ligero y Seguro)
 * Totalmente compatible con iPhone (iOS Safari), Android y PC.
 * Cero bloqueos, no invasivo y asíncrono.
 */

(function () {
  'use strict';

  // Configuración de Firestore REST API (kode-scents)
  const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/kode-scents/databases/(default)/documents/analytics_events?key=AIzaSyARNtXYuz9SiCUBjpfe-Z-vIXe7_aHpmyE';

  // 1. Identificación de Sesión
  let sessionId = null;
  try {
    sessionId = sessionStorage.getItem('kode_session_id');
    if (!sessionId) {
      sessionId = 'kds_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      sessionStorage.setItem('kode_session_id', sessionId);
    }
  } catch (e) {
    sessionId = 'kds_' + Date.now().toString(36) + '_fallback';
  }

  // 2. Detección de Dispositivo
  function getDeviceType() {
    try {
      const ua = navigator.userAgent || navigator.vendor || window.opera || '';
      if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone / iOS';
      if (/Android/i.test(ua)) return 'Android';
      if (/Macintosh|Mac OS/i.test(ua)) return 'Mac Desktop';
      if (/Windows/i.test(ua)) return 'PC Windows';
      return 'PC / Desktop';
    } catch (e) {
      return 'PC / Desktop';
    }
  }

  // 3. Detección de Navegador
  function getBrowserName() {
    try {
      const ua = navigator.userAgent || '';
      if (/Instagram/i.test(ua)) return 'Instagram In-App';
      if (/FBAN|FBAV/i.test(ua)) return 'Facebook In-App';
      if (/TikTok/i.test(ua)) return 'TikTok In-App';
      if (/Edg/i.test(ua)) return 'Edge';
      if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
      if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
      if (/Firefox/i.test(ua)) return 'Firefox';
      return 'Navegador Web';
    } catch (e) {
      return 'Navegador Web';
    }
  }

  // 4. Detección de Fuente / Referrer y UTMs
  function getTrafficSource() {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source');
      const utmCampaign = params.get('utm_campaign');
      const utmMedium = params.get('utm_medium');

      const ref = document.referrer ? document.referrer.toLowerCase() : '';
      let sourceName = 'Directo / Enlace';

      if (utmSource) {
        sourceName = utmSource;
      } else if (ref.includes('instagram.com')) {
        sourceName = 'Instagram';
      } else if (ref.includes('facebook.com') || ref.includes('fb.com')) {
        sourceName = 'Facebook';
      } else if (ref.includes('tiktok.com')) {
        sourceName = 'TikTok';
      } else if (ref.includes('wa.me') || ref.includes('whatsapp.com')) {
        sourceName = 'WhatsApp';
      } else if (ref.includes('google.')) {
        sourceName = 'Google';
      } else if (ref) {
        try {
          const host = new URL(ref).hostname.replace('www.', '');
          sourceName = host;
        } catch (e) {
          sourceName = 'Referencia externa';
        }
      }

      return {
        source: sourceName,
        utmSource: utmSource || '',
        utmCampaign: utmCampaign || '',
        utmMedium: utmMedium || ''
      };
    } catch (e) {
      return { source: 'Directo', utmSource: '', utmCampaign: '', utmMedium: '' };
    }
  }

  // 5. Ubicación Geográfica (Caché en sessionStorage para no hacer llamadas repetidas)
  let geoInfo = { country: 'El Salvador', city: 'San Salvador' };
  try {
    const cached = sessionStorage.getItem('kode_geo');
    if (cached) {
      geoInfo = JSON.parse(cached);
    } else {
      // Intento silencioso y ultraligero con timeout de 2.5s (fallback seguro a El Salvador)
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 2500);
      fetch('https://freeipapi.com/api/json', { signal: ctrl.signal })
        .then(r => r.json())
        .then(data => {
          clearTimeout(tid);
          if (data && data.countryName) {
            geoInfo = {
              country: data.countryName,
              city: data.cityName || 'Ciudad'
            };
            sessionStorage.setItem('kode_geo', JSON.stringify(geoInfo));
          }
        })
        .catch(() => {
          clearTimeout(tid);
        });
    }
  } catch (e) {}

  const device = getDeviceType();
  const browser = getBrowserName();
  const traffic = getTrafficSource();

  // 6. Envío Robusto a Firestore
  function sendToFirestore(eventType, details = {}) {
    try {
      const payload = {
        fields: {
          type: { stringValue: String(eventType) },
          sessionId: { stringValue: String(sessionId) },
          device: { stringValue: String(device) },
          browser: { stringValue: String(browser) },
          country: { stringValue: String(geoInfo.country || 'Desconocido') },
          city: { stringValue: String(geoInfo.city || 'Desconocido') },
          referrer: { stringValue: String(traffic.source || 'Directo') },
          utmSource: { stringValue: String(traffic.utmSource || '') },
          utmCampaign: { stringValue: String(traffic.utmCampaign || '') },
          timestamp: { timestampValue: new Date().toISOString() },
          details: { stringValue: JSON.stringify(details || {}) }
        }
      };

      const bodyStr = JSON.stringify(payload);

      // Si el navegador soporta keepalive, garantiza entrega al cambiar de app (como al ir a WhatsApp)
      if (typeof fetch === 'function') {
        fetch(FIRESTORE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: bodyStr,
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      // Silencioso para no interferir con la navegación del usuario
    }
  }

  // 7. API Pública para la aplicación
  window.KodeTracker = {
    trackEvent: function (type, details) {
      sendToFirestore(type, details);
    }
  };

  // 8. Evento inicial de Sesión y Carga de Página
  try {
    const isNewSession = !sessionStorage.getItem('kode_session_logged');
    if (isNewSession) {
      sessionStorage.setItem('kode_session_logged', 'true');
      sendToFirestore('session_start', {
        screen: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language || ''
      });
    }

    sendToFirestore('page_view', {
      path: window.location.pathname,
      title: document.title
    });
  } catch (e) {}

  // 9. Rastreo de Clics e Interacciones Clave en la Tienda
  let searchDebounceTimer = null;
  function initListeners() {
    try {
      // Clic en Pestañas de Género
      const genderTabs = document.querySelectorAll('.gender-tab');
      genderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const gender = tab.dataset.gender || tab.textContent.trim();
          sendToFirestore('tab_click', { gender });
        });
      });

      // Búsquedas realizadas con debounce de 800ms
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(searchDebounceTimer);
          const val = e.target.value ? e.target.value.trim() : '';
          if (val.length >= 2) {
            searchDebounceTimer = setTimeout(() => {
              sendToFirestore('search', { query: val });
            }, 800);
          }
        });
      }

      // Clic en abrir carrito / bolsa
      const openCartBtn = document.getElementById('open-cart-btn');
      if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
          sendToFirestore('open_cart', {});
        });
      }

      // Delegación de clics en tarjetas de productos para métricas de interés
      document.addEventListener('click', (e) => {
        try {
          const card = e.target.closest('.product-card');
          if (card && !e.target.closest('.apple-buy-btn') && !e.target.closest('.pricing-toggle-wrap')) {
            const code = card.querySelector('.product-code')?.textContent?.trim() || '';
            const name = card.querySelector('.product-title')?.textContent?.trim() || '';
            sendToFirestore('product_view', { code, name });
          }
        } catch (err) {}
      }, { passive: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initListeners);
  } else {
    initListeners();
  }

  // 10. Medición Precisa de Tiempo en Página y Sesión
  const pageStartTime = Date.now();
  let maxSecondsReported = 0;

  function reportTimeSpent(isExit = false) {
    try {
      const elapsed = Math.round((Date.now() - pageStartTime) / 1000);
      if (elapsed >= 5 && elapsed > maxSecondsReported) {
        maxSecondsReported = elapsed;
        sendToFirestore(isExit ? 'session_exit' : 'engagement_heartbeat', { seconds: elapsed });
      }
    } catch (e) {}
  }

  // Heartbeats periódicos (15s, 30s, 60s, 120s, 180s, 300s, 600s...)
  const heartbeatInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - pageStartTime) / 1000);
    if ([15, 30, 45, 60, 90, 120, 180, 240, 300, 420, 600, 900].includes(elapsed) || (elapsed > 0 && elapsed % 60 === 0)) {
      reportTimeSpent(false);
    }
    if (elapsed >= 1800) {
      clearInterval(heartbeatInterval);
    }
  }, 5000);

  // Al salir o cambiar de pestaña en iPhone/Android/PC
  window.addEventListener('pagehide', () => reportTimeSpent(true));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      reportTimeSpent(true);
    }
  });

})();
