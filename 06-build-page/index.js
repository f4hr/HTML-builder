const path = require('node:path');
const { createWriteStream, createReadStream } = require('node:fs');
const { readdir, mkdir, rm } = require('node:fs/promises');

const { copyDir } = require('../04-copy-directory');
const { mergeStyles } = require('../05-merge-styles');

const SRC_DIR = path.join(__dirname);
const DIST_DIR = path.join(__dirname, 'project-dist');

const ASSETS_DIR = 'assets';
const HTML_TEMPLATE_FILE = 'template';
const HTML_TEMPLATES_DIR = 'components';
const HTML_DIST_FILE = 'index';
const CSS_SRC_DIR = 'styles';
const CSS_DIST_FILE = 'style';

function buildPage(srcDir = SRC_DIR, distDir = DIST_DIR) {
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
buildPage();

function buildHtml(templateFile, templatesDir, distFile) {
  const readStreams = [];

  readStreams.push(readFile(templateFile));

  readdir(templatesDir, { withFileTypes: true })
    .then((files) => files.filter(isHtmlTemplate))
    .then((files) => {
      files.forEach((file) => {
        readStreams.push(readFile(path.join(templatesDir, file.name)));
      });

      Promise.all(readStreams)
        .then(([template, ...components]) => transformTemplate(template, components))
        .then((template) => saveTemplate(distFile, template))
        .catch(handleError);
    });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    createReadStream(file)
      .on('error', reject)
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve({ name: file, content: Buffer.concat(chunks).toString() }));
  });
}

function saveTemplate(distFile, template) {
  const writer = createWriteStream(distFile, { encoding: 'utf-8' })
    .on('error', handleError);

  writer.write(template);
  writer.close();
}

function transformTemplate(template, components) {
  let { content: templateContent } = template;

  components.forEach(({ name, content }) => {
    const componentName = path.parse(name).name;
    templateContent = templateContent.replaceAll(`{{${componentName}}}`, content);
  });

  return templateContent;
}

function isHtmlTemplate(file) {
  if (file.isDirectory()) {
    return false;
  }

  const { ext } = path.parse(file.name);

  return ext === '.html';
}

function handleError(err) {
  console.log(err.message);
}

module.exports = {
  buildPage,
};
