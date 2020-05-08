// const puppeteer = require("puppeteer");

// FIXME: ADDIDED SOME MODULE TO RUN BOT UNDECTECTIVE FROM ->  https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const accountSchema = require("./schema/userSchema");


let run_every = 30; // RUN BOT EVERY 30MIN

async function bot(accounts) {
  const today = new Date().getDay();

  for (let account of accounts) {
    // RATIAL FUNCTION TO VERY THE FOLLOW
    const ratial = (percentage = 0.8) => {
      // CHANGE THE 0.4  TO THE AMMOUNT OF PERCENTAGE OR RATIOL, HIGHEST THE NUMBER THE HIGHER IS THE PERCENTAGE TO TAKE THE ACTION
      return Math.random() < percentage;
    };

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
        await page.waitFor(Math.random() * 4000 + 3500);

        if (today == 1) {
          console.log(`Unfollowing -> ${account.memberEmail}`);
          const user_bot_is_following = account.activities.accountsFollowedByBot.filter((a) => a.followed);
          for (let i = 0; i < Math.min(user_bot_is_following.length - 1, 30); i++) {
            let user = account.activities.accountsFollowedByBot[i].username;
            await page.goto(`https://www.instagram.com/${user}/`);
            await page.waitFor(Math.random() * 2000 + 2500);

            // CHECK IF ALREADY FOLLOWING USER
            let isFollowing = await page.evaluate(() => {
              return document.querySelector(`[aria-label="Following"]`) != null;
            });

            if (isFollowing) {
              await page.click(`[aria-label="Following"]`);
              await page.waitFor(Math.random() * 2000 + 1500);
              await page.click(`.-Cab_`);
              page.waitFor(Math.random() * 4000 + 1500);
              accountSchema.findById(account._id, (err, found) => {
                if (err) {
                  console.log(err);
                } else {
                  let filtered = found.activities.accountsFollowedByBot.filter((item) => {
                    return item.username != user;
                  });
                  found.activities.accountsFollowedByBot = [...filtered];
                  found.save((err, saved) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(`Unfollowing ->  ${user}`);
                    }
                  });
                }
              });
            } else {
              accountSchema.findById(account._id, (err, found) => {
                if (err) {
                  console.log(err);
                } else {
                  let filtered = found.activities.accountsFollowedByBot.filter((item) => {
                    return item.username != user;
                  });
                  found.activities.accountsFollowedByBot = [...filtered];
                  found.save((err, saved) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(`Removing -> ${user}`);
                    }
                  });
                }
              });
            }
            page.waitFor(Math.random() * 4000 + 1500);
          }


        }

        // TODO: GET FOLLOWERS BY TARGETED ACCOUNTS
        if (account.settings.followByUserName) {
          for (let i = 0; i < Math.min(account.userThatInteractWith.length - 1, 4); i++) {

            var randomUser;
            randomUser = account.userThatInteractWith[Math.floor(Math.random() * (account.userThatInteractWith.length - 1))];
            await page.goto(`https://www.instagram.com/${randomUser}/`);

            let allpost = await page.evaluate(() => {
              return Array.from(document.querySelectorAll(`._bz0w > a`)).map((e) => e.href);
            });

            // ITERATE TARGED ACCOUNT POST
            for (let i = 0; i < Math.min(allpost.length - 1, 6); i++) {
              let singlePost = allpost[i];
              await page.waitFor(Math.random() * 4000 + 1500);
              await page.goto(singlePost);

              // CHECK IF THE POST IS AN IMAGE
              let is_image = await page.evaluate(() => {
                return document.querySelector(`.Nm9Fw button`) !== null;
              });
              await page.waitFor(Math.random() * 4000 + 1500);
              if (is_image) {
                console.log(`post is an image`);

                await page.click(`.Nm9Fw button`);
                await page.waitFor(Math.random() * 1000 + 1500);
                const all_users_Liked = await page.evaluate(() => {
                  return Array.from(document.querySelectorAll(`a ._7UhW9`)).map((e) => e.innerText);
                });

                for (let i = 0; i < Math.min(all_users_Liked.length - 1, 10); i++) {
                  // ========================================
                  let accountActivities = {
                    liked: false,
                    commented: false,
                    followed: false,
                    date: new Date().toLocaleDateString(),
                  };
                  // ========================================

                  let accountUser = all_users_Liked[i];
                  await page.goto(`https://www.instagram.com/${accountUser}/`);

                  await page.waitFor(Math.random() * 4000 + 1500);
                  // CHECK IF THE USER IS PRIVATE
                  const isAccountPrivate = await page.evaluate(() => {
                    try {
                      return document.querySelector(`.rkEop`).innerText == "This Account is Private";
                    } catch (error) {
                      return false;
                    }
                  });

                  await page.waitFor(Math.random() * 2000 + 0500);
                  // IF ACCOUNT IS PRIVATE SKIP IT
                  if (isAccountPrivate) {
                    console.log(accountUser, `is private`);
                    continue;
                  }

                  //   // GOT TO A RANDOM POST
                  let randomPost = await page.evaluate(() => {
                    let all = document.querySelectorAll(`._bz0w > a`);
                    let postLinks = Array.from(all).map((a) => a.href);

                    return postLinks[Math.floor(Math.random() * (postLinks.length - 1))];
                  });
                  if (randomPost) {
                    await page.goto(randomPost);
                  }
                  await page.waitFor(Math.random() * 4000 + 3500);

                  //TODO:: GET ALL USERNAME OF THE PEOPLE THAT COMMENT ON THE POST
                  const allUserThatCommentedPost = await page.evaluate(() => {
                    let a = document.querySelectorAll(`.Igw0E > a`);
                    return (a = Array.from(a).map((e) => {
                      return e.innerText;
                    }));
                  });

                  //     /*=============================
                  //   FOLLOW ACCOUNT IF ENABLE BY USER
                  //   =============================*/

                  let todayFollowGiven = account.activities.accountsFollowedByBot.filter((e) => e.date == new Date().toLocaleDateString() && e.followed == true).length; //THIS IS TOTAL OF FOLLOW GIVEN TODAY
                  if (account.settings.followAccount && todayFollowGiven < account.settings.maxDeilyFollow && ratial()) {
                    try {
                      // CHECK IF YOU ARE CURRENTLY FOLLOWING THE USER
                      const isFollowing = await page.evaluate(() => {
                        try {
                          return document.querySelector(".oW_lN").innerText == "Following";
                        } catch (error) {
                          return false;
                        }
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
                        await page.waitFor(Math.random() * 3000 + 3000);
                        const isAcctionBlocked = await page.evaluate(() => {
                          try {
                            return document.querySelector(`.piCib`) ? true : false;
                          } catch (error) {
                            console.log(error);
                            return false;
                          }
                        });

                        if (isAcctionBlocked) {
                          accountSchema.findById(account._id, (err, item) => {
                            item.settings.followAccount = false;
                            item.save();
                          });
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

                  //     /*=============================
                  //   LIKE POST IF ENABLE BY USER SETTINGS
                  //   =============================*/
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
                        await page.waitFor(Math.random() * 3000 + 3000);
                        const isAcctionBlocked = await page.evaluate(() => {
                          try {
                            return document.querySelector(`.piCib`) ? true : false;
                          } catch (error) {
                            console.log(error);
                            return false;
                          }
                        });

                        // if (isAcctionBlocked) {
                        //   accountSchema.findById(account._id, (err, item) => {
                        //     item.settings.likePost = false;
                        //     item.save();
                        //   });
                        //   console.log(`ACTION BLOKED MOTHER FUCKER................`);
                        //   await browser.close();
                        //   break;
                        // } else {
                        //   console.log(`GOOD TO GO!!!!!!!!!!!!!!!!!!!!!!!..........`);
                        // }

                        // ADD TO ACTIVITY
                        accountActivities["liked"] = true;
                        accountActivities["username"] = accountUser;
                        // ADD TO ACTIVITY

                        await page.waitFor(Math.random() * 4000 + 3500);
                        console.log("Post Liked ==> ", singlePost);
                      } else {
                        console.log("Post Already liked ==> ", singlePost);
                      }
                      await page.waitFor(Math.random() * 4000 + 3500);
                    } catch (error) {
                      console.log(error);
                    }
                    await page.waitFor(Math.random() * 4000 + 3500);
                  }

                  //     /*=============================
                  //   COMMMENT POST IF ENABLE BY USER
                  //   =============================*/
                  const todayCommentGiven = account.activities.accountsFollowedByBot.filter((e) => e.date == new Date().toLocaleDateString() && e.commented == true).length; //THIS IS TOTAL OF LIKE GIVEN TODAY

                  if (account.settings.commentPost && todayCommentGiven < account.settings.maxDeilyComment && ratial()) {
                    try {
                      //TODO:: GET ALL USERNAME OF THE PEOPLE THAT COMMENT ON THE POST
                      const allUserThatCommentedPost = await page.evaluate(() => {
                        let a = document.querySelectorAll(`.Igw0E > a`);
                        return (a = Array.from(a).map((e) => {
                          return e.innerText;
                        }));
                      });

                      // ONLY TAG 10 ACCOUNTS
                      await page.waitFor(Math.random() * 4000 + 3500);

                      try {
                        // IF DEFAULT COMMENT IS ON
                        if (account.tagPeopleThatCommented) {
                          let comments_with_usernames_of_users_that_commented = "hey ";
                          for (let i = 0; i <= Math.min(allUserThatCommentedPost.length - 1, 5); i++) {
                            let user = allUserThatCommentedPost[i];
                            comments_with_usernames_of_users_that_commented += `@${user} `;
                          }

                          comments_with_usernames_of_users_that_commented += `${account.comments[Math.floor(Math.random() * account.comments.length) - 1]}`;
                          await page.waitForSelector(`textarea`);
                          await page.type("textarea", comments_with_usernames_of_users_that_commented || account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
                          // IF DEFAULT COMMENT IS OFF
                        } else {
                          await page.type("textarea", account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
                        }
                      } catch (error) {
                        console.log("error tryinh to comment. plese see error msg below\n\n", error);
                      }
                      await page.waitFor(Math.random() * 4000 + 3500);
                      await page.click(`form > button`);
                      await page.waitFor(Math.random() * 4000 + 3500);

                      // ADD TO ACTIVITY
                      accountActivities["commented"] = true;
                      accountActivities["username"] = accountUser;
                      // ADD TO ACTIVITY

                      // CHECK IF ACTION IS BLOCKED AND IF IT IS, SKIP ACCOUNT
                      await page.waitFor(Math.random() * 3000 + 3000);
                      const isAcctionBlocked = await page.evaluate(() => {
                        try {
                          return document.querySelector(`.piCib`) ? true : false;
                        } catch (error) {
                          console.log(error);
                          return false;
                        }
                      });

                      if (isAcctionBlocked) {
                        accountSchema.findById(account._id, (err, item) => {
                          item.settings.commentPost = false;
                          item.save();
                        });
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
                // BREAK LOOP AFTER ACTION IS COMPLETED
                break;
              } else {
                console.log(`post is NOT an image`);
              }

              await page.waitFor(Math.random() * 4000 + 1500);
            }

            // IMAGE TAG CLASS: _9AhH0

            // // GET THE LAST TWO POST FROM TARGETED ACCOUNT
            // for (let i = 0; i < Math.min(account.userThatInteractWith.length - 1, 2); i++) {
            //   let targetedAccount = account.userThatInteractWith[i];
            //   await page.goto(`https://www.instagram.com/${targetedAccount}/`);
            //   await page.waitFor(Math.random() * 4000 + 3500);

            //   // GOT TO A RANDOM POST
            //   let randomPost = await page.evaluate(() => {
            //     let all = document.querySelectorAll(`._bz0w > a`);
            //     let postLinks = Array.from(all).map((a) => a.href);
            //     return postLinks[Math.floor(Math.random() * (postLinks.length - 1))];
            //   });
            //   await page.goto(randomPost);
            //   await page.waitFor(Math.random() * 4000 + 3500);

            //   // VISITE ALL USER THAT COMMENT THE POST
            //   for (let i = 1; i < allUserThatCommentedPost.length - 1; i++) {
            //     let accountUser = allUserThatCommentedPost[i];
            //     await page.goto(`https://www.instagram.com/${accountUser}/`);
            //     await page.waitFor(Math.random() * 4000 + 3500);

            //     // GOT TO A RANDOM POST
            //     let randomPost = await page.evaluate(() => {
            //       let all = document.querySelectorAll(`._bz0w > a`);
            //       let postLinks = Array.from(all).map((a) => a.href);
            //       return postLinks[Math.floor(Math.random() * (postLinks.length - 1))];
            //     });
            //     await page.goto(randomPost);
            //     await page.waitFor(Math.random() * 4000 + 3500);

            //   }
            // }
          }
        } else {
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
          let allRecentPostLinks = await page.evaluate(() => Array.from(document.querySelectorAll("article > div:nth-of-type(2n) a"), (e) => e.href));

          // GET THE LAST 15 POST  FROM THE HASGTAG
          for (let i = 0; i < Math.min(allRecentPostLinks.length - 1, 20); i++) {
            let accountActivities = {
              liked: false,
              commented: false,
              followed: false,
              date: new Date().toLocaleDateString(),
            };

            let postLink = allRecentPostLinks[i];
            await page.waitFor(Math.random() * 4000 + 3500);
            // console.log(allRecentPostLinks);
            await page.goto(postLink);
            // GET ACCOUNT USERNAME
            const accountUser = await page.evaluate(() => {
              return document.querySelector(".ZIAjV").innerText;
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
                  await page.waitFor(Math.random() * 3000 + 3000);
                  const isAcctionBlocked = await page.evaluate(() => {
                    try {
                      return document.querySelector(`.piCib`) ? true : false;
                    } catch (error) {
                      console.log(error);
                      return false;
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
                  await page.waitFor(Math.random() * 3000 + 3000);
                  const isAcctionBlocked = await page.evaluate(() => {
                    try {
                      return document.querySelector(`.piCib`) ? true : false;
                    } catch (error) {
                      console.log(error);
                      return false;
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
                const allUserThatCommentedPost = await page.evaluate(() => {
                  let a = document.querySelectorAll(`.Igw0E > a`);
                  return (a = Array.from(a).map((e) => {
                    return e.innerText;
                  }));
                });

                // ONLY TAG 10 ACCOUNTS
                await page.waitFor(Math.random() * 4000 + 3500);

                try {
                  // IF DEFAULT COMMENT IS ON
                  if (account.tagPeopleThatCommented) {
                    let comments_with_usernames_of_users_that_commented = "hey ";
                    for (let i = 0; i <= Math.min(allUserThatCommentedPost.length - 1, 5); i++) {
                      let user = allUserThatCommentedPost[i];
                      comments_with_usernames_of_users_that_commented += `@${user} `;
                    }

                    comments_with_usernames_of_users_that_commented += `${account.comments[Math.floor(Math.random() * account.comments.length) - 1]}`;
                    await page.type("textarea", comments_with_usernames_of_users_that_commented || account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
                    // IF DEFAULT COMMENT IS OFF
                  } else {
                    await page.type("textarea", account.comments[Math.floor(Math.random() * account.comments.length - 1)]);
                  }
                } catch (error) {
                  console.log("error tryinh to comment. plese see error msg below\n\n", error);
                }
                await page.waitFor(Math.random() * 4000 + 3500);

                await page.click(`form > button`);
                await page.waitFor(Math.random() * 4000 + 3500);

                // ADD TO ACTIVITY
                accountActivities["commented"] = true;
                accountActivities["username"] = accountUser;
                // ADD TO ACTIVITY

                // CHECK IF ACTION IS BLOCKED AND IF IT IS, SKIP ACCOUNT
                await page.waitFor(Math.random() * 3000 + 3000);
                const isAcctionBlocked = await page.evaluate(() => {
                  try {
                    return document.querySelector(`.piCib`) ? true : false;
                  } catch (error) {
                    console.log(error);
                    return false;
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
        }

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

  setTimeout(() => {
    accountSchema.find((err, allAccounts) => {
      if (err) {
        console.log(err);
      } else {
        bot(allAccounts);
      }
    });
  }, 60000 * run_every);
}

module.exports = bot;
