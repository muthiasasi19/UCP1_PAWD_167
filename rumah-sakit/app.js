const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));  // Mengatur agar file CSS dapat diakses
// Mengatur view engine menggunakan EJS
app.set('view engine', 'ejs');
const port = 3000;

// Koneksi ke database MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Ganti dengan username MySQL Anda
    password: '', // Ganti dengan password MySQL Anda
    database: 'rumah_sakit'
});

// Hubungkan ke database
db.connect(err => {
    if (err) {
        console.error('Gagal terkoneksi ke database:', err);
    } else {
        console.log('Terhubung ke database MySQL');
    }
});

// Middleware untuk parsing body request
app.use(bodyParser.urlencoded({ extended: true }));



// Route untuk menampilkan data dokter
app.get('/', (req, res) => {
    db.query('SELECT * FROM dokter', (err, results) => {
        if (err) throw err;
        res.render('index', { dokter: results });
    });
});

// Route untuk menambah data dokter
app.get('/add', (req, res) => {
    // Kirimkan objek dokter kosong untuk sinkronisasi dengan form edit
    const dokter = {
        nama: '',
        spesialisasi: '',
        jadwal: ''
    };
    res.render('add', { dokter }); // Pastikan render objek dokter kosong
});

app.post('/add', (req, res) => {
    const { nama, spesialisasi, jadwal } = req.body;
    
    // Pastikan semua field diisi
    if (!nama || !spesialisasi || !jadwal) {
        return res.send('Semua field harus diisi!');
    }

    db.query('INSERT INTO dokter (nama, spesialisasi, jadwal) VALUES (?, ?, ?)', [nama, spesialisasi, jadwal], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


// Route untuk mengedit data dokter
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM dokter WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { dokter: results[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nama, spesialisasi, jadwal } = req.body;
    db.query('UPDATE dokter SET nama = ?, spesialisasi = ?, jadwal = ? WHERE id = ?', [nama, spesialisasi, jadwal, id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Route untuk menghapus data dokter
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM dokter WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
