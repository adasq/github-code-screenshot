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
    res.writeHead(200, 'OK', {
        'Accept-Ranges': 'bytes',
        'age': 4095,
        'cache-control': 'max-age=28800',
        'Content-Disposition': 'inline; filename="aaaaa.webp"',
        'Content-Length': 51668,
        'Content-Type': 'image/webp',
        'Date': 'Thu, 06 Aug 2020 21:08:19 GMT',
        'Etag': "167d6-5ac3aeb138326",
        'Last-Modified': 'Thu, 06 Aug 2020 19:58:55 GMT',
        'status': 200,
        'vary': 'Accept',
    })
    request({
        url: req.query.url,
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