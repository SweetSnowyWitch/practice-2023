const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "wertex12",
    database: "practice"
});

client.connect();

client.query(`Select * from history`, (err, res) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(res.rows);
    }
    
    client.end;
});