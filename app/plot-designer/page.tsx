"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Trash2, Undo, Download, Grid, Sun, CloudRain } from "lucide-react"

export default function PlotDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gridSize, setGridSize] = useState(20) // Size of each grid cell in pixels
  const [plotName, setPlotName] = useState("My Garden Plot")
  const [drawingMode, setDrawingMode] = useState("plot") // plot, shade, soil
  const [plotHistory, setPlotHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })
  const [soilType, setSoilType] = useState("loam")

  // Colors for different drawing modes
  const colors = {
    plot: "#8B4513", // Brown for plot
    shade: "#A9A9A9", // Dark gray for shade
    soil: {
      clay: "#D2691E", // Clay soil
      loam: "#8B4513", // Loam soil
      sandy: "#F4A460", // Sandy soil
      silt: "#D2B48C", // Silt soil
    },
    eraser: "#FFFFFF", // White for eraser
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // Fill with white background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    drawGrid(ctx)

    // Save initial state
    const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setPlotHistory([initialState])
    setCurrentStep(0)
  }, [canvasSize])

  // Draw grid on canvas
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#DDDDDD"
    ctx.lineWidth = 0.5

    // Draw vertical lines
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasSize.height)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasSize.width, y)
      ctx.stroke()
    }
  }

  // Handle mouse drawing
  const [isDrawing, setIsDrawing] = useState(false)

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)

    // Save current state to history
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Remove any states after current step if we've gone back in history
    const newHistory = plotHistory.slice(0, currentStep + 1)
    setPlotHistory([...newHistory, currentState])
    setCurrentStep(newHistory.length)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / gridSize) * gridSize
    const y = Math.floor((e.clientY - rect.top) / gridSize) * gridSize

    // Set color based on drawing mode
    if (drawingMode === "soil") {
      ctx.fillStyle = colors.soil[soilType as keyof typeof colors.soil]
    } else if (drawingMode === "eraser") {
      ctx.fillStyle = colors.eraser
    } else {
      ctx.fillStyle = colors[drawingMode as keyof typeof colors]
    }

    // Draw a grid cell
    ctx.fillRect(x, y, gridSize, gridSize)

    // Redraw grid lines
    drawGrid(ctx)
  }

  // Undo last action
  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.putImageData(plotHistory[currentStep - 1], 0, 0)
    }
  }

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawGrid(ctx)

    // Save cleared state
    const clearedState = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setPlotHistory([clearedState])
    setCurrentStep(0)
  }

  // Save plot data
  const savePlotData = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get plot data as base64 image
    const plotImage = canvas.toDataURL("image/png")

    // Create plot data object
    const plotData = {
      name: plotName,
      image: plotImage,
      width: canvasSize.width,
      height: canvasSize.height,
      gridSize,
      timestamp: new Date().toISOString(),
    }

    // In a real app, you would send this to your backend
    // For now, we'll just log it and save to localStorage
    console.log("Plot data:", plotData)

    try {
      localStorage.setItem(`garden-plot-${Date.now()}`, JSON.stringify(plotData))
      alert("Plot saved successfully!")
    } catch (error) {
      console.error("Error saving plot:", error)
      alert("Failed to save plot. Please try again.")
    }

    // In a real implementation, you would do something like:
    // const response = await fetch('/api/save-plot', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(plotData),
    // })
  }

  // Download plot as image
  const downloadPlot = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `${plotName.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = dataUrl
    link.click()
  }

  // Update canvas size
  const handleCanvasSizeChange = (dimension: "width" | "height", value: number[]) => {
    setCanvasSize((prev) => ({
      ...prev,
      [dimension]: value[0],
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Garden Plot Designer</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{plotName}</CardTitle>
              <CardDescription>Draw your garden plot on the grid below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-1 bg-white overflow-auto">
                <canvas
                  ref={canvasRef}
                  className="cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleUndo} disabled={currentStep <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={downloadPlot}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={savePlotData}>
                <Save className="h-4 w-4 mr-2" />
                Save Plot
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Plot Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="plot-name">Plot Name</Label>
                <Input
                  id="plot-name"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="My Garden Plot"
                />
              </div>

              <div className="space-y-2">
                <Label>Canvas Size</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Width: {canvasSize.width}px</span>
                    </div>
                    <Slider
                      value={[canvasSize.width]}
                      min={300}
                      max={1200}
                      step={50}
                      onValueChange={(value) => handleCanvasSizeChange("width", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Height: {canvasSize.height}px</span>
                    </div>
                    <Slider
                      value={[canvasSize.height]}
                      min={200}
                      max={800}
                      step={50}
                      onValueChange={(value) => handleCanvasSizeChange("height", value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grid Size</Label>
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  <span>{gridSize}px</span>
                </div>
                <Slider
                  value={[gridSize]}
                  min={10}
                  max={50}
                  step={5}
                  onValueChange={(value) => setGridSize(value[0])}
                />
              </div>

              <Tabs defaultValue="plot" onValueChange={(value) => setDrawingMode(value)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="plot">Plot</TabsTrigger>
                  <TabsTrigger value="shade">Shade</TabsTrigger>
                  <TabsTrigger value="soil">Soil</TabsTrigger>
                  <TabsTrigger value="eraser">Eraser</TabsTrigger>
                </TabsList>
                <TabsContent value="plot">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#8B4513]"></div>
                      <span>Draw your garden plot boundaries</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="shade">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>Mark shaded areas in your garden</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="soil">
                  <div className="p-4 border rounded-md mt-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4" />
                      <span>Mark different soil types</span>
                    </div>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay Soil</SelectItem>
                        <SelectItem value="loam">Loam Soil</SelectItem>
                        <SelectItem value="sandy">Sandy Soil</SelectItem>
                        <SelectItem value="silt">Silt Soil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="eraser">
                  <div className="p-4 border rounded-md mt-2">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Erase parts of your drawing</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

