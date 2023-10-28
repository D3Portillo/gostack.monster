import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Home() {
  return (
    <main className="grid min-h-screen place-content-center">
      <form className="border p-4 rounded-xl">
        <div className="flex gap-2">
          <Input type="balance" placeholder="0.0000 SATS" />
          <Button type="submit">Deposit</Button>
        </div>
      </form>
    </main>
  )
}
