const path = require('node:path');
const { createReadStream } = require('node:fs');
const { stdout } = require('node:process');

const FILE_PATH = path.join(__dirname, 'text.txt');

createReadStream(FILE_PATH, { encoding: 'utf-8' })
  .on('error', handleError)
  .pipe(stdout)
  .on('error', handleError);

function handleError(err) {
  console.error(err.message);
}
