import { atom, useAtom } from "jotai"
import { useWallet } from "@/lib/stacks"
import { useBalances } from "@/lib/swr"

import { IoWallet } from "react-icons/io5"
import { HiSwitchHorizontal } from "react-icons/hi"

const satsAtom = atom(false)
export const useIsSatsDeposit = () => useAtom(satsAtom)

function BalanceSwitch({
  isBTC = false,
  onSwitch = () => {},
  onClickMaxBalance = () => {},
}) {
  const [isSatsDeposit, setIsDepositSats] = useIsSatsDeposit()
  const { addresses } = useWallet()
  const { data: balances } = useBalances(addresses)

  const balance = balances[isBTC ? "btc" : "sbtc"]
  const TOKEN = isBTC ? "BTC" : "sBTC"

  function handleSwitch() {
    setIsDepositSats((state) => !state)
    onSwitch()
  }

  return (
    <nav className="flex justify-between mt-8 text-sm">
      <div className="flex items-center gap-1.5">
        <IoWallet />
        <button className="hover:opacity-80" onClick={onClickMaxBalance}>
          <span>Wallet Balance</span>{" "}
          <strong className="font-medium">
            {isSatsDeposit ? balance.sats : balance.formatted}{" "}
            {isSatsDeposit ? "SAT" : TOKEN}
          </strong>
        </button>
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
