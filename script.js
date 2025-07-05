const apiKey = "9ab7d6647ba447788d232134250507";

async function getWeather(city) {
  const weatherBox = document.getElementById("weatherBox");

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
  const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    if (data.error) {
      alert(data.error.message);
      return;
    }

    document.getElementById("cityName").textContent = `${data.location.name}, ${data.location.country}`;
    document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
    document.getElementById("description").textContent = data.current.condition.text;
    document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity}%`;
    document.getElementById("wind").textContent = `Wind: ${data.current.wind_kph} km/h`;
    document.getElementById("sun").textContent = `Sunrise: ${forecastData.forecast.forecastday[0].astro.sunrise} | Sunset: ${forecastData.forecast.forecastday[0].astro.sunset}`;
    document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;

    // Animate card
    weatherBox.classList.add("show");

    // Dynamic background
    const condition = data.current.condition.text.toLowerCase();
    document.body.className = ""; // reset class

    if (condition.includes("sunny")) {
      document.body.classList.add("sunny");
    } else if (condition.includes("rain")) {
      document.body.classList.add("rainy");
    } else if (condition.includes("cloud")) {
      document.body.classList.add("cloudy");
    }
  } catch (error) {
    console.error("Weather fetch failed:", error);
    alert("Error fetching weather data.");
  }
}

// Detect user location
function detectUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(`${lat},${lon}`);
    }, () => {
      alert("Location access denied. Please search manually.");
    });
  } else {
    alert("Geolocation is not supported.");
  }
}

// Manual search
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) getWeather(city);
});

// Auto-load on page open
window.onload = detectUserLocation;
