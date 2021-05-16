const { Client } = require('pg');
const { assoc, curry } = require('ramda');
const { composeP, viewOnPath } = require('ramda-godlike');
const { config } = require('../config');

const credentials = url => assoc("connectionString", url, {ssl: { rejectUnauthorized: false }});

const newClient = (creds) => new Client(creds);

const connectClient = client => client.connect();
const queryClient = (query, values, client) => client.query(query, values);
const endClient = client => client.end();
const accessDb = async (query, values, client) => {
    await connectClient(client);
    let result = await queryClient(query, values, client);
    await endClient(client);

    return result;
}

// getData:: a -> [a] -> [{k: v}]
const db = (query, values) => composeP(
    viewOnPath(["rows"]),
    curry(accessDb)(query, values),
    newClient,
    credentials,
    config
)("db");

module.exports = { db };

