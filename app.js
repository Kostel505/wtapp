import moment from "moment";
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const timezoneEl = document.getElementById('time-zone');
const citynameEl = document.getElementById('cityname');
const currentEl = document.getElementById('current-weather');
const futureEl = document.getElementById('daily-forecast');
const coords = document.getElementById('coords');
const searchbar = document.querySelector("#search-bar");
const searchbutton = document.querySelector(".search button");
const defaultCity = "Ostrava";
const apikey = "ac6dc6a813165b3bb7ec47c7d5e874d8";
const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek'];
const months = ['Leden', 'Únor', 'Březen', 'Duben',
    'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen',
    'Listopad', 'Prosinec'];
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getTime();
    dateEl.innerHTML = days[day] + ', ' + date + '. ' + months[month];
    timeEl.innerHTML = moment(hour).format("HH:mm");
}, 1000);
getLocation();
searchByCity(defaultCity);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((succes) => {
            const { latitude, longitude } = succes.coords;
            fetch("https://api.openweathermap.org/data/2.5/weather?lat=" +
                latitude +
                "&lon=" + longitude +
                "&lang=cz&units=metric"
                + "&appid=" + apikey)
                .then(res => res.json())
                .then(data => {
                //console.log(data);
                showCurrentData(data);
                getWeatherData(latitude, longitude);
            });
        });
    }
    else {
        searchByCity(defaultCity);
    }
}
function showCurrentData(data) {
    const { name } = data;
    const { temp, feels_like, humidity } = data.main;
    const { speed } = data.wind;
    const { description, icon } = data.weather[0];
    const { lat, lon } = data.coord;
    console.log(data);
    getWeatherData(lat, lon);
    coords.innerHTML = "N:" + lat + " E:" + lon;
    citynameEl.innerHTML = name;
    currentEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + icon + "@4x.png' alt='weather icon' class='wicon'>"
        + "<div class='temp'>" + description + " " + temp.toFixed(1) + " &#176;C</div>"
        + "<div class='current-item'>"
        + "<div>Pocitová teplota</div>"
        + "<div> " + feels_like.toFixed(1) + "&#176;C</div>"
        + "</div>"
        + "<div class='current-item'>"
        + "<div>Vlhkost</div>"
        + "<div>" + humidity + "%</div> "
        + "</div>"
        + "<div class='current-item'>"
        + "<div>Rychlost větru</div>"
        + "<div>" + speed + " m/s</div>"
        + "</div>";
}
function searchByCity(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q="
        + city
        + "&units=metric&lang=cz&appid="
        + apikey)
        .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            return searchByCity(defaultCity);
        }
    })
        .then((data) => {
        showCurrentData(data);
    });
}
function search() {
    searchByCity(searchbar.value);
}
searchbutton.addEventListener("click", function () {
    search();
});
searchbar.addEventListener("keyup", function (event) {
    if (event.key == "Enter")
        search();
    searchbar.value = "";
});
function getWeatherData(lat, lon) {
    let otherDay = "";
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" + lon +
        "&lang=cz&exclude=hourly,minutely&units=metric"
        + "&appid=" + apikey)
        .then(res => res.json())
        .then(data => {
        console.log(data);
        timezoneEl.innerHTML = data.timezone;
        data.daily.forEach((day, idx) => {
            if (idx == 0) {
                //console.log(day);
            }
            else {
                // console.log(day);
                otherDay += `
                    <div class="daily-forecast" id="daily-forecast">
                        
                        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon" class="w-icon">
                        <div class="temp">Den ${day.temp.day.toFixed(1)}&#176;C</div>
                        <div class="temp">Noc ${day.temp.night.toFixed(1)}&#176;C</div>
                    </div>`;
            }
        });
        futureEl.innerHTML = otherDay;
    });
}
