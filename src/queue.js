const fs = require('fs')
const Queue = require('better-queue')
const _ = require('lodash')

const produceScreen = require('./screen-producer')

const queue = new Queue(async ({ url, res }, cb) => {
    cb = _.once(cb)

    try {
        await produceScreen(url)
        fs.createReadStream('carbon.png')
            .pipe(res.type('png'))
            .on('finish', () => {
                cb(null)
            })
        setTimeout(() => cb(null), 2000)
    } catch (err) {
        res.status(500).send(err.toString())
        cb(err)
    }
})

module.exports = queue
