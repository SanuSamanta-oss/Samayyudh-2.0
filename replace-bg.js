/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let changed = 0;
files.forEach(file => {
  // don't change report/page.tsx as print needs white
  if (file.includes('report')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('bg-white')) {
    // replace bg-white with bg-card
    // replace bg-white/x with bg-card/x
    let newContent = content.replace(/\bbg-white\b/g, 'bg-card');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      changed++;
      console.log('Updated: ' + file);
    }
  }
});
console.log('Changed ' + changed + ' files.');
