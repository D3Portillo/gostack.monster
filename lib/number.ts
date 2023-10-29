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
