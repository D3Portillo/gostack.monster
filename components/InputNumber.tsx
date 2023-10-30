import { Input, type InputProps } from "@/components/ui/input"

function InputNumber(props: InputProps) {
  return (
    <Input
      {...props}
      inputMode="decimal"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      type="text"
      pattern="^[0-9]*[.]?[0-9]*$"
      minLength={1}
      maxLength={12}
    />
  )
}

export default InputNumber
