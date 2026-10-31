// File footage di folder public/. Isi null = slot belum ada footage,
// komponen Footage akan menampilkan placeholder berlabel.
export const FOOTAGE = {
  // Testimoni peserta (upload chat, 64 dtk, 30fps). Watermark CapCut sudah
  // dihapus dengan ffmpeg delogo; outro CapCut di akhir file tidak dipakai.
  main: "testimoni-peserta-1.mp4" as string | null,
  // B-roll dari folder Drive "Raw footage" belum tersedia (file > 30 MB).
  broll1: null as string | null,
};
