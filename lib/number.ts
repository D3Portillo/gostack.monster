/**
 * Adapted from https://github.com/rainbow-me/rainbowkit/blob/main/packages/rainbowkit/src/components/ConnectButton/abbreviateETHBalance.ts#L6
 */

export function toPrecision(n: number | string, precision: number = 1) {
  return Number(
    n
      .toString()
      .replace(new RegExp(`(.+\\.\\d{${precision}})\\d+`), "$1")
      .replace(/(\.[1-9]*)0+$/, "$1")
      .replace(/\.$/, "")
  )
}

export const safeConvert = (n = 0, convertTo: "SAT" | "BTC") => {
  const isConvertToBTC = convertTo === "BTC"
  const value = Number(n * (isConvertToBTC ? 1 / 1e8 : 1e8))
  if (Number.isFinite(value)) {
    return isConvertToBTC ? value : Math.round(value)
  }
  return 0
}
