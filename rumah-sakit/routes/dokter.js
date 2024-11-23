const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Koneksi MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rumah_sakit',
});

// Data Array Dummy (untuk penilaian menggunakan Array)
let dokterArray = [
  { id: 1, nama: 'Dr. Ahmad', spesialis: 'Kardiologi', pengalaman: 10, no_telp: '081234567890' },
  { id: 2, nama: 'Dr. Budi', spesialis: 'Pediatri', pengalaman: 8, no_telp: '081234567891' },
];

// Route GET - Lihat Semua Dokter
router.get('/', (req, res) => {
  db.query('SELECT * FROM dokter', (err, results) => {
    if (err) throw err;
    res.render('list', { dokterArray: dokterArray, dokterDB: results });
  });
});

// Route GET - Tambah Dokter (Form)
router.get('/tambah', (req, res) => {
  res.render('create');
});

// Route POST - Tambah Dokter
router.post('/tambah', (req, res) => {
  const { nama, spesialis, pengalaman, no_telp } = req.body;

  // Tambah ke Array
  dokterArray.push({ id: dokterArray.length + 1, nama, spesialis, pengalaman: parseInt(pengalaman), no_telp });

  // Tambah ke Database
  db.query('INSERT INTO dokter SET ?', { nama, spesialis, pengalaman, no_telp }, (err, results) => {
    if (err) throw err;
    res.redirect('/dokter');
  });
});

// Route GET - Edit Dokter (Form)
router.get('/edit/:id', (req, res) => {
  const dokterID = req.params.id;

  db.query('SELECT * FROM dokter WHERE id = ?', [dokterID], (err, result) => {
    if (err) throw err;
    res.render('edit', { dokter: result[0] });
  });
});

// Route POST - Update Dokter
router.post('/edit/:id', (req, res) => {
  const dokterID = req.params.id;
  const { nama, spesialis, pengalaman, no_telp } = req.body;

  // Update di Array
  const index = dokterArray.findIndex(d => d.id == dokterID);
  if (index !== -1) {
    dokterArray[index] = { id: dokterID, nama, spesialis, pengalaman: parseInt(pengalaman), no_telp };
  }

  // Update di Database
  db.query('UPDATE dokter SET ? WHERE id = ?', [{ nama, spesialis, pengalaman, no_telp }, dokterID], (err) => {
    if (err) throw err;
    res.redirect('/dokter');
  });
});

// Route GET - Hapus Dokter
router.get('/hapus/:id', (req, res) => {
  const dokterID = req.params.id;

  // Hapus dari Array
  dokterArray = dokterArray.filter(d => d.id != dokterID);

  // Hapus dari Database
  db.query('DELETE FROM dokter WHERE id = ?', [dokterID], (err) => {
    if (err) throw err;
    res.redirect('/dokter');
  });
});

module.exports = router;
