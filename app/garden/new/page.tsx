"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import LocationQuestion from "./components/location-question"
import SoilTypeQuestion from "./components/soil-type-question"
import GrowingHistoryQuestion from "./components/growing-history-question"
import ConstructionQuestion from "./components/construction-question"
import GardenTypeQuestion from "./components/garden-type-question"
import PlantPreferencesQuestion from "./components/plant-preferences-question"

export default function NewGardenQuestionnaire() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 7

  // State to store all answers
  const [gardenData, setGardenData] = useState({
    location: {
      zipcode: "",
      growingZone: "",
    },
    soilTypes: [],
    growingHistory: {
      hasHistory: "no",
      plants: [],
      yearsAgo: 0,
    },
    construction: {
      isConstructed: false,
      hasTrellis: false,
      hasFence: false,
      hasRaisedBed: false,
      hasIrrigation: false,
      hasWeedScreen: false,
    },
    plotDetails: {
      unit: "feet",
      width: 10,
      height: 10,
    },
    gardenTypes: [],
    plantPreferences: {
      wanted: [],
      unwanted: [],
    },
  })

  // Update garden data based on step
  const updateGardenData = (stepData: any) => {
    // Only update if the data has actually changed
    setGardenData((prev) => {
      // Create a shallow copy of the previous state
      const newState = { ...prev }

      // Update only the specific properties that changed
      Object.keys(stepData).forEach((key) => {
        newState[key] = stepData[key]
      })

      return newState
    })
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - proceed to plot designer with all the data
      router.push(`/plot-designer?data=${encodeURIComponent(JSON.stringify(gardenData))}`)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Design Your Garden</CardTitle>
          <CardDescription>
            Answer a few questions to help us create the perfect sustainable garden for you
          </CardDescription>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>

        <CardContent>
          {currentStep === 1 && (
            <LocationQuestion data={gardenData.location} updateData={(data) => updateGardenData({ location: data })} />
          )}

          {currentStep === 2 && (
            <SoilTypeQuestion
              data={gardenData.soilTypes}
              updateData={(data) => updateGardenData({ soilTypes: data })}
            />
          )}

          {currentStep === 3 && (
            <GrowingHistoryQuestion
              data={gardenData.growingHistory}
              updateData={(data) => updateGardenData({ growingHistory: data })}
            />
          )}

          {currentStep === 4 && (
            <ConstructionQuestion
              data={gardenData.construction}
              updateData={(data) => updateGardenData({ construction: data })}
            />
          )}

          {currentStep === 5 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Plot Design</h2>
              <p className="mb-4">Now let's design your garden plot layout.</p>
              <Button onClick={handleNext}>Continue to Plot Designer</Button>
            </div>
          )}

          {currentStep === 6 && (
            <GardenTypeQuestion
              data={gardenData.gardenTypes}
              updateData={(data) => updateGardenData({ gardenTypes: data })}
            />
          )}

          {currentStep === 7 && (
            <PlantPreferencesQuestion
              data={gardenData.plantPreferences}
              gardenTypes={gardenData.gardenTypes}
              updateData={(data) => updateGardenData({ plantPreferences: data })}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>

          <Button onClick={handleNext}>{currentStep === totalSteps ? "Finish" : "Next"}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

