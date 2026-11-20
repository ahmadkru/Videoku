'use strict';

// Shared helpers for every page. No data leaves the browser.
window.Cakra = (() => {
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  let toastTimer;
  function toast(message) {
    let box = document.getElementById('toast');
    if (!box) {
      box = el('div');
      box.id = 'toast';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      document.body.append(box);
    }
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('show'), 3200);
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = el('a');
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function readJsonFile(file, maxBytes = 200000) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('Tidak ada berkas.'));
      if (file.size > maxBytes) return reject(new Error('Berkas terlalu besar.'));
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(reader.result)); } catch { reject(new Error('Berkas bukan JSON yang valid.')); }
      };
      reader.onerror = () => reject(new Error('Berkas tidak bisa dibaca.'));
      reader.readAsText(file);
    });
  }

  // Per-device convenience storage. Always optional: private windows may block it.
  const store = {
    get(key, fallback) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    },
  };

  const str = (v, max = 2000) => (typeof v === 'string' ? v.slice(0, max) : '');

  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return dateFmt.format(new Date(y, m - 1, d));
  }

  return { el, toast, download, readJsonFile, store, str, todayISO, formatDate };
})();
