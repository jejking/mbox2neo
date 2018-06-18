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

    withoutText() {
        return {messageId: this.messageId, 
               subject: this.subject,
               date: this.date,
               from: this.from,
               to: this.to,
               inReplyTo: this.inReplyTo, 
               references: this.references};    
    }

    get textOrEmptyString() {
        if (typeof this.text === 'undefined') {
            return '';
        } else {
            return this.text;
        }
    }

    get subjectOrEmptyString() {
        if (typeof this.subject === 'undefined') {
            return '';
        } else {
            return this.subject;
        }
    }

}

module.exports = SimpleMail;