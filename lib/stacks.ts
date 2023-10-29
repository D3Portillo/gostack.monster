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
        name: "BitLoan",
        icon: "https://freesvg.org/img/bitcoin.png",
      },
      onFinish: () => {
        window.location.reload()
      },
    })
  }

  const disconnect = () => {
    session.signUserOut(window.location.origin)
  }

  return {
    disconnect,
    connect,
    session,
    appConfig,
  }
}
