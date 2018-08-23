const fs = require('fs')
const Queue = require('better-queue')
const _ = require('lodash')

const produceScreen = require('./screen-producer')

const queue = new Queue(async ({ url, res }, cb) => {
    cb = _.once(cb)
    try {
        const file = await produceScreen(url);
        var im = file.split(",")[1];
        var img = new Buffer(im, 'base64');
        
        res.writeHead(200, {
           'Content-Type': 'image/png',
           'Content-Length': img.length
        });
        res.end(img);
        cb(null);
    } catch (err) {
        res.status(500).send(err.toString())
        cb(err)
    }
})

module.exports = queue
