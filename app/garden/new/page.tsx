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
  const totalSteps = 6

  // Define types for garden data
  type GardenData = {
    location: {
      zipcode: string;
      growingZone: string;
    };
    soilTypes: string[];
    growingHistory: {
      hasHistory: string;
      plants: string[];
      yearsAgo: number;
    };
    construction: {
      isConstructed: boolean;
      hasTrellis: boolean;
      hasFence: boolean;
      hasRaisedBed: boolean;
      hasIrrigation: boolean;
      hasWeedScreen: boolean;
    };
    plotDetails: {
      unit: string;
      width: number;
      height: number;
    };
    gardenTypes: string[];
    plantPreferences: {
      wanted: string[];
      unwanted: string[];
    };
  }

  // State to store all answers
  const [gardenData, setGardenData] = useState<GardenData>({
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
  const updateGardenData = (stepData: Partial<GardenData>) => {
    setGardenData(prev => ({
      ...prev,
      ...stepData
    }))
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
            <GardenTypeQuestion
              data={gardenData.gardenTypes}
              updateData={(data) => updateGardenData({ gardenTypes: data })}
            />
          )}

          {currentStep === 6 && (
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
