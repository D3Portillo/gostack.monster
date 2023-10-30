import { useState } from "react"
import { type SignatureData, openSignatureRequestPopup } from "@stacks/connect"
import { StacksTestnet } from "@stacks/network"
import { useNetwork, useWallet } from "./stacks"

export const useSignMessage = (amountSats: number) => {
  const [signatureData, setSignatureData] = useState<SignatureData>()
  const { sbtc } = useNetwork()
  const { addresses, session } = useWallet()

  const resetSignature = () => setSignatureData(undefined)

  const signMessage = async () => {
    // First we reset signature state to `undefined`
    resetSignature()

    // We need to sign a Stacks message to prove we own the sBTC
    const message = sbtc.sbtcWithdrawMessage({
      network: sbtc.TESTNET,
      amountSats,
      bitcoinAddress: addresses.btc,
    })

    try {
      // Now we can use Leather to sign that message
      setSignatureData(
        await new Promise<SignatureData>((resolve) =>
          openSignatureRequestPopup({
            message,
            userSession: session,
            network: new StacksTestnet(),
            onFinish: resolve,
            onCancel: resetSignature,
          })
        )
      )
    } catch (_) {}
  }

  return {
    signMessage,
    lastSignature: signatureData,
    resetSignature,
  }
}
