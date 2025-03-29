"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ThumbsUp, ThumbsDown } from "lucide-react"

interface PlantPreferencesQuestionProps {
  data: {
    wanted: string[]
    unwanted: string[]
  }
  gardenTypes: string[]
  updateData: (data: {
    wanted: string[]
    unwanted: string[]
  }) => void
}

export default function PlantPreferencesQuestion({ data, gardenTypes, updateData }: PlantPreferencesQuestionProps) {
  const [wanted, setWanted] = useState<string[]>(data.wanted || [])
  const [unwanted, setUnwanted] = useState<string[]>(data.unwanted || [])
  const [newPlant, setNewPlant] = useState("")
  const [activeTab, setActiveTab] = useState("wanted")

  // Update parent component when selections change
  // Remove the useEffect that's causing the loop
  // Replace this:
  // useEffect(() => {
  //   updateData({
  //     wanted,
  //     unwanted
  //   })
  // }, [wanted, unwanted, updateData])

  // With these handlers:
  const handleAddPlant = () => {
    if (!newPlant.trim()) return

    let newWanted = [...wanted]
    let newUnwanted = [...unwanted]

    if (activeTab === "wanted") {
      if (!wanted.includes(newPlant) && !unwanted.includes(newPlant)) {
        newWanted = [...wanted, newPlant.trim()]
        setWanted(newWanted)
      }
    } else {
      if (!unwanted.includes(newPlant) && !wanted.includes(newPlant)) {
        newUnwanted = [...unwanted, newPlant.trim()]
        setUnwanted(newUnwanted)
      }
    }

    setNewPlant("")
    updateData({
      wanted: newWanted,
      unwanted: newUnwanted,
    })
  }

  const handleRemovePlant = (plant: string, list: "wanted" | "unwanted") => {
    let newWanted = [...wanted]
    let newUnwanted = [...unwanted]

    if (list === "wanted") {
      newWanted = wanted.filter((p) => p !== plant)
      setWanted(newWanted)
    } else {
      newUnwanted = unwanted.filter((p) => p !== plant)
      setUnwanted(newUnwanted)
    }

    updateData({
      wanted: newWanted,
      unwanted: newUnwanted,
    })
  }

  // Update the addPlant function
  const addPlant = () => {
    handleAddPlant()
  }

  // Update the removePlant function
  const removePlant = (plant: string, list: "wanted" | "unwanted") => {
    handleRemovePlant(plant, list)
  }

  // Get suggested plants based on garden type
  const getSuggestedPlants = () => {
    const suggestions: Record<string, string[]> = {
      herb: ["Basil", "Mint", "Rosemary", "Thyme", "Cilantro", "Parsley", "Sage", "Oregano"],
      food: ["Tomatoes", "Peppers", "Cucumbers", "Lettuce", "Carrots", "Strawberries", "Blueberries", "Zucchini"],
      pollinator: [
        "Lavender",
        "Sunflowers",
        "Bee Balm",
        "Coneflower",
        "Black-eyed Susan",
        "Butterfly Bush",
        "Milkweed",
      ],
    }

    let result: string[] = []
    gardenTypes.forEach((type) => {
      if (suggestions[type]) {
        result = [...result, ...suggestions[type]]
      }
    })

    // Remove duplicates and already selected plants
    return [...new Set(result)].filter((p) => !wanted.includes(p) && !unwanted.includes(p))
  }

  const suggestedPlants = getSuggestedPlants()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Plant Preferences</h2>
        <p className="text-muted-foreground">
          Tell us which plants you want in your garden and which ones you'd prefer to avoid.
        </p>
      </div>

      <Tabs defaultValue="wanted" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wanted" className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Plants I Want
          </TabsTrigger>
          <TabsTrigger value="unwanted" className="flex items-center gap-2">
            <ThumbsDown className="h-4 w-4" />
            Plants to Avoid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wanted" className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a plant you want in your garden"
              value={newPlant}
              onChange={(e) => setNewPlant(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlant()}
            />
            <Button onClick={addPlant} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[100px]">
            {wanted.length > 0 ? (
              wanted.map((plant) => (
                <Badge key={plant} variant="secondary" className="px-3 py-1 text-sm">
                  {plant}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removePlant(plant, "wanted")} />
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No plants added yet. Add plants you'd like to grow.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unwanted" className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a plant you want to avoid"
              value={newPlant}
              onChange={(e) => setNewPlant(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlant()}
            />
            <Button onClick={addPlant} type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[100px]">
            {unwanted.length > 0 ? (
              unwanted.map((plant) => (
                <Badge key={plant} variant="outline" className="px-3 py-1 text-sm">
                  {plant}
                  <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removePlant(plant, "unwanted")} />
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No plants added yet. Add plants you'd prefer to avoid.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {suggestedPlants.length > 0 && (
        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-medium mb-2">Suggested Plants:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPlants.slice(0, 8).map((plant) => (
              <Badge
                key={plant}
                variant="secondary"
                className="px-3 py-1 text-sm cursor-pointer hover:bg-secondary/80"
                onClick={() => {
                  setNewPlant(plant)
                  setActiveTab("wanted")
                }}
              >
                {plant}
                <Plus className="h-3 w-3 ml-2" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

