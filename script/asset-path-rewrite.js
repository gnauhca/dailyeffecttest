/**
 * 构建产物相对路径处理
 * dist 内文件最终部署环境不确定，所以需要支持相对路径引用资源
 */
const path = require('path');
const fs = require('fs');
const glob = require('fast-glob');

const assetPath = 'dist/assets';

const files = glob.sync('dist/**/*.{html,css,js}');
files.forEach((filePath) => {
  const dirname = path.dirname(filePath);
  const relativePath = path.relative(dirname, assetPath);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/\/assets\//g, `${relativePath}/`);
  fs.writeFileSync(filePath, content, 'utf-8');
});
