import { showConnect } from "@stacks/connect"
import { AppConfig, UserSession } from "@stacks/connect"
import { atom, useAtom } from "jotai"

const appConfig = new AppConfig()
const sessionAtom = atom(new UserSession({ appConfig }))

export const useWallet = () => {
  const [session] = useAtom(sessionAtom)

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

  const addresses = {
    stx: (profile?.stxAddress?.testnet ?? "") as string,
    btc: (profile?.btcAddress?.p2wpkh?.testnet ?? "") as string,
    isTestnet: true,
    // TODO: Will add some logic later here. For Stacks Developer Program this will
    // always be set to `true`
  }

  return {
    session,
    addresses,
    connect,
    disconnect,
    isConnected,
    appConfig,
  }
}
