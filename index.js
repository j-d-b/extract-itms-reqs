const fs = require('fs');
const findDuplicates = require('array-find-duplicates');
const chalk = require('chalk');
const textract = require('textract');
const makeDir = require('make-dir');

makeDir.sync('output');

const extractText = path => (
  new Promise((resolve, reject) => {
    textract.fromFileWithPath(path, (error, text) => {
      if (error) reject(error);
      resolve(text);
    });
  })
);

const getReqsByFile = async () => {
  const reqsByFile = {};
  for (const filename of fs.readdirSync('./data')) {
    console.log(chalk.yellow('Searching ' + filename + '...'));
    try {
      const text = await extractText(`./data/${filename}`);
      reqsByFile[filename] = text.match(/ITMSREQ-\d+/g);
    } catch (error) {
      console.log(error);
    }
  }
  return reqsByFile;
};

const getDupesWithFile = (reqsByFile, allReqs) => {
  let last = '';
  const dupeReqs = findDuplicates(allReqs);
  return dupeReqs.reduce((dupesWithFile, dupe) => {
    dupesWithFile[dupe] = Object.entries(reqsByFile).filter(([file, reqs]) => reqs.includes(dupe)).map(([file, reqs]) => file);
    return dupesWithFile;
  }, {});
};

getReqsByFile().then(reqsByFile => {
  const allReqs = Object.values(reqsByFile).flat();
  const dupesWithFile = getDupesWithFile(reqsByFile, allReqs);
  const uniqueReqs = [...(new Set(allReqs))];
  console.log(chalk.green((String(uniqueReqs.length))) + ' unique requirements found');
  console.log(chalk.red(String(Object.keys(dupesWithFile).length)) + ' duplicate requirements found');
  fs.writeFileSync('output/duplicates.txt', Object.entries(dupesWithFile).reduce((str, [req, files]) => {
    return str + req + ' occurs in: ' + files.reduce((s, f) => s + f + ', ', '') + '\n';
  }, ''));
  console.log(chalk.green('✨  Duplicates by file output to `output/duplicates.txt`'));
  fs.writeFileSync('output/requirements.txt', uniqueReqs.reduce((str, req) => str + '\n' + req));
  console.log(chalk.green('✨  Requirements list output to `output/requirements.txt`'));
});
