const fs = require('fs')
const puppeteer = require('puppeteer')
const request = require('request')
const _ = require('lodash')
const parse = require('url-parse')
const fileExtension = require('file-extension')
const highlightService = require('./highlight-service')
const ENV = require('./environment')

// prepare headers for a purpose of calling github API
const requestOpts = {
    json: true,
    headers: {
        'User-Agent': 'Github-Code-Screenshot',
    },
}

if (process.env.USER && process.env.TOKEN) {
    requestOpts.auth = {
        user: process.env.USER,
        pass: process.env.TOKEN,
    }
}

// it initializes internal browser and navigates its page into a local instance of carbon service
let page
;(async () => {
    const browser = await puppeteer.launch({
        headless: ENV.PROD,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    page = await browser.newPage()

    await page.setViewport({
        width: 1600,
        height: 1000,
    })

    await page.goto(getCarbonUrlBySourceCode(), {
        waitUntil: 'load',
    })

    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: `${process.cwd()}/`,
    })
})()

/**
 * It produces base64 Buffer containing image based on passed Github snippet url
 * @param {string} githubSnippetUrl
 */
const produceImageByGithubSnippetUrl = async (githubSnippetUrl) => {
    const githubApiUrl = getGithubApiUrlByGithubSnippetUrl(githubSnippetUrl)

    const githubFileMeta = await getGithubFileMetaByUrl(githubApiUrl)

    const codeSnippetFileExtension = fileExtension(githubFileMeta.name)
    const plainSourceCode = decodeBase64(githubFileMeta.content)
    const plainSourceCodeLines = plainSourceCode.split('\n')

    const [lineFrom, lineTo] = parseGithubSnippetUrl(githubSnippetUrl).lines

    const selectedLines = _.slice(plainSourceCodeLines, lineFrom - 1, lineTo)
    const joinedSelectedLines = selectedLines.join('\n')

    const lang = highlightService.getCarbonLangByFileExtension(
        codeSnippetFileExtension
    )

    const base64FileString = await produceImageByCarbonUrl(
        joinedSelectedLines,
        lang
    )

    return new Buffer(base64FileString.split(',')[1], 'base64')
}

module.exports = produceImageByGithubSnippetUrl

// ----------------------------------------------

/**
 * It returns local carbon url containing default screenshot styles configuration
 */
function getCarbonUrlBySourceCode() {
    return `http://localhost:${
        ENV.PORT
    }/carbon?bg=none&t=seti&wt=none&l=javascript&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=48px&ph=32px&ln=true&fm=Hack&fs=18px&lh=133%25&si=false&code=start&es=2x&wm=false&ts=false`
}

/**
 * It produces Github API url based on Github snippet url
 * @param {string} ghSelectionUrl
 */
function getGithubApiUrlByGithubSnippetUrl(ghSelectionUrl) {
    const info = parseGithubSnippetUrl(ghSelectionUrl)
    const { author, project, file, hash } = info

    const filePath = file.join('/')
    return `https://api.github.com/repos/${author}/${project}/contents/${filePath}?ref=${hash}`
}

/**
 * It parses input base64 string to a plain text
 * @param {string} input
 */
function decodeBase64(input) {
    return Buffer.from(input, 'base64').toString('ascii')
}

/**
 * It retrives github meta info based on github API url
 * @param {string} url
 */
async function getGithubFileMetaByUrl(url) {
    return new Promise((resolve, reject) => {
        request({ url, ...requestOpts }, (err, resp, body) => {
            if (err || !body || !body.content) {
                return reject('could not retrive github code')
            }
            resolve(body)
        })
    })
}

/**
 * It parses github snipet url into details, i.e author, project.
 * @param {string} url
 */
function parseGithubSnippetUrl(url) {
    const url2 = parse(url, true)
    const [, author, project, blob, hash, ...file] = url2.pathname.split('/')

    return {
        lines: getLinesRange(url2.hash),
        author,
        project,
        hash,
        file,
    }
}

/**
 * It returns array containing lines range, i.e.: for '#L12-L31' it returns an array: [12, 21]
 * @param {string} hash
 */
function getLinesRange(hash) {
    let match = /#L(\d+)-L(\d+)/i.exec(hash) || /#L(\d+)/i.exec(hash)

    if (!match) {
        throw Error("cann't calculate line numbers from URL.")
    }

    let [, startLineIndex, endLineIndex = startLineIndex] = match

    return [+startLineIndex, +endLineIndex]
}

/**
 * It produces base64 Buffer containing image based on passed soure code and source code language details
 * @param {string} code
 * @param {object} lang
 */
async function produceImageByCarbonUrl(code, lang) {
    const image = await page.evaluate(
        (code, lang) => {
            api.updateCode(code)
            api.updateLanguage(lang)
            return api.getCarbonImage({ format: 'png' })
        },
        code,
        lang
    )

    return image
}
