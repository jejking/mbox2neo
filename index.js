const Mbox = require('node-mbox');
const fs   = require('fs');
const simpleParser = require('mailparser').simpleParser;
const crypto = require('crypto');
const SimpleMail = require('./simple-mail');
const SimpleEmailAddress = require('./simple-email-address');

const mailbox = fs.createReadStream('ej0001mbox');
const mbox    = new Mbox(mailbox);

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

function writeSimpleMail(outputDirectory, simpleMail) {
    const hash = crypto.createHash('sha256');
    hash.update(simpleMail.messageId);
    const fileName = hash.digest('hex') + '.json';
    fs.writeFile(outputDirectory + '/' + fileName, JSON.stringify(simpleMail), (err) => {
        if (err) throw err;
    });
}

// Next, catch events generated:
mbox.on('message', (msg) => {
    simpleParser(msg)
        .then(mail => toSimpleMail(mail))
        .then(simpleMail => writeSimpleMail('mail-json', simpleMail));
  });