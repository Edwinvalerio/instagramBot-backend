// const puppeteer = require("puppeteer");

// FIXME: ADDIDED SOME MODULE TO RUN BOT UNDECTECTIVE FROM ->  https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function bot(accounts) {
  for (let account of accounts) {
    // CHECK IF THE BOT IS ON FOR PARTICAL USER

    if (account.settings.isBotOn && account.isMemberShipAcctive) {
      console.log("BOT ACTIVE FOR => ", account.instagramUsername);
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      // SET WINDOW VIEW TO RANDOM SIZE TO AVOIN IG TECTECTING THE BOT
      page.setViewport({
        width: Math.floor(Math.random() * 200 + 800),
        height: Math.floor(Math.random() * 200 + 800),
      });
      await page.goto("https://www.instagram.com/accounts/login/?hl=en");
      /*====================================
                          LOG IN TO ACCOUNT
              ====================================*/
      await page.waitForSelector('input[name="username"]');
      await page.type('input[name="username"]', account.instagramUsername);
      await page.type('input[name="password"]', account.instagramPassword);
      await page.waitFor(Math.random() * 4000 + 3500);
      await page.click('button[type="submit"]');

      /*====================================
                          GRAB A RANDOM HASHTAG
              ====================================*/

      await page.waitFor(Math.random() * 4000 + 3500);

      const randomTag =
        account.hashTags[Math.floor(Math.random() * account.hashTags.length)];

      await page.goto(
        `https://www.instagram.com/explore/tags/${randomTag}/?hl=en`
      );

      //  scroll page down 3 times
      await page.evaluate(() => {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            window.scrollBy(0, window.innerHeight);
          }, 1000);
        }
      });

      // GET ALL RECENTS POST
      let allRecentPostLinks = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll("article :nth-child(2) > a"),
          (e) => e.href
        )
      );
      allRecentPostLinks.splice(10);

      for (let postLink of allRecentPostLinks) {
        console.log(allRecentPostLinks);
        await page.goto(postLink);
        // GET ACCOUNT USERNAME
        const accountUser = await page.evaluate(async (e) => {
          return await document.querySelector(".ZIAjV").innerText;
        });
        console.log("checking ====> ", accountUser);
        await page.waitFor(Math.random() * 4000 + 3000);
        /*=============================
            FOLLOE ACCOUNT IF ENABLE BY USER
            =============================*/
        if (account.settings.followAccount) {
          try {
            // CHECK IF YOU ARE CURRENTLY FOLLOWING THE USER
            const isFollowing = await page.evaluate((e) => {
              return document.querySelector(".oW_lN").innerText == "Following";
            });

            // IF NOT FOLLOWING USER (CLICK FOLLOW)
            if (isFollowing == false) {
              await page.waitForSelector(".oW_lN");
              await page.waitFor(Math.random() * 4000 + 3500);
              await page.click(".oW_lN").then(() => {
                //   TODO: ADD USER TO DATABASE
                console.log("following ===> ", accountUser);
              });
            } else {
              console.log("Already following ===> ", accountUser);
            }

            await page.waitFor(Math.random() * 4000);
          } catch (error) {
            console.log("Erro Following User", error);
          }
        }

        /*=============================
            LIKE POST IF ENABLE BY USER SETTINGS
            =============================*/
        if (account.settings.likePost) {
          await page.waitForSelector(`[aria-label="Unlike"]`);
          const isPostLiked = await page.evaluate((e) => {
            return document.querySelector(`[aria-label="Unlike"]`)
              ? true
              : false;
          });
          if (!isPostLiked) {
            await page.waitForSelector(".wpO6b");
            await page.waitFor(Math.random() * 4000 + 3500);
            await page.click(".wpO6b");
            await page.waitFor(Math.random() * 4000 + 3500);
            console.log("Post Liked ==> ", postLink);
          } else {
            console.log("Post Already liked ==> ", postLink);
          }
          await page.waitFor(Math.random() * 4000 + 3500);
        }
        // let isLikeBlocked = document.querySelector('.piCib') ? true : false

        /*=============================
            COMMMENT POST IF ENABLE BY USER
            =============================*/

        if (account.settings.commentPost) {
          try {
            //TODO:: GET ALL USERNAME OF THE PEOPLE THAT COMMENT ON THE POST
            const allUserThatCommentedPost = await page.evaluate((e) => {
              let a = document.querySelectorAll(`.Igw0E > a`);
              return (a = Array.from(a).map((e) => {
                return e.innerText;
              }));
            });

            await page.waitForSelector(".Ypffh");
            await page.waitFor(Math.random() * 4000 + 3500);
            await page.type(
              ".Ypffh",
              account.comments[
                Math.floor(Math.random() * account.comments.length) - 1
              ]
            );
            await page.waitFor(Math.random() * 4000 + 3500);
            // await page.keyboard.press("Enter"); // Enter Key
            await page.waitFor(Math.random() * 5000 + 3500);
          } catch (error) {
            console.log("Erro commenting", error);
          }
        }
      }
    } else {
      console.log("BOT is off for ===> ", account.username);
    }
  }
  console.log("=================================");
  console.log("====== OPERATION COMPLETED ======");
  console.log("======== NEXT RUN IN 1HR ========");
  console.log("=================================");
}

module.exports = bot;

// const r = document.querySelectorAll(`article:nth-child(2) > div  div a`)
// for(let i of r){
//     console.log(i.href)
// }

// blocked window class = .piCib
