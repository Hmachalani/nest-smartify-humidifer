var nest = require("google-nest-api").init('username', 'pwd'),
    request = require("request");

var LOW_HUMIDITY = 35,
    HIGH_HUMIDITY = 50,
    hh_url = "url_trigger_humidity_high",
    hl_url = "url_trigger_humidity_low",
    current_state = undefined,
    State = { ON: "on", OFF: "off" };

var triggerHighHumidity = function () {
    if (!current_state || current_state == State.ON) {
        request(hh_url, function (error, response, body) { 
            if(!error) current_state = State.OFF;
            console.log(body); 
        }); //turn off humidifier
    }

}

var triggerLowHumidity = function () {
    if (!current_state || current_state == State.OFF) {
        request(hl_url, function (error, response, body) {
             if(!error) current_state = State.ON;
            console.log(body); 
        }); //turn on humidifier.
    }
}

var checkHumidity = function () {
    nest.getInfo("09AA01AC33160DBV", function (err, data) {
        if(err) return console.log(err);
        console.log("Humidity is:" + data.current_humidity);
        var currentHumidity = data.current_humidity;

        if (currentHumidity < LOW_HUMIDITY) {
            triggerLowHumidity();
        } else if (currentHumidity > HIGH_HUMIDITY) {
            triggerHighHumidity();
        }
    });
}

var intervalTime = 60000;
setInterval(function () { checkHumidity(); }, intervalTime);

checkHumidity();