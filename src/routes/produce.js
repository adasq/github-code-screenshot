const queue = require('../queue')

module.exports = (req, res) => {
    queue.push({ url: req.query.url, res })
}
