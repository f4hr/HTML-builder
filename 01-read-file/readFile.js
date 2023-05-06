const path = require('node:path');
const { createReadStream } = require('node:fs');
const { stdout } = require('node:process');

function readFile(fileName) {
  const filePath = path.join(__dirname, fileName);

  createReadStream(filePath, { encoding: 'utf-8' })
    .on('error', handleError)
    .pipe(stdout)
    .on('error', handleError);
}

function handleError(err) {
  console.error(err.message);
}

module.exports = {
  readFile,
};
