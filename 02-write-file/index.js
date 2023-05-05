const path = require('node:path');
const { createWriteStream } = require('node:fs');
const { stdin, stdout } = require('node:process');
const readline = require('node:readline');

const FILENAME = 'output.txt';
const filePath = path.join(__dirname, `./${FILENAME}`);
const handleError = (err) => console.error(err.message);

const reader = readline.createInterface({
  input: stdin,
  output: stdout
});
const writer = createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf-8'
}).on('error', handleError);

const greetingText = `Hello! This program writes everything you type into '${FILENAME}' file.`;
const promptText = `(to exit program type 'exit' or press 'ctrl + c')
Please enter some text: `;

function prompt(text) {
  reader.question(text, writeHandler);
}

function exitHandler() {
  console.log('\nGoodbye!');
  reader.close();
  writer.close();
}

function writeHandler(input) {
  if (input === 'exit') {
    exitHandler();
    return;
  }

  writer.write(input);
  writer.write('\n');
  console.log(`\nInput '${input}' was successfuly added to file.`);

  prompt(promptText);
}

reader.on('SIGINT', exitHandler);

function init() {
  console.log(greetingText);
  prompt(promptText);
}
init();
