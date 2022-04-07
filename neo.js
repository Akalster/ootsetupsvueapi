const neo4j = require('neo4j-driver')

function connect(dbName) {
    this.dbName = dbName;
    this.driver = neo4j.driver(
        process.env.NEO4J_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    )
}

function session() {
    return this.driver.session({
        database: this.dbName,
        defaultAccessMode: neo4j.session.WRITE
    })
}

module.exports = {
    connect,
    session,
    dropAll: 'MATCH (n) DETACH DELETE n',
    follow: 'MERGE (user1:User {id:$user1Id}) MERGE (user2:User {id: $user2Id}) MERGE (user1)-[:FOLLOWS]->(user2)',
    follows: 'MATCH (user1:User {id:$userId})-[:FOLLOWS]->(user2:User) RETURN collect(DISTINCT user2.id) as userIds'
}