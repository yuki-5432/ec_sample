import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Load = boolean

const initialState = {
  load: false,
}

const loadSlice = createSlice({
  name: 'load',
  initialState,
  reducers: {
    setLoad: (state, action: PayloadAction<Load>) => {
      state.load = action.payload
    },
  },
})

export const { setLoad } = loadSlice.actions

export default loadSlice.reducer
