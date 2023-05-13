import {
  Checkroom,
  Close,
  Create,
  FormatListBulleted,
  Home,
  Login,
  Payment,
  PersonAdd,
  Restore,
  ShoppingCart,
} from '@mui/icons-material'
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  SwipeableDrawer,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, MouseEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setDrawer, toggleDrawer } from '../features/drawer/drawerSlice'

type Props = {
  state: boolean
}

const MenuDrawer = () => {
  const dispatch = useAppDispatch()
  const drawerState = useAppSelector((state) => state.drawer.drawer)
  const navigate = useNavigate()

  return (
    <SwipeableDrawer
      anchor="right"
      open={drawerState}
      onOpen={() => dispatch(setDrawer(true))}
      onClose={() => dispatch(setDrawer(false))}
    >
      <Box
        sx={{ backgroundColor: '#000', minHeight: '100vh', minWidth: '300px' }}
      >
        <List
          component="nav"
          aria-labelledby="global-nav"
          subheader={
            <ListSubheader
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              component="h2"
              id="global-nav"
            >
              <span>MENU</span>
              <IconButton onClick={() => dispatch(setDrawer(false))}>
                <Close />
              </IconButton>
            </ListSubheader>
          }
        >
          {menuList.map((item) => (
            <ListItemButton
              key={item.text}
              sx={{
                color: '#fff',
                '&:focus': {
                  outline: '2px solid #0022ff',
                },
              }}
              onClick={() => {
                navigate(item.href)
                dispatch(setDrawer(false))
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </SwipeableDrawer>
  )
}

const menuList = [
  { href: '/', text: 'HOME', icon: <Home /> },
  { href: '/sign-up', text: 'SIGN UP', icon: <Login /> },
  { href: '/sign-in', text: 'SIGN IN', icon: <PersonAdd /> },
  { href: '/cart-list', text: 'ショッピングカート', icon: <ShoppingCart /> },
  { href: '/payment', text: '会計', icon: <Payment /> },
  { href: '/order', text: '注文履歴', icon: <Restore /> },
  { href: '/productDetails', text: '商品詳細', icon: <FormatListBulleted /> },
  { href: '/products', text: '商品一覧', icon: <Checkroom /> },
  { href: '/admin/product', text: '商品登録', icon: <Create /> },
  {
    href: '/admin/collection',
    text: '登録商品一覧',
    icon: <FormatListBulleted />,
  },
]

export default MenuDrawer
