'use client'

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface FiltersProps {
  onFilterChange: (type: string, value: string | null) => void;
}

const SEASONS = ['All Season', 'Spring', 'Summer', 'Fall', 'Winter'] as const
const TYPES = ['Accessories', 'Stationery'] as const
const COLORS = ['Black', 'Brown', 'Green', 'White'] as const

export function ProductFilters({ onFilterChange }: FiltersProps) {
  const [openSeason, setOpenSeason] = useState(false)
  const [openType, setOpenType] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const handleSelection = (
    type: 'season' | 'type' | 'color',
    value: string,
    currentValue: string | null,
    setSelected: (value: string | null) => void,
    setOpen: (value: boolean) => void
  ) => {
    const newValue = value === currentValue ? null : value
    setSelected(newValue)
    setOpen(false)
    onFilterChange(type, newValue)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Season Filter */}
      <Popover open={openSeason} onOpenChange={setOpenSeason}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSeason}
            className="w-[140px] justify-between"
          >
            {selectedSeason || "Season"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[140px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {SEASONS.map((season) => (
                <CommandItem
                  key={season}
                  value={season}
                  onSelect={(value) => handleSelection(
                    'season',
                    value,
                    selectedSeason,
                    setSelectedSeason,
                    setOpenSeason
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSeason === season ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {season}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Type Filter */}
      <Popover open={openType} onOpenChange={setOpenType}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openType}
            className="w-[140px] justify-between"
          >
            {selectedType || "Type"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[140px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {TYPES.map((type) => (
                <CommandItem
                  key={type}
                  value={type}
                  onSelect={(value) => handleSelection(
                    'type',
                    value,
                    selectedType,
                    setSelectedType,
                    setOpenType
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedType === type ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {type}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Color Filter */}
      <Popover open={openColor} onOpenChange={setOpenColor}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openColor}
            className="w-[140px] justify-between"
          >
            {selectedColor || "Color"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[140px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {COLORS.map((color) => (
                <CommandItem
                  key={color}
                  value={color}
                  onSelect={(value) => handleSelection(
                    'color',
                    value,
                    selectedColor,
                    setSelectedColor,
                    setOpenColor
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedColor === color ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-200" 
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear Filters Button */}
      {(selectedSeason || selectedType || selectedColor) && (
        <Button
          variant="ghost"
          className="h-10"
          onClick={() => {
            setSelectedSeason(null)
            setSelectedType(null)
            setSelectedColor(null)
            onFilterChange('season', null)
            onFilterChange('type', null)
            onFilterChange('color', null)
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}