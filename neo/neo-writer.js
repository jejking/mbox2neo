const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

function writeMailToNeo(driver, simpleMail) {
    const session = driver.session();
    return session.writeTransaction((tx) => {
        var promise = tx.run(`merge (m:Mail { 
                        messageId: {messageId},
                        subject: {subject},
                        timestamp: {timestamp},
                        date: {date},
                        text: {text}
                        })`, {
                        messageId: simpleMail.messageId,
                        subject: simpleMail.subjectOrEmptyString,
                        timestamp: simpleMail.date.valueOf(),
                        date: simpleMail.date.toISOString(),
                        text: simpleMail.textOrEmptyString,
                        });
        return promise;
    }).then((records, summary) => {
        return {
            status: 'success',
            messageId: simpleMail.messageId
        }
    }, (err) => {
        return {
            status: 'error',
            mail: simpleMail,
            errror: err
        }
    }).finally(() => session.close());
}


module.exports = { driver, writeMailToNeo };