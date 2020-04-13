const puppeteer = require("puppeteer");
const user = require("./user");
const cnf = require("./config");

const randomTime = Math.floor(Math.random() * 4000);

const accounts = [
  {
    username: "dog_cats_lover",
    password: "Bluesky1",
    hashTags: ["love", "pizza"],
    comments: [
      "i like your content",
      "keep the good work",
      "are you from Cambridge Massachuseets? i really like you content",
    ],
    settings: {
      run_every_x_hours: 1,
      like_ratio: 0.75,
      follow_ratio: 0.25,
      do_unfollows: true,
      unfollow_after_days: 2,
      likePost: true,
      commentPost: false,
      followUsers: false,
    },
  },
];

for (let account of accounts) {
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setViewport({ width: 800, height: 800 });
    await page.goto("https://www.instagram.com/accounts/login/?hl=en");
    /*====================================
                  LOG IN TO ACCOUNT
      ====================================*/
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', account.username);
    await page.type('input[name="password"]', account.password);
    await page.waitFor(4000);
    await page.click('button[type="submit"]');

    /*====================================
                  GRAB A RANDOM HASHTAG
      ====================================*/

    await page.waitFor(4000);

    await page.waitFor(4000);

    const randomTag =
      account.hashTags[Math.floor(Math.random() * account.hashTags.length)];

    await page.goto(
      `https://www.instagram.com/explore/tags/${randomTag}/?hl=en`
    );

    const result = await page.evaluate(() => {
      // Get elements into a NodeList
      const elements = document.querySelectorAll(".v1Nh3.kIKUG._bz0w a");

      // Convert elements to an array,
      // then for each item of that array only return the href attribute
      const linksArr = Array.from(elements).map((link) => link.href);

      return linksArr;
    });

    // GET ALL RECENTS POST
    const allRecentPostLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".v1Nh3 > a"), (e) => e.href)
    );

    for (let postLink of allRecentPostLinks) {
      await page.goto(postLink);

      //   IF LIKE SETTING IS ON THEN LIKE THE POST
      if (account.settings.likePost) {
        await page.waitForSelector(".wpO6b");
        await page.waitFor(Math.random() * 4000);
        await page.click(".wpO6b");
        await page.waitFor(Math.random() * 4000);
      }
    }
  })();
}

/*


*/
