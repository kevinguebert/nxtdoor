/**
 *
 * @param {object} notifier
 *  The notifier module object.
 * @param {object} previous
 *  The last item that we saw in the previous run.
 * @param {array} latest
 *  The potentially new item(s) in n*xtdoor.
 *  An array of objects.
 * @param {string} url
 *  Generic n*xtdoor url
 */
module.exports = async (notifier, previous, latest, url) => {
  // If this is our first run, just let user know.
  if (previous && Object.keys(previous).length === 0) {
    notifier.notify({
      title: 'Thank you for subscribing 👏',
      message: "Bye for now...",
      timeout: 10,
      closeLabel: "Close"
    });
    previous = latest[0];
  } else {
    if (latest.length > 0) {
      previous = latest[0];
      // If only one new item, don't concatenate.
      if (latest.length == 1) {
        console.log(`New item: ${latest[0].name}`);
        notifier.notify({
          title: 'New Item on Nextdoor 🎉',
          message: `${latest[0].name}
Price: ${latest[0].price}`,
          open: latest[0].link,
          icon: latest[0].img,
          wait: false,
          timeout: 10,
          closeLabel: "Close"
        });
      } else {
        let output = '';
        // Concatenate all the names together.
        latest.forEach((item) => {
          // If the price has been dropped, it has more data.
          // Looks something like this: <span>Now Free <span class="classified-item-price-strike">$30</span></span>
          let price = item.price;
          price = price.split(" ");
          // Remove extra text when price changes.
          if (price.length > 1) {
            // Will return "Now $100 $225", we want the first number.
            price = price[1];
          }
          output += item.name + ` [${price}]` + ", ";
        });

        // Remove the commac at the end.
        output = output.slice(0, -2);

        notifier.notify({
          title: `${latest.length} new items on Nextdoor 🎉`,
          message: `${output}`,
          open: url,
          wait: false,
          timeout: 10,
          closeLabel: "Close"
        });
      }
    } else {
      console.log("--- No new items. ---")
    }
  }
  return previous;
}
