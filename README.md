# Videoku

## Portal publik CAKRA Kediri Raya (`public/`)

Situs statis berisi alat karier gratis untuk anggota CAKRA. Tidak ada server, login, atau skrip pihak ketiga; isian tetap di browser pengguna.

| Halaman | Isi |
| --- | --- |
| `/` | Beranda dan pintu masuk ke semua alat |
| `/karier/` | Pembuat CV Laut & Darat: riwayat berlayar dalam tabel, hitung total masa layar otomatis, sertifikat, bahasa, referensi. Pratinjau langsung, cetak/PDF A4, simpan & buka draf (.json), opsi "ingat di browser ini" |
| `/karier/sertifikat/` | Pengingat masa berlaku sertifikat: status kedaluwarsa / segera urus / aman, unduh pengingat kalender (.ics), cetak daftar. Bisa dikirim ke Pembuat CV |
| `/karier/persiapan/` | Daftar periksa sebelum melamar sampai berangkat, tanda bahaya lowongan palsu, ringkasan hak pelaut (biaya perekrutan, PKL, cek SIUPPAK) |
| `/karier/darat/` | Memetakan tugas di kapal menjadi keterampilan dan posisi darat, lalu langsung mengisi CV Darat |

### Menjalankan secara lokal

```bash
cd public && python3 -m http.server 8000
# buka http://localhost:8000
```

### Deploy ke Firebase Hosting

`firebase.json` sudah menunjuk ke `public/`:

```bash
firebase deploy --only hosting
```

Catatan: halaman utama situs saat ini adalah ruang pengurus (login Google). Portal ini memakai `/` untuk publik dan menautkan ruang pengurus ke `/pengurus/`. Pindahkan aplikasi pengurus ke `/pengurus/` atau ubah tautan di `public/index.html` sebelum deploy.

### Prinsip

- CSP ketat (`script-src 'self'`, tanpa gaya inline).
- Jangan pernah meminta NIK, nomor paspor, nomor buku pelaut, atau nomor sertifikat.
- Teks panduan bersifat umum; minta pengurus meninjaunya terhadap aturan terbaru.
