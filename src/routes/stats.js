const queue = require('../queue')

module.exports = async (req, res) => {
    res.send(queue.getStats())
}
