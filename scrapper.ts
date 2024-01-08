import { Browser } from "puppeteer";

// Scrapper data from a number of pages from an easy bookstore
const puppeteer = require("puppeteer");
const fs = require("fs");

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function run() {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Number of pages you want to scrape (adjust as needed)
  const totalPages = 6;
  const baseUrl = "https://books.toscrape.com/catalogue/page-";
  const timer = 2000;

  const allData = [];

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const url = `${baseUrl}${currentPage}.html`;

    await sleep(timer);

    await page.goto(url);

    const jsonData = await page.evaluate(() => {
      function convertRating(rating: string) {
        switch (rating) {
          case "One":
            return 1;
          case "Two":
            return 2;
          case "Three":
            return 3;
          case "Four":
            return 4;
          case "Five":
            return 5;
          default:
            return 0;
        }
      }

      const dataPods = Array.from(document.querySelectorAll(".product_pod"));
      const data = dataPods.map((pod) => ({
        title: pod.querySelector("h3 a")?.getAttribute("title"),
        price: Number(pod.querySelector(".price_color")?.innerHTML?.slice(1)),
        img: `${window.location.origin}${pod
          .querySelector("img")
          ?.getAttribute("src")}`,
        rating: convertRating(pod.querySelector(".star-rating")?.classList[1] || ""),
      }));

      return data;
    });

    allData.push(...jsonData);
  }

  await browser.close();

  fs.writeFile("data.json", JSON.stringify(allData), (err: string) => {
    if (err) throw new Error(`An error occurred saving data: ${err}`);
    console.log("Successfully saved data");
  });
}

run();
