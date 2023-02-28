const appId = '1f16dda34dcacec663d946a2cc294fbd'
let searchMethod = 'q'
let units = 'metric'

function searchWeather(searchTerm) {
    // hide weather app title
    const titleContainer = document.getElementById("titleContainer")
    titleContainer.style.opacity = 0;

    // get units based on toggle
    let units
    const unitsToggle = document.getElementById('toggle')
    if (unitsToggle.checked) {
        units = 'metric'
    } else {
        units = 'imperial'
    }

    //fetch openweathermap API
    fetch(`https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&appid=${appId}&units=${units}`).then(result => {
        return result.json()
}).then(result => {
    init(result)
})
}

// switch case to render picture based on weather
function init(resultFromServer) {

    // let body = document.getElementById("weatherContainer")
    const backgroundImageClear = 'linear-gradient(CornflowerBlue, white)'
    const backgroundImageClouds = 'linear-gradient(white, gray)'
    const backgroundImageRain = 'linear-gradient(Silver, SteelBlue)'
    const backgroundImageDrizzle = 'linear-gradient(LightGray, SteelBlue)'
    const backgroundImageMist = 'linear-gradient(white, LightCyan)'
    const backgroundImageThunder = 'linear-gradient(yellow, gray)'
    const backgroundImageSnow = 'linear-gradient(aliceblue, white)'
    const backgroundImageAsh = 'linear-gradient(white, Sienna)'
    const backgroundImageSand = 'linear-gradient(white, SandyBrown)'

    switch (resultFromServer.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = backgroundImageClear
            break

        case 'Clouds':
            document.body.style.backgroundImage = backgroundImageClouds
            break

        case 'Rain':
            document.body.style.backgroundImage = backgroundImageRain
            break

        case 'Drizzle':
            document.body.style.backgroundImage = backgroundImageDrizzle
            break

        case 'Mist':
        case 'Fog':
        case 'Tornado':
            document.body.style.backgroundImage = backgroundImageMist
            break

        case 'Thunderstorm':
            document.body.style.backgroundImage = backgroundImageThunder
            break

        case 'Snow':
            document.body.style.backgroundImage = backgroundImageSnow
            break

        case 'Ash':
        case 'Smoke':
        case 'Dust':
            document.body.style.backgroundImage = backgroundImageAsh
            break

        case 'Squall':
        case 'Haze':
        case 'Sand':
            document.body.style.backgroundImage = backgroundImageSand
            break

        default:

            break
    }
    
const weatherDescription = document.getElementById("weatherDescription")
const temperature = document.getElementById("temperature")
const humidity = document.getElementById("humidity")
const windSpeed = document.getElementById("windSpeed")
const cityName = document.getElementById("cityName")
const weatherIcon = document.getElementById("weatherIcon")
const windIcon = document.getElementById("windIcon")
const humidityIcon = document.getElementById("humidityIcon")
const tempMinIcon = document.getElementById("tempMinIcon")
const tempMaxIcon = document.getElementById("tempMaxIcon")
const feelsLike = document.getElementById("feelsLike")
const tempMax = document.getElementById("tempMax")
const tempMin = document.getElementById("tempMin")

// use sunset/sunrise to calculate whether it is day or night in searched location
let sunrise = resultFromServer.sys.sunrise
let sunset = resultFromServer.sys.sunset
let currentTime = new Date().getTime() / 1000
let dayOrNight

if (currentTime >= sunrise && currentTime < sunset) {
    dayOrNight = 'day'
} else {
    dayOrNight = 'night'
}

console.log(resultFromServer)

// open weather map icons
// weatherIcon.src = 'http://openweathermap.org/img/wn/' + resultFromServer.weather[0].icon + '@2x.png'

// Erik Flowers icons
weatherIcon.className = 'wi wi-owm-' + dayOrNight + '-' + resultFromServer.weather[0].id
windIcon.src = "images/wind.svg"
humidityIcon.src = "images/humidity.svg"
tempMinIcon.src = "images/arrow-down.svg"
tempMaxIcon.src = "images/arrow-up.svg"


let resultDescription = resultFromServer.weather[0].description
// capitalise first letter of weather description
weatherDescription.innerText = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1)

// define units of windspeed
let windSpeedUnits
if (units === 'metric') {
    if (Math.floor(resultFromServer.wind.speed) === 1) {
        windSpeedUnits = ' meter per second'
    } else {
        windSpeedUnits = ' meters per second'
    }
} else {
    if (Math.floor(resultFromServer.wind.speed) === 1) {
        windSpeedUnits = ' mile per hour'
    } else {
        windSpeedUnits = ' miles per hour'
    }
}

feelsLike.innerHTML = 'Feels like ' + Math.floor(resultFromServer.main.feels_like) + "&#176"
tempMax.innerHTML = Math.floor(resultFromServer.main.temp_max) + "&#176"
tempMin.innerHTML = Math.floor(resultFromServer.main.temp_min) + "&#176"
cityName.innerHTML = resultFromServer.name
temperature.innerHTML = Math.floor(resultFromServer.main.temp) + "&#176"
windSpeed.innerHTML = Math.floor(resultFromServer.wind.speed) + windSpeedUnits
humidity.innerHTML = resultFromServer.main.humidity + ' percent'

// get current date
const today = new Date()
const year = today.getFullYear()

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let month = months[today.getMonth()]

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let day = days[today.getDay()]

let date = today.getDate()

const currentDate = document.getElementById("currentDate")
currentDate.innerText = day + ', ' + date + ' ' + month + ' ' + year

}

const findLocation = () => {
    const success = (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const limit = 1

        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${appId}`).then(result => {
            return result.json()
        }).then(result => {
            let currentLocation = result[0].name
            searchWeather(currentLocation)
        })
    }

    const error = (position) => {
        console.log('Unable to retrieve location')
    }
    navigator.geolocation.getCurrentPosition(success, error)
}


// search weather when search button is clicked
document.getElementById("searchButton").addEventListener('click', () => {
    let searchTerm = document.getElementById("searchInput").value
    if(searchTerm) {
        searchWeather(searchTerm)
    }
})

document.getElementById("toggle").addEventListener('change', ()=> {
    const toggle = document.getElementById("toggle")
    const imperialLabel = document.getElementById("imperialLabel")
    const metricLabel = document.getElementById("metricLabel")

    if (!toggle.checked) {
        // if toggle not checked
        // hide metric unit label
        metricLabel.style.opacity = 0;
        // display imperial unit label
        imperialLabel.style.opacity = 1;
        // set units to imperial
        units = 'imperial'
    } else {
        // else, toggle checked, display metric units
        imperialLabel.style.opacity = 0;
        metricLabel.style.opacity = 1;
        units = 'metric'
    }

    // re-search everytime units are changed to automatically update DOM
    let searchTerm = document.getElementById("cityName").innerHTML
    if(searchTerm) {
        searchWeather(searchTerm)
    }
})
