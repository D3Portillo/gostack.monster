import type { PropsWithChildren } from "react"
import copy from "copy-to-clipboard"
import { IoWallet } from "react-icons/io5"
import { BsCheckCircleFill } from "react-icons/bs"
import { LuCopy } from "react-icons/lu"

import { useToast } from "@/components/ui/use-toast"
import { beautifyAddress } from "@/lib/utils"
import { useWallet } from "@/lib/stacks"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function AccountMenu({ children }: PropsWithChildren) {
  const { toast } = useToast()
  const { addresses, disconnect } = useWallet()

  function handleCopyContent(content: string) {
    copy(content)
    toast({
      className: "rounded-2xl p-4",
      title: (
        <h3 className="flex items-center gap-1.5">
          <BsCheckCircleFill className="text-[120%] text-green-600" />
          <span>Copied to clipboard</span>
        </h3>
      ) as any,
      description: <p className="text-xs">{content}</p>,
      duration: 1200,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-2xl [&_button]:cursor-pointer">
        <DropdownMenuLabel className="text-base font-semibold flex items-center gap-2">
          <IoWallet className="text-[110%]" />
          <span>Wallet Addresses</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          className="text-black/70 flex items-center gap-2 w-full"
        >
          <button onClick={() => handleCopyContent(addresses.stx)}>
            <LuCopy className="opacity-75 text-base" />
            <span>STX Address ― {beautifyAddress(addresses.stx)}</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="text-black/70 flex items-center gap-2 w-full"
        >
          <button onClick={() => handleCopyContent(addresses.btc)}>
            <LuCopy className="opacity-75 text-base" />
            <span>BTC Address ― {beautifyAddress(addresses.btc)}</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="bg-black/5 font-bold mt-2 w-full rounded-2xl justify-center"
        >
          <button onClick={disconnect}>Disconnect</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu
