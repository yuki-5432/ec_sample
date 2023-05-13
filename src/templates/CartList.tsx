import { Delete, Image, Remove } from '@mui/icons-material'
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { AppDispatch, RootState } from '../app/store'
import Container from '../components/Container'
import { CartItem, setCart } from '../features/auth/authSlice'
import { setLoad } from '../features/load/loadSlice'
import { db } from '../firebase'

const CartList = () => {
  const cartItem = useAppSelector((state) => state.auth.cartItem)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const deleteCartToProduct = useCallback(
    (id: string, index: number) => {
      return async (dispatch: AppDispatch, getState: () => RootState) => {
        const confirm = window.confirm('削除してもよろしいでしょうか？')
        if (confirm) {
          const userId = getState().auth.user?.uid
          if (userId) {
            dispatch(setLoad(true))
            // const cartRef = collection(db, 'auth', userId, 'cart')
            // const cartData = await getDocs(cartRef).then((snapshot) => {})
            // const userRef = doc(db, 'auth', userId)
            // const cartData = await getDoc(userRef).then((snapshot) => {
            //   console.log(snapshot.data())
            //   const data = snapshot.data()?.cart as CartItem[]
            //   return data
            // })

            return deleteDoc(doc(db, 'auth', userId, 'cart', id))
              .then(() => {
                alert('カートから削除しました')
                const prevCart = getState().auth.cartItem
                const currentCart = prevCart.filter(
                  (item) => item.cart_id !== id
                )
                dispatch(setCart(currentCart))
              })
              .catch((error) => {
                alert(error)
              })
              .finally(() => {
                dispatch(setLoad(false))
              })

            // return setDoc(userRef, {
            //   cart: newCartData,
            // })
            //   .then((e) => {
            //     const beforeState = getState().auth.cartItem
            //     const currentState = beforeState.filter(
            //       (item, i) => i !== index
            //     )
            //     dispatch(setCart(currentState))
            //   })
            //   .finally(() => dispatch(setLoad(false)))
          }
        }
      }
    },
    [cartItem]
  )
  return (
    <>
      <Box component="div" sx={{ height: '100px' }}></Box>
      <section id="cart-list" className="py-20 bg-[#dadada]">
        <Container>
          <Typography
            variant="h4"
            marginBottom="40px"
            fontWeight="bold"
            component="h2"
          >
            ショッピングカート
          </Typography>
          {cartItem.length > 0 ? (
            <List sx={{ bgcolor: 'background.paper' }}>
              {cartItem.map((item, i) => {
                return (
                  <React.Fragment
                    key={`${item.id}:${item.color}:${item.size}:${i}`}
                  >
                    <Divider variant="inset" component="li" />
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() =>
                            dispatch(deleteCartToProduct(item.cart_id!, i))
                          }
                        >
                          <Delete fontSize="large" />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <div className="w-[15vw] aspect-square">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </ListItemAvatar>
                      <ListItemText sx={{ padding: '16px' }}>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="h6">{item.color}</Typography>
                        <Typography variant="h6">{item.size}</Typography>
                        <Typography variant="h6">{item.quantity}</Typography>
                        <Typography variant="h6">{item.price}</Typography>
                      </ListItemText>
                    </ListItem>
                  </React.Fragment>
                )
              })}
            </List>
          ) : (
            <div className="py-20">ショッピングカートは空です</div>
          )}
          <Box marginTop="40px" fontSize="1.2em" fontWeight="bold">
            <Button
              variant="contained"
              color="success"
              size="large"
              sx={{ fontSize: '1.0em', fontWeight: 'bold' }}
              onClick={() => navigate('/products')}
            >
              ショッピングを続ける
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ marginLeft: '30px', fontSize: '1.0em', fontWeight: 'bold' }}
              onClick={() => navigate('/payment')}
            >
              お会計へ
            </Button>
          </Box>
        </Container>
      </section>
    </>
  )
}

export default CartList
