"use client"

import React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCalendarStore } from "@/store/calendar.store"

export function CalendarComponent() {
  const setDate = useCalendarStore(state => state.setDate);
  const date = useCalendarStore(state => state.selectedDate);
  const [open, setOpen] = React.useState(false)

  const handleDate = (date: Date = new Date()) => {
    setDate(date)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="date" className="px-1">
        Fecha
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Seleccione un fecha"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
