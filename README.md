# mbox2neo
Utility to build a simple neo4j graph database from mbox files.

## Setting up neo4j

The current approach is a locally running Neo4j community server. To make a handling dates easier, we rely on a couple of plugins:

* [APOC procedures](https://neo4j-contrib.github.io/neo4j-apoc-procedures/#_installation)
* [Graphaware's Neo4j Time Tree](https://github.com/graphaware/neo4j-timetree) (and the attendant Framework)

Follow the instructions to set up the plugins in your local Neo4j installation.

To use the Time Tree optimally, the code also relies on automatic event attachment to the time tree. Edit the `neo4j.conf` file to include the following lines:

```
dbms.security.procedures.unrestricted=ga.timetree.*

com.graphaware.runtime.enabled=true

# A Runtime module that takes care of attaching the events like this (TT is the ID of the module)
com.graphaware.module.TT.1=com.graphaware.module.timetree.module.TimeTreeModuleBootstrapper

# autoAttach must be set to true
com.graphaware.module.TT.autoAttach=true

# Optionally, nodes which represent events and should be attached automatically have to be defined (defaults to nodes with labe$
com.graphaware.module.TT.event=hasLabel('Mail')

com.graphaware.module.TT.relationship=SENT_ON
```

The code currently assumes (lazily) that the Neo4j database can be connected to by a user `neo4j` with the password `neo4j`.

## Running

A couple of scripts are included in the npm `package.json`:

* `npm run load -i PATH_TO_DIRECTORY_WITH_MBOX_FILES`. Expects input in the form of directory with syntactically valid mbox files and nothing else. These are streamed via RxJS and each mail is added to the Neo4j database in per-mail transactions.
* `npm run clear` - deletes all nodes and relationships in the database.




