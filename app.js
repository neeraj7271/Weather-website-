import express from "express";
import ejs from "ejs";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {

    res.render("index.ejs");

});

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

app.post("/", async (req, res) => {

    const today = new Date();
    let day = weekday[today.getDay()];
    let date = today.getDate();
    let name = month[today.getMonth()];
    const city = req.body.city;
    const country = req.body.country;
    const url = `http://api.weatherapi.com/v1/forecast.json?key=20ff2446c16848889cc162228232907&q=${city},${country}`;


    try {

        const result = await axios.get(url);

        // current data
        const currTemp = result.data.current.temp_c;
        const currDes = result.data.current.condition.text;
        const currIcon = result.data.current.condition.icon;
        const high = result.data.forecast.forecastday[0].day.maxtemp_c;
        const wind = result.data.current.wind_mph
        const sunrise = result.data.forecast.forecastday[0].astro.sunrise;
        const low = result.data.forecast.forecastday[0].day.mintemp_c;
        const rain = result.data.forecast.forecastday[0].day.daily_chance_of_rain;
        const sunset = result.data.forecast.forecastday[0].astro.sunset;

        // forcast data

        const eachHour = result.data.forecast.forecastday[0].hour;

        res.render("result.ejs", {
            city: city,
            country: country,
            weekday: day,
            date: date,
            month: name,

            // curr data
            currtemp: currTemp,
            currdes: currDes,
            curricon: currIcon,
            highest:high,
            windSpeed: wind,
            sunriseTime: sunrise,
            lowest: low,
            rainChance: rain,
            sunsetTime:sunset,

            // forcast data

            hours: eachHour,

            
        });

    } catch (error) {
        console.error("Failed to make request");
        res.render("result.ejs", {
            erorr: JSON.stringify(error.response.data),
        })
    }

    
    



});


app.listen(port, function() {
    console.log(`Server is Running on port ${port}`);
});