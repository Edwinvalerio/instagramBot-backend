// const puppeteer = require("puppeteer");

// FIXME: ADDIDED SOME MODULE TO RUN BOT UNDECTECTIVE FROM ->  https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth

// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const accountSchema = require("./schema/userSchema");

async function bot(accounts) {


  for (let account of accounts) {
    // RATIAL FUNCTION TO VERY THE FOLLOW
    const ratial = () => {
      // CHANGE THE 0.5  TO THE AMMOUNT OF PERCENTAGE OR RATIOL, HIGHEST THE NUMBER THE HIGHER IS THE PERCENTAGE TO TAKE THE ACTION
      return Math.random() < 0.3;
    };

    // ========================================
    const accountActivities = {
      liked: false,
      commented: false,
      followed: false,
      date: new Date().toLocaleDateString(),
    };
    // ========================================

    try {
      // CHECK IF THE BOT IS ON FOR PARTICAL USER

      if (account.settings.isBotOn && account.isMemberShipAcctive) {
        console.log("BOT ACTIVE FOR => ", account.instagramUsername);
        const browser = await puppeteer.launch({ headless: true });
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

        // ===============================================================

        // IF UNFOLLOW SETTING IS ON : START UNFLOWING USERS
        // const today = new Date().getDay();
        // const monday = 2;
        // const all_account_to_unfollow = account.activities.accountsFollowedByBot.filter((e) => {
        //   return e.followed == true;
        // });

        // await page.waitFor(Math.random() * 4000 + 3500);
        // try {
        //   if (account.settings.do_unfollows && today == monday) {
        //     for (let i = 0; i < all_account_to_unfollow.length - 1; i++) {
        //       console.log(`==================    unfollow users        =========================`);
        //       const user_to_unfollow = all_account_to_unfollow[i];
        //       await page.goto(`https://www.instagram.com/${user_to_unfollow.username}`);
        //       await page.waitForSelector(`.glyphsSpriteFriend_Follow`);
        //       await page.click(`.glyphsSpriteFriend_Follow`);

        //       // click unfollow
        //       await page.evaluate(() => {
        //         document.querySelectorAll(`.aOOlW`)[0].click();
        //       });
        //       await page.waitFor(Math.random() * 4000 + 3000);
        //       accountSchema.findById(account._id, (err, found) => {
        //         if (err) {
        //           console.log(`error finding => ${account.instagramUsername || account.memberEmail} to delete following`);
        //         } else {
        //           found.activities.accountsFollowedByBot[i].followed = false;
        //           found.save();
        //         }
        //       });
        //       await page.waitFor(Math.random() * 4000 + 3000);
        //     }
        //   }
        // } catch (error) {
        //   console.log("error unfollowing");
        //   console.log(error);
        // }

        // ===============================================================

        /*====================================
                          GRAB A RANDOM HASHTAG
              ====================================*/

        await page.waitFor(Math.random() * 4000 + 3500);

        const randomTag = account.hashTags[Math.floor(Math.random() * account.hashTags.length)];

        await page.goto(`https://www.instagram.com/explore/tags/${randomTag}/?hl=en`);

        //  scroll page down 3 times
        await page.evaluate(() => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              window.scrollBy(0, window.innerHeight);
            }, 1000);
          }
        });

        // GET ALL RECENTS POST
        let allRecentPostLinks = await page.evaluate(() => Array.from(document.querySelectorAll("article :nth-child(2) > a"), (e) => e.href));

        // GET THE LAST 15 POST  FROM THE HASGTAG
        for (let i = 0; i < Math.min(allRecentPostLinks.length - 1, 15); i++) {
          let postLink = allRecentPostLinks[i];
          await page.waitFor(Math.random() * 4000 + 3500);
          // console.log(allRecentPostLinks);
          await page.goto(postLink);
          // GET ACCOUNT USERNAME
          const accountUser = await page.evaluate(async () => {
            return await document.querySelector(".ZIAjV").innerText;
          });
          console.log("checking ====> ", accountUser);
          await page.waitFor(Math.random() * 4000 + 3000);

          /*=============================
            FOLLOE ACCOUNT IF ENABLE BY USER
            =============================*/
          const todayFollowGiven = account.activities.accountsFollowedByBot.filter((e) => e.date == new Date().toLocaleDateString() && e.followed == true).length; //THIS IS TOTAL OF FOLLOW GIVEN TODAY

          if (account.settings.followAccount && todayFollowGiven < account.settings.maxDeilyFollow && ratial()) {
            try {
              // CHECK IF YOU ARE CURRENTLY FOLLOWING THE USER
              const isFollowing = await page.evaluate(() => {
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


                // CHECK IF ACTION IS BLOCKED AND IF IT IS, SKIP ACCOUNT
                await page.waitFor((Math.random() * 3000) + 3000)
                const isAcctionBlocked = await page.evaluate(() => {
                  try {
                    return document.querySelector(`.piCib`) ? true : false;
                  } catch (error) {
                    console.log(error)
                    return false
                  }
                });

                if (isAcctionBlocked) {
                  console.log(`ACTION BLOKED MOTHER FUCKER................`);
                  await browser.close();
                  break;
                } else {
                  console.log(`GOOD TO GO!!!!!!!!!!!!!!!!!!!!!!!..........`);
                }

                // ADD TO ACTIVITY
                accountActivities["followed"] = true;
                accountActivities["username"] = accountUser;
                // ADD TO ACTIVITY
                await page.waitFor(Math.random() * 4000 + 3500);
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
          const todayLikedGiven = account.activities.accountsFollowedByBot.filter((e) => e.date == new Date().toLocaleDateString() && e.liked == true).length; //THIS IS TOTAL OF LIKE GIVEN TODAY

          if (account.settings.likePost && todayLikedGiven < account.settings.maxDeilyLikes && ratial()) {
            try {
              // await page.waitForSelector(`[aria-label="Unlike"]`);
              await page.waitFor(Math.random() * 4000 + 3500);
              const isPostLiked = await page.evaluate(() => {
                return document.querySelector(`[aria-label="Unlike"]`) ? true : false;
              });

              if (!isPostLiked) {
                // await page.waitForSelector(".wpO6b");
                await page.waitFor(Math.random() * 4000 + 3500);
                await page.click(".wpO6b");

                // CHECK IF ACTION IS BLOCKED AND IF IT IS, SKIP ACCOUNT
                await page.waitFor((Math.random() * 3000) + 3000)
                const isAcctionBlocked = await page.evaluate(() => {
                  try {
                    return document.querySelector(`.piCib`) ? true : false;
                  } catch (error) {
                    console.log(error)
                    return false
                  }
                });

                if (isAcctionBlocked) {
                  console.log(`ACTION BLOKED MOTHER FUCKER................`);
                  await browser.close();
                  break;
                } else {
                  console.log(`GOOD TO GO!!!!!!!!!!!!!!!!!!!!!!!..........`);
                }

                // ADD TO ACTIVITY
                accountActivities["liked"] = true;
                accountActivities["username"] = accountUser;
                // ADD TO ACTIVITY

                await page.waitFor(Math.random() * 4000 + 3500);
                console.log("Post Liked ==> ", postLink);
              } else {
                console.log("Post Already liked ==> ", postLink);
              }
              await page.waitFor(Math.random() * 4000 + 3500);
            } catch (error) {
              console.log(error);
            }
            await page.waitFor(Math.random() * 4000 + 3500);
          }
          // let isLikeBlocked = document.querySelector('.piCib') ? true : false

          /*=============================
            COMMMENT POST IF ENABLE BY USER
            =============================*/
          const todayCommentGiven = account.activities.accountsFollowedByBot.filter((e) => e.date == new Date().toLocaleDateString() && e.commented == true).length; //THIS IS TOTAL OF LIKE GIVEN TODAY

          if (account.settings.commentPost && todayCommentGiven < account.settings.maxDeilyComment && ratial()) {
            try {
              //TODO:: GET ALL USERNAME OF THE PEOPLE THAT COMMENT ON THE POST
              const allUserThatCommentedPost = await page.evaluate((e) => {
                let a = document.querySelectorAll(`.Igw0E > a`);
                return (a = Array.from(a).map((e) => {
                  return e.innerText;
                }));
              });

              // ONLY TAG 10 ACCOUNTS
              await page.waitForSelector(".Ypffh");
              await page.waitFor(Math.random() * 4000 + 3500);

              // IF DEFAULT COMMENT IS ON
              if (account.tagPeopleThatCommented) {
                let comments_with_usernames_of_users_that_commented = "hey ";
                for (let i = 0; i <= Math.min(allUserThatCommentedPost.length - 1, 5); i++) {
                  let user = allUserThatCommentedPost[i];
                  comments_with_usernames_of_users_that_commented += `@${user} `;
                }

                comments_with_usernames_of_users_that_commented += `${account.comments[Math.floor(Math.random() * account.comments.length - 1)]}`;
                await page.type(".Ypffh", comments_with_usernames_of_users_that_commented || account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
                // IF DEFAULT COMMENT IS OFF
              } else {
                await page.type(".Ypffh", account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
              }
              await page.waitFor(Math.random() * 4000 + 3500);
              await page.click(`form > button`);
              await page.waitFor(Math.random() * 4000 + 3500);

              // ADD TO ACTIVITY
              accountActivities["commented"] = true;
              accountActivities["username"] = accountUser;
              // ADD TO ACTIVITY

              // CHECK IF ACTION IS BLOCKED AND IF IT IS, SKIP ACCOUNT
              await page.waitFor((Math.random() * 3000) + 3000)
              const isAcctionBlocked = await page.evaluate(() => {
                try {
                  return document.querySelector(`.piCib`) ? true : false;
                } catch (error) {
                  console.log(error)
                  return false
                }
              });

              if (isAcctionBlocked) {
                console.log(`ACTION BLOKED MOTHER FUCKER................`);
                await browser.close();
                break;
              } else {
                console.log(`GOOD TO GO!!!!!!!!!!!!!!!!!!!!!!!..........`);
              }

              await page.waitFor(Math.random() * 5000 + 3500);
            } catch (error) {
              console.log("Erro commenting", error);
            }
            await page.waitFor(Math.random() * 4000 + 3500);
          }

          console.log("=================================");
          console.log(accountActivities);
          console.log("=================================");
          if (accountActivities["username"]) {
            accountSchema.findById(account._id, (err, found) => {
              if (err) {
                console.log(err);
              } else {
                found.activities.accountsFollowedByBot.push(accountActivities);
                found.save();
              }
            });
          }
        }
        //CLOSE BROWSER
        await browser.close();

        await page.waitFor(Math.random() * 4000 + 3500);
      } else {
        console.log("BOT is OFF or MEMMBERSHIP is not ACTIVE for ===> ", account.username || account.memberEmail);
      }
    } catch (error) {
      console.log(`error for account ${account.instagramUsername || account.memberEmail}\nError: => ${error}`);
    }

    // close browser after each account opertion
  }
  console.log("=================================");
  console.log("====== OPERATION COMPLETED ======");
  console.log("======== NEXT RUN IN 1HR ========");
  console.log("=================================");


  // setTimeout(() => {
  //   accountSchema.find((err, allAccounts) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       bot(allAccounts);
  //     }
  //   });
  // }, 60000 * 60);
}

module.exports = bot;
