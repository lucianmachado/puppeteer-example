const puppeteer = require("puppeteer");
const crypto = require('crypto');


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      // "--disable-extensions-except=/path/to/my/extension",
      // "--load-extension=/path/to/my/extension",
      // "--user-data-dir=User Data\\Profile 1",
      //'--profile-directory=Profile 1'
    ],
  });
  


   // handle a page being closed
   browser.on('targetdestroyed', async target => {
    const openPages = await browser.pages();
    console.log('Open pages:', openPages.length);
    if (openPages.length == 0) {
      console.log('Closing empty browser');
      await browser.close();
      console.log('Browser closed');
    }
  });
  
  const page = await browser.newPage();
  
  const pages = await browser.pages();
  if (pages.length > 1) {
      await pages[0].close();
  }

  await page.goto("http://www.google.com", { waitUntil: 'networkidle0' });

  page.on('console', (msg) => console.log(msg.text()));
  await page.exposeFunction('md5', (text) =>
    crypto.createHash('md5').update(text).digest('hex')
  );

  await page.evaluate(async () => {
    // use window.md5 to compute hashes
    const myString = 'PUPPETEER';
    const myHash = await window.md5(myString);
    console.log(`md5 of ${myString} is ${myHash}`);
  });

  console.log(await page.cookies())
  
})();
