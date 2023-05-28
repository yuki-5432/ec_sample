import React, { Fragment, useEffect, useRef } from 'react'
import Teleportation from '../libs/teleportation'

const TeleportationCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    new Teleportation(canvasRef)
  }, [])

  return (
    <Fragment>
      <div
        id="list"
        className="bg-white w-fit px-4 text-4xl font-bold relative z-[11] text-left"
      ></div>
      <div
        className="absolute top-0 left-0 z-10 w-full h-screen bg-slate-500 text-white"
        ref={canvasRef}
      >
        Teleportation
      </div>
    </Fragment>
  )
}

export default TeleportationCanvas
