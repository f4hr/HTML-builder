const path = require('node:path');
const {
  readdir, mkdir, copyFile, stat,
} = require('node:fs/promises');

function copyDir(srcDir, distDir) {
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
