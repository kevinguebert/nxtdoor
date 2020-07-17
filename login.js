const constants = require('./constants');

module.exports = async (page) => {
  await page.goto('https://nextdoor.com/login/?next=/for_sale_and_free/%3Finit_source%3Dmore_menu%26sort_order%3D2');

  await page.waitForSelector('#id_email');
  await page.type('#id_email', constants.email);

  await page.keyboard.down('Tab');
  await page.waitFor(4000)
  await page.keyboard.type(constants.password);

  await page.click('#signin_button');
}
