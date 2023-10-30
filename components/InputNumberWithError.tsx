import type { InputProps } from "@/components/ui/input"
import { Fragment } from "react"
import { BiSolidMessageSquareError } from "react-icons/bi"
import { cn } from "@/lib/utils"

import InputNumber from "./InputNumber"
import Image, { type StaticImageData } from "next/image"

function InputNumberWithError({
  errorMessage,
  className,
  tokenSymbol,
  tokenImage,
  ...props
}: InputProps & {
  errorMessage?: any
  tokenSymbol: string
  tokenImage: StaticImageData
}) {
  const isError = Boolean(errorMessage)

  return (
    <Fragment>
      <div className="relative">
        <InputNumber
          required
          className={cn("rounded-xl", isError && "!ring-red-500/20", className)}
          {...props}
        />
        <div className="absolute pointer-events-none h-full text-sm px-3 gap-1.5 flex items-center top-0 right-0">
          <Image className="w-5 h-5" src={tokenImage} alt="" />
          <span className="opacity-70 font-semibold">{tokenSymbol}</span>
        </div>
      </div>
      <p
        hidden={!isError}
        className="text-xs text-red-500 flex items-center gap-1 h-8"
      >
        <BiSolidMessageSquareError className="text-[105%]" />
        <span>{errorMessage}</span>
      </p>
    </Fragment>
  )
}

export default InputNumberWithError
