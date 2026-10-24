document.addEventListener('DOMContentLoaded', () => {
    //create input events for every input field.
    const cityInput = document.getElementById('city-input')
    const searchBtn = document.getElementById("get-weather-btn")
    const weatherInfo = document.getElementById("weather-info")
    
    //Data coming from weather API
    const cityName = document.getElementById("city-name")
    const temprature = document.getElementById("temprature")
    const description = document.getElementById("description")
    const windSpeed = document.getElementById("speed")
    const humidity = document.getElementById("humidity")
    
    //API KEY
    const API_KEY = "e9319a43e6e2bfafb2facadf5868729f";
    // We directly include AAPI key in our code which is not recommended practice we usually keep it in .env file.

    //making searchBtn functional.
    searchBtn.addEventListener('click', async() => {
        //taking city input from user
        const city = cityInput.value.trim()
        if(!city) return;  //alert("City not found!!!!!!!"); //If the city name didn't match the dataset or wrong spelling is typed.

        //showing API data. Using try-catch because it can throw some errors(maybe).
        try {
            const weatherData = await fetchData(city)
            displayData(weatherData)
        } catch (error) {
            // showError()
        }
    })

    //Implementing function that will fetch data from API.
    async function fetchData(city) {
        //get the data from url.
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`

        //fetch request for API.
        const response = await fetch(url)
        console.log(typeof response)
        console.log("RESPONSE", response)

        if(!response.ok){
            throw new Error("City not found!!!!!!") //Throwing this error here instead of at in input field.
        }
        
        const data = await response.json()
        return data;
    }
    
    //Implementing function which will display data on UI.
    //We fetched the response from API, now we have to display it on UI(browser).
    function displayData(weatherData) {
        console.log(weatherData)
        const { name, main, weather, wind } = weatherData;
        cityName.textContent = name
        temprature.textContent = `Temprature: ${main.temp}`
        description.textContent = `Conditions: ${weather[0].description}`
        humidity.textContent = `Humidity: ${main.humidity}`;
        windSpeed.textContent = `Wind-Speed: ${wind.speed}`;
    }

    // function showError() {
    //     //Displaying all errors.
    // }
})