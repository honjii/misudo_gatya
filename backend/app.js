const format = require("date-fns/format");
const fs = require("fs");
const Koa = require("koa");
const app = new Koa();

// ライブラリの読み込み
const puppeteer = require("puppeteer");

// 期間(月イチ)を決めてキャッシュする
// キャッシュがない場合
// -> スクレイピングをする (できている)
// -> jsonで保存する

// キャッシュがある場合
// -> キャッシュからデータを返す (できていない)

async function getDonutData() {
  // ブラウザの立ち上げ
  const browser = await puppeteer.launch();
  // 新しいタブを開く
  const page = await browser.newPage();

  // 指定のURLに飛ぶ
  await page.goto("https://www.misterdonut.jp/m_menu/donut/");

  const data = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list
      .map((data) => {
        return {
          name: data
            .querySelector(".tx.name")
            .textContent.replaceAll("    ", "")
            .replaceAll("\n", "")
            .replaceAll("\t", "")
            .trim(),
          price: data
            .querySelector(".tx.price")
            .textContent.replaceAll("    ", "")
            .replaceAll("\n", "")
            .replaceAll("\t", "")
            .trim(),
          image: data.querySelector("img").src,
        };
      })
      .filter((data) => data.price)
      .map((data) => {
        const reg = /（税抜）¥(\d+)/gi;
        return {
          name: data.name,
          price: parseInt(reg.exec(data.price)[1]),
          image: data.image,
        };
      });
  }, ".item");

  console.log(data);
  // サイトのスクショ
  await page.screenshot({ path: "topics.png" });
  // ブラウザを閉じる
  await browser.close();

  fs.writeFile(
    `./cache/${format(new Date(), "yyyyMM")}.json`,
    JSON.stringify(data),
    (error) => {
      console.log(error);
    }
  );

  return data;
}

app.use(async (ctx) => {
  const fileName = `./cache/${format(new Date(), "yyyyMM")}.json`;
  if (fs.existsSync(fileName)) {
    ctx.body = JSON.parse(fs.readFileSync(fileName));
  } else {
    ctx.body = await getDonutData();
  }
});

app.listen(3000);
