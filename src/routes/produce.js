const queue = require('../queue')

module.exports = (req, res) => {
    queue.push({ url: req.query.url, res }, function(err, result) {
        if (err) {
            return console.log('err: ', err)
        }
        console.log('done...')
    })
}
