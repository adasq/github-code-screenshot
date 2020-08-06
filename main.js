const express = require('express')
const request = require('request')
const ENV = require('./src/environment')





// server setup
const app = express()
app.listen(ENV.PORT || 3000)

// routes setup
app.get('/', require('./src/routes/home'))
app.get('/produce', require('./src/routes/produce'))
app.get('/stats', require('./src/routes/stats'))

app.get('/proxy', (req, res) => {
    // send queue stats including average computation time

    return request({
        url: 'https://cdn.x-kom.pl/i/img/promotions/hot-shot-small,,hs_2020_8_6_15_13_45.PNG',
        headers: {
            'Referer': 'https://www.x-kom.pl/',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    
            'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-fetch-dest': 'image',
            'sec-fetch-mode': 'no-cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36'
        }
    }).pipe(res)
})

app.use('/carbon', express.static('out'))

ENV.PROD && setInterval(() => request('https://github-shot.herokuapp.com/'), 1000 * 60 * 15)