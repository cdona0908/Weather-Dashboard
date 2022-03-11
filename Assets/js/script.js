//Global Variables and Selectors
var apiKey = "e1ab46c5537b3f0c9d3940457509a86b";
var cityNameEl = document.querySelector("#city-search");
var cityFormEl = document.querySelector("#city-form");
var currentWeatherContainer = document.querySelector("#current-weather");
var cityInfoEl = document.querySelector("#cityInfo");
var currentWeatherIconEl = document.querySelector("#current-weather-icon");
var weatherListEl = document.querySelector("#weather-elements-list");
var currentTempEl = document.querySelector("#temperature");
var currentHumidityEl = document.querySelector("#humidity");
var currentWindEl = document.querySelector("#wind");
var currentUVIndexEl = document.querySelector("#uv");
var currentUVIValueEl = document.querySelector("#uviValue");
var weatherForescastContainer = document.querySelector("#forecast");



//Functions

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var city = cityNameEl.value.trim();
  
    if (city) {
      getCityWeather(city);
  
      // clear old content
      currentWeatherContainer.textContent = "";
      weatherForescastContainer.textContent = "";
      cityNameEl.value = "";
    } else {
      alert("Please enter a City");
    }
};

//Get info from openweathermap API

var getCityWeather = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial" + "&appid=" + apiKey;
    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if(response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data); 
                //call function to display weather info
                displayWeather(data);
            });
        }else {
            alert('Error: City Not Found');
        }
    })
    .catch(function(error){
        alert("Unable to connect to OpenWeatherMap");
    });
};

var displayWeather = function(data){
    //display city name and date
    cityInfoEl.innerHTML = data.name;
    currentWeatherContainer.appendChild(cityInfoEl);
    //display icon for current weather
    var currentWeatherIcon = data.weather[0].icon;
    currentWeatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    cityInfoEl.appendChild(currentWeatherIconEl);
    // display current temperature
    currentTempEl.innerHTML= "Temperature: " + data.main.temp + " &#176F";
    //weatherListEl.appendChild(currentTempEl);
    // display current humidity 
    currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + " %";
    //weatherListEl.appendChild(currentHumidityEl);
    // display current wind speed
    currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " mph";
    //weatherListEl.appendChild(currentWindEl);
    // define latitude and longitude to call API for UVI
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    var uviAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&daily&appid=" + apiKey;
    fetch(uviAPIUrl)
    .then(function(response){
        //request was successful
        if(response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data); 
                //call function to display weather info
                //displayWeather(data);
                var uviValue = data.current.uvi;
                currentUVIValueEl.innerHTML = uviValue;
                
                if(uviValue >= 0 && uviValue <3){
                    //favorable
                    currentUVIValueEl.setAttribute("class", "bg-success border rounded px-1 text-white font-weight-bold");
                } else if (uviValue >= 3 && uviValue < 8){
                    //moderate
                    currentUVIValueEl.setAttribute("class", "bg-warning border rounded px-1 text-white font-weight-bold");
                } else{
                    //severe
                    currentUVIValueEl.setAttribute("class", "bg-danger border rounded px-1 text-white font-weight-bold ");
                }
                currentUVIndexEl.innerHTML = "UV Index: ";
                currentUVIndexEl.appendChild(currentUVIValueEl);
                weatherListEl.appendChild(currentUVIndexEl);
                console.log('This is the UVI',uviValue);
            });
        }else {
            alert('Error: UVI for this city Not Found');
        }        
    })
    .catch(function(error){
        alert("Unable to connect to OpenWeatherMap");
    });
       


    weatherListEl.appendChild( currentWindEl, currentHumidityEl, currentTempEl);

    currentWeatherContainer.appendChild(weatherListEl);

    
    
    // var windSpeed = data.wind.speed;
    // console.log (windSpeed);
    
    //create element for city name
    // var cityEl = document.createElement("h3");
    // cityEl.classList = "ml-2";
    // cityEl.textContent = cityName;

    //create element for icon
    

    

};

//Event Listeners
cityFormEl.addEventListener("submit",formSubmitHandler);