const puppeteer = require("puppeteer");

(async () => {
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
  await page.type('input[name="username"]', "blqck");
  await page.type('input[name="password"]', "Bluesky12");
  await page.waitFor(Math.random() * 4000 + 3500);
  await page.click('button[type="submit"]');
  await page.waitFor(Math.random() * 4000 + 3500);

  // AFTER LOGIN GO TO @USERNAME

  await page.goto("https://www.instagram.com/samantha.j.torres");
  await page.waitForSelector(`._9AhH0`);
  await page.click(`._9AhH0`);

  //   GET USERNAME OF PEOPLE THAT COMMENTED
  const allUserThatCommentedPost = await page.evaluate(() => {
    let a = document.querySelectorAll(`.Igw0E > a`);
    return (a = Array.from(a).map((e) => {
      return e.innerText;
    }));
  });
  await page.waitFor(Math.random() * 4000 + 3500);

  console.log(allUserThatCommentedPost);
})();
