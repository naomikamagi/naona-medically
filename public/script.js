// Seleksi elemen yang dibutuhkan
const addPatientForm = document.getElementById("addPatientForm");

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

const ctx = document.getElementById('chartPasien').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [{
            label: 'Kunjungan Pasien',
            data: [10, 15, 12, 20, 18, 25, 22, 30, 28, 25, 35, 40], // data dummy, sesuaikan sesuai kebutuhan
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
