
const cron = require('node-cron');
const puppeteer = require('puppeteer');
const path = require('path');
const NotificationCenter = require('node-notifier').NotificationCenter;
const notifier = new NotificationCenter({
  customPath: path.join(__dirname, 'nxtdoor.app/Contents/MacOS/nxtdoor')
})

const login = require('./login');
const getLatest = require('./getLatest');
const checkLatest = require('./checkLatest');

const url = 'https://nextdoor.com/for_sale_and_free/?sort_order=2';

let lastItem = {};

cron.schedule('* * * * *', () => {
  console.log('#### Broswing Nextdoor ####');
  console.log(`Current Time: ${new Date().toTimeString()}`);
  if (lastItem.postedAt) {
    console.log(`Last Item Posted: ${lastItem.postedAt}`)
  }
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
        console.error('--- Error on waitForNavigation ---');
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
      lastItem = await checkLatest(page, notifier, lastItem, latest, url);

      browser.close();
    } catch (error) {
      console.error('--- Error on page.goto ---')
      console.log(error);
      browser.close();
    }
  } catch (error) {
    console.error('--- Error on initial page.goto ---')
    console.log(error);
    browser.close();
  }
};
