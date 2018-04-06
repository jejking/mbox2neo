# The Plan

## Neo4j DDL

Run `ddl.cypher` to set up the unique indexes on the key labels.

## Import Observerable

The goal of the import is to create an observerable which delivers a stream of simple mail objects.

Source of this is:

* a stream of mbox files in a given directory
* from each mbox file, a stream of simple mail objects

## Neo4j Subscriber

Start up a session.

For each object coming in, create a new transaction.

### Create mail transaction

* create|merge the core mail object
    ** messageId (the unique key)
    ** the subject
    ** the date (in printable form)
    ** the corresponding timestamp (in ms)
    ** the actual text
* for all mail addresses in from, to, reply to, cc, bcc, create|merge the email address
    * set up the actual mail address
    * if there is a name
        ** create|merge the name
        ** create|merge the HAS_NAME relationship
    * create|merge the FROM, TO, REPLY_TO, CC, BCC relationship to the mail address
* for inReplyTo present:
    * filter on being a plausible messageId
    * create|merge a node for the target
    * create|merge an IN_REPLY_TO relationship
* if references field present
    * filter on being a plausible messageId
    * create|merge a node for the target
    * create|merge a REFERENCES relationship    

If no problems turn up, commit the transaction.

Else rollback and log an error.
