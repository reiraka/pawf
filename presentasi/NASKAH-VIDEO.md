# Naskah Video — GLACIREY (Project 5)

Durasi perkiraan: 5–7 menit. Naskah ini juga tersimpan sebagai *speaker notes* di setiap slide PowerPoint (buka lewat **View → Notes Page** atau Presenter View).

---

## Slide 1 — Pembuka (±30 detik)

> Halo semuanya! Di video ini saya akan menjelaskan project kelima saya: **GLACIREY** — sebuah web blog yang saya bangun dengan Django. Nama Glacirey adalah gabungan kata *glacier*, yang berarti gletser, dengan nama saya, Rey. Sesuai namanya, blog ini mengusung tema es dengan tampilan semi-3D yang terinspirasi dari website pemenang penghargaan, igloo.inc. Mari kita mulai.

## Slide 2 — Latar Belakang (±40 detik)

> Latar belakangnya sederhana. Kebanyakan blog tampil datar dan statis, sehingga pembaca cepat bosan. Saya terinspirasi dari igloo.inc, situs yang membuktikan bahwa web bisa terasa punya kedalaman ruang. Tapi alih-alih memakai WebGL yang berat, saya memilih pendekatan **semi-3D**: ilusi kedalaman yang dibangun murni dengan CSS transform dan JavaScript — tanpa satu pun library eksternal. Hasilnya ringan dan cepat.

## Slide 3 — Teknologi (±40 detik)

> Untuk teknologinya, backend memakai **Django versi 6** dengan database SQLite. Seluruh efek tiga dimensi dibangun dengan CSS murni: preserve-3d, perspective, dan transform. Interaksinya memakai JavaScript vanilla — Fetch API untuk komunikasi dengan server tanpa reload. Session Django saya manfaatkan untuk mencegah spam like dan menghitung view secara akurat. Perhatikan: tidak ada jQuery, tidak ada framework frontend — semuanya bawaan browser.

## Slide 4 — Arsitektur (±45 detik)

> Arsitekturnya mengikuti pola **MVT** milik Django: Model, View, Template. Saat browser meminta halaman, urls.py mencocokkan alamatnya, views.py memproses permintaan, mengambil data dari Model Post, lalu hasilnya dirender oleh template menjadi HTML. Model Post menyimpan judul, slug yang dibuat otomatis, konten, jumlah views dan likes. Ada empat endpoint utama — dua halaman biasa, dan dua endpoint JSON untuk fitur like dan live search.

## Slide 5 — Tampilan Semi-3D (±40 detik)

> Sekarang bagian tampilannya. Ada empat elemen semi-3D utama. Pertama, **kubus es tiga dimensi** di halaman utama yang berputar mengikuti arah kursor. Kedua, **kartu artikel dengan efek tilt** — kartu miring ke arah kursor dan isinya terasa berlapis. Ketiga, **latar belakang parallax tiga lapis**: grid perspektif, pecahan es yang melayang, dan cahaya glow. Keempat, **tema es gelap** dengan efek kaca dan tekstur grain halus, persis nuansa igloo.inc. Nanti akan saya tunjukkan langsung di demo.

## Slide 6 — Fitur: Interaksi Tanpa Reload (±40 detik)

> Masuk ke fitur inovatif pertama: interaksi tanpa reload. **Live search** memunculkan hasil pencarian langsung saat kita mengetik, dengan teknik debounce 250 milidetik supaya server tidak dibanjiri request. Pencariannya mencakup judul dan isi artikel. Lalu ada **tombol like berbasis AJAX**: angka berubah seketika tanpa halaman dimuat ulang, bisa di-unlike, dan ada anti-spam berbasis session sehingga satu pengunjung hanya bisa memberi satu like per artikel. Keamanannya dijaga dengan token CSRF.

## Slide 7 — Fitur: Pengalaman Membaca (±40 detik)

> Fitur inovatif kedua berfokus pada pengalaman membaca. **View counter**-nya cerdas: di-refresh berapa kali pun, angka hanya bertambah sekali per sesi pengunjung. Setiap artikel punya **estimasi waktu baca** yang dihitung otomatis dari jumlah kata. Saat membaca, ada **progress bar** di bagian atas yang terisi seiring kita scroll. Dan yang paling menarik: fitur **text-to-speech** — artikel bisa dibacakan dengan suara Bahasa Indonesia, memakai Web Speech API bawaan browser. Ini juga bentuk aksesibilitas untuk pengguna dengan gangguan penglihatan.

## Slide 8 — Demo Langsung (±90–120 detik, rekam layar)

Beralih ke rekaman layar browser (`http://localhost:8000`), ikuti urutan ini:

1. **Buka beranda** — gerakkan kursor perlahan; tunjukkan kubus es yang menoleh dan latar yang bergeser.
2. **Arahkan kursor ke kartu artikel** — tunjukkan efek tilt 3D dan kilau yang mengikuti mouse.
3. **Ketik di kotak pencarian** (contoh: `git` atau `parallax`) — hasil muncul instan.
4. **Buka satu artikel** — tunjukkan progress bar saat scroll, waktu baca, dan view counter.
5. **Klik tombol like** — angka berubah seketika; lalu **putar text-to-speech** beberapa detik.

> Narasi pengantar: "Sekarang saatnya demo. Pertama saya buka beranda — perhatikan kubus es dan latar belakang yang bergerak mengikuti kursor…" (lanjutkan sesuai aksi di layar).

## Slide 9 — Rencana Pengembangan (±30 detik)

> Untuk pengembangan ke depan, ada empat rencana. Pertama, **deploy ke hosting online** seperti PythonAnywhere supaya blog ini bisa diakses siapa pun lewat link publik. Kedua, **kolom komentar** agar pembaca bisa berdiskusi. Ketiga, sistem **kategori dan tag** supaya artikel mudah dijelajahi. Dan keempat, **akun penulis** dengan halaman tulis artikel sendiri, jadi tidak perlu lewat admin panel Django.

## Slide 10 — Penutup (±20 detik)

> Itulah GLACIREY — blog semi-3D dengan tujuh fitur interaktif, empat elemen tampilan tiga dimensi, dan semuanya dibangun tanpa library eksternal: hanya Django, CSS, dan JavaScript murni. Terima kasih sudah menonton video penjelasan Project 5 ini. Sampai jumpa di project berikutnya!

---

## Tips merekam

- Jalankan server dulu: `.venv\Scripts\python.exe manage.py runserver`, lalu buka `http://localhost:8000`.
- Rekam layar dengan **OBS Studio** (gratis) atau perekam bawaan Windows (`Win+Alt+R`).
- Untuk bagian demo, gerakkan kursor **perlahan** — efek 3D-nya lebih terlihat di video.
- Tutup tab dan notifikasi lain sebelum merekam.
- Baca narasi dengan santai; lebih baik direkam per slide lalu digabung daripada sekali jalan.
