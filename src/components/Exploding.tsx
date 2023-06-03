import React, { useEffect, useRef } from 'react'
import ExplodingParticle from '../libs/explodingParticle'
import video from '../video/video-01.mp4'
import video2 from '../video/video-02.mp4'
import video3 from '../video/video-03.mp4'

const Exploding = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // console.log('exploding')
    new ExplodingParticle(canvasRef, videoRef, textRef)
  }, [])

  return (
    <div
      className="absolute top-0 left-0 z-10 bg-blue-300 w-full h-screen"
      ref={canvasRef}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[60%] aspect-[480/820]"
        ref={videoRef}
      >
        <video
          src={video}
          muted
          className="w-full h-full absolute inset-0"
        ></video>
        <video
          src={video2}
          muted
          className="w-full h-full absolute inset-0"
        ></video>
        <video
          src={video3}
          muted
          className="w-full h-full absolute inset-0"
        ></video>
      </div>
      <div
        ref={textRef}
        className="absolute top-3/4 left-0 -translate-y-1/2 z-[12] w-full text-white font-garamond text-8xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap">
          BLUE ROSE
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap">
          DANDELION
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-nowrap">
          SAKURA
        </div>
      </div>
    </div>
  )
}

export default Exploding
