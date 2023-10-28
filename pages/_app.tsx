import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { Inter } from "next/font/google"

const nextFont = Inter({ subsets: [], display: "swap" })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={nextFont.className}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}
