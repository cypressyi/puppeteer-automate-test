const puppeteer = require('puppeteer');
const colors = require('colors');

(async () => {
  const website = require('./website.json')
  const browserSetting = {
    // headless: false,
    // devtools: true,
    // slowMo: 250
  }
  const browser = await puppeteer.launch(browserSetting);
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 800
  });

  await page.on("error", msg => console.log(`Page error: ${msg.toString()}`.red));
  await page.on("pageerror", msg => console.log(`Page exception: ${msg.toString()}\n`.yellow));
  await page.on('console', msg => console.log(`Page console: ${msg.text()}\n`.cyan));
  await page.on('response', response => {
    if(!response.ok()) {
      if(response.status() !== 302 && response.status() !== 304 ) {
        console.error(`Response: ${response.status()}\nRequest: ${response.url()}\n`.red);
      }
    }
  });

  for (i = 0; i < website.length; i = i+1) {
    console.log(`>> Page: ${website[i].url}\n`.green)
    await page.goto(website[i].url);

    // Scroll to bottom
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          try {
              const maxScroll = Number.MAX_SAFE_INTEGER;
              let lastScroll = 0;
              const interval = setInterval(() => {
                  window.scrollBy(0, 250);
                  const scrollTop = document.documentElement.scrollTop;
                  if (scrollTop === maxScroll || scrollTop === lastScroll) {
                      clearInterval(interval);
                      resolve();
                  } else {
                    lastScroll = scrollTop;
                  }
              }, 100);
          } catch (err) {
              console.log(err);
              reject(err.toString());
          }
      });
    });
  }

  await browser.close();
})();

