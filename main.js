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
    console.error('Please specify option "in" -  an input directory from which to load and process mbox files');
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


// file.toFilenamesObservable(options.in)
//     .flatMap(mbox.fileNameToSimpleMailObservable)
//     .filter((sm) => typeof sm.messageId !== 'undefined')
//     .filter((sm) => sm.messageId === '<199912032054.VAA08364@maria.ctv.es>')
//     .subscribe(f => console.log(f.withoutText()), err => console.error(err.message), () => {
//         //neowriter.driver.close();
//         console.log('done');
//     });