'use strict';

(() => {
  const { el, toast, store } = window.Cakra;
  const KEY = 'cakra.persiapan.v1';

  // [id, title, detail]
  const groups = [
    ['Sebelum melamar', [
      ['cv', 'CV terbaru', 'Riwayat berlayar urut dari yang terbaru, lengkap dengan tanggal sign on/sign off.'],
      ['sert', 'Sertifikat masih berlaku', 'Cek di Pengingat sertifikat. Pastikan tidak habis di tengah kontrak.'],
      ['bukupelaut', 'Buku pelaut berlaku', 'Cek sisa masa berlaku dan halaman sijil yang tersisa.'],
      ['paspor', 'Paspor berlaku', 'Banyak perusahaan meminta sisa masa berlaku yang cukup untuk seluruh kontrak.'],
      ['mcu', 'Pemeriksaan kesehatan pelaut', 'Dilakukan di klinik yang diakui untuk pelaut. Simpan hasilnya.'],
      ['sijil', 'Bukti pengalaman', 'Salinan halaman sijil atau surat keterangan dari kapal sebelumnya.'],
      ['salinan', 'Salinan digital dokumen', 'Pindai semua dokumen. Simpan di tempat aman, jangan disebar di grup.'],
    ]],
    ['Memeriksa perusahaan atau agen', [
      ['siuppak', 'Agen punya SIUPPAK', 'Cocokkan nama dan nomor izin ke Ditjen Perhubungan Laut atau syahbandar.'],
      ['kantor', 'Kantor bisa didatangi', 'Alamat jelas dan bisa dikunjungi, bukan hanya akun media sosial.'],
      ['tanpabiaya', 'Tidak ada biaya penempatan', 'Tidak diminta "uang jaminan" atau "biaya proses" untuk mendapat kapal.'],
      ['tanya', 'Sudah tanya anggota CAKRA', 'Tanyakan pengalaman anggota lain dengan agen dan kapal tersebut.'],
      ['tandaterima', 'Tanda terima dokumen', 'Minta tanda terima tertulis untuk setiap dokumen asli yang diserahkan.'],
    ]],
    ['Sebelum tanda tangan kontrak', [
      ['pklbaca', 'PKL sudah dibaca utuh', 'Jangan tanda tangan sebelum paham isinya. Tanyakan bagian yang tidak jelas.'],
      ['pklisi', 'Isi PKL lengkap', 'Jabatan, gaji pokok, lembur, cuti, lama kontrak, pemulangan, perlindungan kecelakaan dan kesehatan.'],
      ['pklsalinan', 'Punya salinan PKL', 'Simpan salinan untukmu dan satu untuk keluarga.'],
      ['allotment', 'Pengaturan kiriman gaji', 'Rekening tujuan dan jumlah kiriman ke keluarga sudah jelas.'],
      ['jaminan', 'Perlindungan sosial', 'Tanyakan jaminan kecelakaan kerja dan kesehatan selama kontrak.'],
    ]],
    ['Sebelum berangkat', [
      ['keluarga', 'Keluarga tahu detail perjalanan', 'Nama kapal, perusahaan, agen, pelabuhan bergabung, dan nomor kontak darurat agen.'],
      ['obat', 'Obat pribadi', 'Bawa cukup untuk masa kontrak, dengan resep atau keterangan dokter.'],
      ['kontak', 'Kontak pengurus CAKRA', 'Simpan kontak pengurus wilayahmu untuk keadaan darurat.'],
      ['asli', 'Dokumen asli dibawa', 'Buku pelaut, paspor, sertifikat, hasil kesehatan, dan PKL.'],
    ]],
  ];
  const allIds = groups.flatMap(([, items]) => items.map(([id]) => id));

  const box = document.querySelector('#checklist');
  const bar = document.querySelector('#bar');
  const text = document.querySelector('#progressText');

  const savedRaw = store.get(KEY, []);
  const checked = new Set(Array.isArray(savedRaw) ? savedRaw.filter((id) => allIds.includes(id)) : []);

  function render() {
    box.replaceChildren(...groups.map(([title, items], gi) => {
      const fs = el('fieldset', 'check-group mt-s');
      fs.append(el('legend', '', `${gi + 1}. ${title}`));
      for (const [id, name, detail] of items) {
        const label = el('label', 'check');
        const input = el('input');
        input.type = 'checkbox';
        input.dataset.id = id;
        input.checked = checked.has(id);
        const span = el('span');
        span.append(el('b', '', name), el('br'), el('span', 'muted small', detail));
        label.append(input, span);
        fs.append(label);
      }
      return fs;
    }));
    progress();
  }

  function progress() {
    const done = checked.size;
    const pct = Math.round((done / allIds.length) * 100);
    bar.style.width = `${pct}%`;
    text.textContent = `${done} dari ${allIds.length} langkah selesai (${pct}%).`;
  }

  box.addEventListener('change', ({ target }) => {
    if (!target.dataset.id) return;
    if (target.checked) checked.add(target.dataset.id); else checked.delete(target.dataset.id);
    store.set(KEY, [...checked]);
    progress();
  });

  document.querySelector('#printList').addEventListener('click', () => window.print());
  document.querySelector('#resetList').addEventListener('click', () => {
    if (!checked.size || !window.confirm('Hapus semua centang?')) return;
    checked.clear();
    store.remove(KEY);
    render();
    toast('Centang dihapus.');
  });

  render();
})();
