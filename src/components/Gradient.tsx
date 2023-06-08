import React, { useEffect, useRef } from 'react'

const Gradient = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(canvasRef)
  }, [])

  return <div className="w-full h-screen bg-red-500" ref={canvasRef}></div>
}

export default Gradient
