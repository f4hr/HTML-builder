const path = require('node:path');
const { createWriteStream, createReadStream } = require('node:fs');
const { readdir } = require('node:fs/promises');

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
  buildHtml,
};
