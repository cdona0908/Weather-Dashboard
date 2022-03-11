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
    var date = new Date (data.dt * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    
    cityInfoEl.innerHTML = data.name + " "+ month + "/" + day + "/" + year ;
    currentWeatherContainer.appendChild(cityInfoEl);
    //display icon for current weather
    var currentWeatherIcon = data.weather[0].icon;
    currentWeatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + currentWeatherIcon + ".png");
    cityInfoEl.appendChild(currentWeatherIconEl);
    // display current temperature
    currentTempEl.innerHTML= "Temperature: " + data.main.temp + " &#176F";
    
    // display current humidity 
    currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + " %";
    
    // display current wind speed
    currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " mph";
    
    // define latitude and longitude to call API for UVI
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    var uviAPIUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial"+ "&daily&appid=" + apiKey;
    fetch(uviAPIUrl)
    .then(function(response){
        //request was successful
        if(response.ok){
            console.log(response);
            response.json().then(function(data){
                console.log(data); 
                
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
                displayForecast(data);
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
};

var displayForecast = function(data) {
   // var forecastEl = 

 var dailyData = data.daily;
 console.log(dailyData);
 for ( var i=1 ; i < 6 ; i++){
     var forecastDt = data.daily[i].dt ;
     var forecastDate = new Date (forecastDt * 1000);
     var forecastDay = forecastDate.getDate();
     var forecastMonth = forecastDate.getMonth() + 1;
     var forecastYear = forecastDate.getFullYear();

     //create title for 5-day forecast
     var forecastTitle = document.createElement("h2");
     forecastTitle.textContent = "5-Day Forecast:";

     //create div element to contain the list of forecast cards
     var forecastCardContainer = document.createElement("div");
     forecastCardContainer.classList = "d-inline-flex flex-wrap";

     //create div element to contain the card
     var forecastCard = document.createElement('div');
     forecastCard.classList = "card text-white bg-dark-blue m-2 p0";

     //create ul element to contain the list of weather parameters
     var weatherParameters = document.createElement('ul');
     weatherParameters.classList = "list-unstyled p-3";

     //create element for date
     var dateEl = document.createElement("li");
     dateEl.classList = "font-weight-bold";
     dateEl.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
     weatherParameters.appendChild(dateEl);

     //create element for icon
     var forecastIcon = data.daily[i].weather[0].icon;     
     var iconEl = document.createElement("img");
     iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + forecastIcon + ".png");
     iconEl.classList = "mt-2";
     weatherParameters.appendChild(iconEl);

     //create element for temperature
     var tempEl = document.createElement("li");
     tempEl.innerHTML= "Temp: " + data.daily[i].temp.day + " &#176F";
     tempEl.classList = "mt-2";
     weatherParameters.appendChild(tempEl);

     //create element for wind
     var windEl = document.createElement("li");
     windEl.innerHTML = "Wind: " + data.daily[i].wind_speed + "mph";
     windEl.classList = "mt-2";
     weatherParameters.appendChild(windEl);
     
     //create element for humidity
     var humEl = document.createElement("li");
     humEl.innerHTML = "Humidity: " + data.daily[i].humidity + "%";
     humEl.classList = "mt-2";
     weatherParameters.appendChild(humEl);

     forecastCard.appendChild(weatherParameters);
     forecastCardContainer.appendChild(forecastCard);
     weatherForescastContainer.appendChild(forecastCardContainer, forecastTitle);

     console.log(forecastIcon);

 }
};

//Event Listeners
cityFormEl.addEventListener("submit",formSubmitHandler);