// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCxaPiM9pboYy1UWUIMEoihkxe7rQuexGg",
    authDomain: "car-environment-monitor.firebaseapp.com",
    databaseURL: "https://car-environment-monitor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "car-environment-monitor",
    storageBucket: "car-environment-monitor.firebasestorage.app",
    messagingSenderId: "982089273392",
    appId: "1:982089273392:web:0dd94823459eee90ab5df5"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, 'car_environment_data');

// Listen for real-time data updates
onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('temperature').innerText = `${data.temperature} °C` || "No data";
        document.getElementById('humidity').innerText = `${data.humidity} %` || "No data";
        document.getElementById('airQuality').innerText = `${data.air_quality} AQI` || "No data";

        // Air Quality Status
        const airQualityValue = parseInt(data.air_quality) || 0;
        document.getElementById('airQualityDesc').innerHTML = 
            airQualityValue > 80 ? "<span class='good'>Good: Fresh air inside! 🌿</span>" : 
            "<span class='bad'>Bad: Poor air quality ⚠️</span>";
    }
}, (error) => {
    console.error("❌ Error reading data:", error);
});

// Function to switch between tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        this.classList.add('active');
    });
});

// Simulated Sensor Update
function updateSensorData(temperature, humidity, airQuality) {
    set(dataRef, {
        temperature: temperature,
        humidity: humidity,
        air_quality: airQuality,
        timestamp: new Date().toISOString()
    })
    .then(() => console.log("✅ Data updated successfully!"))
    .catch(error => console.error("❌ Error updating data:", error));
}

// Simulating new sensor values
setInterval(() => {
    const temp = Math.floor(Math.random() * 10) + 25; // Random 25-35°C
    const humidity = Math.floor(Math.random() * 20) + 50; // Random 50-70%
    const airQuality = Math.floor(Math.random() * 150) + 50; // Random AQI 50-200

    updateSensorData(temp, humidity, airQuality);
}, 5000); // Updates every 5 seconds
