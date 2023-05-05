const path = require('node:path');
const { mkdir, rm } = require('node:fs/promises');

const { buildHtml } = require('./buildHtml');
const { mergeStyles } = require('../05-merge-styles/mergeStyles');
const { copyDir } = require('../04-copy-directory/copyDir');

const ASSETS_DIR = 'assets';
const HTML_TEMPLATE_FILE = 'template';
const HTML_TEMPLATES_DIR = 'components';
const HTML_DIST_FILE = 'index';
const CSS_SRC_DIR = 'styles';
const CSS_DIST_FILE = 'style';

function build(srcDir, distDir) {
  // HTML
  const htmlTemplateFile = path.join(srcDir, `${HTML_TEMPLATE_FILE}.html`);
  const htmlTemplatesDir = path.join(srcDir, HTML_TEMPLATES_DIR);
  const htmlDistFile = path.join(distDir, `${HTML_DIST_FILE}.html`);
  // Styles
  const stylesSourceDir = path.join(srcDir, CSS_SRC_DIR);
  const styleDistFile = path.join(distDir, `${CSS_DIST_FILE}.css`);
  // Assets
  const assetsSrcDir = path.join(srcDir, ASSETS_DIR);
  const assetsDistDir = path.join(distDir, ASSETS_DIR);

  rm(distDir, { recursive: true, force: true })
    .then(() => mkdir(distDir))
    .then(() => buildHtml(htmlTemplateFile, htmlTemplatesDir, htmlDistFile))
    .then(() => mergeStyles(stylesSourceDir, styleDistFile))
    .then(() => copyDir(assetsSrcDir, assetsDistDir))
    .catch(handleError);
}

function handleError(err) {
  console.log(err.message);
}

module.exports = {
  build,
};
