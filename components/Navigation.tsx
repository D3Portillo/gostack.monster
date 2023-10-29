import Image from "next/image"
import { Button } from "@/components/ui/button"

import asset_logo from "@/assets/logo.svg"

function Navigation() {
  return (
    <nav className="flex items-center justify-between w-full">
      <Image className="w-full max-w-[10rem]" src={asset_logo} alt="" />
      <Button className="rounded-full">Connect Wallet</Button>
    </nav>
  )
}

export default Navigation
