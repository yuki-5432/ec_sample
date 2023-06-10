import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import TeleportationCanvas from '../components/Teleportation'
import { observe } from '../features/auth/authSlice'
import { auth } from '../firebase'
import hero from '../img/blank-notebook-on-creative-workspace.jpg'
import Morphing from '../libs/morphing'
import Ripple from '../libs/ripple'
import Exploding from '../components/Exploding'
import Distortion from '../components/Distortion'
import Gradient from '../components/Gradient'

const Home = () => {
  const user = useAppSelector((state) => state.auth.user)
  const login = useAppSelector((state) => state.auth.login)
  // const dispatch = useAppDispatch()

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // new Ripple(canvasRef)
    // new Morphing(canvasRef)
  }, [])

  // useEffect(() => {
  //   console.log('observe')
  //   dispatch(observe())
  //   console.log(auth.currentUser)
  // }, [dispatch])

  return (
    <section className="h-screen relative mt-[120px]">
      <Gradient />
      {/* <TeleportationCanvas /> */}

      {/* <Distortion /> */}
      {/* <Exploding /> */}
      {/* <div
        className="absolute top-0 left-0 w-full h-full z-0 bg-red"
        ref={canvasRef}
      ></div> */}
      <div className="absolute top-1/3 left-[10%] z-0">
        <h2 className="text-7xl font-bold text-white">HOME</h2>
        {login && user && (
          <dl>
            <dt>ユーザーID</dt>
            <dd>{user.uid}</dd>
            <dt>名前</dt>
            <dd>{user.displayName}</dd>
          </dl>
        )}
      </div>
      <img src={hero} alt="hero" className="w-full h-full object-cover" />
    </section>
  )
}

export default Home
