"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Leaf, Apple, Flower } from "lucide-react"

interface GardenTypeQuestionProps {
  data: string[]
  updateData: (data: string[]) => void
}

export default function GardenTypeQuestion({ data, updateData }: GardenTypeQuestionProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(data || [])

  const gardenTypes = [
    {
      id: "herb",
      name: "Herb Garden",
      description: "Culinary and medicinal herbs for cooking and wellness",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
    },
    {
      id: "food",
      name: "Fruit & Vegetable Garden",
      description: "Edible plants for sustainable food production",
      icon: <Apple className="h-8 w-8 text-red-500" />,
    },
    {
      id: "pollinator",
      name: "Pollinator Garden",
      description: "Flowers and plants that attract and support beneficial insects",
      icon: <Flower className="h-8 w-8 text-purple-500" />,
    },
  ]

  const handleGardenTypeToggle = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type]

    setSelectedTypes(newSelectedTypes)
    updateData(newSelectedTypes)
  }

  // Update the toggleGardenType function
  const toggleGardenType = (type: string) => {
    handleGardenTypeToggle(type)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What type of garden do you want to create?</h2>
        <p className="text-muted-foreground">
          Select all that apply. You can create a garden that combines multiple purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gardenTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-6 cursor-pointer transition-colors ${
              selectedTypes.includes(type.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => toggleGardenType(type.id)}
          >
            <div className="flex items-center gap-4">
              <div className="shrink-0">{type.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`type-${type.id}`} className="text-lg font-medium cursor-pointer">
                    {type.name}
                  </Label>
                  <Checkbox
                    id={`type-${type.id}`}
                    checked={selectedTypes.includes(type.id)}
                    onCheckedChange={() => toggleGardenType(type.id)}
                  />
                </div>
                <p className="text-muted-foreground mt-1">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTypes.length === 0 && (
        <p className="text-amber-600 text-sm">Please select at least one garden type to continue.</p>
      )}

      <Separator />

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Benefits of Mixed Gardens:</h3>
        <p className="text-sm text-muted-foreground">
          Combining different garden types can create a more balanced ecosystem. For example, pollinator plants can
          improve fruit and vegetable yields, while herbs can repel pests naturally, reducing the need for chemical
          interventions.
        </p>
      </div>
    </div>
  )
}

