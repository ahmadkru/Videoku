'use strict';

(() => {
  const { el, toast, download, readJsonFile, store, str, todayISO, formatDate } = window.Cakra;
  const STORE_KEY = 'cakra.cv.v1';
  const CERT_KEY = 'cakra.sertifikat.v1';

  // Field definitions per track. type: text | textarea | list
  const certList = {
    id: 'sertifikat', type: 'list', label: 'Sertifikat dan pelatihan', item: 'Sertifikat', add: 'Tambah sertifikat',
    hint: 'Tulis nama saja, tanpa nomor. Tanggal berlaku membantu perekrut menilai kesiapanmu.',
    cols: [
      { id: 'nama', label: 'Nama sertifikat', max: 120, placeholder: 'Contoh: BST, SAT, COC ANT-III' },
      { id: 'berlaku', label: 'Berlaku sampai (opsional)', type: 'date' },
    ],
  };
  const tracks = {
    laut: {
      label: 'CV Laut',
      fields: [
        { id: 'target', label: 'Target jabatan', placeholder: 'Contoh: Mualim II', max: 100, required: true },
        { id: 'kapal', label: 'Tipe kapal yang dituju', placeholder: 'Contoh: ASD Tug, kapal kargo, tanker', max: 140 },
        { id: 'ringkasan', type: 'textarea', label: 'Ringkasan singkat', placeholder: '2–3 kalimat: pengalaman utama, kekuatanmu, dan apa yang kamu cari.', max: 600 },
        {
          id: 'layar', type: 'list', label: 'Riwayat berlayar', item: 'Pengalaman', add: 'Tambah pengalaman berlayar',
          hint: 'Mulai dari yang terbaru. Kosongkan sign off jika masih di kapal. Total masa layar dihitung otomatis.',
          cols: [
            { id: 'mulai', label: 'Sign on', type: 'date' },
            { id: 'selesai', label: 'Sign off', type: 'date' },
            { id: 'jabatan', label: 'Jabatan', max: 60, placeholder: 'Mualim II' },
            { id: 'kapal', label: 'Nama kapal', max: 80, placeholder: 'TB Contoh' },
            { id: 'tipe', label: 'Tipe kapal', max: 60, placeholder: 'ASD Tug' },
            { id: 'ukuran', label: 'GT / daya mesin', max: 40, placeholder: '450 GT / 2×1.200 kW' },
            { id: 'perusahaan', label: 'Perusahaan / agen', max: 100 },
          ],
        },
        certList,
        { id: 'pendidikan', type: 'textarea', label: 'Pendidikan', placeholder: 'Contoh: D3 Nautika — nama institusi — tahun lulus', max: 500 },
        { id: 'bahasa', label: 'Bahasa', placeholder: 'Contoh: Indonesia (ibu), Inggris (kerja/maritim)', max: 160 },
        { id: 'siap', label: 'Kesiapan bergabung', placeholder: 'Contoh: siap mulai Januari, siap rotasi 6 bulan', max: 160 },
        { id: 'referensi', type: 'textarea', label: 'Referensi', placeholder: 'Contoh: Tersedia atas permintaan. Jangan tulis nomor telepon orang lain tanpa izin.', max: 400 },
      ],
    },
    darat: {
      label: 'CV Darat',
      fields: [
        { id: 'target', label: 'Target posisi', placeholder: 'Contoh: Operasi Pelabuhan, Marine Operations, HSE', max: 100, required: true },
        { id: 'ringkasan', type: 'textarea', label: 'Ringkasan profesional', placeholder: 'Jelaskan pengalamanmu dan kaitannya dengan posisi yang dituju.', max: 600 },
        { id: 'keterampilan', type: 'textarea', label: 'Keterampilan yang bisa dialihkan', placeholder: 'Satu per baris. Gunakan halaman "Karier darat" untuk ide.', max: 900 },
        {
          id: 'kerja', type: 'list', label: 'Pengalaman dan hasil', item: 'Pengalaman', add: 'Tambah pengalaman',
          hint: 'Tulis peran, tindakan, dan hasil nyata. Jangan mengarang angka.',
          cols: [
            { id: 'periode', label: 'Periode', max: 40, placeholder: '2022–2025' },
            { id: 'peran', label: 'Peran', max: 80, placeholder: 'Mualim I' },
            { id: 'tempat', label: 'Perusahaan / kapal', max: 100 },
            { id: 'hasil', label: 'Tindakan dan hasil', type: 'textarea', max: 600, placeholder: 'Satu poin per baris.' },
          ],
        },
        certList,
        { id: 'pendidikan', type: 'textarea', label: 'Pendidikan', placeholder: 'Contoh: D4 Nautika — institusi — tahun lulus', max: 500 },
        { id: 'bahasa', label: 'Bahasa', placeholder: 'Contoh: Indonesia, Inggris (lancar)', max: 160 },
      ],
    },
  };
  const commonIds = ['nama', 'domisili', 'telepon', 'email'];

  const blank = () => ({ track: 'laut', common: {}, laut: {}, darat: {} });
  let state = blank();

  const form = document.querySelector('#editor');
  const fieldsBox = document.querySelector('#fields');
  const cv = document.querySelector('#cv');
  const print = document.querySelector('#print');
  const seaTime = document.querySelector('#seaTime');
  const remember = document.querySelector('#remember');

  // ---------- state helpers ----------
  function sanitize(raw) {
    const clean = blank();
    if (!raw || typeof raw !== 'object') return clean;
    clean.track = raw.track === 'darat' ? 'darat' : 'laut';
    for (const id of commonIds) clean.common[id] = str(raw.common?.[id], 120);
    for (const [key, def] of Object.entries(tracks)) {
      for (const f of def.fields) {
        const v = raw[key]?.[f.id];
        if (f.type === 'list') {
          clean[key][f.id] = Array.isArray(v) ? v.slice(0, 40).map((row) => Object.fromEntries(f.cols.map((c) => [c.id, str(row?.[c.id], c.max || 20)]))) : [];
        } else {
          clean[key][f.id] = str(v, f.max);
        }
      }
    }
    return clean;
  }

  function persist() {
    if (remember.checked) store.set(STORE_KEY, state);
  }

  // ---------- sea time ----------
  function parseISO(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function rowDays(row) {
    const start = parseISO(row.mulai);
    const end = parseISO(row.selesai || todayISO());
    if (start === null || end === null || end < start) return 0;
    return Math.round((end - start) / 86400000) + 1;
  }
  function describeDays(days) {
    const months = Math.floor(days / 30);
    const rest = days % 30;
    const y = Math.floor(months / 12);
    const m = months % 12;
    const parts = [];
    if (y) parts.push(`${y} tahun`);
    if (m) parts.push(`${m} bulan`);
    if (rest || !parts.length) parts.push(`${rest} hari`);
    return parts.join(' ');
  }
  const monthFmt = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' });
  function shortDate(iso) {
    const t = parseISO(iso);
    return t === null ? '' : monthFmt.format(new Date(t));
  }

  // ---------- editor ----------
  function control(def, value, id) {
    const node = el(def.type === 'textarea' ? 'textarea' : 'input');
    node.id = id;
    if (def.type === 'textarea') node.rows = 3;
    else node.type = def.type === 'date' ? 'date' : 'text';
    if (def.max) node.maxLength = def.max;
    if (def.placeholder) node.placeholder = def.placeholder;
    node.value = value || '';
    return node;
  }

  function renderFields() {
    const t = state.track;
    fieldsBox.replaceChildren(...tracks[t].fields.map((f) => {
      if (f.type === 'list') return renderList(f);
      const group = el('div', 'field');
      const id = `${t}-${f.id}`;
      const label = el('label', '', f.label);
      label.htmlFor = id;
      if (f.required) label.append(el('span', 'muted', ' (wajib)'));
      const input = control(f, state[t][f.id], id);
      input.dataset.field = f.id;
      if (f.required) input.required = true;
      group.append(label, input);
      return group;
    }));
  }

  function renderList(f) {
    const t = state.track;
    const rows = state[t][f.id] || (state[t][f.id] = []);
    const box = el('fieldset', 'repeat');
    box.dataset.list = f.id;
    box.append(el('legend', '', f.label));
    if (f.hint) box.append(el('small', 'muted', f.hint));
    rows.forEach((row, i) => {
      const item = el('div', 'repeat-item');
      const head = el('div', 'repeat-head');
      head.append(el('span', '', `${f.item} ${i + 1}`));
      const del = el('button', 'link', 'Hapus');
      del.type = 'button';
      del.dataset.remove = `${f.id}:${i}`;
      del.setAttribute('aria-label', `Hapus ${f.item.toLowerCase()} ${i + 1}`);
      head.append(del);
      item.append(head);
      const grid = el('div', 'field-row');
      for (const c of f.cols) {
        const id = `${t}-${f.id}-${i}-${c.id}`;
        const label = el('label', '', c.label);
        label.htmlFor = id;
        const input = control(c, row[c.id], id);
        Object.assign(input.dataset, { list: f.id, index: i, col: c.id });
        label.append(input);
        grid.append(label);
      }
      item.append(grid);
      if (f.id === 'sertifikat' && row.berlaku && row.berlaku < todayISO()) {
        const warn = el('p', 'small');
        warn.append(el('span', 'tag bad', 'Sudah kedaluwarsa — perpanjang sebelum melamar'));
        item.append(warn);
      }
      box.append(item);
    });
    const actions = el('div', 'actions');
    const add = el('button', 'secondary', `+ ${f.add}`);
    add.type = 'button';
    add.dataset.add = f.id;
    actions.append(add);
    if (f.id === 'sertifikat') {
      const saved = store.get(CERT_KEY, null);
      if (Array.isArray(saved?.items) && saved.items.length) {
        const pull = el('button', 'secondary', 'Ambil dari Pengingat sertifikat');
        pull.type = 'button';
        pull.dataset.pullCerts = '1';
        actions.append(pull);
      }
    }
    box.append(actions);
    return box;
  }

  function fillCommon() {
    for (const id of commonIds) document.getElementById(id).value = state.common[id] || '';
    form.querySelector(`input[name=track][value=${state.track}]`).checked = true;
  }

  // ---------- preview ----------
  function section(title, ...children) {
    const s = el('section', 'cv-section');
    s.append(el('h4', '', title), ...children);
    return s;
  }
  const para = (text) => el('p', '', text);
  function bullets(text) {
    const lines = text.split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
    if (lines.length < 2) return para(text);
    const ul = el('ul');
    for (const l of lines) ul.append(el('li', '', l));
    return ul;
  }
  function table(headers, rows) {
    const wrap = el('div', 'table-scroll');
    const tbl = el('table', 'cv-table');
    const tr = el('tr');
    for (const h of headers) tr.append(el('th', '', h));
    const thead = el('thead');
    thead.append(tr);
    const tbody = el('tbody');
    for (const r of rows) {
      const row = el('tr');
      for (const cell of r) row.append(el('td', '', cell));
      tbody.append(row);
    }
    tbl.append(thead, tbody);
    wrap.append(tbl);
    return wrap;
  }

  function renderCV() {
    const t = state.track;
    const d = state[t];
    const nama = (state.common.nama || '').trim();
    const target = (d.target || '').trim();

    // Sea time summary (laut only)
    const layar = (state.laut.layar || []).filter((r) => r.mulai);
    const totalDays = layar.reduce((sum, r) => sum + rowDays(r), 0);
    seaTime.hidden = !(t === 'laut' && totalDays);
    if (!seaTime.hidden) seaTime.textContent = `Total masa layar dari ${layar.length} pengalaman: ${describeDays(totalDays)} (${totalDays} hari, dihitung dari sign on sampai sign off).`;

    if (!nama || !target) {
      cv.classList.remove('ready');
      cv.replaceChildren(el('p', 'empty-state', 'Isi nama dan target untuk melihat pratinjau.'));
      print.disabled = true;
      return;
    }

    const head = el('header', 'cv-heading');
    head.append(el('p', 'cv-track', tracks[t].label), el('h3', '', nama), el('p', 'cv-target', target + (t === 'laut' && d.kapal ? ` · ${d.kapal.trim()}` : '')));
    const contact = ['domisili', 'telepon', 'email'].map((k) => (state.common[k] || '').trim()).filter(Boolean);
    if (contact.length) head.append(el('p', 'cv-contact', contact.join(' · ')));
    cv.replaceChildren(head);

    if (d.ringkasan?.trim()) cv.append(section(t === 'laut' ? 'Ringkasan' : 'Ringkasan profesional', para(d.ringkasan.trim())));

    if (t === 'laut') {
      const rows = (d.layar || []).filter((r) => r.jabatan || r.kapal || r.mulai)
        .slice().sort((a, b) => (b.mulai || '').localeCompare(a.mulai || ''))
        .map((r) => {
          const period = r.mulai ? `${shortDate(r.mulai)} – ${r.selesai ? shortDate(r.selesai) : 'sekarang'}` : '';
          const days = r.mulai ? rowDays(r) : 0;
          return [
            period + (days ? `\n(${describeDays(days)})` : ''),
            r.jabatan,
            [r.kapal, [r.tipe, r.ukuran].filter(Boolean).join(', ')].filter(Boolean).join('\n'),
            r.perusahaan,
          ];
        });
      if (rows.length) {
        const s = section('Riwayat berlayar', table(['Periode', 'Jabatan', 'Kapal', 'Perusahaan / agen'], rows));
        if (totalDays) s.append(el('p', 'small', `Total masa layar: ${describeDays(totalDays)}.`));
        cv.append(s);
      }
    } else {
      if (d.keterampilan?.trim()) cv.append(section('Keterampilan', bullets(d.keterampilan.trim())));
      const items = (d.kerja || []).filter((r) => r.peran || r.hasil);
      if (items.length) {
        const s = section('Pengalaman');
        for (const r of items) {
          const block = el('div', 'cv-section');
          block.append(el('p', 'cv-target', [r.peran, r.tempat].filter(Boolean).join(' — ') + (r.periode ? ` (${r.periode})` : '')));
          if (r.hasil?.trim()) block.append(bullets(r.hasil.trim()));
          s.append(block);
        }
        cv.append(s);
      }
    }

    const certs = (d.sertifikat || []).filter((c) => c.nama?.trim());
    if (certs.length) {
      const ul = el('ul');
      for (const c of certs) ul.append(el('li', '', c.berlaku ? `${c.nama.trim()} — berlaku sampai ${formatDate(c.berlaku)}` : c.nama.trim()));
      cv.append(section('Sertifikat dan pelatihan', ul));
    }
    if (d.pendidikan?.trim()) cv.append(section('Pendidikan', bullets(d.pendidikan.trim())));
    if (d.bahasa?.trim()) cv.append(section('Bahasa', para(d.bahasa.trim())));
    if (t === 'laut' && d.siap?.trim()) cv.append(section('Kesiapan bergabung', para(d.siap.trim())));
    if (t === 'laut' && d.referensi?.trim()) cv.append(section('Referensi', para(d.referensi.trim())));

    cv.classList.add('ready');
    print.disabled = false;
  }

  function update() {
    renderCV();
    persist();
  }

  // ---------- events ----------
  form.addEventListener('change', ({ target }) => {
    if (target.name === 'track' && Object.hasOwn(tracks, target.value)) {
      state.track = target.value;
      renderFields();
      update();
    } else if (target.dataset.list && target.dataset.col === 'berlaku') {
      renderFields(); // refresh expiry warning
    }
  });

  form.addEventListener('input', ({ target }) => {
    const t = state.track;
    if (target.dataset.common) state.common[target.dataset.common] = target.value;
    else if (target.dataset.field) state[t][target.dataset.field] = target.value;
    else if (target.dataset.list) state[t][target.dataset.list][+target.dataset.index][target.dataset.col] = target.value;
    else return;
    update();
  });

  form.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;
    const t = state.track;
    if (btn.dataset.add) {
      const list = state[t][btn.dataset.add];
      if (list.length >= 40) return toast('Maksimal 40 baris.');
      list.push({});
      renderFields();
      update();
      const inputs = fieldsBox.querySelectorAll(`[data-list="${btn.dataset.add}"][data-index="${list.length - 1}"]`);
      inputs[0]?.focus();
    } else if (btn.dataset.remove) {
      const [list, idx] = btn.dataset.remove.split(':');
      state[t][list].splice(+idx, 1);
      renderFields();
      update();
      toast('Baris dihapus.');
    } else if (btn.dataset.pullCerts) {
      const saved = store.get(CERT_KEY, { items: [] });
      const existing = new Set(state[t].sertifikat.map((c) => (c.nama || '').trim().toLowerCase()));
      let added = 0;
      for (const c of saved.items || []) {
        const nama = str(c.nama, 120).trim();
        if (!nama || existing.has(nama.toLowerCase())) continue;
        state[t].sertifikat.push({ nama, berlaku: /^\d{4}-\d{2}-\d{2}$/.test(c.berlaku) ? c.berlaku : '' });
        added++;
      }
      renderFields();
      update();
      toast(added ? `${added} sertifikat ditambahkan.` : 'Semua sertifikat sudah ada di CV.');
    }
  });

  form.addEventListener('reset', (event) => {
    event.preventDefault();
    if (!window.confirm('Kosongkan semua isian CV Laut dan CV Darat?')) return;
    state = blank();
    fillCommon();
    renderFields();
    update();
    toast('Isian dikosongkan.');
  });

  print.addEventListener('click', () => { if (cv.classList.contains('ready')) window.print(); });

  document.querySelector('#exportDraft').addEventListener('click', () => {
    const name = (state.common.nama || 'cv').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cv';
    download(`draf-cv-${name}.json`, JSON.stringify({ app: 'cakra-cv', version: 1, ...state }, null, 2), 'application/json');
    toast('Draf disimpan ke folder unduhan.');
  });

  document.querySelector('#importDraft').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    try {
      const data = await readJsonFile(file);
      if (data.app !== 'cakra-cv') throw new Error('Ini bukan berkas draf CV CAKRA.');
      state = sanitize(data);
      fillCommon();
      renderFields();
      update();
      toast('Draf dibuka.');
    } catch (err) {
      toast(err.message);
    }
  });

  remember.addEventListener('change', () => {
    if (remember.checked) {
      if (store.set(STORE_KEY, state)) toast('Draf akan diingat di browser ini.');
      else { remember.checked = false; toast('Browser ini tidak mengizinkan penyimpanan.'); }
    } else {
      store.remove(STORE_KEY);
      toast('Draf dihapus dari browser ini.');
    }
  });

  // ---------- start ----------
  const saved = store.get(STORE_KEY, null);
  if (saved) {
    state = sanitize(saved);
    remember.checked = true;
  }
  // Skills sent from the "Karier darat" page (same tab, one-time).
  let handoff = null;
  try {
    handoff = JSON.parse(sessionStorage.getItem('cakra.handoff.darat') || 'null');
    sessionStorage.removeItem('cakra.handoff.darat');
  } catch { /* storage blocked */ }
  if (Array.isArray(handoff) && handoff.length) {
    const existing = (state.darat.keterampilan || '').split('\n').map((l) => l.trim()).filter(Boolean);
    const add = handoff.map((l) => str(l, 200).trim()).filter((l) => l && !existing.includes(l));
    state.darat.keterampilan = [...existing, ...add].join('\n').slice(0, 900);
    state.track = 'darat';
    toast(`${add.length} keterampilan ditambahkan ke CV Darat.`);
  } else if (new URLSearchParams(location.search).get('jalur') === 'darat') {
    state.track = 'darat';
  }
  fillCommon();
  renderFields();
  renderCV();
})();
