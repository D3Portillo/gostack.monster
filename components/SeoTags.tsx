import { useMemo } from "react"
import { NextSeo } from "next-seo"

const BASE_URL = "https://gostack.monster"
const TWITTER_HANDLE = "d3portillo"
export const DEFAULT_SEO = {
  title: "GoStack on Stacks 🧡",
  url: BASE_URL,
  imageURL: `${BASE_URL}/seo.jpg`,
  description:
    "Deposit BTC, mint sBTC. Stacks Foundation Developer Program. Bridge",
  imageWidth: 1200,
  imageHeight: 630,
}

export type SeoDefinitions = typeof DEFAULT_SEO
function SeoTags(props: Partial<SeoDefinitions> = {}) {
  const SEO = useMemo(() => {
    return Object.keys(DEFAULT_SEO).reduce((currentDef, _key: any) => {
      const key = _key as keyof SeoDefinitions
      return {
        ...currentDef,
        [key]: props[key] || currentDef[key],
      }
    }, DEFAULT_SEO)
  }, [props])

  return (
    <NextSeo
      title={SEO.title}
      additionalLinkTags={[
        {
          rel: "icon",
          type: "image/jpg",
          // located at -> /public/favicon.jpg
          href: "/favicon.jpg",
        },
      ]}
      twitter={{
        cardType: "summary_large_image",
        handle: TWITTER_HANDLE,
        site: SEO.url,
      }}
      openGraph={{
        type: "website",
        url: SEO.url,
        title: SEO.title,
        description: SEO.description,
        images: [
          {
            // located at -> /public/seo.png
            url: SEO.imageURL,
            alt: SEO.imageURL,
            width: SEO.imageWidth || 1200,
            height: SEO.imageHeight || 630,
          },
        ],
      }}
      description={SEO.description}
    />
  )
}

export default SeoTags
