const puppeteer = require('puppeteer');
const colors = require('colors');

(async () => {
  const urls = [
    'https://github.com/h5bp/html5asdfsa',
    'https://events.curves.com.tw/curvestw',
    'https://events.aso.com.tw/asotw',
    'https://events.curves.com.tw/curvestw',
    'https://events.westlake.com.tw/3826',
    'https://news.rt-mart.com.tw/784',
    'https://news.rt-mart.com.tw/main',
    'https://www.hvc.com.tw/39',
    'https://www.hvc.com.tw/content',
    'https://zines.cc/4397',
    'https://zines.cc/mwbchk'
  ]

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

  for (i = 0; i < urls.length; i = i+1) {
    console.log(`>> Page: ${urls[i]}\n`.green)
    await page.goto(urls[i]);

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

