import { CartItem, setCart } from './../auth/authSlice'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import { AppDispatch, RootState } from '../../app/store'
import { db, FirebaseTimestamp } from '../../firebase'
import { setLoad } from '../load/loadSlice'
import { NavigateFunction, useNavigate } from 'react-router-dom'

export type Sku = {
  size: string | null | undefined
  color: string | null | undefined
  stock: string | null | undefined
}

// export type Product = {
//   id: string | null
//   name: string | null
//   description: string | null
//   category: string | null
//   gender: string | null
//   price: string | null
//   images: string[] | null
//   sku: Sku[] | null
// }

export interface Product {
  id: string | null
  name: string | null
  description: string | null
  category: string | null
  gender: string | null
  price: string | null
  images: string[] | null
  sku: Sku[] | null
}

type ProductState = {
  product: Product | null
}

const initialState: ProductState = {
  product: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product | null>) => {
      state.product = action.payload
    },
  },
})

export const { setProduct } = productSlice.actions

export const saveProduct =
  (
    id: string,
    name: string,
    description: string,
    category: string,
    gender: string,
    price: string,
    images: string[],
    sku: Sku[]
  ) =>
  (dispatch: AppDispatch) => {
    console.log('click')
    dispatch(setLoad(true))
    const newProductRef =
      id === '' ? doc(collection(db, 'products')) : doc(db, 'products', id)
    console.log(newProductRef)

    console.log('click2')

    const timestamp = Timestamp.now()

    const data = {
      name: name,
      description: description,
      category: category,
      gender: gender,
      price: price,
      images: images,
      sku: sku,
      create_at: timestamp,
      update_at: timestamp,
    }

    return setDoc(newProductRef, data, { merge: true })
      .then((a) => {
        console.log(newProductRef)
        alert('商品登録が完了しました！')
      })
      .catch((a) => {
        console.error('error')
        alert('商品登録に失敗しました')
      })
      .finally(() => {
        dispatch(setLoad(false))
      })
  }

export const test = async (cartItem: CartItem[], totalPrice: number) => {
  const sleep = () =>
    new Promise((resolve, reject) => {
      try {
        if (totalPrice <= 0) {
          throw new Error('エラーが発生しました')
        }
        window.setTimeout(() => {
          resolve('完了')
        }, 5000)
      } catch (error) {
        alert(error)
        reject('error')
      }
    })

  // let i = 0
  // while (i < 5) {
  //   const text = await sleep()
  //   console.log(text)
  //   i++
  // }

  const array = [0, 1, 2, 3, 4, 5]
  // array.forEach(async (num) => {
  //   const text = await sleep()
  //   console.log(text)
  // })
  // for (let i = 0; i < array.length; i++) {
  //   const text = await sleep()
  //   console.log(text)
  // }
  ;(async () => {
    for await (const num of array) {
      sleep()
      console.log(num)
    }
  })()
}

export const orderProduct = (cartItem: CartItem[], totalPrice: number) => {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
    // navigate: NavigateFunction
  ) => {
    const uid = getState().auth?.user?.uid
    if (uid) {
      dispatch(setLoad(true))

      const userRef = doc(db, 'auth', uid)

      let amount = totalPrice,
        products: { [index: string]: Object } = {},
        soldOutProducts: Array<string> = []

      const batch = writeBatch(db)

      for (const item of cartItem) {
        const productRef = doc(db, 'products', item.id)
        const snapshot = await getDoc(productRef)
        const skuList: Sku[] = snapshot.data()?.sku

        const updateSku = skuList.map((sku) => {
          if (sku.color === item.color && sku.size === item.size) {
            if (Number(sku.stock) === 0) {
              soldOutProducts.push(`${item.name} ${sku.color} x ${sku.size}`)
              return sku
            }
            sku.stock = String(Number(sku.stock) - item.quantity)
            return sku
          } else {
            return sku
          }
        })

        products[item.id] = {
          id: item.id,
          image: item.image,
          name: item.name,
          price: item.price,
          color: item.color,
          size: item.size,
        }

        batch.update(productRef, {
          sku: updateSku,
        })

        batch.delete(doc(db, 'auth', uid, 'cart', item.cart_id!))
      }

      if (soldOutProducts.length > 0) {
        const errorMessage =
          soldOutProducts.length > 1
            ? soldOutProducts.join('と')
            : soldOutProducts[0]
        alert(
          `大変申し訳ございません。${errorMessage}が在庫切れとなったため、注文処理を中断しました。`
        )
        dispatch(setLoad(false))
        return
      } else {
        try {
          // if (uid) {
          //   throw new Error('エラーが発生しました')
          // }

          await batch.commit()
          const orderRef = doc(collection(db, 'auth', uid, 'order'))
          const timestamp = FirebaseTimestamp.now()
          const date = FirebaseTimestamp.now().toDate()
          console.log(date)
          const shippingDate = FirebaseTimestamp.fromDate(
            new Date(date.setDate(date.getDate() + 3))
          )
          console.log(shippingDate)

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            sipping_date: shippingDate,
          }

          dispatch(setCart([]))

          await setDoc(orderRef, history)
          dispatch(setLoad(false))
          return
        } catch (error: any) {
          alert(error)
          console.error(error.message)
          dispatch(setLoad(false))
          return
        }
      }
    }

    // if (uid) {
    //   const batch = writeBatch(db)
    //   const timestamp = FirebaseTimestamp.now()

    //   // cartItem.map(async (item) => {
    //   for (const item of cartItem) {
    //     const productRef = doc(db, 'products', item.id)
    //     const productData = await getDoc(productRef)
    //       .then((snapshot) => snapshot.data())
    //       .catch((error) => console.log(error))

    //     const newSku = (productData?.sku as Sku[]).map((sku) => {
    //       if (sku.color === item.color && sku.size === item.size) {
    //         sku.stock = String(Number(sku.stock) - item.quantity)
    //         return sku
    //       }
    //       return sku
    //     })
    //     console.log(newSku)
    //     batch.update(productRef, { sku: newSku })
    //     // })
    //   }
    //   await batch.commit()
    // }
    // if (uid) {
    //   const userRef = doc(db, 'auth', uid)
    //   const timestamp = FirebaseTimestamp.now()
    //   console.log(cartItem)
    //   console.log(timestamp.toString())

    //   try {
    //     await runTransaction(db, async (transaction) => {
    //       console.log(transaction)
    //       cartItem.forEach(async (item) => {
    //         const productRef = doc(db, 'products', item.id)
    //         const productDoc = await transaction
    //           .get(productRef)
    //           .then((snapshot) => snapshot.data())
    //         console.log(productDoc?.sku)
    //         console.log(item.color)
    //         const newSku = (productDoc?.sku as Array<Sku>).map((sku) => {
    //           if (sku.color === item.color && sku.size === item.size) {
    //             const newSku = { ...sku }
    //             console.log(newSku.stock)
    //             newSku.stock = (Number(sku.stock) - item.quantity).toString()
    //             console.log(newSku.stock)
    //             return newSku
    //           }
    //           return sku
    //         })
    //         console.log(newSku)
    //         transaction.set(productRef, {
    //           sku: newSku,
    //         })
    //       })
    //       const cartRef = doc(collection(db, 'auth', uid, 'cart'))
    //       transaction.delete(cartRef)
    //       transaction.set(doc(collection(db, 'auth', uid, 'order-list')), {
    //         order_at: timestamp,
    //         cart_item: cartItem,
    //       })
    //     })
    //   } catch (e) {
    //     console.error('Transaction failed: ', e)
    //   }
    // }
  }
}

export default productSlice.reducer
