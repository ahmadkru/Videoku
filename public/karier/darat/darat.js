'use strict';

(() => {
  const { el, toast } = window.Cakra;
  const HANDOFF = 'cakra.handoff.darat';

  // [id, istilah kapal, kalimat untuk CV darat, contoh posisi darat]
  const groups = [
    ['Dek', [
      ['jaga', 'Tugas jaga navigasi', 'Memantau operasi 24 jam secara bergiliran dan mengambil keputusan cepat sesuai prosedur', ['Operator ruang kendali', 'Petugas pemantauan lalu lintas kapal', 'Dispatcher operasi']],
      ['muat', 'Bongkar muat dan rencana muatan', 'Merencanakan dan mengawasi bongkar muat, termasuk perhitungan stabilitas dan distribusi muatan', ['Perencana muatan terminal', 'Staf operasional pelabuhan', 'Logistik dan pergudangan']],
      ['sandar', 'Sandar, lepas sandar, koordinasi tug dan pandu', 'Mengkoordinasikan manuver bersama pandu, kapal tunda, dan petugas darat dengan komunikasi radio yang jelas', ['Marine operations', 'Koordinator pelabuhan', 'Mooring master/superintendent (dengan pengalaman senior)']],
      ['rawatdek', 'Perawatan dek dan alat keselamatan', 'Menjadwalkan, melaksanakan, dan mencatat perawatan peralatan sesuai standar keselamatan', ['Staf perawatan fasilitas', 'Inspektur aset']],
      ['dokumen', 'Dokumen kapal dan port clearance', 'Menyiapkan dokumen kedatangan dan keberangkatan serta berkomunikasi dengan otoritas pelabuhan', ['Staf keagenan kapal', 'Administrasi pelabuhan', 'Ekspedisi dan kepabeanan']],
    ]],
    ['Mesin', [
      ['jagamesin', 'Tugas jaga kamar mesin', 'Mengoperasikan dan memantau mesin, pembangkit listrik, dan sistem pendukung', ['Operator pembangkit', 'Operator utilitas pabrik']],
      ['pms', 'Perawatan terencana (PMS)', 'Menjalankan sistem perawatan terencana: jadwal, catatan jam kerja mesin, dan riwayat perbaikan', ['Teknisi perawatan', 'Maintenance planner']],
      ['trouble', 'Perbaikan kerusakan', 'Mendiagnosis dan memperbaiki kerusakan mesin, pompa, kompresor, dan sistem listrik', ['Teknisi lapangan', 'Service engineer']],
      ['bunker', 'Bunkering dan pengelolaan BBM', 'Mengawasi penerimaan, pengukuran, dan pencatatan bahan bakar sesuai prosedur keselamatan', ['Staf depo BBM', 'Pengawas penerimaan BBM']],
      ['spare', 'Inventaris suku cadang', 'Mengelola stok, pemesanan, dan penerimaan suku cadang teknis', ['Staf gudang teknis', 'Pengadaan teknis']],
    ]],
    ['Umum', [
      ['drill', 'Latihan darurat dan toolbox meeting', 'Memimpin briefing keselamatan dan latihan darurat, serta menerapkan izin kerja (permit to work)', ['Staf K3/HSE', 'Koordinator keselamatan']],
      ['pimpin', 'Memimpin kru', 'Membagi tugas dan memimpin tim lintas budaya dalam kondisi kerja berat dan jadwal ketat', ['Supervisor', 'Koordinator tim']],
      ['laporan', 'Logbook dan laporan', 'Membuat catatan harian dan laporan kejadian yang akurat dan tepat waktu', ['Administrasi operasi', 'Staf dokumentasi/QA']],
      ['inspeksi', 'Persiapan inspeksi (PSC, vetting, audit)', 'Menyiapkan unit kerja untuk inspeksi eksternal dan menindaklanjuti temuan hingga selesai', ['Staf QA/QC', 'Auditor internal', 'Staf HSE']],
      ['inggris', 'Bahasa Inggris maritim', 'Berkomunikasi dalam bahasa Inggris dengan kru asing, otoritas, dan klien', ['Posisi yang melayani klien asing']],
      ['masak', 'Dapur kapal', 'Menyiapkan makanan untuk banyak orang dengan anggaran dan stok terbatas sambil menjaga kebersihan dapur', ['Katering industri', 'Dapur hotel dan restoran']],
    ]],
  ];
  const byId = new Map(groups.flatMap(([, items]) => items.map((d) => [d[0], d])));

  const dutiesBox = document.querySelector('#duties');
  const result = document.querySelector('#result');
  const toCV = document.querySelector('#toCV');
  const copyBtn = document.querySelector('#copy');
  const selected = new Set();

  dutiesBox.replaceChildren(...groups.map(([title, items]) => {
    const fs = el('fieldset', 'check-group mt-s');
    fs.append(el('legend', '', title));
    for (const [id, name, phrase] of items) {
      const label = el('label', 'check');
      const input = el('input');
      input.type = 'checkbox';
      input.value = id;
      const span = el('span');
      span.append(el('b', '', name), el('br'), el('span', 'muted small', phrase));
      label.append(input, span);
      fs.append(label);
    }
    return fs;
  }));

  function skillLines() {
    return [...selected].map((id) => byId.get(id)[2]);
  }

  function render() {
    const lines = skillLines();
    toCV.disabled = copyBtn.disabled = !lines.length;
    if (!lines.length) {
      result.replaceChildren(el('p', 'empty-state', 'Pilih minimal satu tugas.'));
      return;
    }
    const roles = new Map();
    for (const id of selected) for (const r of byId.get(id)[3]) roles.set(r, (roles.get(r) || 0) + 1);
    const sortedRoles = [...roles.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r);

    const skills = el('ul');
    for (const l of lines) skills.append(el('li', '', l));
    const roleList = el('ul');
    for (const r of sortedRoles) roleList.append(el('li', '', r));
    result.replaceChildren(
      el('h3', '', 'Keterampilan yang bisa dialihkan'), skills,
      el('h3', 'mt-s', 'Posisi darat yang bisa kamu jajaki'), roleList,
    );
  }

  dutiesBox.addEventListener('change', ({ target }) => {
    if (!byId.has(target.value)) return;
    if (target.checked) selected.add(target.value); else selected.delete(target.value);
    render();
  });

  copyBtn.addEventListener('click', async () => {
    const text = skillLines().map((l) => `- ${l}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast('Teks disalin.');
    } catch {
      toast('Tidak bisa menyalin otomatis. Pilih teks lalu salin manual.');
    }
  });

  toCV.addEventListener('click', () => {
    try {
      sessionStorage.setItem(HANDOFF, JSON.stringify(skillLines()));
      window.location.href = '/karier/?jalur=darat';
    } catch {
      toast('Browser memblokir pemindahan. Gunakan "Salin teks" lalu tempel di CV Darat.');
    }
  });
})();
