const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

const session = driver.session();
session.run(`MATCH (n)
            DETACH DELETE n`)
            .then(
                (res) => console.log("deleted all nodes"),
                (err) => console.error(err.message))
                .finally(() => {
                    session.close();
                    driver.close()}
                );


