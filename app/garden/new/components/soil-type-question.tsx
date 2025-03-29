"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

interface SoilTypeQuestionProps {
  data: string[]
  updateData: (data: string[]) => void
}

export default function SoilTypeQuestion({ data, updateData }: SoilTypeQuestionProps) {
  const [selectedSoilTypes, setSelectedSoilTypes] = useState<string[]>(data || [])

  const soilTypes = [
    {
      id: "clay",
      name: "Clay Soil",
      description: "Sticky when wet, hard when dry. Holds nutrients well but drains poorly.",
      image: "/img/clay.jpg",
    },
    {
      id: "loam",
      name: "Loam Soil",
      description: "Perfect balance of sand, silt, and clay. Ideal for most plants.",
      image: "/img/loam.jpg",
    },
    {
      id: "sandy",
      name: "Sandy Soil",
      description: "Gritty texture, drains quickly but doesn't hold nutrients well.",
      image: "/img/sand.jpeg",
    },
    {
      id: "silt",
      name: "Silt Soil",
      description: "Smooth and slippery when wet, holds moisture and nutrients well.",
      image: "/img/silt.jpg",
    },
    {
      id: "peat",
      name: "Peat Soil",
      description: "Made up of partially degraded plant matter, rich in nutrients and soaks up water.",
      image: "/img/peat.jpg",
    },
    {
      id: "chalky",
      name: "Chalky Soil",
      description: "Rocky, free-draining soil with little nutrients.",
      image: "/img/chalk.jpg",
    },
  ]

  // With this approach that only updates when needed:
  const handleSoilTypeToggle = (soilType: string) => {
    const newSelectedTypes = selectedSoilTypes.includes(soilType)
      ? selectedSoilTypes.filter((type) => type !== soilType)
      : [...selectedSoilTypes, soilType]

    setSelectedSoilTypes(newSelectedTypes)
    updateData(newSelectedTypes)
  }

  // And update the toggleSoilType function to use this new handler
  const toggleSoilType = (soilType: string) => {
    handleSoilTypeToggle(soilType)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What soil type is in your garden?</h2>
        <p className="text-muted-foreground">
          Select all soil types present in your garden. This will help us recommend plants that will thrive in your soil
          conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {soilTypes.map((soil) => (
          <div
            key={soil.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedSoilTypes.includes(soil.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => toggleSoilType(soil.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={`soil-${soil.id}`}
                checked={selectedSoilTypes.includes(soil.id)}
                onCheckedChange={() => toggleSoilType(soil.id)}
              />
              <div className="space-y-2">
                <Label htmlFor={`soil-${soil.id}`} className="font-medium cursor-pointer">
                  {soil.name}
                </Label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-[200px] h-[200px] relative">
                    {soil.id === 'sandy' && (
                      <Image
                        src="/img/sand.jpeg"
                        alt={soil.name}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover' }}
                        className="rounded-md border"
                      />
                    )}
                    {soil.id === 'chalky' && (
                      <Image
                        src="/img/chalk.jpg"
                        alt={soil.name}
                        width={150}
                        height={150}
                        style={{ objectFit: 'cover' }}
                        className="rounded-md border"
                      />
                    )}
                    {soil.id !== 'sandy' && soil.id !== 'chalky' && (
                      <Image
                        src={`/img/${soil.id}.jpg`}
                        alt={soil.name}
                        width={150}
                        height={150}
                        style={{ objectFit: 'fill' }}
                        className="rounded-md border"
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{soil.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSoilTypes.length === 0 && (
        <p className="text-amber-600 text-sm">Please select at least one soil type to continue.</p>
      )}

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">How to identify your soil type:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Take a handful of moist soil and squeeze it.</li>
          <li>If it holds shape but crumbles when poked, it's likely loam.</li>
          <li>If it forms a sticky ball that doesn't crumble easily, it's clay.</li>
          <li>If it falls apart easily and feels gritty, it's sandy.</li>
          <li>If it feels smooth and silky, it's likely silt.</li>
        </ol>
      </div>
    </div>
  )
}

