const express = require('express')

// server setup
const app = express()
app.listen(process.env.PORT || 3000)

// routes setup
app.get('/', require('./src/routes/home'))
app.get('/produce', require('./src/routes/produce'))
app.get('/stats', require('./src/routes/stats'))
