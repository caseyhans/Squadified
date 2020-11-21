//#region import modules
const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const axios = require("axios")
const qs = require("querystring")
const cors = require("cors")()

const Song = require('./Song.js');

const bodyParser = require('body-parser');


const app = express()
//#endregion
app.use(bodyParser.json());


const spotifyClientID = "e877e6ffc92f4caca0352895fa830224"
const spotifySecret = "8bde01a0227440f6910fe671615e03c8"
const authReq = "Basic " + Buffer.from(spotifyClientID + ":" + spotifySecret).toString("base64")
let currToken = {}

/*
const sslOptions = {
    //where certbot put our letsencrypt private and public keys
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}

// setting up a service on the default https port. Pass in our SSL credentials as well as our express app to actually respond to requests
https.createServer(sslOptions, app).listen(443)

app.listen(80) //Have an http port open for first time contact
app.use(helmet.hsts()) //Use helmet http strict transport security to force https

app.use(express.static("/var/www/squadified/public")) //static files like index.html 
app.use(cors)
*/

let updateToken = () => {
    axios(
    {
        url: "https://accounts.spotify.com/api/token",
        method: "post",
        headers: {
            "Authorization": authReq.toString(),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            "grant_type": "client_credentials"
        })
    })
    .then((response) => {
        currToken.code = response.data.access_token
        currToken.expiresAt = Date.now() + response.data.expires_in * 1000
        console.log("fetched new token.")
    })
    .catch((error) => {
        console.log(error)
    })
}

updateToken()
setInterval(updateToken, 3600 * 1000)

app.get("/token", (req, res) => {
    res.send(currToken)
})

app.get("/example", (req, res) => {
    res.send("example ajax method")
})

app.post("/song", (req, res) => {
    let {sid, name, artist} = req.data;
    let s = Song.create(req.data.sid, req.data.name, red.data.artist);
    if (s == null) {
        res.status(400).send("Bad Request");
        return;
    }
    return res.json(s);
})

app.get("/song/:id", (req, res) => {
    let s = Song.findByID(req.params.id);
    if (s == null) {
        res.status(404).send("Song not found");
        return;
    }
    res.json(s);
});
