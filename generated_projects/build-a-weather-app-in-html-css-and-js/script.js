// script.js
// Main application JavaScript functionality

// Import API module
const api = require('./api.js');

// Function to get user location
function getUserLocation() {
    // Get user location using geolocation API
    navigator.geolocation.getCurrentPosition(position => {
        // Return user location as an object
        return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
    });
}

// Function to display current weather
function displayWeather() {
    // Get user location
    const location = getUserLocation();

    // Get weather data using API
    api.getWeatherData(location.latitude, location.longitude)
        .then(data => {
            // Display current weather
            console.log(`Current weather: ${data.weather[0].description}`);
            console.log(`Temperature: ${data.main.temp}°C`);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Call displayWeather function to display current weather
displayWeather();
