import * as btc from "@scure/btc-signer"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"
import { withPreventDefault } from "@/lib/utils"
import { useFormattedInputHandler } from "@/lib/input"
import { useNetwork, useWallet } from "@/lib/stacks"

import { useBalances } from "@/lib/swr"
import { useSignMessage } from "@/lib/wallet"
import { safeConvert } from "@/lib/number"

import BalanceSwitch, { useIsSatsDeposit } from "@/components/BalanceSwitch"
import { Button } from "@/components/ui/button"
import InputNumberWithError from "./InputNumberWithError"

import asset_sbtc from "@/assets/tokens/sbtc.svg"

function Withdraw() {
  const [isSatsDeposit] = useIsSatsDeposit()
  const formattedInput = useFormattedInputHandler()
  const { addresses, connect, isConnected, publicKey } = useWallet()
  const { data: balances } = useBalances(addresses)
  const { sbtc, sbtcWalletAddress, testnet } = useNetwork()
  const amountSats = Number(
    isSatsDeposit ? formattedInput.value : formattedInput.formattedValue
  )

  const { lastSignature, signMessage, resetSignature } =
    useSignMessage(amountSats)

  const handleDeposit = async () => {
    if (!isConnected) return connect()
    // Early exit if Wallet Not-Connected

    if (!lastSignature) return signMessage()
    // Continue until signed tx

    const tx = await sbtc.sbtcWithdrawHelper({
      ...({
        sbtcWalletAddress,
      } as any),
      network: sbtc.TESTNET,
      bitcoinAddress: addresses.btc,
      amountSats,
      signature: lastSignature!.signature,
      feeRate: await testnet.estimateFeeRate("low"),
      pegAddress: await testnet.getSbtcPegAddress(),
      fulfillmentFeeSats: 2000,
      utxos: await testnet.fetchUtxos(addresses.btc),
      bitcoinChangeAddress: addresses.btc,
    })

    const txResponse = await window.btc.request("signPsbt", {
      publicKey,
      hex: bytesToHex(tx.toPSBT()),
    })

    const formattedTx = btc.Transaction.fromPSBT(
      hexToBytes(txResponse.result.hex)
    )

    formattedTx.finalize()

    const finalTx = await testnet.broadcastTx(formattedTx)

    // Clean up signed tx
    resetSignature()

    console.log(finalTx)
  }

  const isBalanceUnavailable = formattedInput.isEmpty
    ? false
    : amountSats > balances.sbtc.sats

  return (
    <section className="border p-7 pt-8 rounded-2xl bg-white shadow-lg shadow-black/5">
      <h2 className="text-2xl mb-3 font-bold">Deposit sBTC, withdraw BTC</h2>
      <p className="text-sm text-black/80">
        Input the amount of BTC you wish to withdraw. Balance will be sent to
        the BTC address of your logged-in account
      </p>

      <BalanceSwitch
        onClickMaxBalance={() =>
          formattedInput.setValue(
            balances.sbtc[isSatsDeposit ? "sats" : "decimal"]
          )
        }
        onSwitch={() => {
          if (formattedInput.isEmpty) return
          formattedInput.setValue(
            safeConvert(formattedInput.value, isSatsDeposit ? "BTC" : "SAT")
          )
        }}
      />

      <form
        onSubmit={withPreventDefault(handleDeposit)}
        className="flex flex-col mt-2"
      >
        <InputNumberWithError
          tokenImage={asset_sbtc}
          value={formattedInput.value}
          tokenSymbol={isSatsDeposit ? "SATS" : "sBTC"}
          onChange={formattedInput.onChangeHandler}
          errorMessage={isBalanceUnavailable && "Balance unavailable"}
          placeholder={isSatsDeposit ? "10000" : "0.0001"}
        />

        <Button
          suppressHydrationWarning
          className="-mx-1 rounded-full h-14 text-xl bg-stacks-purple hover:bg-stacks-purple"
        >
          {isConnected
            ? lastSignature
              ? "Confirm Withdrawal"
              : "Sign Transaction"
            : "Connect Wallet"}
        </Button>
      </form>
    </section>
  )
}

export default Withdraw
