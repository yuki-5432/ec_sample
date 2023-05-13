import postReducer from './../features/post/postSlice'
import { configureStore } from '@reduxjs/toolkit'
import { pokemonApi } from '../services/pokemon'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import authReducer from '../features/auth/authSlice'
import productReducer from '../features/product/productSlice'
import loadReducer from '../features/load/loadSlice'
import collectionReducer from '../features/collection/collectionSlice'
import drawerReducer from '../features/drawer/drawerSlice'

export const store = configureStore({
  reducer: {
    post: postReducer,
    auth: authReducer,
    product: productReducer,
    load: loadReducer,
    collection: collectionReducer,
    drawer: drawerReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
