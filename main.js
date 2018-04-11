const commandLineArgs = require('command-line-args');
const file = require('./file');
const mbox = require('./mbox');
const neowriter = require('./neo/neo-writer')
const Rx = require('rxjs/Rx');

const optionDefinitions = [
    { name: 'in', alias: 'i', type: directoryName => new file.DirectoryDetails(directoryName), defaultOption: true }
];

const options = commandLineArgs(optionDefinitions);

if (!options.in) {
    console.error('Please specify in an input directory');
    process.exit(1);
} else {
    console.log(options.in);
}

file.toFilenamesObservable(options.in)
    .flatMap(mbox.fileNameToSimpleMailObservable)
    .filter((sm) => typeof sm.messageId !== 'undefined')
    .flatMap((sm) => Rx.Observable.from(neowriter.writeMailToNeo(neowriter.driver, sm)))
    .subscribe(f => console.log(f), err => console.error(err.message), () => {
        neowriter.driver.close();
        console.log('done')
    });