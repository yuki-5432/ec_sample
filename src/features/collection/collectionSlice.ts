import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { useAppSelector } from '../../app/hooks'
import { AppDispatch, RootState } from '../../app/store'
import { db } from '../../firebase'
import { setLoad } from '../load/loadSlice'
import { Product, Sku } from '../product/productSlice'

type Collection = Product[] | null | undefined

type CollectionState = {
  collection: Collection | null
  loading: boolean
}

const initialState: CollectionState = {
  collection: null,
  loading: false,
}

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollection: (state, action: PayloadAction<Collection>) => {
      state.collection = action.payload
    },
    setCollectionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setCollection, setCollectionLoading } = collectionSlice.actions

type Data = {
  id: string | null
  name: string | null
  description: string | null
  category: string | null
  gender: string | null
  price: string | null
  images: string[] | null
  sku: Sku[] | null
  create_at: {}
  updata_at: {}
}

export const fetchCollection = () => {
  return async (dispatch: AppDispatch) => {
    const querySnapshot = await getDocs(collection(db, 'products')).finally(
      () => dispatch(setCollectionLoading(false))
    )
    const products: Array<Product> = []
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data())
      const data = doc.data() as Data
      const product = {
        id: doc.id,
        name: data.name,
        description: data.description,
        images: data.images,
        category: data.category,
        gender: data.gender,
        price: data.price,
        sku: data.sku,
      }
      products.push(product)
    })
    dispatch(setCollection(products))
    dispatch(setCollectionLoading(true))
    return querySnapshot
  }
}

export const deleteProduct = (id: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoad(true))
    await deleteDoc(doc(db, 'products', id))
      .then(() => alert('削除が完了しました'))
      .catch((error) => alert(error))
    const state = collectionSlice.getInitialState()
    console.log(state)
    dispatch(setLoad(false))
  }
}

export default collectionSlice.reducer
