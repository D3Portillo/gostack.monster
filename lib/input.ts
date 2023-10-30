import { type FormEventHandler, useMemo, useState } from "react"
import { parseUnits } from "viem"

const isComma = (n: any) => n === "." || n === ","
const commify = (n: any) => (n || "").replace(",", ".")

export const validateInput = (value: string | number = "") => {
  const isAlpha = /[a-z\s]/gi.test(`${value}`)
  const trimmed = `${value}`.trim().replace(/\s/g, "")
  const isVoidOrDirty = isComma(trimmed) || trimmed.length === 0 || isAlpha
  const formatted = isVoidOrDirty ? "0" : commify(trimmed).replace(/\.$/, ".0")
  // replaces [,]->[.]

  return {
    formatted,
    isValid: isAlpha ? false : value === "" || isFinite(Number(formatted)),
  }
}

export const useFormattedInputHandler = (initState?: number) => {
  const [value, setValue] = useState<any>(initState!)

  const formattedValue = useMemo(
    () => parseUnits(validateInput(value).formatted, 8),
    [value]
  )

  const onChangeHandler: FormEventHandler<HTMLInputElement> = ({
    currentTarget: { value: newValue },
  }) => {
    const isCurrentZeroed = (value as any) === "0."
    const formatted = isComma(newValue)
      ? `0${isCurrentZeroed ? "" : "."}`
      : commify(newValue)

    setValue(validateInput(newValue).isValid ? formatted : 0)
  }

  const resetValue = () => setValue("" as any)

  return {
    value,
    resetValue,
    formattedValue,
    onChangeHandler,
    isEmpty: value == "",
    setValue,
  }
}
