// Fungsi untuk memperbarui waktu dan tanggal di sidebar
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

// Fungsi untuk menambahkan data obat ke tabel dan mengirim ke server
async function tambahObat() {
    // Ambil nilai dari form input
    const namaObat = document.getElementById("namaObat").value;
    const jenisObat = document.getElementById("jenisObat").value;
    const stok = document.getElementById("stokObat").value;
    const tglKadaluarsa = document.getElementById("tglKadaluarsa").value;

    // Cek jika ada input yang kosong
    if (!namaObat || !jenisObat || !stok || !tglKadaluarsa) {
        alert("Mohon lengkapi semua kolom.");
        return;
    }

    try {
        // Kirim data obat ke server menggunakan metode POST
        const response = await fetch('/api/obat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama_obat: namaObat,
                jenis_obat: jenisObat,
                stok: stok,
                tgl_kadaluarsa: tglKadaluarsa
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);

            // Tambahkan data ke tabel setelah berhasil disimpan di server
            const table = document.getElementById("obatTable").getElementsByTagName("tbody")[0];
            const newRow = table.insertRow();
            newRow.innerHTML = `
                <td>${table.rows.length}</td>
                <td>${namaObat}</td>
                <td>${jenisObat}</td>
                <td>${stok}</td>
                <td>${tglKadaluarsa}</td>
                <td>
                    <button onclick="hapusObat(${result.id})">Hapus</button>
                </td>
            `;

            // Kosongkan form setelah menambahkan data
            document.getElementById("namaObat").value = "";
            document.getElementById("jenisObat").value = "";
            document.getElementById("stokObat").value = "";
            document.getElementById("tglKadaluarsa").value = "";
        } else {
            console.error('Gagal menambahkan data obat');
            alert('Terjadi kesalahan saat menambahkan data.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal terhubung ke server.');
    }
}

// Fungsi untuk memuat data obat dari server dan menampilkan di tabel
function loadDataObat() {
    fetch('/api/obat')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#obatTable tbody');
            tbody.innerHTML = ''; // Kosongkan tabel

            data.forEach((obat, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${obat.nama_obat}</td>
                    <td>${obat.jenis_obat}</td>
                    <td>${obat.stok}</td>
                    <td>${obat.tgl_kadaluarsa}</td>
                    <td><button onclick="hapusObat(${obat.id})">Hapus</button></td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Panggil fungsi untuk memuat data obat saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadDataObat);

// Fungsi untuk menghapus data obat
function hapusObat(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data obat ini?')) {
        fetch(`/api/obat/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadDataObat(); // Memuat ulang data setelah penghapusan
        })
        .catch(error => console.error('Error menghapus data obat:', error));
}
}


