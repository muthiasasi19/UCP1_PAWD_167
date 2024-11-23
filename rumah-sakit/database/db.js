const mysql = require('mysql2');

// Membuat koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',        // Ganti dengan host database Anda (misalnya 'localhost')
    user: 'root',             // Ganti dengan username MySQL Anda
    password: '',             // Ganti dengan password MySQL Anda
    database: 'rumah_sakit'   // Ganti dengan nama database Anda
});

// Cek koneksi
db.connect((err) => {
    if (err) {
        console.error('Error koneksi ke database:', err);
    } else {
        console.log('Koneksi ke database berhasil');
    }
});

module.exports = db;
