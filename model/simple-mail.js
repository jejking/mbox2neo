class SimpleMail {
    constructor(messageId, subject, date, from, to, text, inReplyTo, references) {
        this.messageId = messageId;
        this.subject = subject;
        this.date = date;
        this.from = from;
        this.to = to;
        this.text = text;
        this.inReplyTo = inReplyTo;
        this.references = references;
    }

}

module.exports = SimpleMail;