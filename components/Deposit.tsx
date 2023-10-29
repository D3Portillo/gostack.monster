import { useState } from "react"
import * as btc from "@scure/btc-signer"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"

import useOnOffMachine from "@/lib/useOnOffMachine"
import { useNetwork, useWallet } from "@/lib/stacks"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoWallet } from "react-icons/io5"

import { HiSwitchHorizontal } from "react-icons/hi"

function Deposit() {
  const satsMachine = useOnOffMachine()
  const { addresses, publicKey, connect, isConnected } = useWallet()
  const { sbtc, sbtcWalletAddress, testnet } = useNetwork()
  const [satoshis, setSatoshis] = useState(10000)

  const handleDeposit = async () => {
    if (!isConnected) return connect()
    // Early exit if Wallet Not-Connected

    const utxos = await testnet.fetchUtxos(addresses.btc)

    const {
      tr: { address: pegAddress },
    } = await testnet.getBitcoinAccount(sbtc.WALLET_00)

    const tx = await sbtc.sbtcDepositHelper({
      ...({
        sbtcWalletAddress,
        // dirty bypass ts error :(
        // TODO: suggest to include or update typedefs
      } as any),
      network: sbtc.TESTNET,
      stacksAddress: addresses.stx,
      pegAddress,
      amountSats: satoshis,
      feeRate: await testnet.estimateFeeRate("low"),
      utxos,
      bitcoinChangeAddress: addresses.btc,
    })

    // convert the returned transaction object into a PSBT for Leather to use
    const psbt = tx.toPSBT()

    // Call Leather API to sign PSBT
    const txResponse = await window.btc.request("signPsbt", {
      publicKey,
      hex: bytesToHex(psbt),
    })

    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    )

    formattedTx.finalize()

    // Broadcast using the helper
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
          onClick={satsMachine.toggle}
          className="flex items-center gap-1 text-stacks-purple"
        >
          <span>Switch to {satsMachine.isOn ? "BTC" : "SAT"}</span>
          <HiSwitchHorizontal />
        </button>
      </nav>
      <div className="flex flex-col gap-4 mt-2">
        <Input
          type="balance"
          className="rounded-xl"
          placeholder={satsMachine.isOn ? "1000 SAT" : "0.0001 BTC"}
        />
        <Button
          suppressHydrationWarning
          onClick={handleDeposit}
          className="-mx-1 rounded-full h-14 text-xl bg-stacks-purple hover:bg-stacks-purple"
        >
          {isConnected ? "Confirm Deposit" : "Connect Wallet"}
        </Button>
      </div>
    </section>
  )
}

export default Deposit
