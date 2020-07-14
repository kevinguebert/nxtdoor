module.exports = async (page, previous) => {
  await page.waitForSelector('#classified-section-container');
  await page.waitForSelector('.classified-item-card-title');
  const latestName = await page.evaluate(() => {
    return document.querySelector(".classified-item-card-title").innerHTML;
  });

  let newItems = [];
  if (latestName !== previous.name) {
    newItems = await page.evaluate((previous) => {
      let newItems = [];
      let children = document.getElementsByClassName('classified-item-card-container');
      console.log(children);
      for (var i = 0; i < children.length; i++) {
        const child = children[i];
        let name = child.getElementsByClassName('classified-item-card-title')[0].innerHTML;
        if (name == previous.name) {
          break;
        }
        let price = child.getElementsByClassName('classified-item-card-price').length > 0 ? child.getElementsByClassName('classified-item-card-price')[0].innerHTML : null;
        console.log("THE PRICE", price);
        let link = child.href;
        let img = child.getElementsByClassName('classified-item-card-photo')[0].src
        newItems.push({
          name,
          price,
          link,
          img
        });
      }
      return newItems;
    }, previous);
  }

  return newItems;
}
