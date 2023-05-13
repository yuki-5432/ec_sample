import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PostsData } from '../../dummyData'

export interface PostData {
  id: number
  name: string
  content: string
}

export interface PostState {
  value: PostData[]
}

const initialState: PostState = {
  value: PostsData,
}

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<PostData>) => {
      state.value.push(action.payload)
    },
    removePost: (state, action: PayloadAction<number>) => {
      state.value = state.value.filter((post) => post.id !== action.payload)
    },
  },
})

export const { addPost, removePost } = postSlice.actions

export default postSlice.reducer
