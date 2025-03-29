"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface ConstructionQuestionProps {
  data: {
    isConstructed: boolean
    hasTrellis: boolean
    hasFence: boolean
    hasRaisedBed: boolean
    hasIrrigation: boolean
    hasWeedScreen: boolean
  }
  updateData: (data: {
    isConstructed: boolean
    hasTrellis: boolean
    hasFence: boolean
    hasRaisedBed: boolean
    hasIrrigation: boolean
    hasWeedScreen: boolean
  }) => void
}

export default function ConstructionQuestion({ data, updateData }: ConstructionQuestionProps) {
  const [isConstructed, setIsConstructed] = useState(data.isConstructed)
  const [hasTrellis, setHasTrellis] = useState(data.hasTrellis)
  const [hasFence, setHasFence] = useState(data.hasFence)
  const [hasRaisedBed, setHasRaisedBed] = useState(data.hasRaisedBed)
  const [hasIrrigation, setHasIrrigation] = useState(data.hasIrrigation)
  const [hasWeedScreen, setHasWeedScreen] = useState(data.hasWeedScreen)

  const handleConstructedChange = (value: string) => {
    const newValue = value === "yes"
    setIsConstructed(newValue)
    updateData({
      isConstructed: newValue,
      hasTrellis,
      hasFence,
      hasRaisedBed,
      hasIrrigation,
      hasWeedScreen,
    })
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newData = {
      isConstructed,
      hasTrellis,
      hasFence,
      hasRaisedBed,
      hasIrrigation,
      hasWeedScreen,
    }

    switch (feature) {
      case "trellis":
        setHasTrellis(checked)
        newData.hasTrellis = checked
        break
      case "fence":
        setHasFence(checked)
        newData.hasFence = checked
        break
      case "raised-bed":
        setHasRaisedBed(checked)
        newData.hasRaisedBed = checked
        break
      case "irrigation":
        setHasIrrigation(checked)
        newData.hasIrrigation = checked
        break
      case "weed-screen":
        setHasWeedScreen(checked)
        newData.hasWeedScreen = checked
        break
    }

    updateData(newData)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Is your garden already constructed?</h2>
        <p className="text-muted-foreground">
          Tell us about any existing garden infrastructure so we can provide appropriate recommendations.
        </p>
      </div>

      <RadioGroup value={isConstructed ? "yes" : "no"} onValueChange={handleConstructedChange} className="space-y-3">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="constructed-yes" />
          <Label htmlFor="constructed-yes">Yes, my garden is already set up</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="constructed-no" />
          <Label htmlFor="constructed-no">No, I'm starting from scratch</Label>
        </div>
      </RadioGroup>

      {isConstructed && (
        <div className="space-y-4 pl-6 border-l-2 border-primary/20">
          <h3 className="font-medium">What features does your garden have?</h3>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply to your current garden setup.</p>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trellis"
                checked={hasTrellis}
                onCheckedChange={(checked) => handleFeatureChange("trellis", checked === true)}
              />
              <Label htmlFor="trellis">Trellis or vertical supports</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="fence"
                checked={hasFence}
                onCheckedChange={(checked) => handleFeatureChange("fence", checked === true)}
              />
              <Label htmlFor="fence">Fence or barrier</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="raised-bed"
                checked={hasRaisedBed}
                onCheckedChange={(checked) => handleFeatureChange("raised-bed", checked === true)}
              />
              <Label htmlFor="raised-bed">Raised beds</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="irrigation"
                checked={hasIrrigation}
                onCheckedChange={(checked) => handleFeatureChange("irrigation", checked === true)}
              />
              <Label htmlFor="irrigation">Irrigation system</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="weed-screen"
                checked={hasWeedScreen}
                onCheckedChange={(checked) => handleFeatureChange("weed-screen", checked === true)}
              />
              <Label htmlFor="weed-screen">Weed barrier/screen</Label>
            </div>
          </div>
        </div>
      )}

      <Separator />

      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Sustainable Garden Infrastructure:</h3>
        <p className="text-sm text-muted-foreground">
          The right garden infrastructure can significantly reduce water usage, prevent soil erosion, and minimize the
          need for chemical interventions. We'll recommend sustainable options based on your garden's needs.
        </p>
      </div>
    </div>
  )
}

