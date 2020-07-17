
const cron = require('node-cron');
const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

const login = require('./login');
const getLatest = require('./getLatest');
const checkLatest = require('./checkLatest');

const url = 'https://nextdoor.com/for_sale_and_free/?sort_order=2';

let lastItem = {};

cron.schedule('* * * * *', () => {
  console.log('#### Broswing Nextdoor ####');
  init();
});

async function init() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    userDataDir: '/tmp/myChromeSession'
  });

  const page = await browser.newPage();
  try {
    await page.goto(url);
    let title = await page.title();

    // Need to signin, our session has changed.
    if (title === "Sign In — Nextdoor") {
      await login(page);
      try {
        await page.waitForNavigation();
      } catch (error) {
        console.log('--- Error on waitForNavigation ---');
        console.log(error);
        browser.close();
      }
    }

    // Unsure if cookies are needed now that we use userDataDir.
    cookies = await page.cookies();
    await page.setCookie(...cookies);

    try {
      await page.goto(url);
      const latest = await getLatest(page, lastItem);
      lastItem = await checkLatest(page, notifier, lastItem, latest);

      browser.close();
    } catch (error) {
      console.error('--- Error on page.goto ---')
      console.error(error);
      browser.close();
    }
  } catch (error) {
    console.error('--- Error on initial page.goto ---')
    console.error(error);
    browser.close();
  }
};
