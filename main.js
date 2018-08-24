const express = require('express')
const request = require('request')

// server setup
const app = express()
app.listen(process.env.PORT || 3000)

// routes setup
app.get('/', require('./src/routes/home'))
app.get('/produce', require('./src/routes/produce'))
app.get('/stats', require('./src/routes/stats'))


const url = `http://localhost:${process.env.PORT}/stats`;
const url2 = `http://0.0.0.0:${process.env.PORT}/stats`;

setInterval(() => request(url, (err, resp, body) => {
    console.log(url)
    console.log(err)
    console.log(body)
}), 1000)

setInterval(() => request(url2, (err, resp, body) => {
    console.log(url2)
    console.log(err)
    console.log(body)
}), 1000)