const puppeteer = require('puppeteer-extra')
const pluginStealth = require('puppeteer-extra-plugin-stealth')
puppeteer.use(pluginStealth())
const config = require('./config')

module.exports = class PPTR {
    async browser() {
        const b = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                '--disable-sandbox',
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
            executablePath: config.pptr_exec_path,
            userDataDir: './userdata',
            slowMo: 20
        })
        return b
    }

}