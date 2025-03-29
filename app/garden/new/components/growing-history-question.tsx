"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface GrowingHistoryProps {
  data: {
    hasHistory: string
    plants: string[]
    yearsAgo: number
  }
  updateData: (data: {
    hasHistory: string
    plants: string[]
    yearsAgo: number
  }) => void
}

export default function GrowingHistoryQuestion({ data, updateData }: GrowingHistoryProps) {
  const [hasHistory, setHasHistory] = useState(data.hasHistory || "no")
  const [plants, setPlants] = useState(data.plants.join(", ") || "")
  const [yearsAgo, setYearsAgo] = useState(data.yearsAgo || 1)

  // With these individual handlers:
  const handleHistoryChange = (value: string) => {
    setHasHistory(value)
    updateData({
      hasHistory: value,
      plants: plants
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== ""),
      yearsAgo,
    })
  }

  const handlePlantsChange = (value: string) => {
    setPlants(value)
    if (hasHistory === "yes") {
      updateData({
        hasHistory,
        plants: value
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),
        yearsAgo,
      })
    }
  }

  const handleYearsChange = (value: number) => {
    setYearsAgo(value)
    if (hasHistory === "yes") {
      updateData({
        hasHistory,
        plants: plants
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),
        yearsAgo: value,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Is there any previous growing history in the plot?</h2>
        <p className="text-muted-foreground">
          This information helps us understand your garden's history and make better recommendations for crop rotation
          and soil health.
        </p>
      </div>

      <RadioGroup value={hasHistory} onValueChange={handleHistoryChange} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no-history" />
          <Label htmlFor="no-history">No, this is a new garden plot</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="unknown" id="unknown-history" />
          <Label htmlFor="unknown-history">Unknown, I'm not sure what was grown here before</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes-history" />
          <Label htmlFor="yes-history">Yes, plants have been grown here before</Label>
        </div>
      </RadioGroup>

      {hasHistory === "yes" && (
        <div className="space-y-4 pl-6 border-l-2 border-primary/20">
          <div className="space-y-2">
            <Label htmlFor="plants-grown">What types of plants were grown here?</Label>
            <Textarea
              id="plants-grown"
              placeholder="E.g., tomatoes, peppers, basil, etc."
              value={plants}
              onChange={(e) => handlePlantsChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years-ago">How many years ago?</Label>
            <Input
              id="years-ago"
              type="number"
              min={1}
              max={20}
              value={yearsAgo}
              onChange={(e) => handleYearsChange(Number.parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
      )}

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Why this matters:</h3>
        <p className="text-sm text-muted-foreground">
          Knowing what was previously grown in your garden helps prevent soil depletion and disease. Some plants should
          not be grown in the same soil for consecutive seasons, while others can actually improve soil health for
          future plantings.
        </p>
      </div>
    </div>
  )
}

