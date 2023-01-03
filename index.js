require("dotenv").config()
const http = require('http');
const fs = require('fs');
let requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempval, orgval) => {
    let temperature = (tempval.replace("{%tempval%}", (orgval.main.temp - 273.15).toFixed(2)));
    temperature = (temperature.replace("{%tempmin%}", (orgval.main.temp_min - 273.15).toFixed(2)));
    temperature = (temperature.replace("{%tempmax%}", (orgval.main.temp_max - 273.15).toFixed(2)));
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = (temperature.replace("{%tempStatus%}", orgval.weather[0].main))
    // return 'temperature';
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=${process.env.api_key}`)
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData.map(val=> replaceval(homeFile, val)).join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
});
server.listen(7000, () => {
    console.log('Server listening at: http://localhost:7000/');
})