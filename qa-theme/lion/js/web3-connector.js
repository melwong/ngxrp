/*
    Description: Javascript to process web3 related functions

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
	
*/

async function connect() {
  //Change button text
  document.getElementById("btn-login").value = "Generating....";
  document.getElementById("btn-login").disabled = true;

  // Define the network client
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  //const test_wallet = xrpl.Wallet.generate();
  //console.log("wallet: " + test_wallet);

  // Create a wallet and fund it with the Testnet faucet:
  const fund_result = await client.fundWallet();
  const test_wallet = fund_result.wallet;
  console.log(fund_result);

  // Create trust line from hot to master address --------------------------------
  const my_wallet = xrpl.Wallet.fromSeed(fund_result.wallet.seed);

  const currency_code = "NAN";
  const trust_set_tx = {
    TransactionType: "TrustSet",
    Account: my_wallet.address,
    LimitAmount: {
      currency: currency_code,
      issuer: "rH12zFQ......cm",
      value: "10000000000", // Large limit, arbitrarily chosen
    },
  };

  const ts_prepared = await client.autofill(trust_set_tx);
  const ts_signed = my_wallet.sign(ts_prepared);
  console.log("Creating trust line from hot address to issuer...");
  const ts_result = await client.submitAndWait(ts_signed.tx_blob);
  if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`
    );
  } else {
    throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`;
  }
  //Trust line completed --------------------------------

  document.getElementById("wallet").value = fund_result.wallet.classicAddress;
  document.getElementById("privKey").value = fund_result.wallet.seed;

  //Enable the submit button which was originally disabled
  document.getElementById("submit-button").disabled = false;

  //Remove button after wallet is generated
  document.getElementById("btn-login").outerHTML = "";

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect();
}

async function mintToken() {
  document.getElementById("sign-up").submit();
}

async function withdrawCoins(amount, walletAddress) {
  // Example credentials
  const wallet = xrpl.Wallet.fromSeed("ssa....A9CqkXL");
  console.log(wallet.address); // rMCcNuT.....jUrMpH
  console.log("Connecting to Testnet...");

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  //const balance = await client.getXrpBalance(wallet.address)
  //console.log("Master wallet balance: ", balance)

  // Prepare transaction to send XRP -------------------------------------------------------
  /*const prepared = await client.autofill({
		"TransactionType": "Payment",
		"Account": wallet.address,
		"Amount": xrpl.xrpToDrops(amount),
		"Destination": walletAddress
		})
	const max_ledger = prepared.LastLedgerSequence
	console.log("Prepared transaction instructions:", prepared)
	console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
	console.log("Transaction expires after ledger:", max_ledger)

	// Sign prepared instructions ------------------------------------------------
	const signed = wallet.sign(prepared)
	console.log("Identifying hash:", signed.hash)
	console.log("Signed blob:", signed.tx_blob)

	// Submit signed blob --------------------------------------------------------
	const tx = await client.submitAndWait(signed.tx_blob)

	// Wait for validation -------------------------------------------------------
	// submitAndWait() handles this automatically, but it can take 4-7s.

	// Check transaction results -------------------------------------------------
	console.log("Transaction result:", tx.result.meta.TransactionResult)
	console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
	//Sending XRP ends
	*/

  // Send token ----------------------------------------------------------------
  const currency_code = "NAN";
  const issue_quantity = amount;
  const send_token_tx = {
    TransactionType: "Payment",
    Account: wallet.address,
    Amount: {
      currency: currency_code,
      value: issue_quantity,
      issuer: wallet.address,
    },
    Destination: walletAddress,
    DestinationTag: 1, // Needed since we enabled Require Destination Tags
    // on the hot account earlier.
  };

  const pay_prepared = await client.autofill(send_token_tx);
  const pay_signed = wallet.sign(pay_prepared);
  console.log(
    `Sending ${issue_quantity} ${currency_code} to ${walletAddress}...`
  );
  const pay_result = await client.submitAndWait(pay_signed.tx_blob);
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(
      `Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`
    );
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`;
  }
  //End of sending token -------------------------------------------------------

  // End of main()
  client.disconnect();

  return pay_signed.hash;
  //return signed.hash
}
