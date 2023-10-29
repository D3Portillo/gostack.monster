import { useState } from "react"
import btc from "@scure/btc-signer"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"

import useOnOffMachine from "@/lib/useOnOffMachine"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoWallet } from "react-icons/io5"

import { HiSwitchHorizontal } from "react-icons/hi"

function Deposit() {
  const depositSAT = useOnOffMachine()
  const [satoshis, setSatoshis] = useState(0)

  const handleInputChange = (event: any) => {
    setSatoshis(event.target.value)
  }

  const buildTransaction = async (e: any) => {
    const { sbtcDepositHelper, TESTNET, TestnetHelper } = await import("sbtc")
    e.preventDefault()

    // Helper for working with various API and RPC endpoints and getting and processing data
    // Change this depending on what network you are working with
    const testnet = new TestnetHelper()
    // const testnet = new DevEnvHelper();

    // setting BTC address for devnet
    // Because of some quirks with Leather, we need to pull our BTC wallet using the helper if we are on devnet
    // const bitcoinAccountA = await testnet.getBitcoinAccount(WALLET_00);
    // const btcAddress = bitcoinAccountA.wpkh.address;
    // const btcPublicKey = bitcoinAccountA.publicKey.buffer.toString();

    // setting BTC address for testnet
    // here we are pulling directly from our authenticated wallet
    const btcAddress = "userData.profile.btcAddress.p2wpkh.testnet"
    const btcPublicKey = "userData.profile.btcPublicKey.p2wpkh"

    let utxos = await testnet.fetchUtxos(btcAddress)

    // If we are working via testnet
    // get sBTC deposit address from bridge API
    const response = await fetch(
      "https://bridge.sbtc.tech/bridge-api/testnet/v1/sbtc/init-ui"
    )
    const data = await response.json()
    const sbtcWalletAddress = data.sbtcContractData.sbtcWalletAddress

    // if we are working via devnet we can use the helper to get the sbtc wallet address, which is associated with the first wallet
    // const sbtcWalletAccount = await testnet.getBitcoinAccount(WALLET_00);
    // const sbtcWalletAddress = sbtcWalletAccount.tr.address;

    const tx = await sbtcDepositHelper({
      // comment this line out if working via devnet
      network: TESTNET,
      stacksAddress: "",
      amountSats: satoshis,

      // we can use the helper to get an estimated fee for our transaction
      feeRate: await testnet.estimateFeeRate("low"),
      // the helper will automatically parse through these and use one or some as inputs
      utxos,
      // where we want our remainder to be sent. UTXOs can only be spent as is, not divided, so we need a new input with the difference between our UTXO and how much we want to send
      bitcoinChangeAddress: btcAddress,
    })

    // convert the returned transaction object into a PSBT for Leather to use
    const psbt = tx.toPSBT()
    const requestParams = {
      publicKey: btcPublicKey,
      hex: bytesToHex(psbt),
    }
    // Call Leather API to sign the PSBT and finalize it
    const txResponse = await (window as any)["btc"].request(
      "signPsbt",
      requestParams
    )
    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    )
    formattedTx.finalize()

    // Broadcast it using the helper
    const finalTx = await testnet.broadcastTx(formattedTx)

    // Get the transaction ID
    console.log(finalTx)
  }

  return (
    <section className="border p-7 rounded-2xl bg-white shadow-lg shadow-black/5">
      <h2 className="text-2xl mb-2 font-bold">Deposit BTC, mint sBTC</h2>
      <p className="text-sm text-black/80">
        Input a BTC amount to mint sBTC (minimum: 0.0001 BTC). sBTC will be
        minted to your logged-in account
      </p>

      <nav className="flex justify-between mt-8 text-sm">
        <div className="flex items-center gap-1.5">
          <IoWallet />
          <span>Balance ― 0.0003 BTC</span>
        </div>
        <button
          onClick={depositSAT.toggle}
          className="flex items-center gap-1 text-stacks-purple"
        >
          <span>Switch to {depositSAT.isOn ? "BTC" : "SAT"}</span>
          <HiSwitchHorizontal />
        </button>
      </nav>
      <div className="flex flex-col gap-4 mt-2">
        <Input
          type="balance"
          className="rounded-xl"
          placeholder={depositSAT.isOn ? "1000 SAT" : "0.0001 BTC"}
        />
        <Button className="-mx-1 rounded-full h-14 text-xl bg-stacks-purple hover:bg-stacks-purple">
          Confirm Deposit
        </Button>
      </div>
    </section>
  )
}

export default Deposit
