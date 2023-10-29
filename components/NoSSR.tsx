import { useEffect, useState } from "react"

interface Props {
  children: any // React.ReactNode
  fallback?: any // JSX.Element
}

const NoSSR = ({ children, fallback = null }: Props) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return mounted ? children : fallback
}

export default NoSSR
