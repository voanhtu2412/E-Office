const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.vue') || file.endsWith('.scss')) {
        results.push(file);
      }
    }
  });
  return results;
}
const files = walk('c:/eOffice/E-Office/src');
let changedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/font-size:\s*(\d+(?:\.\d+)?)(px|rem)/g, (match, p1, p2) => {
    let val = parseFloat(p1);
    // Increase by 15% and round to 1 decimal place
    val = Math.round((val * 1.15) * 10) / 10;
    return `font-size: ${val}${p2}`;
  });
  
  // also bump up SVG widths/heights that are strictly numbers inside tags
  newContent = newContent.replace(/(<svg[^>]*>)/g, (match) => {
     return match.replace(/(width|height)=["'](\d+)["']/g, (m, attr, val) => {
         let newVal = Math.round(parseInt(val) * 1.15);
         return `${attr}="${newVal}"`;
     });
  });

  // also bump up SCSS typography variables in abstracts/_variables.scss
  if (file.endsWith('_variables.scss')) {
    newContent = newContent.replace(/\$font-size-\w+:\s*(\d+(?:\.\d+)?)(rem|px)/g, (match, p1, p2) => {
      let val = parseFloat(p1);
      val = Math.round((val * 1.15) * 1000) / 1000;
      // Reconstruct the match
      return match.replace(p1, val);
    });
  }

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
  }
});
console.log('Updated font sizes and icons in ' + changedFiles + ' files.');
