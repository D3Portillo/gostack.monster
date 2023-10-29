declare interface Window {
  btc: {
    request(
      requestType: "signPsbt",
      payload: Record<string, any>
    ): Promise<{
      result: {
        hex: string
      }
    }>
  }
}
