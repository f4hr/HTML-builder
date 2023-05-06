const path = require('node:path');
const {
  rm, readdir, mkdir, copyFile, stat,
} = require('node:fs/promises');

const SRC_DIR = path.join(__dirname, 'files');
const DIST_DIR = path.join(__dirname, 'files-copy');

function copyDir(srcDir = SRC_DIR, distDir = DIST_DIR) {
  function copyDirContent(dirContent) {
    dirContent.forEach((file) => {
      const sourcePath = path.join(srcDir, file);
      const distPath = path.join(distDir, file);
      copyRecursive(sourcePath, distPath);
    });
  }

  return mkdir(distDir)
    .then(() => {
      readdir(srcDir)
        .then(copyDirContent)
        .catch(handleError);
    })
    .catch(handleError);
}
rm(DIST_DIR, { recursive: true, force: true }).then(() => copyDir());

function copyRecursive(srcPath, distPath) {
  stat(srcPath)
    .then((fileStat) => {
      if (fileStat.isDirectory()) {
        return copyDir(srcPath, distPath);
      } else {
        return copyFile(srcPath, distPath);
      }
    })
    .catch(handleError);
}


function handleError(err) {
  console.log(err.message);
}

module.exports = {
  copyDir,
};
