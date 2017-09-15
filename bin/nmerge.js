#!/usr/bin/env node
var split = require('split');
var Transform = require('stream').Transform;
var program = require('commander');
var path = require('path');
var os = require('os');

program
  .version(require('../package.json').version)
  .option('--mf [name]', 'Merge file')
  .option('--mk [name]', 'Merge key')
  .option('--mvk [name]', 'Merge Value key')
  .option('-k --key [name]', 'Key')
  .option('--vk [name]', 'Value key')
  .parse(process.argv);

if (!program.mf) exit('No merge file specified');
var mergeFile = require(path.join(process.cwd(), program.mf));
if (!mergeFile) exit('No merge file found');
var mergeKey = program.mk;
if (!mergeKey) exit('No merge key');
var mergeValueKey = program.mvk;
if (!mergeValueKey) exit('No value key');
var valueKey = program.vk;
if (!valueKey) valueKey = mergeValueKey;
var key = program.key;
if (!key) exit('No key');

var h = {};
for (var i = 0; i < mergeFile.length; i += 1) {
  var row = mergeFile[i];
  h[row[mergeKey]] = row[mergeValueKey];
}

var t = new Transform({
  writableObjectMode: true,
  transform: function (chunk, enc, next) {
    chunk[valueKey] = h[chunk[key]];
    this.push(JSON.stringify(chunk) + os.EOL);
    next();
  },
});

process.stdin
  .pipe(split(JSON.parse, null, { trailing: false }))
  .on('error', exit)
  .pipe(t)
  .on('error', exit)
  .pipe(process.stdout)
  .on('error', exit);

function exit(msg) {
  console.error(msg);
  process.exit(msg ? 1 : 0);
}
