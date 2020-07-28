/**
 * @param {object} page
 *  The puppteer browser object.
 * @param {object} previous
 *  The last item that we saw in the previous run.
 */
module.exports = async (page, previous) => {
  // Some safeguarding to make sure the page is loading/loaded.
  await page.waitForSelector('#classified-section-container');
  await page.waitForSelector('.classified-item-card-title');

  // Use querySelector to get the most recent item.
  const latestName = await page.evaluate(() => {
    return document.querySelector(".classified-item-card-title").innerHTML;
  });
  console.log(`--- Most recent item: ${latestName} ---`);

  let newItems = [];
  if (previous && latestName !== previous.name) {
    newItems = await page.evaluate((previous) => {
      let newItems = [];
      let postedAt = new Date().toTimeString();
      let children = document.getElementsByClassName('classified-item-card-container');
      for (var i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.querySelector('classified-item-card-title')) {
          let name = child.querySelector('classified-item-card-title').innerText;

          // If we have reached the previous item, don't keep going (unnecessary work).
          if (name == previous.name) {
            break;
          } else {
            let price = child.querySelector('.classified-item-card-price').innerHTML;
            let link = child.href;
            let img = child.querySelector('.classified-item-card-photo').src

            newItems.push({
              name,
              price,
              link,
              img,
              postedAt
            });
          }
        }
      }
      return newItems;
    }, previous);
  }

  return newItems;
}
