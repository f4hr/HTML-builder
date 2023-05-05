const path = require('node:path');
const { createReadStream, createWriteStream } = require('node:fs');
const { readdir, rm } = require('node:fs/promises');

const SOURCE_DIR = 'styles';
const BUNDLE_FILE_NAME = 'bundle';
const OUTPUT_DIR = 'project-dist';

function mergeStyles() {
  const sourceDir = path.join(__dirname, SOURCE_DIR);
  const outputFile = path.join(__dirname, OUTPUT_DIR, `${BUNDLE_FILE_NAME}.css`);

  resetDist(outputFile).then(() => writeCss(sourceDir, outputFile));
}
mergeStyles();

function writeCss(sourceDir, outputFile) {
  const writer = createWriteStream(outputFile, {
    flags: 'a',
    encoding: 'utf-8'
  }).on('error', handleError);

  readdir(sourceDir)
    .then((files) => {
      const cssFiles = files.filter(isCssFile);
      cssFiles.forEach((fileName) => writeFile(fileName, writer));
    })
    .catch(handleError);
}

function writeFile(fileName, writer) {
  const sourceFile = path.join(__dirname, SOURCE_DIR, fileName);

  createReadStream(sourceFile, { encoding: 'utf-8' })
    .on('error', handleError)
    .pipe(writer);
}

function resetDist(outputFile) {
  return rm(outputFile, { force: true });
}

function isCssFile(file) {
  const { ext } = path.parse(path.join(__dirname, SOURCE_DIR, file));
  return ext === '.css';
}

function handleError(err) {
  console.log(err.message);
}
