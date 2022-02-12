//Global Variables and Selectors
var apiKey = "e1ab46c5537b3f0c9d3940457509a86b";
var cityNameEl = document.querySelector("#city-search");
var currentWeatherContainer = document.querySelector("#current-weather");
var weatherForescastContainer = document.querySelector("#forecast");
var cityFormEl = document.querySelector("#city-form");


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
              });
          }else {
              alert('Error: City Not Found');
          }
      })
      .catch(function(error){
          alert("Unable to connect to OpenWeatherMap");
      });
  };

//Event Listeners
cityFormEl.addEventListener("submit",formSubmitHandler);