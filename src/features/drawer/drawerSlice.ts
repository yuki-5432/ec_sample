import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { KeyboardEvent, MouseEvent } from 'react'
import { AppDispatch } from '../../app/store'

type DrawerState = {
  drawer: boolean
}

const initialState: DrawerState = {
  drawer: false,
}

const drawerSlice = createSlice({
  name: 'drawer',
  initialState: {
    drawer: false,
  },
  reducers: {
    setDrawer: (state, action: PayloadAction<boolean>) => {
      state.drawer = action.payload
    },
  },
})

export const { setDrawer } = drawerSlice.actions

export const toggleDrawer =
  (state: boolean, e: MouseEvent | KeyboardEvent) =>
  (dispatch: AppDispatch) => {
    if (
      e &&
      e.type === 'keydown' &&
      ((e as KeyboardEvent).key === 'Tab' ||
        (e as KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    dispatch(setDrawer(!state))
  }

export default drawerSlice.reducer
