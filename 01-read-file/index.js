const path = require('node:path');
const { createReadStream } = require('node:fs');
const { stdout } = require('node:process');

const filePath = path.join(__dirname, './text.txt');
const handleError = (err) => console.error(err.message);

createReadStream(filePath, { encoding: 'utf-8' })
  .on('error', handleError)
  .pipe(stdout)
  .on('error', handleError);
