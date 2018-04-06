const commandLineArgs = require('command-line-args');
const file = require('./file');
const mbox = require('./mbox');

const optionDefinitions = [
    { name: 'in', alias: 'i', type: directoryName => new file.DirectoryDetails(directoryName), defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

const filenamesObservable = file.toFilenamesObservable(options.in);

const simpleMailObservable = filenamesObservable.flatMap(mbox.fileNameToSimpleMailObservable);

simpleMailObservable.subscribe(f => console.log(f), err => console.error(err.message), () => console.log('done'));