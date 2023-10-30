import { atom, useAtom } from "jotai"
import { useWallet } from "@/lib/stacks"
import { useBalances } from "@/lib/swr"

import { IoWallet } from "react-icons/io5"
import { HiSwitchHorizontal } from "react-icons/hi"

const satsAtom = atom(false)
export const useIsSatsDeposit = () => useAtom(satsAtom)

function BalanceSwitch({ isBTC = false, onClick = () => {} }) {
  const [isSatsDeposit, setIsDepositSats] = useIsSatsDeposit()
  const { addresses } = useWallet()
  const { data: balances } = useBalances(addresses)

  const balance = balances[isBTC ? "btc" : "sbtc"]
  const TOKEN = isBTC ? "BTC" : "sBTC"

  function handleSwitch() {
    onClick?.()
    setIsDepositSats((state) => !state)
  }

  return (
    <nav className="flex justify-between mt-8 text-sm">
      <div className="flex items-center gap-1.5">
        <IoWallet />
        <span>
          Balance ― {isSatsDeposit ? balance.sats : balance.formatted}{" "}
          {isSatsDeposit ? "SAT" : TOKEN}
        </span>
      </div>
      <button
        onClick={handleSwitch}
        className="flex items-center gap-1 text-stacks-purple"
      >
        <span>Switch to {isSatsDeposit ? TOKEN : "SAT"}</span>
        <HiSwitchHorizontal />
      </button>
    </nav>
  )
}

export default BalanceSwitch
