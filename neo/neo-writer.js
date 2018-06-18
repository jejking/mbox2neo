const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

async function writeMailBody(tx, simpleMail) {
    return tx.run(`MERGE (m:Mail { 
        messageId: {messageId}})
        with m
        set m.subject = {subject}
        set m.timestamp = {timestamp}
        set m.date = {date}
        set m.text = {text}`, {
        messageId: simpleMail.messageId,
        subject: simpleMail.subjectOrEmptyString,
        timestamp: neo4j.int(simpleMail.date.valueOf()),
        date: simpleMail.date.toISOString(),
        text: simpleMail.textOrEmptyString,
        });
}

async function writeMailAddress(tx, simpleEmailAddress) {
    return tx.run(`MERGE (a:Address {
        address: {address}
    })`, {
        address: simpleEmailAddress.address
    });
}

async function writeMailName(tx, simpleEmailAddress) {
    if (!simpleEmailAddress.name) {
        return Promise.resolve('no name');
    } else {
        return tx.run(`MERGE (n:Name {name: {name}})`, {
            name: simpleEmailAddress.name
        });
    }
}

async function linkNameAndAddress(tx, simpleEmailAddress) {
    if (!simpleEmailAddress.name) {
        return Promise.resolve('no name to link');
    } else {
        return tx.run(`MERGE (a:Address {address: {address}})
                   MERGE (n:Name {name: {name}})
                   MERGE (a)-[:HAS_NAME]->(n)`, {
                       address: simpleEmailAddress.address,
                       name: simpleEmailAddress.name
                   });
    }
}

async function writeSimpleEmailAddress(tx, simpleEmailAddress) {
    const addressRes = await writeMailAddress(tx, simpleEmailAddress);
    const nameRes = await writeMailName(tx, simpleEmailAddress);
    return linkNameAndAddress(tx, simpleEmailAddress);
}

async function linkAddressToMail(tx, simpleMail, simpleEmailAddress, relationship) {
    const mergeString = `MERGE (m)-[:${relationship}]->(a)`;
    return tx.run(
        `MERGE (m:Mail {messageId: {messageId} })
        MERGE (a:Address {address: {address}})
        ${mergeString}`, {
            messageId: simpleMail.messageId,
            address: simpleEmailAddress.address,
            relationship: relationship
        });
}

async function linkInReplyTo(tx, simpleMail) {
    if (!simpleMail.inReplyTo) {
        return Promise.resolve('no in reply to relationship to link');
    } else {
        return tx.run(
            `MERGE(from:Mail {messageId: {fromMessageId}})
             MERGE(to:Mail {messageId: {toMessageId}})
             MERGE (from)-[:IN_REPLY_TO]->(to);`, {
                fromMessageId: simpleMail.messageId,
                toMessageId: simpleMail.inReplyTo
            }
        );
    }
}

async function linkReferences(tx, simpleMail) {
    if (!simpleMail.references) {
        return Promise.resolve('no in references relationship to link');
    } else {
        return tx.run(
            `MERGE(from:Mail {messageId: {fromMessageId}})
             MERGE(to:Mail {messageId: {toMessageId}})
             MERGE (from)-[:REFERENCES]->(to);`, {
                fromMessageId: simpleMail.messageId,
                toMessageId: simpleMail.references
            }
        );
    }
}

async function writeMailTransaction(tx, simpleMail) {
    const bodyRes = await writeMailBody(tx, simpleMail);
    for (const fromAddress of simpleMail.from) {
        const res = await writeSimpleEmailAddress(tx, fromAddress);
        const res2 = await linkAddressToMail(tx, simpleMail, fromAddress, 'FROM');
    }
    for (const toAddress of simpleMail.to) {
        const res = await writeSimpleEmailAddress(tx, toAddress);
        const res2 = await linkAddressToMail(tx, simpleMail, toAddress, 'TO');
    }
    const inReplyToRes = await linkInReplyTo(tx, simpleMail);
    const referecesRes = await linkReferences(tx, simpleMail);
}

function writeMailToNeo(driver, simpleMail) {
    const session = driver.session();
    return session.writeTransaction((tx) => {
        return writeMailTransaction(tx, simpleMail);
    }).then((records, summary) => {
        return {
            status: 'success',
            messageId: simpleMail.messageId
        }
    }, (err) => {
        return {
            status: 'error',
            mail: simpleMail,
            error: err
        }
    }).finally(() => session.close());
}


module.exports = { driver, writeMailToNeo };