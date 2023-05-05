const path = require('node:path');
const { readdir, stat } = require('node:fs/promises');

const FOLDER_NAME = 'secret-folder';

function init() {
  readdir(path.join(__dirname, `./${FOLDER_NAME}`), { withFileTypes: true })
    .then(printFiles)
    .catch((err) => console.log(err.message));
}
init();

function getFileStat(file) {
  return new Promise((resolve, reject) => {
    stat(file)
      .then((fileStat) => {
        const { name, ext } = path.parse(file);
        return resolve({ name, ext, size: fileStat.size });
      })
      .catch(reject);
  });
}

function printFiles(folderContent) {
  const filePaths = folderContent
    .filter((file) => file.isFile())
    .map((file) => path.join(__dirname, FOLDER_NAME, file.name));

  Promise.all(filePaths.map(getFileStat)).then((stats) => {
    stats.forEach((fileStat) => console.log(formatStat(fileStat)));
  });
}

function formatStat({ name, ext, size }) {
  return `${name} - ${ext.substring(1)} - ${formatBytes(size)}`;
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
