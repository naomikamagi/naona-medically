const express = require('express');
const path = require('path');
const db = require('./db'); // Pastikan 'db.js' sudah benar

const app = express();

// Middleware untuk parsing JSON dan mengatur static file
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint untuk mengarahkan root URL ke nacidnay.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nacidnay.html'));
});

// Endpoint API untuk mengambil data pasien
app.get('/api/pasien', (req, res) => {
    const sql = 'SELECT * FROM pasien';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error mengambil data pasien:', err);
            res.status(500).send('Error mengambil data pasien');
        } else {
            res.json(results);
        }
    });
});

// Endpoint POST untuk menyimpan data pasien
app.post('/api/pasien', (req, res) => {
    const { nama_pasien, status_pasien, kelas, jam, keluhan, keterangan } = req.body;

    console.log('Data yang diterima:', req.body); // Debugging

    const sql = 'INSERT INTO pasien (nama_pasien, status_pasien, kelas, jam, keluhan, keterangan) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nama_pasien, status_pasien, kelas, jam, keluhan, keterangan], (err, result) => {
        if (err) {
            console.error('Error memasukkan data pasien:', err);
            res.status(500).send('Error memasukkan data pasien');
        } else {
            res.status(201).json({ message: 'Data pasien berhasil ditambahkan', id: result.insertId });
        }
    });
});

// Endpoint DELETE untuk menghapus data pasien
app.delete('/api/pasien/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM pasien WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error menghapus data pasien:', err);
            res.status(500).send('Error menghapus data pasien');
        } else {
            res.json({ message: 'Data pasien berhasil dihapus' });
        }
    });
});

// Route untuk mengambil semua data obat
app.get('/api/obat', (req, res) => {
    const query = 'SELECT * FROM obat';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Gagal mengambil data obat:', err);
            return res.status(500).json({ message: 'Gagal mengambil data' });
        }
        res.json(results); // Mengirimkan data obat dalam format JSON
    });
});

// Route untuk menambahkan data obat
app.post('/api/obat', (req, res) => {
    const { nama_obat, jenis_obat, stok, tgl_kadaluarsa } = req.body;

    if (!nama_obat || !jenis_obat || !stok || !tgl_kadaluarsa) {
        return res.status(400).json({ message: 'Semua kolom harus diisi!' });
    }

    const query = 'INSERT INTO obat (nama_obat, jenis_obat, stok, tgl_kadaluarsa) VALUES (?, ?, ?, ?)';
    db.query(query, [nama_obat, jenis_obat, stok, tgl_kadaluarsa], (err, results) => {
        if (err) {
            console.error('Gagal menambahkan data obat:', err);
            return res.status(500).json({ message: 'Gagal menambahkan data obat' });
        }
        res.status(201).json({ message: 'Data obat berhasil ditambahkan', id: results.insertId });
    });
});

// Route untuk menghapus data obat
app.delete('/api/obat/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM obat WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Gagal menghapus data obat:', err);
            return res.status(500).json({ message: 'Gagal menghapus data obat' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Data obat tidak ditemukan' });
        }

        res.json({ message: 'Data obat berhasil dihapus' });
    });
});

app.post('/rekam-medis', (req, res) => {
    const { nama_pasien, status_pasien, kelas_pasien, tgl_kunjungan, riwayat_penyakit, obat_dikonsumsi } = req.body;
    const query = 'INSERT INTO rekam_medis (nama_pasien, status_pasien, kelas_pasien, tgl_kunjungan, riwayat_penyakit, obat_dikonsumsi) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [nama_pasien, status_pasien, kelas_pasien, tgl_kunjungan, riwayat_penyakit, obat_dikonsumsi], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Rekam medis berhasil ditambahkan', id: result.insertId });
    });
});

// Mengupdate rekam medis berdasarkan ID
app.put('/rekam-medis/:id', (req, res) => {
    const { id } = req.params;
    const { nama_pasien, status_pasien, kelas_pasien, tgl_kunjungan, riwayat_penyakit, obat_dikonsumsi } = req.body;

    const query = 'UPDATE rekam_medis SET nama_pasien = ?, status_pasien = ?, kelas_pasien = ?, tgl_kunjungan = ?, riwayat_penyakit = ?, obat_dikonsumsi = ? WHERE id = ?';
    db.query(query, [nama_pasien, status_pasien, kelas_pasien, tgl_kunjungan, riwayat_penyakit, obat_dikonsumsi, id], (err, result) => {
        if (err) {
            console.error('Error updating rekam medis:', err);
            return res.status(500).send('Error updating rekam medis');
        }
        res.json({ message: 'Rekam medis berhasil diperbarui' });
    });
});


app.get('/rekam-medis', (req, res) => {
    const query = 'SELECT * FROM rekam_medis';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching rekam medis:', err);
            res.status(500).send('Error fetching rekam medis');
        } else {
            res.json(result);  // Pastikan data dikirim dalam format JSON
        }
    });
});

app.delete('/rekam-medis/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM rekam_medis WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting rekam medis:', err);
            res.status(500).send('Error deleting rekam medis');
        } else {
            res.json({ message: 'Rekam medis berhasil dihapus' });
        }
    });
});

// Jalankan server di port 3004
const PORT = 3004;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});