const queue = require('../queue')

module.exports = async (req, res) => {
    // send queue stats including average computation time
    res.send(queue.getStats())
}
