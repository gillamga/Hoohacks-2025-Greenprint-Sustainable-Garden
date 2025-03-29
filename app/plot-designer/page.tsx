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
import { Save, Trash2, Undo, Download, Grid, Sun, CloudRain, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PlotDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridSize = 20 // Size of each grid cell in pixels (constant)
  const [plotName, setPlotName] = useState("My Garden Plot")
  const [drawingMode, setDrawingMode] = useState("plot") // plot, shade, soil
  const [plotHistory, setPlotHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [canvasSize, setCanvasSize] = useState({ width: 30, height: 20 }) // Number of squares in width and height
  const [soilType, setSoilType] = useState("loam")
  const [unit, setUnit] = useState("feet")
  const [shadeType, setShadeType] = useState("partial")
  const { toast } = useToast()

  // Colors for different drawing modes
  const colors = {
    plot: "#8B4513", // Brown for plot
    shade: {
      full: "#4B4B4B", // Dark gray for full shade
      partial: "#A9A9A9", // Medium gray for partial shade
      "partial-sun": "#D3D3D3", // Light gray for partial sun
      "full-sun": "#FFFFE0", // Light yellow for full sun
    },
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

    // Set canvas size (convert from number of squares to pixels)
    canvas.width = canvasSize.width * gridSize
    canvas.height = canvasSize.height * gridSize

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

    const pixelWidth = canvasSize.width * gridSize
    const pixelHeight = canvasSize.height * gridSize

    // Draw vertical lines
    for (let x = 0; x <= pixelWidth; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, pixelHeight)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= pixelHeight; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(pixelWidth, y)
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
    } else if (drawingMode === "shade") {
      ctx.fillStyle = colors.shade[shadeType as keyof typeof colors.shade]
    } else if (drawingMode === "eraser") {
      ctx.fillStyle = colors.eraser
    } else if (drawingMode === "plot") {
      ctx.fillStyle = colors.plot
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

  // Check if plot is valid (each edge has at least one filled square)
  const isPlotValid = (): boolean => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const ctx = canvas.getContext("2d")
    if (!ctx) return false

    const pixelWidth = canvasSize.width * gridSize
    const pixelHeight = canvasSize.height * gridSize
    const imageData = ctx.getImageData(0, 0, pixelWidth, pixelHeight)
    const data = imageData.data
    
    // Check if a pixel is filled (not white)
    const isPixelFilled = (x: number, y: number): boolean => {
      const index = (y * pixelWidth + x) * 4
      // Check if not white (RGB values all 255)
      return !(data[index] === 255 && data[index + 1] === 255 && data[index + 2] === 255)
    }
    
    // Check top edge
    let topEdgeHasFilled = false
    for (let x = 0; x < pixelWidth; x += gridSize) {
      if (isPixelFilled(x + gridSize/2, gridSize/2)) {
        topEdgeHasFilled = true
        break
      }
    }
    
    // Check bottom edge
    let bottomEdgeHasFilled = false
    for (let x = 0; x < pixelWidth; x += gridSize) {
      if (isPixelFilled(x + gridSize/2, pixelHeight - gridSize/2)) {
        bottomEdgeHasFilled = true
        break
      }
    }
    
    // Check left edge
    let leftEdgeHasFilled = false
    for (let y = 0; y < pixelHeight; y += gridSize) {
      if (isPixelFilled(gridSize/2, y + gridSize/2)) {
        leftEdgeHasFilled = true
        break
      }
    }
    
    // Check right edge
    let rightEdgeHasFilled = false
    for (let y = 0; y < pixelHeight; y += gridSize) {
      if (isPixelFilled(pixelWidth - gridSize/2, y + gridSize/2)) {
        rightEdgeHasFilled = true
        break
      }
    }
    
    return topEdgeHasFilled && bottomEdgeHasFilled && leftEdgeHasFilled && rightEdgeHasFilled
  }

  // Save plot data
  const savePlotData = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Validate plot before saving
    if (!isPlotValid()) {
      toast({
        variant: "destructive",
        title: "Invalid Plot",
        description: "Please ensure each edge of your plot has at least one filled square."
      })
      return
    }

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
      toast({
        title: "Plot Saved",
        description: "Your garden plot has been saved successfully."
      })
    } catch (error) {
      console.error("Error saving plot:", error)
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save your plot. Please try again."
      })
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
                <Label>Canvas Size (in squares)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Width: {canvasSize.width} squares</span>
                    </div>
                    <Slider
                      value={[canvasSize.width]}
                      min={10}
                      max={60}
                      step={5}
                      onValueChange={(value) => handleCanvasSizeChange("width", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Height: {canvasSize.height} squares</span>
                    </div>
                    <Slider
                      value={[canvasSize.height]}
                      min={10}
                      max={40}
                      step={5}
                      onValueChange={(value) => handleCanvasSizeChange("height", value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Grid Size</Label>
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  <span>{gridSize}px (fixed)</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unit of Measurement</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="inches">Inches</SelectItem>
                  </SelectContent>
                </Select>
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
                  <div className="p-4 border rounded-md mt-2 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>Mark light conditions in your garden</span>
                    </div>
                    <Select value={shadeType} onValueChange={setShadeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select light condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Shade</SelectItem>
                        <SelectItem value="partial">Partial Shade</SelectItem>
                        <SelectItem value="partial-sun">Partial Sun</SelectItem>
                        <SelectItem value="full-sun">Full Sun</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-[#4B4B4B] mb-1"></div>
                        <span>Full Shade</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-[#A9A9A9] mb-1"></div>
                        <span>Partial Shade</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-[#D3D3D3] mb-1"></div>
                        <span>Partial Sun</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 bg-[#FFFFE0] mb-1"></div>
                        <span>Full Sun</span>
                      </div>
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
