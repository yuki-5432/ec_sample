import {
  AccountCircle,
  AddShoppingCart,
  Close,
  Menu,
} from '@mui/icons-material'
import { Badge, Button, Icon, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import { deleteAccount, logOut } from '../features/auth/authSlice'
import { setDrawer, toggleDrawer } from '../features/drawer/drawerSlice'
import { db } from '../firebase'
import logo from '../img/いじめっ子アイコン1.png'
import MenuDrawer from './MenuDrawer'

const Header = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const cart = useAppSelector((state) => state.auth.cartItem)
  const drawerState = useAppSelector((state) => state.drawer.drawer)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.uid) {
      const unsub = onSnapshot(doc(db, 'auth', user?.uid), (doc) => {
        console.log(doc.data())
        console.log(doc.exists())
        console.log(doc.get('cart'))
        console.log(doc.ref)
      })

      return () => unsub()
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 z-10 w-full py-5 bg-black text-white">
      <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
        <h1 className="w-20">
          <img className="w-full" src={logo} alt="logo" />
        </h1>
        {/* <nav className="text-lg">
          <ul className="flex space-x-8">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sign-up"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                SIGN UP
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                SIGN IN
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/product"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                商品登録
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/collection"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                商品一覧
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/productDetails"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                商品詳細
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive
                    ? 'block py-2 duration-300 underline'
                    : 'block py-2 duration-300 no-underline'
                }
              >
                商品一覧
              </NavLink>
            </li>
          </ul>
        </nav> */}
        {user?.uid && (
          <div>
            <Button
              variant="contained"
              color="info"
              sx={{
                fontWeight: 700,
              }}
              onClick={() => dispatch(logOut())}
            >
              ログアウト
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                fontWeight: 700,
                marginLeft: '20px',
              }}
              onClick={() => dispatch(deleteAccount())}
            >
              退会
            </Button>
          </div>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/cart-list')}>
            <Badge badgeContent={cart && cart.length} color="info">
              <AddShoppingCart color="warning" fontSize="large" />
            </Badge>
          </IconButton>
          <AccountCircle fontSize="large" />
          <div className="font-bold">
            {user?.displayName ? user.displayName : 'ゲスト'}
          </div>
        </Box>
        <IconButton
          sx={{ position: 'relative', zIndex: '1201' }}
          color="info"
          onClick={() => dispatch(setDrawer(!drawerState))}
        >
          {drawerState ? <Close fontSize="large" /> : <Menu fontSize="large" />}
        </IconButton>
        <MenuDrawer />
      </div>
    </header>
  )
}

export default Header
