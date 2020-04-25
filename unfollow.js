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
