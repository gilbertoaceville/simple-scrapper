require("dotenv").config();

import { Browser } from "puppeteer";

// Inputing details into an authentication without being seen like a bot
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const { executablePath } = require("puppeteer");

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const url = "https://www.praxis-bulkamp.com/myaccount/login";

async function run() {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.goto(url);

  await page.type("#email-address", process.env.ADMIN_EMAIL || "");
  await page.type("#password", process.env.ADMIN_PASSWORD || "");
  await page.click("[type=submit]");

  await page.waitForTimeout(20000);

  await browser.close();
}

run();
