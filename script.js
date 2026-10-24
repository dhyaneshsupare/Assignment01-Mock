document.addEventListener('DOMContentLoaded', () => {
  //create input events for every input field.
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");

  //Data coming from weather API
  const cityName = document.getElementById("city-name");
  const temprature = document.getElementById("temprature");
  const description = document.getElementById("description");
  const windSpeed = document.getElementById("speed");
  const humidity = document.getElementById("humidity");

  // New DOM elements for added functionalities
  const errorMessage = document.getElementById("error-message");
  const loadingSpinner = document.getElementById("loading-spinner");
  const forecastContainer = document.getElementById("forecast-container");
  const celsiusBtn = document.getElementById("celsius-btn");
  const fahrenheitBtn = document.getElementById("fahrenheit-btn");

  //API KEY
  const API_KEY = "e9319a43e6e2bfafb2facadf5868729f";
  // We directly include AAPI key in our code which is not recommended practice we usually keep it in .env file.

  // State to support °C / °F toggling without re-fetching
  let currentUnit = "C";
  let storedWeatherData = null;

  //Load most recently searched city from localStorage on page refresh
  const savedCity = localStorage.getItem("lastSearchedCity");
  if (savedCity) {
    cityInput.value = savedCity;
    handleWeatherSearch(savedCity);
  }

  //making searchBtn functional.
  searchBtn.addEventListener("click", async () => {
    //taking city input from user
    const city = cityInput.value.trim();
    if (!city) return; //alert("City not found!!!!!!!"); //If the city name didn't match the dataset or wrong spelling is typed.
    await handleWeatherSearch(city);
  });

  // Helper that wraps your try-catch logic so both Search button and localStorage load can use it
  async function handleWeatherSearch(city) {
    try {
      //Show loading spinner while pending
      loadingSpinner.classList.remove("hidden");
      errorMessage.classList.add("hidden");
      weatherInfo.classList.add("hidden");

      const weatherData = await fetchData(city);
      storedWeatherData = weatherData;

      //Save valid searched city in localStorage
      localStorage.setItem("lastSearchedCity", weatherData.current.name);

      displayData(weatherData);
    } catch (error) {
      showError(error.message);
    } finally {
      //Hide loading spinner once request finishes
      loadingSpinner.classList.add("hidden");
    }
  }

  //Implementing function that will fetch data from API.
  async function fetchData(city) {
    //get the data from url.
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error(
        "City not found! Please check the spelling and try again.",
      );
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return { current: currentData, forecast: forecastData };
  }

  //Implementing function which will display data on UI.
  //We fetched the response from API, now we have to display it on UI(browser).
  function displayData(weatherData) {
    console.log(weatherData);
    const { name, main, weather, wind } = weatherData.current;
    cityName.textContent = name;
    temprature.textContent = `Temprature: ${main.temp}`;
    description.textContent = `Conditions: ${weather[0].description}`;
    humidity.textContent = `Humidity: ${main.humidity}`;
    windSpeed.textContent = `Wind-Speed: ${wind.speed} m/s`;

    //Render 3-Day Forecast
    forecastContainer.innerHTML = "";
    const dailyForecasts = weatherData.forecast.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 3);

    dailyForecasts.forEach((day) => {
      const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
                <p><strong>${date}</strong></p>
                <p>${formatTemp(day.main.temp)}</p>
                <p>${day.weather[0].main}</p>
            `;
      forecastContainer.appendChild(card);
    });

    errorMessage.classList.add("hidden");
    weatherInfo.classList.remove("hidden");
  }

  function showError(message) {
    weatherInfo.classList.add("hidden");
    errorMessage.textContent =
      message || "Something went wrong. Please try again.";
    errorMessage.classList.remove("hidden");
  }

  function formatTemp(celsiusTemp) {
    if (currentUnit === "F") {
      const fahrenheit = (celsiusTemp * 9) / 5 + 32;
      return `${fahrenheit.toFixed(1)} °F`;
    }
    return `${celsiusTemp.toFixed(1)} °C`;
  }

  //Helper and Event Listeners for Celsius / Fahrenheit Toggle
  celsiusBtn.addEventListener("click", () => {
    if (currentUnit !== "C") {
      currentUnit = "C";
      celsiusBtn.classList.add("active-unit");
      fahrenheitBtn.classList.remove("active-unit");
      if (storedWeatherData) displayData(storedWeatherData);
    }
  });

  fahrenheitBtn.addEventListener("click", () => {
    if (currentUnit !== "F") {
      currentUnit = "F";
      fahrenheitBtn.classList.add("active-unit");
      celsiusBtn.classList.remove("active-unit");
      if (storedWeatherData) displayData(storedWeatherData);
    }
  });
})