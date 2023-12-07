const fs = require('fs');
const path = require('path');
const esprima = require('esprima');

const directoryPath = path.join(__dirname, 'routes'); // replace with your actual path
let totalCommentsCount = 0; // Make sure this is defined in the root scope of the script

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === '.js') {
      const filePath = path.join(directoryPath, file);
      const code = fs.readFileSync(filePath, 'utf8');
      const comments = esprima.parseScript(code, { comment: true }).comments;
      totalCommentsCount += comments.length;
      console.log(`${file} has ${comments.length} comments`);
    }
  });

  // Moved this inside the readdir callback to ensure proper asynchronous execution
  console.log(`Total comments in all files: ${totalCommentsCount}`);
});
