import { List, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchOrderList } from '../features/auth/authSlice'
import Particle from '../libs/particle'

gsap.registerPlugin(ScrollTrigger)

const Order = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const orderList = useAppSelector((state) => state.auth.order)

  useEffect(() => {
    dispatch(fetchOrderList()).then(() => ScrollTrigger.refresh())
  }, [user])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lenis = new Lenis()
    lenis.options.duration = 1.0
    lenis.options.easing = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    lenis.on('scroll', (e: any) => {
      // console.log(e)
    })

    const raf = (time: any) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    window.addEventListener('scroll', (e: Event) => {
      console.log(window.scrollY)
    })

    gsap.utils
      .selector(containerRef.current)('div')
      .forEach((item) => {
        console.log(item)
        gsap.to(item, {
          backgroundColor: '#fff',
          duration: 1.0,
          ease: 'circ.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 50%',
          },
        })
      })
  }, [])

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    new Particle(canvasRef)
  }, [])

  return (
    <>
      <div className="h-[100vh]"></div>
      <div
        className="fixed top-0 left-0 w-full h-screen bg-blue-400 z-0"
        ref={canvasRef}
      ></div>
      <Box paddingY={10} component="section" zIndex={1} position="relative">
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" component="h2">
            注文履歴
          </Typography>
          {orderList && (
            <dl className="py-10 space-y-4 px-20">
              {orderList?.map((item) => (
                <>
                  <div className="flex justify-between">
                    <dt>注文番号</dt>
                    <dd>{item.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>合計</dt>
                    <dd>¥ {item.amount.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>注文番号</dt>
                    <dd>{item.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>注文番号</dt>
                    <dd>{item.id}</dd>
                  </div>
                </>
              ))}
            </dl>
          )}
        </Container>
      </Box>
      <div ref={containerRef} className="relative z-[1] opacity-10">
        <Box sx={{ height: '100vh', backgroundColor: '#00ff00' }}></Box>
        <Box sx={{ height: '100vh', backgroundColor: '#ff0000' }}></Box>
        <Box sx={{ height: '100vh', backgroundColor: '#0000ff' }}></Box>
        <Box sx={{ height: '100vh', backgroundColor: '#00ffff' }}></Box>
      </div>
    </>
  )
}

export default Order
