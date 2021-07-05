const fs = require('fs')
const Queue = require('better-queue')
const _ = require('lodash')

const produceScreen = require('./screen-producer')

const queue = new Queue(async ({ url, res }, cb) => {
    try {
        const [fileName, fileBuffer] = await produceScreen(url)
        console.log(fileName);
        res.setHeader('Content-disposition', `filename=${fileName}.png`)
        res.type('png').end(fileBuffer)
        cb(null)
    } catch (err) {
        res.status(500).send(err.toString())
        cb(err)
    }
})

module.exports = queue
