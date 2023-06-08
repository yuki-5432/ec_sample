import React, { Fragment, useEffect, useRef } from 'react'
import img1 from '../img/distortion/lonely-814631_640.jpg'
import img2 from '../img/distortion/people-2603521_640.jpg'
import img3 from '../img/distortion/woman-1107329_640.jpg'
import img4 from '../img/distortion/woman-2564660_640.jpg'
import img5 from '../img/distortion/woman-531252_640.jpg'
import img6 from '../img/distortion/young-woman-4266712_640.jpg'
import DistortionCanvas from '../libs/DistortionCanvas'
import Lenis from '@studio-freight/lenis'

const Distortion = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const imgList = [img1, img2, img3, img4, img5, img6]
  const imgListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.2,
      easing: (n) => {
        return 1 - (1 - n) * (1 - n)
      },
    })

    const canvas = new DistortionCanvas(canvasRef, imgListRef, lenis.animate.to)

    lenis.on('scroll', (e: any) => {
      console.log(e)
      canvas.to = e.animate.to
    })

    const raf = (time: any) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <Fragment>
      <div
        className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none"
        ref={canvasRef}
      ></div>
      <div className="relative top-0 left-0 z-0 bg-red-200 w-full py-20 max-w-5xl px-6 mx-auto">
        <div className="grid grid-cols-2 gap-12" ref={imgListRef}>
          {imgList.map((src) => {
            return (
              <div
                key={src}
                data-src={src}
                className="w-full aspect-[4/3]"
              ></div>
            )
          })}
        </div>
      </div>
    </Fragment>
  )
}

export default Distortion
