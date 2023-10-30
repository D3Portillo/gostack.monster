import type { Addresses, Balances } from "@/@types/shared"
import useSWR from "swr"
import { API_BASE_URL } from "./constants"
import { toPrecision } from "./number"

export const formatRequest = (endpoint = "") =>
  `${API_BASE_URL}${endpoint}` as const

const formatBalance = (sats = 0) => ({
  sats,
  decimal: sats / 1e8,
  formatted: toPrecision(sats / 1e8, 5),
})

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

  return {
    ...query,
    data: {
      sbtc: formatBalance(data?.sBTCBalance || 0),
      btc: formatBalance(
        Number(
          (data?.cardinalInfo?.chain_stats?.funded_txo_sum || 0) -
            (data?.cardinalInfo?.chain_stats?.spent_txo_sum || 0)
        )
      ),
    },
  }
}
