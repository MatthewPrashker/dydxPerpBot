import { makeClient } from './utils/client.js';
import { Market } from '@dydxprotocol/v3-client';

async function main() {
    console.log("Creating client...");
    const cli = await makeClient();
    console.log("DYDX Client Credentials:")
    console.log(await cli.ethPrivate.recovery(
        process.env.PUB_KEY
    ));
    const accounts = await cli.private.getAccounts();
    console.log(accounts);
}

main();