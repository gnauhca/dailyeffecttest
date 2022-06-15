import path, { dirname } from 'path';
import fs from 'fs';
import glob from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmls = glob.sync('{src/*/*.html,src/*/*/*.html}')
  .map((item) => {
    const content = fs.readFileSync(item, 'utf-8');
    const matched = content.match(/<title>(.+)<\/title>/);
    return { path: item.replace('src', '.'), title: matched ? matched[1] : '' };
  })
  .filter((item) => item.title.indexOf('temp') === -1);
console.log(htmls);

(async () => {
  const indexHTMLPath = path.join(__dirname, '../src/index.html');
  const indexHTMLContent = fs.readFileSync(indexHTMLPath, 'utf-8');
  const replacedContent = indexHTMLContent.replace(/<nav>[\s\S]*<\/nav>/gm, () => {
    const aTagsStr = htmls
      .map((item) => `           <a href="${item.path}" title="${item.title}">${item.title}</a>`)
      .join('\n');
    return `<nav>\n${aTagsStr}\n        </nav>`;
  });
  fs.writeFileSync(indexHTMLPath, replacedContent, 'utf-8');
})();

// const screenshotDir = path.join(__dirname, '../src/screenshots');

// (async () => {
//   for (let i = 0; i < htmls.length; i++) {
//     const htmlPath = htmls[i];
//     const url = `https://sinxcosy.com/daily-effect-test/${htmlPath.replace('src/', '')}`;
//     const fileName = `${htmlPath.replace('src/', '').replace(/\//g, '-').replace('.html', '')}.png`;
//     const filePath = path.join(screenshotDir, fileName);
//     console.log('catching', url);
//     try {
//       await captureWebsite.file(url, filePath, { type: 'jpeg', delay: 2, timeout: 10 });
//       console.log('catched');
//     } catch (e) {
//       console.error(e);
//       console.log('catch failed');
//     }
//   }
// })();
