import BalanceSwitch, { useIsSatsDeposit } from "@/components/BalanceSwitch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Withdraw() {
  const [isSatsDeposit] = useIsSatsDeposit()

  return (
    <section className="border p-7 rounded-2xl bg-white shadow-lg shadow-black/5">
      <h2 className="text-2xl mb-2 font-bold">Deposit sBTC, withdraw BTC</h2>
      <p className="text-sm text-black/80">
        Input the amount of BTC you wish to withdraw. Balance will be sent to
        the BTC address of your logged-in account
      </p>

      <BalanceSwitch />

      <div className="flex flex-col gap-4 mt-2">
        <Input
          type="balance"
          className="rounded-xl"
          placeholder={isSatsDeposit ? "1000 SAT" : "0.0001 sBTC"}
        />
        <Button className="-mx-1 rounded-full h-14 text-xl bg-stacks-purple hover:bg-stacks-purple">
          Confirm Withdrawal
        </Button>
      </div>
    </section>
  )
}

export default Withdraw
