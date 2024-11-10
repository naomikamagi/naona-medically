function updateTime() {
    const dateTimeElement = document.getElementById("dateTime");
    const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', options);
    const formattedTime = now.toLocaleTimeString('id-ID');

    dateTimeElement.innerHTML = `${formattedDate}, ${formattedTime}`;
}

setInterval(updateTime, 1000);
updateTime();

function tambahRekamMedis() {
    const nama_pasien = document.getElementById('nama_pasien').value;
    const status_pasien = document.getElementById('status_pasien').value;
    const kelas_pasien = document.getElementById('kelas_pasien').value;
    const tgl_kunjungan = document.getElementById('tgl_kunjungan').value;
    const riwayat_penyakit = document.getElementById('riwayat_penyakit').value;
    const obat_dikonsumsi = document.getElementById('obat_dikonsumsi').value;

    if (!nama_pasien || !status_pasien || !kelas_pasien || !tgl_kunjungan || !riwayat_penyakit || !obat_dikonsumsi) {
        alert('Semua kolom harus diisi!');
        return;
    }

    const newRekamMedis = {
        nama_pasien,
        status_pasien,
        kelas_pasien,
        tgl_kunjungan,
        riwayat_penyakit,
        obat_dikonsumsi
    };

    // Mengirim data ke server menggunakan fetch
    fetch('/rekam-medis', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRekamMedis)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Rekam medis berhasil ditambahkan:', data);
        // Menambahkan data baru ke tabel (di sisi klien)
        tambahKeTabel(newRekamMedis);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Mengosongkan form setelah data dikirim
    document.getElementById('nama_pasien').value = '';
    document.getElementById('status_pasien').value = '';
    document.getElementById('kelas_pasien').value = '';
    document.getElementById('tgl_kunjungan').value = '';
    document.getElementById('riwayat_penyakit').value = '';
    document.getElementById('obat_dikonsumsi').value = '';
}

// Fungsi untuk menambah data ke tabel secara dinamis
function tambahKeTabel(data) {
    const tableBody = document.getElementById('rekamMedisTableBody');
    const row = document.createElement('tr');
    const rowIndex = tableBody.rows.length + 1;

    row.innerHTML = `
        <td>${rowIndex}</td>
        <td>${data.nama_pasien}</td>
        <td>${data.status_pasien}</td>
        <td>${data.kelas_pasien}</td>
        <td>${data.tgl_kunjungan}</td>
        <td>${data.riwayat_penyakit}</td>
        <td>${data.obat_dikonsumsi}</td>
        <td><button onclick="hapusRekamMedis(this)">Hapus</button></td>
    `;
    
    tableBody.appendChild(row);
}

document.addEventListener("DOMContentLoaded", function() {
    // Panggil API untuk mendapatkan data rekam medis dan tampilkan di tabel
    fetch('/rekam-medis')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('rekamMedisTableBody');
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${item.nama_pasien}</td>
                    <td>${item.status_pasien}</td>
                    <td>${item.kelas_pasien}</td>
                    <td>${item.tgl_kunjungan}</td>
                    <td>${item.riwayat_penyakit}</td>
                    <td>${item.obat_dikonsumsi}</td>
                    <td>
                        <button onclick="hapusRekamMedis(${item.id}, this)">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
});

function hapusRekamMedis(id, button) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        fetch(`/rekam-medis/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            // Hapus baris dari tabel
            const row = button.parentNode.parentNode;
            row.parentNode.removeChild(row);
            alert('Rekam medis berhasil dihapus');
        })
        .catch(error => console.error('Error:', error));
    }
}


// Update rekam medis
function updateRekamMedis(id) {
    const nama_pasien = document.getElementById('nama_pasien').value;
    const status_pasien = document.getElementById('status_pasien').value;
    const kelas_pasien = document.getElementById('kelas_pasien').value;
    const tgl_kunjungan = document.getElementById('tgl_kunjungan').value;
    const riwayat_penyakit = document.getElementById('riwayat_penyakit').value;
    const obat_dikonsumsi = document.getElementById('obat_dikonsumsi').value;

    const updatedData = {
        nama_pasien,
        status_pasien,
        kelas_pasien,
        tgl_kunjungan,
        riwayat_penyakit,
        obat_dikonsumsi
    };

    fetch(`/rekam-medis/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();  // Reload halaman setelah data diupdate
    })
    .catch(err => console.error('Error updating rekam medis:', err));
}

