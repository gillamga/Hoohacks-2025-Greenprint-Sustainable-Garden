import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Grid3X3, Sprout, Droplets } from "lucide-react"

export default function Home() {
  return (
    <main className="container mx-auto py-6">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">Sustainable Garden Planner</h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          Design your garden with sustainability in mind. Optimize for local conditions, reduce water usage, and create
          a thriving ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Leaf className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Design Your Garden</CardTitle>
            <CardDescription>Create a custom garden plan based on your space and needs</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Draw your garden plot, mark shaded areas, and identify soil types to get personalized recommendations for
              sustainable gardening.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/plot-designer" className="w-full">
              <Button className="w-full">
                <Grid3X3 className="mr-2 h-4 w-4" />
                Start Designing
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Sprout className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Plant Recommendations</CardTitle>
            <CardDescription>Get plant suggestions based on your garden conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our system recommends plants that thrive in your conditions while promoting biodiversity and reducing
              resource consumption.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Droplets className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Resource Management</CardTitle>
            <CardDescription>Track water usage and maintain a sustainable garden</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Log your watering and fertilizing activities, and get a sustainability score with suggestions for
              improvement.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

