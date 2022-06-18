import { DydxClient } from '@dydxprotocol/v3-client';
import Web3 from 'web3';
import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

export async function makeClient() {
  
  //web3 connection
  let web3 = new Web3()
  web3.eth.accounts.wallet.add(process.env.PRIV_KEY);

  //dydx client
  let client = new DydxClient(process.env.DYDX_HTTP_HOST, { web3 });
  const apiCreds = await client.onboarding.recoverDefaultApiCredentials(
    process.env.PUB_KEY
  );
  client.apiKeyCredentials = apiCreds;
  
  const timestamp = new Date().toISOString()
  const signature = client.private.sign({
    requestPath: '/ws/accounts',
    method: 'GET',
    isoTimestamp: timestamp,
  })
  const msg = {
    type: 'subscribe',
    channel: 'v3_accounts',
    accountNumber: '0',
    apiKey: apiCreds.key,
    signature,
    timestamp,
    passphrase: apiCreds.passphrase
  }

  const ws = new WebSocket(process.env.DYDX_WS_HOST);
  ws.on('open', () => {
    ws.send(JSON.stringify(msg))
  })
  ws.on('error', (error) => {
    console.log('<', error)
  })
  
  await new Promise(r => setTimeout(r, 2000));
  ws.close();
  return client;
}
