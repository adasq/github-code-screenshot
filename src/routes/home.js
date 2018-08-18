module.exports = async (req, res) => {
    const url =
        'https://github.com/steemit/steem/blob/master/libraries/schema/schema.cpp#L28-L44'
    res.type('html').send(`
        <form action="/produce" style="margin: 10%; font-family: Arial; display: flex; flex-direction: column;">
            Your GitHub snippet code url:<br>
            <input type="text" name="url" placeholder="i.e.: ${url}" value="${url}"><br>
            <input type="submit">
        </form>
        `)
}
