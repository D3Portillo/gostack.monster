import sbtc from "sbtc"

export type TypedSBTC = typeof sbtc

export type Addresses = {
  stx: string
  btc: string
  ordinals: string
  isTestnet: boolean
}

export type Balances = {
  sBTCBalance: number
  cardinalInfo: {
    chain_stats: {
      funded_txo_sum: number
      spent_txo_sum: number
    }
  }
}
