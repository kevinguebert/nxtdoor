
const cron = require('node-cron');
const chrome = require('chrome-cookies-secure');
const puppeteer = require('puppeteer');
const path = require('path');
const notifier = require('node-notifier');

const login = require('./login');
const getLatest = require('./getLatest');

const url = 'https://nextdoor.com/for_sale_and_free/?sort_order=2';

let lastItem = {};

cron.schedule('* * * * *', () => {
  console.log('#### Broswing Nextdoor ####');
  init();
});

async function init() {
  const browser = await puppeteer.launch({headless: false,args: ["--no-sandbox"], userDataDir: '/tmp/myChromeSession'});

  const page = await browser.newPage();
  await page.goto(url);
  let title = await page.title();

  // Need to signin, our session has changed
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
    if (Object.keys(lastItem).length === 0) {
      notifier.notify({
        title: 'Thank you for subscribing 👏',
        message: "Bye for now...",
        timeout: 10,
        closeLabel: "Close"
      });
      lastItem = latest[0];
    } else {
      if (latest.length > 0) {
        lastItem = latest[0];
        if (latest.length == 1) {
          console.log(`New item: ${latest[0].name}`);
          notifier.notify({
            title: 'New Item on Nextdoor 🎉',
            message: `${latest[0].name}
  Price: ${latest[0].price}`,
            open: latest[0].link,
            icon: latest[0].img,
            wait: true,
            timeout: 10,
            closeLabel: "Close"
          });
        } else {
          let output = '';
          latest.forEach((item, index) => {
            output += item.name + ` [${item.price}]` + ", ";
          });
          output = output.slice(0, -2);
          console.log(output);

          notifier.notify({
            title: `${latest.length} new items on Nextdoor 🎉`,
            message: `${output}`,
            open: url,
            wait: true,
            timeout: 10,
            closeLabel: "Close"
          });
        }
      } else {
        console.log("No new items.")
      }
    }

    browser.close();
  } catch (error) {
    console.log('--- Error on page.goto ---')
    console.log(error);
  }
};
