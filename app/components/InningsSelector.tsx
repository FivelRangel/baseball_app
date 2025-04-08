"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InningsSelectorProps {
  value: number
  onChange: (value: number) => void
}

export default function InningsSelector({ value, onChange }: InningsSelectorProps) {
  const handleChange = (newValue: string) => {
    onChange(Number.parseInt(newValue, 10))
  }

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="innings">Número de Entradas</Label>
      <Select value={value.toString()} onValueChange={handleChange}>
        <SelectTrigger id="innings" className="w-full bg-white">
          <SelectValue placeholder="Seleccionar entradas" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} {num === 1 ? "Entrada" : "Entradas"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
