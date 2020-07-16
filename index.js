
const cron = require('node-cron');
const chrome = require('chrome-cookies-secure');
const puppeteer = require('puppeteer');
const path = require('path');
const notifier = require('node-notifier');
// const NotificationCenter = require('node-notifier').NotificationCenter;
// var notifier = new NotificationCenter({
//   withFallback: false, // Use Growl Fallback if <= 10.8
//   customPath: path.join(__dirname, 'terminal-notifier.app') // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
// });

const login = require('./login');
const getLatest = require('./getLatest');

const url = 'https://nextdoor.com/for_sale_and_free/?init_source=more_menu&sort_order=2';

let lastItem = {};

cron.schedule('* * * * *', () => {
  console.log('#### Broswing Nextdoor ####');
  init();
});

const getCookies = () => {
  return new Promise((resolve, reject) => {
    chrome.getCookies(url, 'puppeteer', function(err, cookies) {
      if (err) {
          console.log(err, 'error');
          notifier.notify({
            title: `ERROR: ${err}`
          });
          reject(err);
      }
      resolve(cookies);
    }, 'Default');
  });
}

async function init() {
  const browser = await puppeteer.launch({headless: true});

  const page = await browser.newPage();

  // Authentication/Login.
  let cookies = await getCookies();
  if (!cookies) {
    await login(page);
    cookies = await getCookies();
  }

  // Set cookies so we don't have to relogin everytime.
  await page.setCookie(...cookies);
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
};
