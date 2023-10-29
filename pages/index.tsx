import Image from "next/image"
import Deposit from "@/components/Deposit"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs"

import asset_logo from "@/assets/logo.svg"

const TABS = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
}

export default function Home() {
  return (
    <main className="container flex flex-col gap-8 items-center min-h-screen p-4">
      <nav className="flex items-center justify-between w-full">
        <Image src={asset_logo} alt="" />
        <Button className="rounded-full">Connect Wallet</Button>
      </nav>
      <Tabs defaultValue={TABS.DEPOSIT} className="w-full max-w-md">
        <TabsList className="grid bg-stacks-purple/5 border h-12 rounded-xl [&_button]:h-full [&_button]:rounded-lg w-full grid-cols-2">
          <TabsTrigger className="font-semibold" value={TABS.DEPOSIT}>
            Mint sBTC
          </TabsTrigger>
          <TabsTrigger className="font-semibold" value={TABS.WITHDRAW}>
            Withdraw BTC
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TABS.DEPOSIT}>
          <Deposit />
        </TabsContent>
        <TabsContent value={TABS.WITHDRAW}>
          <Deposit />
        </TabsContent>
      </Tabs>
    </main>
  )
}
