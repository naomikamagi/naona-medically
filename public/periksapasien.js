function updateTime() {
    const dateTimeElement = document.getElementById("dateTime");
    const now = new Date();
    
    // Format waktu dan tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', options);
    const formattedTime = now.toLocaleTimeString('id-ID');

    dateTimeElement.innerHTML = `${formattedDate}, ${formattedTime}`;
}

// Panggil updateTime setiap detik
setInterval(updateTime, 1000);

// Panggil sekali saat halaman pertama kali dimuat
updateTime();

// URL API untuk melakukan request
const apiUrl = 'http://localhost:3000/api/pasien'; // Ganti dengan URL API yang sesuai

// Fungsi untuk menambahkan data ke tabel dan mengirim ke server
async function tambahData() {
    // Ambil nilai dari form input
    const nama = document.getElementById("nama").value;
    const status = document.getElementById("status").value;
    const kelas = document.getElementById("kelas").value;
    const jam = document.getElementById("jam").value;
    const keluhan = document.getElementById("keluhan").value;
    const keterangan = document.getElementById("keterangan").value;

    // Cek jika ada input yang kosong
    if (!nama || !status || !kelas || !jam || !keluhan || !keterangan) {
        alert("Mohon lengkapi semua kolom.");
        return;
    }

    try {
        // Kirim data ke server menggunakan metode POST
        const response = await fetch('/api/pasien', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama_pasien: nama,
                status_pasien: status,
                kelas,
                jam,
                keluhan,
                keterangan
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);

            // Tambahkan data ke tabel setelah berhasil disimpan di server
            const table = document.getElementById("pasienTable").getElementsByTagName("tbody")[0];
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${table.rows.length}</td>
                <td>${nama}</td>
                <td>${status}</td>
                <td>${kelas}</td>
                <td>${jam}</td>
                <td>${keluhan}</td>
                <td>${keterangan}</td>
                <td>
                    <button onclick="hapusData(this)">Hapus</button>
                </td>
            `;

            // Kosongkan form setelah menambahkan data
            document.getElementById("nama").value = "";
            document.getElementById("status").value = "";
            document.getElementById("kelas").value = "";
            document.getElementById("jam").value = "";
            document.getElementById("keluhan").value = "";
            document.getElementById("keterangan").value = "";
        } else {
            console.error('Gagal menambahkan data pasien');
            alert('Terjadi kesalahan saat menambahkan data.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal terhubung ke server.');
    }
}

function loadDataPasien() {
    fetch('/api/pasien')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#pasienTable tbody');
            tbody.innerHTML = ''; // Kosongkan tabel

            data.forEach((pasien, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${pasien.nama_pasien}</td>
                    <td>${pasien.status_pasien}</td>
                    <td>${pasien.kelas}</td>
                    <td>${pasien.jam}</td>
                    <td>${pasien.keluhan}</td>
                    <td>${pasien.keterangan}</td>
                    <td><button onclick="deletePasien(${pasien.id})">Hapus</button></td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Panggil fungsi untuk memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadDataPasien);

const deletePasien = async (id) => {
    try {
        const response = await fetch(`/api/pasien/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Data pasien berhasil dihapus:', data.message);

            // Memuat ulang data setelah penghapusan
            loadDataPasien();
        } else {
            const errorMessage = await response.text();
            console.error('Gagal menghapus data pasien:', errorMessage);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
};
