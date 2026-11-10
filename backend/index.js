const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware JSON parser & request logger
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Helper: Format relative Indonesian time
function formatRelativeTime(dateString) {
  const date = new Date(dateString.replace(' ', 'T') + 'Z');
  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now - date) / 1000));

  if (diffInSeconds < 60) {
    return 'Baru Saja';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari yang lalu`;
  }
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Helper: Determine avatar background color
function getAvatarBg(category) {
  switch (category) {
    case 'Sahabat':
      return 'bg-primary-fixed-dim text-on-primary-fixed';
    case 'Rekan Kerja':
      return 'bg-tertiary-fixed text-on-tertiary-fixed';
    case 'Keluarga':
      return 'bg-surface-container-high text-on-surface';
    case 'Alumni Kampus':
      return 'bg-secondary-fixed text-on-secondary-fixed';
    default:
      return 'bg-primary-container text-on-primary-container';
  }
}

// Helper: Compute RSVP & wishes stats
function getStats() {
  const totalWishesRow = db.prepare('SELECT COUNT(*) as count FROM wishes').get();
  const attendingRow = db
    .prepare("SELECT COUNT(*) as count FROM wishes WHERE attendance = 'hadir'")
    .get();
  const absentRow = db
    .prepare("SELECT COUNT(*) as count FROM wishes WHERE attendance = 'berhalangan'")
    .get();

  const totalWishes = totalWishesRow.count;
  const totalAttending = attendingRow.count;
  const totalAbsent = absentRow.count;

  return {
    totalWishes: totalWishes,
    realWishesCount: totalWishes,
    totalAttending,
    totalAbsent,
    percentageKasih: '100%',
  };
}

// ======================== ROUTES ========================

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Undangan Pernikahan Rizal & Putri API',
    time: new Date().toISOString(),
  });
});

// 2. GET /api/wishes - Ambil semua ucapan & doa
app.get('/api/wishes', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const query = db.prepare(`
      SELECT id, name, initial, avatar_bg, category, attendance, pax, message, created_at
      FROM wishes
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);

    const rows = query.all(limit, offset);

    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      initial: row.initial,
      avatarBg: row.avatar_bg,
      category: row.category,
      attendance: row.attendance,
      isAttending: row.attendance === 'hadir',
      pax: row.pax,
      message: row.message,
      createdAt: row.created_at,
      timeAgo: formatRelativeTime(row.created_at),
    }));

    res.json({
      success: true,
      data,
      stats: getStats(),
    });
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data ucapan',
      error: error.message,
    });
  }
});

// 3. POST /api/wishes - Kirim ucapan & doa baru
app.post('/api/wishes', (req, res) => {
  try {
    const { name, category, attendance, pax, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap / kerabat wajib diisi.',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Untaian doa & ucapan selamat wajib diisi.',
      });
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const validCategory = category || 'Keluarga';
    const validAttendance = attendance === 'berhalangan' ? 'berhalangan' : 'hadir';
    const validPax = validAttendance === 'hadir' ? (pax || '1 Orang') : '-';
    const initial = trimmedName.charAt(0).toUpperCase();
    const avatarBg = getAvatarBg(validCategory);

    const insert = db.prepare(`
      INSERT INTO wishes (name, initial, avatar_bg, category, attendance, pax, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const result = insert.run(
      trimmedName,
      initial,
      avatarBg,
      validCategory,
      validAttendance,
      validPax,
      trimmedMessage
    );

    const newWish = {
      id: Number(result.lastInsertRowid),
      name: trimmedName,
      initial,
      avatarBg,
      category: validCategory,
      attendance: validAttendance,
      isAttending: validAttendance === 'hadir',
      pax: validPax,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
      timeAgo: 'Baru Saja',
    };

    res.status(201).json({
      success: true,
      message: 'Doa & ucapan restu Anda berhasil dikirimkan!',
      data: newWish,
      stats: getStats(),
    });
  } catch (error) {
    console.error('Error creating wish:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirimkan ucapan',
      error: error.message,
    });
  }
});

// 4. GET /api/stats - Statistik kehadiran & ucapan
app.get('/api/stats', (req, res) => {
  try {
    res.json({
      success: true,
      data: getStats(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST /api/gifts/confirm - Konfirmasi amplop / kado digital
app.post('/api/gifts/confirm', (req, res) => {
  try {
    const { senderName, bankTarget, amount, notes } = req.body;

    if (!senderName || !senderName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama pengirim wajib diisi.',
      });
    }

    const insert = db.prepare(`
      INSERT INTO gifts (sender_name, bank_target, amount, notes, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const result = insert.run(
      senderName.trim(),
      bankTarget || 'BCA',
      parseFloat(amount) || 0,
      notes ? notes.trim() : ''
    );

    res.status(201).json({
      success: true,
      message: 'Konfirmasi tanda kasih berhasil dicatat. Terima kasih banyak!',
      giftId: Number(result.lastInsertRowid),
    });
  } catch (error) {
    console.error('Error confirming gift:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mencatat konfirmasi tanda kasih',
      error: error.message,
    });
  }
});

// 6. GET /api/guest - Mendapatkan info tamu undangan
app.get('/api/guest', (req, res) => {
  const guestParam = req.query.to || req.query.guest || req.query.u || 'Bapak / Ibu / Saudara(i)';
  res.json({
    success: true,
    data: {
      guestName: guestParam,
      couple: 'Rizal & Putri',
      weddingDate: 'Sabtu, 18 Oktober 2025',
      venue: 'The Dharmawangsa Jakarta',
    },
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Backend Undangan Pernikahan Rizal & Putri `);
  console.log(` Server berjalan di http://localhost:${PORT} `);
  console.log(` API Endpoint: http://localhost:${PORT}/api/wishes `);
  console.log(` Database: SQLite (data/wedding.db) `);
  console.log(`===============================================`);
});

