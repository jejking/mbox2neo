const Mbox = require('node-mbox');
const fs   = require('fs');
const simpleParser = require('mailparser').simpleParser;
const Rx = require('rxjs/Rx');
const SimpleMail = require('./model/simple-mail');
const SimpleEmailAddress = require('./model/simple-email-address');

function toSimpleEmailAddresses(address) {
    if (address) {
        return address.value.map((a) => new SimpleEmailAddress(a.address, a.name))
    } else {
        return undefined;
    }
}

function toSimpleMail(mail) {
    return new SimpleMail(mail.messageId, 
                        mail.subject,
                        mail.date, 
                        toSimpleEmailAddresses(mail.from),
                        toSimpleEmailAddresses(mail.to),
                        mail.text,
                        mail.inReplyTo,
                        mail.references);
}

function toMbox(filename) {
    
    return new Mbox(fs.createReadStream(filename));
}

function toParsedMailObservable(rawMessage) {
    return Rx.Observable.from(simpleParser(rawMessage));
}

function toObservable(mbox) {
    return Rx.Observable.create(observer => {
        mbox.on('message', msg => observer.next(msg));
        mbox.on('error', theError => observer.error(theError));
        mbox.on('end', () => observer.complete());
    });
}

function fileNameToSimpleMailObservable(filename) {
    return toObservable(toMbox(filename))
            .flatMap(msg => toParsedMailObservable(msg))
            .map(parsedMail => toSimpleMail(parsedMail));
}

module.exports = { fileNameToSimpleMailObservable };