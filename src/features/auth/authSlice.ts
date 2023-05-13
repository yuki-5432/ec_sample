import { AnyAction, createSlice, PayloadAction, Store } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth'
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { AppDispatch, RootState } from '../../app/store'
import { auth, db, FirebaseTimestamp } from '../../firebase'
import { setLoad } from '../load/loadSlice'

type User = {
  uid: string | null
  displayName: string | null
  email: string | null
}

export type CartItem = {
  added_at: Timestamp | undefined
  cart_id: string | null
  id: string
  name: string
  image: string
  color: string
  size: string
  quantity: number
  price: string
}

type Product = {
  [key: string]: {
    id: string
    name: string
    image: string
    price: string
    color: string
    size: string
  }
}

type Order = {
  id: string
  created_ad: string
  sipping_date: string
  amount: number
  product: Product[]
}

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
  login: boolean
  cartItem: CartItem[]
  order: Order[] | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  login: false,
  cartItem: [],
  order: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.login = action.payload
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItem = action.payload
    },
    addCart: (state, action: PayloadAction<CartItem>) => {
      state.cartItem = state.cartItem
        ? [...state.cartItem, action.payload]
        : [action.payload]
    },
    setOrder: (state, action: PayloadAction<Order[]>) => {
      state.order = action.payload
    },
  },
})

export const {
  setLoading,
  setError,
  setUser,
  setLogin,
  setCart,
  addCart,
  setOrder,
} = authSlice.actions

export const signUp =
  (username: string, email: string, password: string, confirm: string) =>
  (dispatch: AppDispatch) => {
    // varidate
    if (username === '' || email === '' || password === '' || confirm === '') {
      alert('全て項目を入力してください')
      return false
    }

    if (password !== confirm) {
      alert('パスワードが一致しません')
      return false
    }

    dispatch(setLoading(true))
    dispatch(setError(null))
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user

        if (user) {
          const uid = user.uid
          const timestamp = Timestamp.now()
          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: 'customer',
            uid: uid,
            updated_at: timestamp,
            username: username,
          }

          await setDoc(doc(db, 'auth', uid), userInitialData)
          dispatch(
            setUser({
              uid: uid,
              displayName: username,
              email: email,
            })
          )
          dispatch(setLogin(true))
        }
        console.log(user)
        console.log('create!')
        return userCredential
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        dispatch(setError('error'))
        console.log(`${errorCode}, ${errorMessage}`)
        alert('アカウント登録に失敗しました')
      })
      .finally(() => dispatch(setLoading(false)))
  }

export const signIn =
  (email: string, password: string) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    dispatch(setLoad(true))
    if (email === '' || password === '') {
      alert('全て項目を入力してください')
      return false
    }

    return signInWithEmailAndPassword(auth, email, password)
      .then((UserCredential) => {
        console.log(UserCredential)
        const user = UserCredential.user
        if (user) {
          const uid = user.uid

          getDoc(doc(db, 'auth', uid)).then((docSnap) => {
            console.log(docSnap.data())
            const data = docSnap.data() as { username: string }
            const username = data.username
            dispatch(
              setUser({
                uid: uid,
                displayName: username,
                email: email,
              })
            )
            dispatch(setLogin(true))
          })
        }
        return user
      })
      .catch((error) => {
        console.log(error)
        console.error(error.message)
        console.error('error')
        window.alert('ログインに失敗しました')
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }

export const logOut = () => (dispatch: AppDispatch) => {
  dispatch(setLoading(true))

  return signOut(auth)
    .then(() => {
      dispatch(
        setUser({
          uid: null,
          displayName: null,
          email: null,
        })
      )
      window.alert('ログアウトしました')
      return true
    })
    .catch((error) => {
      console.log(error)
      alert('ログアウトに失敗しました。')
    })
    .finally(() => {
      dispatch(setLogin(false))
      dispatch(setLoading(false))
    })
}

export const observe = () => (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid
      getDoc(doc(db, 'auth', uid)).then(async (docSnap) => {
        console.log(docSnap.data())
        if (docSnap.data()) {
          const data = docSnap.data() as {
            username: string
            email: string
          }
          const { username, email } = data
          dispatch(
            setUser({
              uid: uid,
              displayName: username,
              email: email,
            })
          )
          const cartRef = collection(db, 'auth', uid, 'cart')
          const cartData = await getDocs(cartRef).then((snapshot) => {
            return snapshot.docChanges().map((doc) => doc.doc.data().cartItem)
          })
          console.log(cartData)
          const newData = cartData.map((item) => {
            item.added_at = null
            return item
          })
          // if (cart && cart.length > 0) {
          //   const newCart = cart.map((item) => {
          //     item.added_at = undefined
          //     return item
          //   })
          dispatch(setCart(cartData))
        }
        dispatch(setLogin(true))
        // }
      })

      return user
    }
  })
}

export const sendPasswordMail = (email: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(setLoading(true))
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('パスワードの再設定メールを送りました')
      })
      .catch((error) => {
        alert('リセットメールの送信に失敗しました')
        console.log(error.code)
        console.log(error.message)
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }
}

export const deleteAccount = () => {
  return (dispatch: AppDispatch) => {
    const user = auth.currentUser
    if (user) {
      const newLocal = 'アカウントを削除してもよろしいですか？'
      const res = window.confirm(newLocal)
      if (res) {
        dispatch(setLoading(true))
        const auth = deleteUser(user)
        const dbDelete = deleteDoc(doc(db, 'auth', user.uid))
        Promise.all([auth, dbDelete])
          .then(() => {
            console.log(auth)
            console.log(dbDelete)
            window.alert('アカウントを削除しました')
          })
          .catch((error) => {
            console.log(error)
            window.alert('アカウント削除に失敗しました')
          })
          .finally(() => {
            dispatch(setLoading(false))
            dispatch(setUser(null))
          })
      }
    }
  }
}

export const addProductToCart = (cartItem: CartItem) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoad(true))
    const userid = getState().auth.user!.uid!
    console.log(userid)
    const userRef = doc(db, 'auth', userid)
    const cartRef = doc(collection(db, 'auth', userid, 'cart'))
    cartItem.cart_id = cartRef.id
    const addData = await setDoc(cartRef, {
      cartItem,
    })
      .then((doc) => {
        cartItem.added_at = undefined
        dispatch(addCart(cartItem))
      })
      .catch((error) => {
        alert(error)
      })
      .finally(() => dispatch(setLoad(false)))
  }
}

export const fetchOrderList = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const uid = getState().auth.user?.uid
    console.log(uid)
    if (uid) {
      const orderRef = collection(db, 'auth', uid, 'order')
      const snapshot = await getDocs(
        query(orderRef, orderBy('created_at', 'desc'))
      )

      const orderList: Order[] = []
      snapshot.forEach((doc) => {
        const orderData = doc.data()
        // const date = new Date(
        //   (orderData.created_at = orderData.created_at.toDate())
        // )
        console.log(orderData)
        console.log(orderData.created_at.toDate())
        console.log(orderData.sipping_date.toDate())
        orderData.created_at = orderData.sipping_date
          .toDate()
          .toLocaleDateString()
        orderData.sipping_date = orderData.sipping_date
          .toDate()
          .toLocaleDateString()
        orderList.push(orderData as Order)
      })
      console.log(orderList)

      dispatch(setOrder(orderList))
    }
  }
}

export default authSlice.reducer
