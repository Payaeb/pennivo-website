/* ════════════════════════════════════════════════════
   Pennivo landing page — client-side behavior
   Theme toggle (persists to localStorage) +
   GitHub Releases latest-version fetcher.
   No dependencies, no build step.
   ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const STORAGE_KEY = 'pennivo-theme';
  const GITHUB_REPO = 'Payaeb/pennivo';

  // ── Theme toggle ──────────────────────────────────
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function getCurrentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable — silently ignore */
    }
    updateToggleLabel(theme);
  }

  function updateToggleLabel(theme) {
    if (!toggleBtn) return;
    const next = theme === 'dark' ? 'light' : 'dark';
    toggleBtn.setAttribute('aria-label', `Switch to ${next} theme`);
    toggleBtn.setAttribute('title', `Switch to ${next} theme`);
  }

  // On first visit, respect prefers-color-scheme if no saved choice
  (function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (!saved && window.matchMedia) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      // Note: user asked the site to *start* in light by default, so we do
      // NOT auto-apply dark on first visit. We only honor the saved choice.
      // (The inline pre-paint script in index.html already handles this.)
    }

    updateToggleLabel(getCurrentTheme());
  })();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ── GitHub Releases: latest version + download link ──
  async function fetchLatestRelease() {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
        { headers: { Accept: 'application/vnd.github+json' } }
      );
      if (!res.ok) return;
      const data = await res.json();

      const version = data.tag_name || '';
      if (version) {
        document.querySelectorAll('#version-badge, #version-badge-2').forEach(
          (el) => (el.textContent = version)
        );
      }

      // Find Windows installer asset (.exe), prefer Setup/installer naming
      const assets = Array.isArray(data.assets) ? data.assets : [];
      const winAsset =
        assets.find(
          (a) => /\.exe$/i.test(a.name) && /setup|installer/i.test(a.name)
        ) || assets.find((a) => /\.exe$/i.test(a.name));

      if (winAsset && winAsset.browser_download_url) {
        const primary = document.getElementById('download-primary');
        const secondary = document.getElementById('download-secondary');
        if (primary) primary.href = winAsset.browser_download_url;
        if (secondary) secondary.href = winAsset.browser_download_url;
      }
    } catch (e) {
      /* Offline or rate-limited — fallback links in HTML still work */
    }
  }

  fetchLatestRelease();

  // ── Subtle scroll-reveal for feature cards ────────
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    document
      .querySelectorAll('.feature-card, .showcase-item')
      .forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });
  }
})();
