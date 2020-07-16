/**
 * Initialization to allow users to enter their 2fa code.
 */

const puppeteer = require('puppeteer');
const url = 'https://nextdoor.com/login/';

init();

async function init() {
  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();

  await page.goto(url);

  browser.on('disconnected', () => {
    console.log("User is done");
  });
};
