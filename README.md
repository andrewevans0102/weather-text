# duck-weather

This project uses an AWS Lambda to send a text message with the current weather.

Here's the process flow:

![flow chart](https://github.com/andrewevans0102/weather-text/blob/master/images/duck-weather.png)

1. Lambda is triggered by a [CloudWatch](https://aws.amazon.com/cloudwatch/) scheduled cron job
2. Lambda calls the [OpenWeatherMap API](https://openweathermap.org/api) for current conditions
3. Lambda calls the [NOAA API](https://www.weather.gov/documentation/services-web-api) for forecast data
4. A message is created with all of the content
5. A text message is sent via [Twilio's APIs](https://www.twilio.com/)

## AWS CLI
- Before running your own version of this project, please create an AWS account and setup the CLI.
- Go [here to get started](https://aws.amazon.com/cli/)

## ClaudiaJS
- This project uses ClaudiaJS to generate the AWS lambda
- Checkout the tutorial here https://claudiajs.com/tutorials/hello-world-lambda.html

## OpenWeatherMap API
- In order to get the current weather I used the OpenWeatherMap API.  The weather service is free, but you still need to register to create an API Key.
- Go [here to get started](https://openweathermap.org/api)

## NOAA APIs
- In order to get the weather forecast, I used NOAAs APIs.  These are free and open to the public.
- Go [here to get started](https://www.weather.gov/documentation/services-web-api)

## Environment Variables
- This lambda uses several environment variables to do its work
- `OPEN_WEATHER_MAP_API_KEY` = the registration key for an OpenWeatherMAPAPI account
- `LATITUDE` = the Latitude of the location you want to get the forecast of
- `LONGITUDE` = the Longitude of the location you want to get the forecast of
- `TWILLO_ACCOUNT_SID` = the SID of a Twilio account for sending text messages
- `TWILLO_AUTH_TOKEN` = the auth token of a Twilio account for sending text messages
- `TWILLO_ACCOUNT_PHONE_NUMBER` = the phone number that is to be used with the Twilio account for sending text messages
- In order to easily setup these values, please fill out the corresponding `<VALUE>` and paste this at the bottom of your terminal's bash_profile (or other associated shell)
```bash
# weather-text
export WT_OPEN_WEATHER_MAP_API_KEY=<VALUE>
export WT_LATITUDE=<VALUE>
export WT_LONGITUDE=<VALUE>
export WT_TWILLO_ACCOUNT_SID=<VALUE>
export WT_TWILLO_AUTH_TOKEN=<VALUE>
export WT_TWILLO_ACCOUNT_PHONE_NUMBER=<VALUE>
```

## NPM scripts
- This project has `npm scripts` that will enable you to get up and running without a problem
- `create-lambda` uses the ClaudiaJS CLI and the AWS CLI to create a lambda in the AWS account on your machine
- `update-lambda` uses the ClaudiaJS CLI to provision your Lambda with the environment variables mentioned above
- `local-test` enables you to call your lambda from your local terminal

## TO RUN THIS LOCALLY
- Create an OpenWeatherMap API account and get a key
- Create an AWS account and setup the CLI on your local machine (the account gives you a free year of services)
- Install the ClaudiaJS CLI on your local machine
- Create a trial account with Twilio (it is free and you get a starting credit)
- Setup the Environment variables in the `npm script` that I mentioned above
- In the `lambda.js` go to line 96 where the Twilio API is called and put your phone number
- Run the `create-lambda` script to create the lambda in AWS
- Run the `update-lambda` script to update the Lambda with the environment Variables
- Run the `local-test` script to see it in action (and test it on a phone number of your choice)
- and tada!  It should be working!

## Contributions
- This is a very small project, but PRs are welcome!
- Reach out to me at `@AndrewEvans0102` on [twitter](https://twitter.com/andrewevans0102) anytime!
