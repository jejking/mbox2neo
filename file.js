const fs = require('fs');
const path = require('path');
const Rx = require('rxjs/Rx');

class DirectoryDetails {
    constructor (directoryName) {
      this.directoryName = directoryName;
      this.exists = fs.existsSync(directoryName);
      this.isDirectory = this.exists ? fs.statSync(directoryName).isDirectory() : false;
    }
}

// returns observable of filenames in directory
function toFilenamesObservable(directoryDetails) {
    if (!directoryDetails) {
        return Rx.Observable.throw(new Error('No directory specified'));
    }
    if (!directoryDetails.exists) {
        return Rx.Observable.throw(new Error(`${directoryDetails.directoryName} does not exist`));
    }
    if (!directoryDetails.isDirectory) {
        return Rx.Observable.throw(new Error(`${directoryDetails.directoryName} is not a directory`));
    }
    const readDirAsObservable = Rx.Observable.bindNodeCallback(fs.readdir);
    return readDirAsObservable(directoryDetails.directoryName)
            .flatMap(listing => Rx.Observable.from(listing))
            .map(listing => path.join(directoryDetails.directoryName, listing))
            .filter(listing => fs.statSync(listing).isFile()); // need to make async
}

module.exports = { DirectoryDetails, toFilenamesObservable };