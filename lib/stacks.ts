import type { Addresses, TypedSBTC } from "@/types/shared"
import type { TestnetHelper } from "sbtc"
import { useEffect } from "react"
import { showConnect } from "@stacks/connect"
import { AppConfig, UserSession } from "@stacks/connect"
import { atom, useAtom } from "jotai"

import { formatRequest } from "@/lib/swr"

const appConfig = new AppConfig()
const sessionAtom = atom(new UserSession({ appConfig }))

export const useWallet = () => {
  const [session] = useAtom(sessionAtom)

  useEffect(() => {
    if (session.isSignInPending()) {
      session.handlePendingSignIn()
    }
  }, [])

  const connect = () => {
    showConnect({
      userSession: session,
      appDetails: {
        name: "Gostack",
        icon: "https://gostack.monster/logo.png",
      },
      onFinish: () => {
        window.location.reload()
      },
    })
  }

  const disconnect = () => {
    session.signUserOut(window.location.origin)
  }

  const isConnected = session?.isUserSignedIn()
  const profile = isConnected ? session?.loadUserData()?.profile : {}

  const addresses: Addresses = {
    stx: profile?.stxAddress?.testnet ?? "",
    btc: profile?.btcAddress?.p2wpkh?.testnet ?? "",
    ordinals: profile?.btcAddress?.p2tr?.testnet ?? "",
    isTestnet: true,
    // TODO: Will add some logic later here. For Stacks Developer Program this will
    // always be set to `true`
  }

  return {
    session,
    addresses,
    publicKey: (profile?.btcPublicKey?.p2wpkh ?? "") as string,
    connect,
    disconnect,
    isConnected,
    appConfig,
  }
}

const networkAtom = atom({ sbtc: {} as TypedSBTC, sbtcWalletAddress: "" })
export const useNetwork = () => {
  const [config, setConfig] = useAtom(networkAtom)

  useEffect(() => {
    ;(async function fetchAddress() {
      // Get sBTC deposit address from bridge API
      const response = await fetch(formatRequest("/init-ui"))
      const { sbtcWalletAddress } = (await response.json()).sbtcContractData
      setConfig((config) => ({ ...config, sbtcWalletAddress }))
    })()

    import("sbtc").then((sbtc) => setConfig((config) => ({ ...config, sbtc })))
  }, [])

  return {
    ...config,
    testnet: config.sbtc?.TestnetHelper
      ? new config.sbtc.TestnetHelper()
      : ({} as TestnetHelper),
  }
}
