# Panduan File Lagu / Audio

Simpan file lagu/musik latar undangan pernikahan Anda di folder ini:
- Contoh nama file: `wedding-song.mp3`
- Lokasi file: `frontend/public/audio/wedding-song.mp3`

File ini akan langsung dapat diakses di kode React melalui path:
```javascript
const audioSrc = "/audio/wedding-song.mp3";
```

> **Tips Format**: Format `.mp3` atau `.m4a` berukuran di bawah 5MB sangat direkomendasikan agar cepat dimuat di perangkat tamu (terutama saat menggunakan koneksi seluler).

