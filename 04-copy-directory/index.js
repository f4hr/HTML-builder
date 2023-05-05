const path = require('node:path');
const { readdir, mkdir, rm, copyFile } = require('node:fs/promises');

const SOURCE_FOLDER_NAME = 'files';
const TARGET_FOLDER_NAME = 'files-copy';

function copyDir() {
  const sourceDir = path.join(__dirname, `./${SOURCE_FOLDER_NAME}`);
  const targetDir = path.join(__dirname, `./${TARGET_FOLDER_NAME}`);

  rm(targetDir, { recursive: true, force: true })
    .then(() => mkdir(targetDir, { recursive: true }))
    .then(() => readdir(sourceDir))
    .then((files) => copyFiles(files, sourceDir, targetDir))
    .catch((err) => console.log(err.message));
}
copyDir();

function copyFiles(files, sourceDir, targetDir) {
  return Promise.all(files.map((name) => {
    const sourceFileName = path.join(sourceDir, name);
    const targetFileName = path.join(targetDir, name);

    return copyFile(sourceFileName, targetFileName);
  }));
}
