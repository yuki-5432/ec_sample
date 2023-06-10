import React, { useEffect, useRef } from 'react'
import GradientCanvas from '../libs/gradientCanvas'

const Gradient = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    new GradientCanvas(canvasRef)
  }, [])

  return <div className="w-full h-screen bg-white" ref={canvasRef}></div>
}

export default Gradient
