const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Sesuaikan dengan user MySQL Anda
    password: '',       // Sesuaikan dengan password MySQL Anda
    database: 'db_kk'   // Nama database yang Anda gunakan
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
    } else {
        console.log('Terhubung ke database MySQL');
    }
});

module.exports = db;