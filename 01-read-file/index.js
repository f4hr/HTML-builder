const path = require('node:path');
const { createReadStream } = require('node:fs');
const { stdout } = require('node:process');

const FILE_NAME = 'text.txt';

function readFile(fileName = FILE_NAME) {
  const filePath = path.join(__dirname, fileName);

  createReadStream(filePath)
    .on('error', handleError)
    .pipe(stdout)
    .on('error', handleError);
}
readFile();

function handleError(err) {
  console.error(err.message);
}

module.exports = {
  readFile,
};
