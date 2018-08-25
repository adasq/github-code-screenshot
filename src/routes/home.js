const fs = require('fs');

const homePage = fs.readFileSync('./src/home.html');

module.exports = async (req, res) => {
    return res.type('html').send(homePage);
}
