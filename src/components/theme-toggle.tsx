"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  isDarkMode: boolean
  onToggle: () => void
  className?: string
}

export function ThemeToggle({ isDarkMode, onToggle, className }: ThemeToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Sun className={cn("h-4 w-4 transition-all", isDarkMode ? "text-gray-400" : "text-yellow-500")} />
      <Switch
        checked={isDarkMode}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-yellow-100"
      />
      <Moon className={cn("h-4 w-4 transition-all", isDarkMode ? "text-blue-400" : "text-gray-400")} />
    </div>
  )
}

// Alternative button-style toggle
export function ThemeToggleButton({ isDarkMode, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 hover:scale-110 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-30",
        isDarkMode
          ? "text-white hover:text-white"
          : "text-black hover:text-black",
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      {isDarkMode ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </button>
  )
}
