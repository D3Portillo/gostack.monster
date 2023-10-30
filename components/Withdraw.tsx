import { withPreventDefault } from "@/lib/utils"
import { useFormattedInputHandler } from "@/lib/input"
import { useWallet } from "@/lib/stacks"
import { useBalances } from "@/lib/swr"

import BalanceSwitch, { useIsSatsDeposit } from "@/components/BalanceSwitch"
import { Button } from "@/components/ui/button"
import InputNumberWithError from "./InputNumberWithError"

import asset_sbtc from "@/assets/tokens/sbtc.svg"

function Withdraw() {
  const [isSatsDeposit] = useIsSatsDeposit()
  const formattedInput = useFormattedInputHandler()
  const { addresses, connect, isConnected } = useWallet()
  const { data: balances } = useBalances(addresses)

  const amountSats = Number(
    isSatsDeposit ? formattedInput.value : formattedInput.formattedValue
  )

  const handleDeposit = async () => {
    if (!isConnected) return connect()
    // Early exit if Wallet Not-Connected
  }

  const isBalanceUnavailable = formattedInput.isEmpty
    ? false
    : amountSats > balances.sbtc.sats

  return (
    <section className="border p-7 rounded-2xl bg-white shadow-lg shadow-black/5">
      <h2 className="text-2xl mb-2 font-bold">Deposit sBTC, withdraw BTC</h2>
      <p className="text-sm text-black/80">
        Input the amount of BTC you wish to withdraw. Balance will be sent to
        the BTC address of your logged-in account
      </p>

      <BalanceSwitch />

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
          {isConnected ? "Confirm Withdrawal" : "Connect Wallet"}
        </Button>
      </form>
    </section>
  )
}

export default Withdraw
