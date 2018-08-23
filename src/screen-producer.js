const fs = require('fs')
const puppeteer = require('puppeteer')
const request = require('request')
const _ = require('lodash')
const parse = require('url-parse')

const requestOpts = {
    json: true,
    headers: {
        'User-Agent': 'Github-Code-Screenshot',
    }
}

if (process.env.USER && process.env.TOKEN) {
    requestOpts.auth = {
        user: process.env.USER,
        pass: process.env.TOKEN,
    }
}

let page
    ; (async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        page = await browser.newPage()

        await page.setViewport({
            width: 1600,
            height: 1000,
        })
    
        await page.goto(getCarbonUrlBySourceCode('test'), {
            waitUntil: 'load',
        })
    
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: `${process.cwd()}/`,
        })
    })()

const produceImageByGithubSnippetUrl = async (githubSnippetUrl) => {
    console.log(githubSnippetUrl)
    removeTemporaryFile()

    const githubApiUrl = getGithubApiUrlByGithubSnippetUrl(githubSnippetUrl)

    console.log(githubApiUrl)

    const githubFileMeta = await getGithubFileMetaByUrl(githubApiUrl)
    const plainSourceCode = decodeBase64(githubFileMeta.content)
    const plainSourceCodeLines = plainSourceCode.split('\n')

    const [lineFrom, lineTo] = parseGithubSnippetUrl(githubSnippetUrl).lines

    const selectedLines = _.slice(
        plainSourceCodeLines,
        lineFrom - 1,
        lineTo,
    )
    const joinedSelectedLines = encodeURIComponent(selectedLines.join('\n'))

    const carbonUrl = getCarbonUrlBySourceCode(joinedSelectedLines)

    return await produceImageByCarbonUrl(selectedLines.join('\n'))
}

module.exports = produceImageByGithubSnippetUrl

// ----------------------------------------------

function getCarbonUrlBySourceCode(code) {
    return `http://localhost:3000/carbon?bg=none&t=seti&wt=none&l=javascript&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=48px&ph=32px&ln=false&fm=Hack&fs=18px&lh=133%25&si=false&code=${code}&es=2x&wm=false&ts=false`
    // return `http://localhost:3000?bg=none&t=seti&wt=none&l=javascript&ds=false&dsyoff=20px&dsblur=68px&wc=true&wa=true&pv=48px&ph=32px&ln=false&fm=Hack&fs=18px&lh=133%25&si=false&code=${code}&es=2x&wm=false&ts=false`
}

function removeTemporaryFile() {
    try {
        fs.unlinkSync('./carbon.png')
    } catch (e) { }
}

function getGithubApiUrlByGithubSnippetUrl(ghSelectionUrl) {
    const info = parseGithubSnippetUrl(ghSelectionUrl)
    const { author, project, file, hash } = info

    const filePath = file.join('/')
    return `https://api.github.com/repos/${author}/${project}/contents/${filePath}?ref=${hash}`
}

function decodeBase64(input) {
    return Buffer.from(input, 'base64').toString('ascii')
}

async function getGithubFileMetaByUrl(url) {
    return new Promise((resolve, reject) => {
        request(
            { url, ...requestOpts },
            (err, resp, body) => {
                if (err || !body || !body.content) {
                    return reject('could not retrive github code')
                }
                resolve(body)
            }
        )
    })
}

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

function getLinesRange(hash) {
    let match = /#L(\d+)-L(\d+)/i.exec(hash) || /#L(\d+)/i.exec(hash)

    if (!match) {
        throw Error("cann't calculate line numbers from URL.")
    }

    let [, startLineIndex, endLineIndex = startLineIndex] = match

    return [+startLineIndex, +endLineIndex]
}

async function produceImageByCarbonUrl(code) {

    const saveImageTrigger = await page.waitForSelector(
        '[aria-labelledby="downshift-2-label"]'
    )
    // await saveImageTrigger.click()

    // const pngExportTrigger = await page.$('#downshift-2-item-0')
    // const svgExportTrigger = await page.$('#downshift-2-item-1')
    // await pngExportTrigger.click()

    const links = await page.evaluate((code) => {
        api.updateCode(code);
        return api.getCarbonImage({ type: 'blob2', format: 'png' })
        //.then(a => console.log(a))
        //api.save();
      }, code);

     return links;
   
    // await page.waitFor(10 * 1000)
}
