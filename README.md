# Instant, Local Notifications for N*xtdoor.

In my humble opinion, N*xtdoor is by far the best place for finding the best deals on neighbors selling _stuff_. It beats out Facebook Marketplace and Craigslist due to the trust that comes with being a part of a neighborhood.

This project's goal is to help make deals **as fast as possible**. This little project checks N*xtdoor classifieds every minute for a new product and then sends a notification on your computer with details.

![Notification](./assets/notification.png)

_in active development_

## Installation

1. Clone this repo to your computer
2. Change `example.constants.js` to `constants.js` and add in your N*xtdoor email and password.
3. More coming soon as this won't fully work because of 2fa

## Notes

- In an effort to reduce the number of Chromium instances, this utilizes `try catch` to look out for any errors (specifically `TimeoutError: Navigation timeout of 30000 ms exceeded`). If that is the case, the `catch` will log the error and close the browser. This more or less means that iteration of the check is skipped.

## Todo
- [ ] One time account login happens where code gets sent to the email address. Not sure how often/when/how to handle. [07/14/2020]

    -- Create steps for initialize.js
    -- Create webpage with instructions

- [X] When a price drops, it is wrapped in a "`<span>`" [07/16/2020]
- [X] Add timestamp to logs [07/16/2020]
- [X] Custom app icon to replace default terminal icon [7/17/2020]

