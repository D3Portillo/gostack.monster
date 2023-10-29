import NoSSR from "@/components/NoSSR"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import { HiChevronDown } from "react-icons/hi"

import { useWallet } from "@/lib/stacks"
import { beautifyAddress } from "@/lib/utils"

import asset_logo from "@/assets/logo.svg"
import AccountMenu from "./AccountMenu"

function Navigation() {
  const { isConnected, connect, addresses } = useWallet()

  return (
    <nav
      suppressHydrationWarning
      className="flex items-center justify-between w-full"
    >
      <Image className="w-full max-w-[10rem]" src={asset_logo} alt="" />
      <NoSSR>
        {isConnected ? (
          <AccountMenu>
            <Button className="rounded-full flex items-center gap-2">
              <span>Connected {beautifyAddress(addresses.btc)}</span>
              <HiChevronDown className="text-[150%]" />
            </Button>
          </AccountMenu>
        ) : (
          <Button onClick={connect} className="rounded-full">
            Connect Wallet
          </Button>
        )}
      </NoSSR>
    </nav>
  )
}

export default Navigation
