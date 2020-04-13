const puppeteer = require("puppeteer");
const cnf = require("./config");
const accounts = require("./accounts");
const randomTime = Math.floor(Math.random() * 4000);

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

    // GET ALL RECENTS POST
    const allRecentPostLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".v1Nh3 > a"), (e) => e.href)
    );
    console.log(allRecentPostLinks);
    for (let postLink of allRecentPostLinks) {
      await page.goto(postLink);

      /*=============================
    LIKE POST IF ENABLE BY USER SETTINGS
    =============================*/
      if (account.settings.likePost) {
        await page.waitForSelector(".wpO6b");
        await page.waitFor(Math.random() * 4000);
        await page.click(".wpO6b");
        await page.waitFor(Math.random() * 4000);
      }

      /*=============================
    COMMMENT POST IF ENABLE BY USER
    =============================*/

      if (account.settings.commentPost) {
        await page.waitForSelector("textarea");
        await page.waitFor(Math.random() * 4000);
        await page.type(
          ".Ypffh",
          account.comments[
            Math.floor(Math.random() * account.comments.length) - 1
          ]
        );
        await page.waitFor(3000);
      }

      /*=============================
    FOLLOE ACCOUNT IF ENABLE BY USER
    =============================*/
      if (account.settings.followAccount) {
        // GET ACCOUNT USERNAME
        const accountUser = await page.evaluate(async (e) => {
          return await document.querySelector(".ZIAjV").innerText;
        });

        // CHECK IF YOU ARE CURRENTLY FOLLOWING THE USER
        const isFollowing = await page.evaluate((e) => {
          return document.querySelector(".oW_lN").innerText == "Following";
        });

        // IF NOT FOLLOWING USER (CLICK FOLLOW)
        if (!isFollowing) {
          await page.click(".oW_lN").then(() => {
            //   TODO: ADD USER TO DATABASE
            console.log("following ===> ", accountUser);
          });
        } else {
          console.log("Already following ===> ", accountUser);
        }
        // await page.waitFor(7000);
        //     await page.waitForSelector(".Ypffh");
        //     await page.waitFor(Math.random() * 4000);
        //     await page.type(
        //       ".Ypffh",
        //       account.comments[
        //         Math.floor(Math.random() * account.comments.length) - 1
        //       ]
        //     );
        await page.waitFor(Math.random() * 4000);
      }
    }
  })();
}

/*


*/
