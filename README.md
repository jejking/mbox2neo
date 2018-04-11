# mbox2neo
Utility to build a simple neo4j graph database from mbox files.

## Setting up neo4j

The current approach is a locally running Neo4j community server. To make a handling dates easier, we rely on a couple of plugins:

* (APOC procedures)[https://neo4j-contrib.github.io/neo4j-apoc-procedures/#_installation]
* Graphaware's Neo4j (Time Tree)[https://github.com/graphaware/neo4j-timetree] (and the attendant Framework)



