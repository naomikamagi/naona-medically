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


// script.js

// Mendapatkan elemen form dan daftar kontak
const emergencyForm = document.getElementById('emergencyForm');
const contactsList = document.getElementById('contactsList');

// Fungsi untuk menambahkan kontak ke daftar
function addEmergencyContact(contact) {
  const li = document.createElement('li');
  li.textContent = `${contact.contactName} (${contact.contactType}): ${contact.contactNumber}`;
  contactsList.appendChild(li);
}

// Menangani pengiriman form
emergencyForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const contactName = document.getElementById('contactName').value;
  const contactNumber = document.getElementById('contactNumber').value;
  const contactType = document.getElementById('contactType').value;

  // Menambahkan kontak ke daftar
  addEmergencyContact({ contactName, contactNumber, contactType });

  // Reset form
  emergencyForm.reset();
});

// script.js

// Fungsi untuk mengirim data kontak ke server
function saveContactToServer(contact) {
    fetch('/save-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Contact saved to database:', data);
    })
    .catch(error => {
      console.error('Error saving contact:', error);
    });
  }
  
  // Menangani pengiriman form
  emergencyForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const contactName = document.getElementById('contactName').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const contactType = document.getElementById('contactType').value;
  
    const contact = { contactName, contactNumber, contactType };
  
    // Menambahkan kontak ke daftar dan menyimpannya di server
    addEmergencyContact(contact);
    saveContactToServer(contact);
  
    // Reset form
    emergencyForm.reset();
  });

  // Menampilkan daftar kontak darurat yang ada
function loadEmergencyContacts() {
    fetch('/get-contacts')
      .then(response => response.json())
      .then(data => {
        data.forEach(contact => {
          addEmergencyContact(contact);
        });
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  }
  
  // Memuat kontak darurat saat halaman dimuat
  window.onload = loadEmergencyContacts;
  