import type { Addresses, Balances } from "@/@types/shared"
import useSWR from "swr"
import { API_BASE_URL } from "./constants"
import { toPrecision } from "./number"

export const formatRequest = (endpoint = "") =>
  `${API_BASE_URL}${endpoint}` as const

export const useBalances = (addresses: Addresses) => {
  const { data, ...query } = useSWR(
    addresses?.stx ? `useBalances.${addresses.stx}` : null,
    () =>
      fetch(
        formatRequest(
          `/address/balances/${addresses.stx}/${addresses.btc}/${addresses.ordinals}`
        )
      ).then((r) => r.json()) as Promise<Balances>
  )

  const btcSats = Number(
    (data?.cardinalInfo.chain_stats.funded_txo_sum || 0) -
      (data?.cardinalInfo.chain_stats.spent_txo_sum || 0)
  )
  const sbtcSats = data?.sBTCBalance || 0

  return {
    ...query,
    data: {
      sbtc: {
        sats: sbtcSats,
        decimal: sbtcSats / 1e8,
        formatted: toPrecision(sbtcSats / 1e8, 5),
      },
      btc: {
        sats: btcSats,
        decimal: btcSats / 1e8,
        formatted: toPrecision(btcSats / 1e8, 5),
      },
    },
  }
}
