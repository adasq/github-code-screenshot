const express = require('express')
const request = require('request')

// server setup
const app = express()
app.listen(process.env.PORT || 3000)

// routes setup
app.get('/', require('./src/routes/home'))
app.get('/produce', require('./src/routes/produce'))
app.get('/stats', require('./src/routes/stats'))

app.use('/carbon', express.static('out'))
// app.use('/carbon', express.static('../carbon/out'))

setInterval(() => request('https://github-shot.herokuapp.com/'), 1000 * 60 * 15)