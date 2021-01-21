const key = "37e7ac1f17aa8aed520755c7cef494c8";
var lat = "";
var lon = "";
var cityName ;

var currentWeatherEle = $("#currentWeather");
var fiveForecast = $("#fiveForecast");

function getWeather() {
  //cityName = $("#weatherInput").text();
  $("#currentWeather").empty();
  var currentWeatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    key;

  $.ajax({
    url: currentWeatherUrl,
    method: "GET",
  }).then(function (res) {
    lat = res.coord.lat;
    lon = res.coord.lon;
    $("#currentWeather").append("<h2>" + res.name + "</h2>");
    $("#currentWeather").append("<p> Temperature: " + res.main.temp + "</p>");
    $("#currentWeather").append("<p> Humidity: " + res.main.humidity + "</p>");
    $("#currentWeather").append("<p> Wind Speed: " + res.wind.speed + "</p>");
    getUv();
    getForecasst();
  });
}

function getUv() {
  //print a empty

  var uvUrl =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    key;

  $.ajax({
    url: uvUrl,
    method: "GET",
  }).then(function (res) {
    $("#currentWeather").append(
      "<p> UV Index: " + "<span id = 'uv'>" + res.value + "</span>" + "</p>"
    );
    let uv = parseInt(res.value);
    if (uv <= 2) {
      $("#uv").css("color", "green");
    } else if (uv <= 5) {
      $("#uv").css("color", "yellow");
    } else if (uv <= 8) {
      $("#uv").css("color", "orange ");
    } else if (uv <= 10) {
      $("#uv").css("color", "red ");
    } else {
      $("#uv").css("color", "red");
    }
  });
}

function getForecasst() {
  $("#row").empty();
  $("#fiveForecast h2").empty();
  var fiveDayForecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&appid=" +
    key;

  $.ajax({
    url: fiveDayForecastUrl,
    method: "GET",
  }).then(function (res) {
    $("#fiveForecast").prepend("<h2> 5-Day Forecast</h2>");
    for (let i = 0; i < res.list.length; i += 8) {
      let col = $("<div>").attr("class", "col");
      let card = $("<div>").attr("class", "card");
      card.css("background-color", "CornflowerBlue");
      let cardBody = $("<div>").attr("class", "card-body");
      var date = filter(res.list[i].dt_txt);
      var icon = $("<img>");

      var iconurl =
        "http://openweathermap.org/img/w/" +
        res.list[i].weather[0].icon +
        ".png";

      icon.attr("src", iconurl);
      icon.attr("alt", "weather-icon");
      cardBody.append("<p class = 'card-text'>" + date + "</p>");
      cardBody.append(icon);
      cardBody.append(
        "<p class = 'card-text'>" + res.list[i].main.humidity + "</p>"
      );
      cardBody.append(
        "<p class = 'card-text'>" + res.list[i].main.temp + "</p>"
      );
      card.append(cardBody);
      col.append(card);
      $("#row").append(col);
    }
  });
}

function filter(date) {
  var returnDate = " ";
  for (var i = 0; i < date.length; i++) {
    if (date[i] === " ") {
      return returnDate;
    } else {
      returnDate += date[i];
    }
  }
}

function addHistory(Name) {
  var ul = document.getElementById("history");
  var liEle = $("<li class = 'list-group-item'>");
  //liEle.addClass("hover-enabled");
  liEle.hover(function(){
    $(this).css("background-color", "AliceBlue");
    }, function(){
    $(this).css("background-color", "white");
  });

  liEle.on("click",function(){
    
     cityName= ($(this).text());
     $("#weatherInput").val(cityName);
    getWeather();
  });
  var items = ul.getElementsByTagName("li");
  var temp = false;
  if (items.length === 0) {
    liEle.text(Name);
    $("#history").append(liEle);
  } else {
    for (var i = 0; i < items.length; i++) {

      if (items[i].innerHTML === Name) {
        temp = true;
        break;
      }
    }
  }
  if (temp === false) {
    liEle.text(Name);
    $("#history").append(liEle);
  }
}

$("#search").on("click", function () {
  cityName = $("#weatherInput").val();
  getWeather();
  addHistory(cityName);
});
