"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MapPin, CheckCircle } from "lucide-react"

interface LocationQuestionProps {
  data: {
    zipcode: string
    growingZone: string
  }
  updateData: (data: { zipcode: string; growingZone: string }) => void
}

export default function LocationQuestion({ data, updateData }: LocationQuestionProps) {
  const [zipcode, setZipcode] = useState(data.zipcode)
  const [growingZone, setGrowingZone] = useState(data.growingZone)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Validate zipcode and fetch growing zone
  const validateZipcode = async () => {
    // Basic validation
    if (!/^\d{5}$/.test(zipcode)) {
      setError("Please enter a valid 5-digit US zipcode")
      return false
    }

    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call your API
      // For now, we'll simulate an API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock growing zone data based on zipcode
      // In a real app, this would come from your USDA API
      const mockZones: Record<string, string> = {
        "90210": "10a",
        "10001": "7b",
        "60601": "6a",
        "98101": "8b",
        "33101": "10b",
      }

      const zone = mockZones[zipcode] || `${Math.floor(Math.random() * 9) + 1}${Math.random() > 0.5 ? "a" : "b"}`

      setGrowingZone(zone)
      setSuccess(true)
      return true
    } catch (err) {
      setError("Failed to fetch growing zone. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  // With this approach that only updates when values are confirmed:
  const handleZipcodeConfirm = async () => {
    const success = await validateZipcode()
    if (success) {
      updateData({ zipcode, growingZone })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Where is your garden located?</h2>
        <p className="text-muted-foreground">
          We'll use your zipcode to determine your USDA hardiness growing zone and provide plant recommendations
          suitable for your climate.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zipcode">Enter your zipcode</Label>
          <div className="flex gap-2">
            <Input
              id="zipcode"
              placeholder="Enter US zipcode"
              value={zipcode}
              onChange={(e) => {
                setZipcode(e.target.value)
                setSuccess(false)
                setError(null)
              }}
              maxLength={5}
              className="flex-1"
            />
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2"
              onClick={handleZipcodeConfirm}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {loading ? "Finding..." : "Find Zone"}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && growingZone && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Growing Zone Found!</span>
              </div>
              <p>
                Your USDA Hardiness Zone is: <span className="font-bold text-lg">{growingZone}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This information will help us recommend plants that will thrive in your climate.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

