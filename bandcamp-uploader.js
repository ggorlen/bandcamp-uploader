const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const uploadAlbum = async (album, config) => {
  const {username, password} = config;
  let browser;
  return (async () => {
    browser = await puppeteer.launch({
      headless: true,
      userDataDir: "/browserdata",
    });
    const [page] = await browser.pages();
    await page.goto("https://bandcamp.com/login");
  
    if (await page.$("#loginform")) {
      await page.type("#username-field", username);
      await page.type("#password-field", password);
      await Promise.all([
        page.click('#loginform [type="submit"]'),
        page.waitForNavigation(),
      ]);
    }
  
    await page.goto(`https://${username}.bandcamp.com/edit_album`);
  
    album.private && (await page.click('#private-radio'));
    await page.type('[name="album.title"]', album.title);
    await page.type('[name="album.release_date"]', album.release_date);
    await page.$eval('[name="album.price"]', el => el.value = "");
    await page.type('[name="album.price"]', album.price);
    await page.type('[name="album.about"]', album.about);
    await page.type('[name="album.credits"]', album.credits);
    await page.type('[name="album.artist"]', album.artist);
    await page.type('[name="album.tags"]', album.tags);
    await page.type('[name="album.cat_number"]', album.cat_number);
    await page.$eval(
      'input[name="album.nyp"]', 
      (el, album) => {el.checked = album.enablePayMore;},
      album
    );
    await page.$eval(
      'input[name="preorder.on"]', 
      (el, album) => {el.checked = album.enablePreorder;},
      album
    );
    
    await (await page.$('.art-upload input[type="file"]'))
      .uploadFile(album.art)
    ;
  
    for (let i = 0; i < album.tracks.length; i++) {
      const track = album.tracks[i];
      await (await page.$('.add-audio input[type="file"]'))
        .uploadFile(track.file)
      ;
      await page.type(`[name="track.title_${i}"]`, track.title);
      await page.$eval(`[name="track.price_${i}"]`, el => el.value = "");
      await page.type(`[name="track.price_${i}"]`, track.price);
      await page.$eval(
        `input[name="track.enable_download_${i}"]`,
        (el, checked) => {el.checked = checked;},
        track.enablePurchase
      );
      await page.$eval(
        `input[name="track.nyp_${i}"]`,
        (el, checked) => {el.checked = checked;},
        track.fansPayIfWant
      );
      await page.$eval(
        `input[name="track.require_email_${i}"]`,
        (el, checked) => {el.checked = checked;},
        track.requireEmail
      );
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".tracks .track .filename .checkmark")].length === 
        [...document.querySelectorAll(".tracks .track")].length,
        {timeout: 60 * 60 * 1000} // wait for upload to finish
      );
    }
  
    await page.click(".save-draft");
    await page.waitForSelector(".draft-saved", {visible: true});
    await page.click(".publish");
    await page.waitForSelector(".view-published", {visible: true});
  })()
    .finally(async () => await browser.close())
  ;
};

module.exports = {uploadAlbum};

