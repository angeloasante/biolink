'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onSave: (croppedImageBlob: Blob) => void
  onCancel: () => void
  aspectRatio?: number // 1 for circle/square
}

export default function ImageCropper({ 
  imageSrc, 
  onSave, 
  onCancel,
  aspectRatio = 1 
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  const CROP_SIZE = 280 // Size of the crop area

  // Handle image load
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return
    
    const img = imageRef.current
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    
    // Calculate initial scale to fit image in crop area
    const scaleX = CROP_SIZE / naturalWidth
    const scaleY = CROP_SIZE / naturalHeight
    const initialScale = Math.max(scaleX, scaleY) * 1.2 // Slightly larger to allow movement
    
    setScale(initialScale)
    setImageSize({ width: naturalWidth, height: naturalHeight })
    setImageLoaded(true)
    
    // Center the image
    setPosition({ x: 0, y: 0 })
  }, [])

  // Mouse/Touch handlers for dragging
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true)
    setDragStart({ x: clientX - position.x, y: clientY - position.y })
  }, [position])

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !imageRef.current) return
    
    const newX = clientX - dragStart.x
    const newY = clientY - dragStart.y
    
    // Calculate boundaries
    const scaledWidth = imageSize.width * scale
    const scaledHeight = imageSize.height * scale
    const maxX = Math.max(0, (scaledWidth - CROP_SIZE) / 2)
    const maxY = Math.max(0, (scaledHeight - CROP_SIZE) / 2)
    
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    })
  }, [isDragging, dragStart, scale, imageSize])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
    }
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Zoom handlers
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    const minScale = Math.max(CROP_SIZE / imageSize.width, CROP_SIZE / imageSize.height)
    setScale(prev => Math.max(prev / 1.2, minScale))
  }

  const handleReset = () => {
    const scaleX = CROP_SIZE / imageSize.width
    const scaleY = CROP_SIZE / imageSize.height
    const initialScale = Math.max(scaleX, scaleY) * 1.2
    setScale(initialScale)
    setPosition({ x: 0, y: 0 })
  }

  // Handle wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.95 : 1.05
    const minScale = Math.max(CROP_SIZE / imageSize.width, CROP_SIZE / imageSize.height)
    setScale(prev => Math.max(Math.min(prev * delta, 5), minScale))
  }, [imageSize])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  // Crop and save the image
  const handleSave = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const outputSize = 400 // Output image size
    canvas.width = outputSize
    canvas.height = outputSize

    const img = imageRef.current
    const scaledWidth = imageSize.width * scale
    const scaledHeight = imageSize.height * scale

    // Calculate the crop area in the original image coordinates
    const cropCenterX = (scaledWidth / 2) - position.x
    const cropCenterY = (scaledHeight / 2) - position.y
    
    const sourceX = (cropCenterX - (CROP_SIZE / 2)) / scale
    const sourceY = (cropCenterY - (CROP_SIZE / 2)) / scale
    const sourceSize = CROP_SIZE / scale

    // Draw circular clip
    ctx.beginPath()
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()

    // Draw the cropped image
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    )

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob)
      }
    }, 'image/jpeg', 0.9)
  }, [imageSize, scale, position, onSave])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="bg-[#111] rounded-3xl p-6 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Adjust Photo</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Crop Area */}
        <div 
          ref={containerRef}
          className="relative w-[280px] h-[280px] mx-auto mb-6 overflow-hidden rounded-full cursor-move bg-black"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Circular mask overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 280 280">
              <defs>
                <mask id="circleMask">
                  <rect width="280" height="280" fill="white" />
                  <circle cx="140" cy="140" r="140" fill="black" />
                </mask>
              </defs>
              <rect 
                width="280" 
                height="280" 
                fill="rgba(0,0,0,0.6)" 
                mask="url(#circleMask)" 
              />
              <circle 
                cx="140" 
                cy="140" 
                r="139" 
                fill="none" 
                stroke="rgba(34, 197, 94, 0.8)" 
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Image */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={handleImageLoad}
              className="max-w-none select-none"
              style={{
                width: imageSize.width * scale,
                height: imageSize.height * scale,
                opacity: imageLoaded ? 1 : 0,
              }}
              draggable={false}
            />
          </div>

          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-500 text-sm mb-4">
          Drag to reposition • Scroll to zoom
        </p>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button 
            onClick={handleZoomOut}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-colors"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          
          <div className="flex-1 max-w-[150px]">
            <input
              type="range"
              min={Math.max(CROP_SIZE / imageSize.width, CROP_SIZE / imageSize.height) * 100 || 50}
              max={500}
              value={scale * 100}
              onChange={(e) => setScale(Number(e.target.value) / 100)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>
          
          <button 
            onClick={handleZoomIn}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleReset}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!imageLoaded}
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-400 rounded-xl font-semibold text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Apply
          </button>
        </div>

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
