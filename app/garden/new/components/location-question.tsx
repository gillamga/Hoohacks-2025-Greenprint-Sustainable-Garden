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
      // Call the Plant Hardiness Zone API to get the growing zone
      const response = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === this.DONE) {
            if (this.status === 200) {
              resolve(this.responseText);
            } else {
              reject(new Error(`API request failed with status ${this.status}`));
            }
          }
        });

        xhr.open('GET', `https://plant-hardiness-zone.p.rapidapi.com/zipcodes/${zipcode}`);
        
        // Use environment variables for API credentials
        const apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
        const apiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'plant-hardiness-zone.p.rapidapi.com';
        
        if (!apiKey) {
          console.error('API key not found. Please set NEXT_PUBLIC_RAPIDAPI_KEY in your .env.local file');
          reject(new Error('API key not configured'));
          return;
        }
        
        xhr.setRequestHeader('x-rapidapi-key', apiKey);
        xhr.setRequestHeader('x-rapidapi-host', apiHost);

        xhr.send(null);
      });

      // Parse the response to get the zone information
      const responseData = JSON.parse(response);
      
      if (responseData && responseData.hardiness_zone) {
        setGrowingZone(responseData.hardiness_zone);
        setSuccess(true);
        return true;
      } else {
        throw new Error("Could not determine growing zone from API response");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch growing zone. Please try again.");
      return false;
    } finally {
      setLoading(false);
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
