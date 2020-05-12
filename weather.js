$(document).ready(function () {
    var searchHistory = [];
    var APIKey = "b212266a3b5800f1c727bf9539b273bb";
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        $(".card-deck").empty();
        $(".lead").empty();
        $(".display-4").empty();
        var location = $('#input').val();
        searchHistory.push(location);
        getWeatherData(location);
        localStorage.setItem('cities', JSON.stringify(searchHistory));
    })
    var getWeatherData = function (location) {
        var currentDay = moment().format('dddd, MMMM Do');
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var temperature = Math.floor(((response.main.temp) - 273.15) * 1.80 + 32)
            var humidity = response.main.humidity
            var windspeed = response.wind.speed
            var cityName = response.name;
            var icon = response.weather[0].icon
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $('.display-4').html(cityName)
            $('.display-4').append(" " + currentDay);
            $('.display-4').append(` <img src='http://openweathermap.org/img/wn/${icon}.png' class="img-fluid" alt="Responsive image">`);
            $('.lead').append("Temperature: " + temperature + "°F");
            $('.lead').append('<br>Humidity: ' + humidity + "%");
            $('.lead').append('<br>Windspeed: ' + windspeed + "MPH");
            getFiveDayForecast(lat, lon);
        })

    }
    var getFiveDayForecast = function (lat, lon) {
        var queryURL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
            console.log(response.daily[0].uvi);
            for (var i = 1; i < 6; i++) {
                var nextDay = moment().add(i, 'days').format('L');
                var cardIcon = response.daily[i].weather[0].icon
                var cardTemp = Math.floor(((response.daily[i].temp.day) - 273.15) * 1.80 + 32);
                var cardHumidity = response.daily[i].humidity;

                $('.card-deck').append(`<div class='card'>
             <div class='card-body'>
                 <h6 class='card-title'>${nextDay}</h6>
                 <p class='card-text'id ="card${i}"> <img src='http://openweathermap.org/img/wn/${cardIcon}.png' class="img-fluid" alt="Responsive image"> <br>${cardTemp}°F <br> ${cardHumidity}% </p>
             </div>`);
            }
            var uvi = response.daily[0].uvi
            if (uvi > 8) {
                $('.lead').append(`<br> <div class="text-danger"> UV index : ${uvi}</div>`)
            }
            else if (uvi < 8 && uvi > 5) {
                $('.lead').append(`<br> <div class="text-warning"> UV index :   ${uvi}</div>`)
            }
            else {
                $('.lead').append(`<br> <div class="text-success"> UV index :   ${uvi}</div>`)
            }
        });
    };
    var search = function () {
        var searched = JSON.parse(localStorage.getItem("cities"));
        console.log(searched)
        if (searched !== null) {
            searchHistory = searched;
            for (var i = 0; i < searched.length; i++) {
                $('.list-group').append(`<li class='list-group-item btn' id='button' value='${searched[i]}'>${searched[i]}</li>`);
            }
        }
        if (searchHistory !== null) {
            var lastLocation = searchHistory[searchHistory.length - 1]
            getWeatherData(lastLocation);
        }
    }
    search();
    $(document).on('click', '#button', function () {
        $(".card-deck").empty();
        $(".lead").empty();
        $(".display-4").empty();
        newLocation = $(this).attr("value");
        getWeatherData(newLocation);
    });

});