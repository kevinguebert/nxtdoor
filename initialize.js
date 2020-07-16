/**
 * Initialization to allow users to enter their 2fa code.
 */

const puppeteer = require('puppeteer');
const url = 'https://nextdoor.com/for_sale_and_free/?init_source=more_menu&sort_order=2';

init();

async function init() {
  const browser = await puppeteer.launch({headless: false, handleSIGINT});

  browser.on('disconnected', () => {
    console.log("User is done");
  });

  const page = await browser.newPage();

  await page.goto(url);

};
