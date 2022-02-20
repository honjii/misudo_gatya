// ライブラリの読み込み
const puppeteer = require("puppeteer");

// 同期処理する関数の実行
(async () => {
  // ブラウザの立ち上げ
  const browser = await puppeteer.launch();
  // 新しいタブを開く
  const page = await browser.newPage();

  // 指定のURLに飛ぶ
  await page.goto("https://www.misterdonut.jp/m_menu/donut/");

  var data = await page.evaluate((selector) => {
    const list = Array.from(document.querySelectorAll(selector));
    return list.map((data) => {
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
          .trim()
          .match(/（税抜）¥(\d+)/gi),
      };
    });
  }, ".item");

  console.log(data);

  // サイトのスクショ
  await page.screenshot({ path: "topics.png" });

  // ブラウザを閉じる
  await browser.close();
})();
