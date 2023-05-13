import React, { useEffect, useLayoutEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { observe } from '../features/auth/authSlice'
import { auth } from '../firebase'
import hero from '../img/blank-notebook-on-creative-workspace.jpg'

const Home = () => {
  const user = useAppSelector((state) => state.auth.user)
  const login = useAppSelector((state) => state.auth.login)
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   console.log('observe')
  //   dispatch(observe())
  //   console.log(auth.currentUser)
  // }, [dispatch])
  return (
    <section className="h-screen relative">
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
