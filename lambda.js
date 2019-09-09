const AWS = require('aws-sdk');
const axios = require('axios');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Helper method that formats number returned from OpenWeatherMapAPI into formatted timestamp for message
 * @param  {number} time, time in number form from OpenWeatherMapAPI
 * @return {string} formatted time
 */
function formatTime(time) {
	const zeroTime = new Date(0);
	zeroTime.setUTCSeconds(time);
	let minutes = String(zeroTime.getUTCMinutes());
	if (minutes.length < 2) {
	  minutes = '0' + minutes;
	}
	// formatted for eastern standard time
	let hours = (String(zeroTime.getUTCHours() - 4));
	if(hours > 12) {
		hours = hours - 12;
	}
	if (hours.length < 2) {
	  hours = '0' + hours;
	}
	return hours + ':' + minutes;
};

/**
 * Current Weather is retrieved using openWeatherMapAPI
 * Weather Metadata and Forecast are retrieved from NOAA API
 * @param  {} event
 * @param  {} context
 * @return {}
 */
exports.handler = async function (event, context) {
	AWS.config.update({region: 'us-east-1'});
	const APIKey = process.env.OPEN_WEATHER_MAP_API_KEY;
	const latitude = process.env.LATITUDE;
	const longitude = process.env.LONGITUDE;
	const SNSTopic = process.env.SNS_TOPIC;
	const units = 'imperial';

	// OpenWeatherMapAPI Endpoint
	const openWeatherMapAPIURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon='
    + longitude + '&units=' + units + '&appid=' + APIKey;
	const currentWeather = await axios.get(openWeatherMapAPIURL)
	  .catch((error) => {
			console.log(error);
			return;
	  });

	// NOAA Endpiont for metadata
	const NOAAMetadata = await axios.get('https://api.weather.gov/points/' + latitude + ',' + longitude)
	  .catch((error) => {
		  console.log(error);
		  return;
	  });

	// NOAA endpoint for weekly forecast
	const NOAAWeeklyForecast = await axios.get(NOAAMetadata.data.properties.forecast)
		.catch((error) => {
			console.log(error);
			return;
		});

	const sunrise = formatTime(currentWeather.data.sys.sunrise);
	const sunset = formatTime(currentWeather.data.sys.sunset);
	const message =
		'WEATHER TEXT:\n'
	 	+ '\n'
		+ 'Good Morning!  ☀️ 💦 🌤 ⛈ \n'
		+ 'Here\'s the lowdown for today...\n'
		+ '\n'
			// to show degree symbol on OSX hold shift + option + 8
		+ 'temp: ' + currentWeather.data.main.temp.toFixed(0) + '°\n'
		+ 'high: ' + currentWeather.data.main.temp_max.toFixed(0) + '°\n'
		+ 'low: ' + currentWeather.data.main.temp_min.toFixed(0) + '°\n'
		+ 'wind: ' + currentWeather.data.wind.speed.toFixed(0) + ' MPH\n'
		+ 'sunrise: ' + sunrise + ' AM\n'
		+ 'sunset: ' + sunset + ' PM\n'
		+ '\n'
		+ 'forecast: ' + NOAAWeeklyForecast.data.properties.periods[0].detailedForecast + '\n'
		+ '\n'
		+ 'Have a good day! 🎉🎉 🎉 🎉'
	const params = {
		Message: message,
		TopicArn: process.env.SNS_TOPIC
	};

	let response = 'lambda completed with ';

	await client.messages
	  .create({
	     body: message,
	     from: process.env.TWILIO_FROM,
	     to: process.env.TWILIO_TO
	   })
	  .then((success) => {
			console.log(success.sid);
			response = response + 'success';
		})
		.catch((error) => {
			console.log(error);
			response = response + ' error';
		});

	return response;
};
