import Link from "next/link"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import Deposit from "@/components/Deposit"
import Navigation from "@/components/Navigation"
import Withdraw from "@/components/Withdraw"
import SeoTags from "@/components/SeoTags"

const TABS = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
}

export default function Home() {
  return (
    <main className="container flex flex-col gap-8 items-center min-h-screen p-4">
      <Navigation />
      <SeoTags />
      <Tabs defaultValue={TABS.DEPOSIT} className="w-full max-w-md">
        <TabsList className="grid bg-stacks-purple/5 border h-12 rounded-xl [&_button]:h-full [&_button]:rounded-lg w-full grid-cols-2">
          <TabsTrigger className="font-semibold" value={TABS.DEPOSIT}>
            Deposit BTC
          </TabsTrigger>
          <TabsTrigger className="font-semibold" value={TABS.WITHDRAW}>
            Withdraw BTC
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TABS.DEPOSIT}>
          <Deposit />
        </TabsContent>
        <TabsContent value={TABS.WITHDRAW}>
          <Withdraw />
        </TabsContent>
      </Tabs>

      <div className="flex-grow" />

      <p className="text-xs text-black/40 text-center">
        Gostack is an <strong>unofficial project</strong> for{" "}
        <Link
          className="underline underline-offset-2"
          href="https://stacks.org/sbtc-testnet"
          target="_blank"
        >
          Stacks Network Testnet Program
        </Link>
      </p>
    </main>
  )
}
