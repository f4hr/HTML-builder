const path = require('node:path');
const { createWriteStream } = require('node:fs');
const { stdin, stdout } = require('node:process');
const readline = require('node:readline');

const FILE_NAME = 'output.txt';
const PROMPT_MESSAGE = '(to exit program type \'exit\' or press \'ctrl + c\')\nPlease enter some text: ';

function writeFile(fileName = FILE_NAME) {
  const filePath = path.join(__dirname, fileName);
  const greetingMessage = `Hello! This program writes everything you type into '${fileName}' file.`;

  const reader = readline.createInterface({
    input: stdin,
    output: stdout
  });
  const writer = createWriteStream(filePath, {
    flags: 'a',
    encoding: 'utf-8'
  }).on('error', handleError);

  reader.on('SIGINT', () => exitHandler(reader, writer));

  console.log(greetingMessage);
  reader.question(PROMPT_MESSAGE, (input) => writeHandler(reader, writer, input));
}
writeFile();

function exitHandler(reader, writer) {
  console.log('\nGoodbye!');
  reader.close();
  writer.close();
}

function writeHandler(reader, writer, input) {
  if (input === 'exit') {
    exitHandler(reader, writer);
    return;
  }

  writer.write(input);
  writer.write('\n');
  console.log(`\nInput '${input}' was successfuly added to file.`);

  reader.question(PROMPT_MESSAGE, (input) => writeHandler(reader, writer, input));
}

function handleError(err) {
  console.error(err.message);
}

module.exports = {
  writeFile,
};
