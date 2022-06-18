import { makeClient } from './utils/client.js';

async function main() {
    console.log("Creating client...");
    const cli = await makeClient();
    console.log("DYDX Client Credentials:")
    console.log(await cli.ethPrivate.recovery(
        process.env.PUB_KEY
    ));
}

main();