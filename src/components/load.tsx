import { CircularProgress } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../app/hooks'

const Load = () => {
  const loading = useAppSelector((state) => state.auth.loading)
  const load = useAppSelector((state) => state.load.load)

  return loading || load ? (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#000] bg-opacity-20 flex justify-center items-center duration-300 visible opacity-100">
      <CircularProgress />
    </div>
  ) : (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#000] bg-opacity-20 flex justify-center items-center duration-300 invisible opacity-0">
      <CircularProgress />
    </div>
  )
}

export default Load
