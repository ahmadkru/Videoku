'use strict';

(() => {
  const { el, toast, download, readJsonFile, store, str, todayISO, formatDate } = window.Cakra;
  const KEY = 'cakra.sertifikat.v1';
  const ISO = /^\d{4}-\d{2}-\d{2}$/;

  let state = { items: [], window: 6 };

  const list = document.querySelector('#certList');
  const summary = document.querySelector('#summary');
  const addForm = document.querySelector('#addForm');
  const windowSel = document.querySelector('#window');
  const remember = document.querySelector('#remember');
  const icsBtn = document.querySelector('#ics');
  const printBtn = document.querySelector('#printList');

  function sanitize(raw) {
    const items = Array.isArray(raw?.items) ? raw.items : [];
    return {
      window: [3, 6, 9, 12].includes(+raw?.window) ? +raw.window : 6,
      items: items.slice(0, 60)
        .map((c) => ({ id: str(c.id, 40) || newId(), nama: str(c.nama, 120).trim(), berlaku: ISO.test(c.berlaku) ? c.berlaku : '', catatan: str(c.catatan, 140) }))
        .filter((c) => c.nama && c.berlaku),
    };
  }
  function newId() {
    return (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^a-z0-9-]/gi, '');
  }

  const toUTC = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  function daysLeft(iso) { return Math.round((toUTC(iso) - toUTC(todayISO())) / 86400000); }
  function minusMonths(iso, months) {
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1 - months, 1));
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(d, last));
    return date.toISOString().slice(0, 10);
  }

  function status(c) {
    const left = daysLeft(c.berlaku);
    if (left < 0) return { cls: 'bad', text: 'Kedaluwarsa', detail: `habis ${-left} hari lalu` };
    if (c.berlaku <= minusMonths(todayISO(), -state.window) || left === 0) {
      return { cls: 'warn', text: 'Segera urus', detail: left === 0 ? 'habis hari ini' : `${left} hari lagi` };
    }
    return { cls: 'ok', text: 'Aman', detail: `${left} hari lagi` };
  }

  function persist() { if (remember.checked) store.set(KEY, state); }

  function render() {
    const items = state.items.slice().sort((a, b) => a.berlaku.localeCompare(b.berlaku));
    list.replaceChildren();
    const counts = { bad: 0, warn: 0, ok: 0 };
    for (const c of items) {
      const s = status(c);
      counts[s.cls]++;
      const li = el('li');
      const info = el('div', 'grow');
      info.append(el('b', '', c.nama), el('div', 'muted small', `Berlaku sampai ${formatDate(c.berlaku)} · ${s.detail}`));
      if (c.catatan) info.append(el('div', 'small', c.catatan));
      const del = el('button', 'link no-print', 'Hapus');
      del.type = 'button';
      del.dataset.id = c.id;
      del.setAttribute('aria-label', `Hapus ${c.nama}`);
      li.append(info, el('span', `tag ${s.cls}`, s.text), del);
      list.append(li);
    }
    if (!items.length) {
      list.append(el('li', 'muted', 'Belum ada sertifikat. Tambahkan lewat formulir.'));
      summary.textContent = 'Tambahkan sertifikat pertamamu untuk melihat status.';
    } else {
      const parts = [];
      if (counts.bad) parts.push(`${counts.bad} kedaluwarsa`);
      if (counts.warn) parts.push(`${counts.warn} perlu segera diurus`);
      if (counts.ok) parts.push(`${counts.ok} aman`);
      summary.textContent = `${items.length} sertifikat: ${parts.join(', ')}.`;
      summary.classList.toggle('warn', counts.bad + counts.warn > 0);
    }
    icsBtn.disabled = printBtn.disabled = !items.length;
  }

  // ---------- iCalendar ----------
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
  const ymd = (iso) => iso.replace(/-/g, '');
  function nextDay(iso) { return new Date(toUTC(iso) + 86400000).toISOString().slice(0, 10); }
  function fold(line) {
    const out = [];
    let rest = line;
    while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = ` ${rest.slice(74)}`; }
    out.push(rest);
    return out.join('\r\n');
  }
  function buildICS() {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CAKRA Kediri Raya//Pengingat Sertifikat//ID', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    const event = (uid, date, summaryText, desc) => {
      lines.push('BEGIN:VEVENT', `UID:${uid}@cakra-sertifikat`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd(date)}`, `DTEND;VALUE=DATE:${ymd(nextDay(date))}`,
        `SUMMARY:${esc(summaryText)}`, `DESCRIPTION:${esc(desc)}`, 'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:-PT15H', `DESCRIPTION:${esc(summaryText)}`, 'END:VALARM', 'END:VEVENT');
    };
    const today = todayISO();
    for (const c of state.items) {
      const note = c.catatan ? `\nCatatan: ${c.catatan}` : '';
      if (c.berlaku >= today) event(`${c.id}-habis`, c.berlaku, `${c.nama} habis berlaku`, `Sertifikat ${c.nama} habis berlaku hari ini.${note}`);
      const start = minusMonths(c.berlaku, state.window);
      if (start >= today) event(`${c.id}-urus`, start, `Mulai urus perpanjangan: ${c.nama}`, `${c.nama} habis ${formatDate(c.berlaku)}. Daftar diklat/perpanjangan sekarang.${note}`);
    }
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }

  // ---------- events ----------
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nama = document.querySelector('#nama');
    const berlaku = document.querySelector('#berlaku');
    if (!nama.value.trim()) { nama.setCustomValidity('Isi nama sertifikat.'); nama.reportValidity(); return; }
    if (!ISO.test(berlaku.value)) { berlaku.setCustomValidity('Pilih tanggal berlaku.'); berlaku.reportValidity(); return; }
    if (state.items.length >= 60) { toast('Maksimal 60 sertifikat.'); return; }
    state.items.push({ id: newId(), nama: nama.value.trim().slice(0, 120), berlaku: berlaku.value, catatan: document.querySelector('#catatan').value.trim().slice(0, 140) });
    addForm.reset();
    persist();
    render();
    nama.focus();
    toast('Sertifikat ditambahkan.');
  });
  addForm.addEventListener('input', ({ target }) => target.setCustomValidity?.(''));

  list.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-id]');
    if (!btn) return;
    state.items = state.items.filter((c) => c.id !== btn.dataset.id);
    persist();
    render();
    toast('Sertifikat dihapus.');
  });

  windowSel.addEventListener('change', () => { state.window = +windowSel.value; persist(); render(); });

  remember.addEventListener('change', () => {
    if (remember.checked) {
      if (store.set(KEY, state)) toast('Daftar akan diingat di browser ini.');
      else { remember.checked = false; toast('Browser ini tidak mengizinkan penyimpanan.'); }
    } else { store.remove(KEY); toast('Daftar dihapus dari browser ini.'); }
  });

  icsBtn.addEventListener('click', () => {
    download('pengingat-sertifikat.ics', buildICS(), 'text/calendar;charset=utf-8');
    toast('Buka berkas .ics untuk menambahkannya ke kalender.');
  });
  printBtn.addEventListener('click', () => window.print());

  document.querySelector('#exportList').addEventListener('click', () => {
    download('sertifikat-saya.json', JSON.stringify({ app: 'cakra-sertifikat', version: 1, ...state }, null, 2), 'application/json');
  });
  document.querySelector('#importList').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    try {
      const data = await readJsonFile(file);
      if (data.app !== 'cakra-sertifikat') throw new Error('Ini bukan berkas daftar sertifikat CAKRA.');
      state = sanitize(data);
      windowSel.value = String(state.window);
      persist();
      render();
      toast(`${state.items.length} sertifikat dibuka.`);
    } catch (err) { toast(err.message); }
  });
  document.querySelector('#clearAll').addEventListener('click', () => {
    if (!state.items.length || !window.confirm('Hapus semua sertifikat dari daftar?')) return;
    state.items = [];
    persist();
    render();
  });

  // ---------- start ----------
  const saved = store.get(KEY, null);
  if (saved) { state = sanitize(saved); remember.checked = true; windowSel.value = String(state.window); }
  render();
})();
