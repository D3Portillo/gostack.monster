import * as btc from "@scure/btc-signer"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils"

import { safeConvert } from "@/lib/number"
import { withPreventDefault } from "@/lib/utils"
import { useFormattedInputHandler } from "@/lib/input"
import { useNetwork, useWallet } from "@/lib/stacks"
import { useToast } from "@/components/ui/use-toast"
import { useBalances } from "@/lib/swr"

import BalanceSwitch, { useIsSatsDeposit } from "@/components/BalanceSwitch"
import { Button } from "@/components/ui/button"
import InputNumberWithError from "./InputNumberWithError"

import asset_btc from "@/assets/tokens/btc.svg"

const MIN_SAT_DEPOSIT = 10000
function Deposit() {
  const [isSatsDeposit] = useIsSatsDeposit()
  const formattedInput = useFormattedInputHandler()
  const { toast } = useToast()
  const { addresses, publicKey, connect, isConnected } = useWallet()
  const { data: balances } = useBalances(addresses)

  const { sbtc, sbtcWalletAddress, testnet } = useNetwork()

  const amountSats = Number(
    isSatsDeposit ? formattedInput.value : formattedInput.formattedValue
  )

  const handleDeposit = async () => {
    if (!isConnected) return connect()
    // Early exit if Wallet Not-Connected

    if (MIN_SAT_DEPOSIT > amountSats) {
      return toast({
        title: "Balance Error",
        description: "Balance should be greater than 0.0001 BTC",
      })
    }

    const tx = await sbtc.sbtcDepositHelper({
      ...({
        sbtcWalletAddress,
        // dirty bypass ts error :(
        // TODO: suggest to include or update typedefs
      } as any),
      network: sbtc.TESTNET,
      feeRate: await testnet.estimateFeeRate("low"),
      pegAddress: await testnet.getSbtcPegAddress(),
      utxos: await testnet.fetchUtxos(addresses.btc),
      bitcoinChangeAddress: addresses.btc,
      stacksAddress: addresses.stx,
      amountSats,
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

  const isBalanceUnavailable = formattedInput.isEmpty
    ? false
    : amountSats > balances.btc.sats

  return (
    <section className="border p-7 pt-8 rounded-2xl bg-white shadow-lg shadow-black/5">
      <h2 className="text-2xl mb-3 font-bold">Deposit BTC, mint sBTC</h2>
      <p className="text-sm text-black/80">
        Input a BTC amount to mint sBTC (minimum: 0.0001 BTC). sBTC will be
        minted to your logged-in account
      </p>

      <BalanceSwitch
        isBTC
        onClickMaxBalance={() =>
          formattedInput.setValue(
            balances.btc[isSatsDeposit ? "sats" : "decimal"]
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
          tokenImage={asset_btc}
          value={formattedInput.value}
          tokenSymbol={isSatsDeposit ? "SATS" : "BTC"}
          onChange={formattedInput.onChangeHandler}
          errorMessage={isBalanceUnavailable && "Balance unavailable"}
          placeholder={isSatsDeposit ? "10000" : "0.0001"}
        />

        <Button
          suppressHydrationWarning
          className="-mx-1 rounded-full h-14 text-xl bg-stacks-purple hover:bg-stacks-purple"
        >
          {isConnected ? "Confirm Deposit" : "Connect Wallet"}
        </Button>
      </form>
    </section>
  )
}

export default Deposit
