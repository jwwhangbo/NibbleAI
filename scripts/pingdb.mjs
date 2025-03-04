import { Client } from '@neondatabase/serverless'

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    console.log(client.connectionParameters);
    const start = Date.now();
    console.log(
      "\x1b[1m%s \x1b[36m%s \x1b[34m%s \x1b[0m%s",
      "pingdb",
      "notice",
      "PING",
      `${client.connectionParameters["host"]}:${client.connectionParameters["port"]}`
    );
    await client.connect().catch((err) => {
        console.log("connection failed", err.stack);
    });
    console.log(
      "\x1b[1m%s \x1b[36m%s \x1b[34m%s \x1b[0m%s",
      "pingdb",
      "notice",
      "PONG",
      `${Date.now() - start}ms`
    );
    client.on('error', (err) => {
        console.log('something went wrong :(', err.stack);
    })
    client.on("end", () => {
      console.log(
        "\x1b[1m\x1b[36m%s \x1b[0m%s",
        "notice",
        "Client disconnected"
      );
    });

    await client.end();
}

main();