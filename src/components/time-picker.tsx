"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [period, setPeriod] = useState<"AM" | "PM">("AM")

  // Parse the initial value
  useEffect(() => {
    if (value) {
      const timeRegex = /^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i
      const match = value.match(timeRegex)

      if (match) {
        let parsedHours = Number.parseInt(match[1], 10)
        const parsedMinutes = Number.parseInt(match[2], 10)
        let parsedPeriod: "AM" | "PM" = "AM"

        if (match[3]) {
          parsedPeriod = match[3].toUpperCase() as "AM" | "PM"
        } else if (parsedHours >= 12) {
          parsedPeriod = "PM"
          if (parsedHours > 12) parsedHours -= 12
        }

        setHours(parsedHours)
        setMinutes(parsedMinutes)
        setPeriod(parsedPeriod)
      }
    }
  }, [value])

  // Format the time when hours, minutes, or period changes
  useEffect(() => {
    if (hours || minutes) {
      const formattedHours = hours === 0 ? 12 : hours
      const formattedMinutes = minutes.toString().padStart(2, "0")
      onChange(`${formattedHours}:${formattedMinutes} ${period}`)
    }
  }, [hours, minutes, period, onChange])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setHours(value)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value)
    }
  }

  const togglePeriod = () => {
    setPeriod(period === "AM" ? "PM" : "AM")
  }

  return (
    <Popover open={isOpen && !disabled} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!value && "text-muted-foreground"}`}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center space-x-2">
          <div className="grid gap-1">
            <div className="text-xs font-medium">Hours</div>
            <Input type="number" min={1} max={12} value={hours || ""} onChange={handleHoursChange} className="w-16" />
          </div>
          <div className="text-xl">:</div>
          <div className="grid gap-1">
            <div className="text-xs font-medium">Minutes</div>
            <Input
              type="number"
              min={0}
              max={59}
              value={minutes || ""}
              onChange={handleMinutesChange}
              className="w-16"
            />
          </div>
          <div className="grid gap-1">
            <div className="text-xs font-medium">Period</div>
            <Button variant="outline" size="sm" onClick={togglePeriod} className="w-16">
              {period}
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
