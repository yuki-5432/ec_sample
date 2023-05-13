import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import '@splidejs/react-splide/css'

import { useAppDispatch, useAppSelector } from './app/hooks'
import Header from './components/header'
import Load from './components/load'
import PokemonList from './components/pokemon-list'
import { observe } from './features/auth/authSlice'
import Post from './features/post/Post'
import Product from './templates/admin/product'
import Collection from './templates/collection'
import Home from './templates/Home'
import NotFound from './templates/not-found'
import ProductDetails from './templates/productDetails'
import Products from './templates/products'
import SignIn from './templates/sign-in'
import SignUp from './templates/sign-up'
import CartList from './templates/CartList'
import Payment from './templates/Payment'
import Order from './templates/Order'

const App = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(observe())
  }, [])

  return (
    <div className="App">
      <Header />
      <main className="relative z-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/products">
            <Route index element={<Products />} />
            <Route path=":id" element={<ProductDetails />} />
          </Route>
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/admin/product" element={<Product />}>
            <Route path=":postId" />
          </Route>
          <Route path="/admin/collection" element={<Collection />}></Route>
          <Route path="/cart-list" element={<CartList />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Load />
    </div>
  )
}

export default App
