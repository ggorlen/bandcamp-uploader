import puppeteer from "puppeteer";

/**
 * @typedef {import('../types/index.d.ts').Album} Album
 * @typedef {import('../types/index.d.ts').Track} Track
 * @typedef {import('puppeteer').Page} Page
 */

/**
 * Handles navigation, login, editing, uploading, saving, and publishing an album to Bandcamp.
 * @param {Page} page
 * @param {Album} album
 * @param {{username:string,password:string}} creds
 */
export async function uploadAlbumWithPage(page, album, { username, password }) {
  await page.goto("https://bandcamp.com/login", {
    timeout: 60_000,
    waitUntil: "networkidle2",
  });
  const loginForm = await page.$("#loginform");
  if (loginForm) {
    await page.type("#username-field", username, { delay: 50 });
    await page.type("#password-field", password, { delay: 50 });
    await Promise.all([
      page.waitForNavigation({ timeout: 60_001, waitUntil: "networkidle2" }),
      page.click('#loginform [type="submit"]'),
    ]);
  }

  await page.goto(`https://${username}.bandcamp.com/edit_album`, {
    timeout: 60_002,
    waitUntil: "networkidle2",
  });

  if (album.private) {
    await page.click("#private-radio");
  }

  await page.type('[name="album.title"]', album.title, { delay: 50 });
  await page.type('[name="album.release_date"]', album.release_date, {
    delay: 50,
  });
  await page.$eval('[name="album.price"]', (el) => {
    if (!(el instanceof HTMLInputElement)) {
      throw Error("Expected HTML input element");
    }
    el.value = "";
  });
  await page.type('[name="album.price"]', album.price, { delay: 50 });
  await page.type('[name="album.about"]', album.about, { delay: 50 });
  await page.type('[name="album.credits"]', album.credits, { delay: 50 });
  await page.type('[name="album.artist"]', album.artist, { delay: 50 });
  await page.type('[name="album.tags"]', album.tags, { delay: 50 });
  await page.type('[name="album.cat_number"]', album.cat_number, { delay: 50 });

  await page.$eval(
    'input[name="album.nyp"]',
    (el, val) => (el.checked = val),
    album.enablePayMore
  );
  await page.$eval(
    'input[name="preorder.on"]',
    (el, val) => (el.checked = val),
    album.enablePreorder
  );

  const albumArtInput = await page.$('.art-upload input[type="file"]');
  if (!albumArtInput) {
    throw Error("Unable to find album art input");
  }

  await albumArtInput.uploadFile(album.art);

  for (let i = 0; i < album.tracks.length; i++) {
    const track = album.tracks[i];
    const audioFileInput = await page.$('.add-audio input[type="file"]');
    if (!audioFileInput) {
      throw Error("Unable to find audio file input");
    }

    await audioFileInput.uploadFile(track.file);
    await page.type(`[name="track.title_${i}"]`, track.title, { delay: 50 });
    await page.$eval(`[name="track.price_${i}"]`, (el) => {
      if (!(el instanceof HTMLInputElement)) {
        throw Error("Expected HTMLInputElement");
      }
      el.value = "";
    });
    await page.type(`[name="track.price_${i}"]`, track.price, { delay: 50 });
    await page.$eval(
      `input[name="track.enable_download_${i}"]`,
      (el, val) => (el.checked = val),
      track.enablePurchase
    );
    await page.$eval(
      `input[name="track.nyp_${i}"]`,
      (el, val) => (el.checked = val),
      track.fansPayIfWant
    );
    await page.$eval(
      `input[name="track.require_email_${i}"]`,
      (el, val) => (el.checked = val),
      track.requireEmail
    );

    await page.waitForFunction(
      () =>
        document.querySelectorAll(".tracks .track .filename .checkmark")
          .length === document.querySelectorAll(".tracks .track").length,
      { timeout: 60 * 60 * 1000 }
    );
  }

  await page.click(".save-draft");
  await page.waitForSelector(".draft-saved", {
    visible: true,
    timeout: 30_001,
  });
  await page.click(".publish");
  await page.waitForSelector(".view-published", {
    visible: true,
    timeout: 30_002,
  });
}

/**
 * Convenience wrapper that manages the browser and page, uploading an album end to end.
 * @param {Album} album
 * @param {{username:string,password:string}} creds
 */
export async function uploadAlbum(album, creds) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      userDataDir: "./bandcamp-browserdata",
    });
    const [page] = await browser.pages();
    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
    await page.setUserAgent({ userAgent });
    await uploadAlbumWithPage(page, album, creds);
  } finally {
    await browser?.close();
  }
}
