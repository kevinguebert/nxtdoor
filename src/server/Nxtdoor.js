
// const url = 'https://nextdoor.com/for_sale_and_free/?sort_order=2';

const puppeteer = require('puppeteer-electron')


class Nxtdoor {
  constructor(app, BrowserWindow) {
  }

  search = async () => {
    const app = await puppeteer.launch({ headless: false }) // default is true
    const pages = await app.pages()
    const [page] = pages
    await page.goto('https://bing.com')

    setTimeout(async () => await app.close(), 5000)
  }
}

module.exports = Nxtdoor;
