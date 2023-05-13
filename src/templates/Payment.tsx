import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import Grid from '@mui/system/Unstable_Grid'
import React, { Component, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { orderProduct, test } from '../features/product/productSlice'

const Payment = () => {
  const cartList = useAppSelector((state) => state.auth.cartItem)
  const totalPrice = cartList.reduce((prev, current) => {
    return prev + Number(current.price) * current.quantity
  }, 0)
  const postage = totalPrice > 5000 ? 0 : 1000
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <>
      <Box height="120px"></Box>
      <Box component="section" paddingY="50px">
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            paddingY={2}
          >
            お会計
          </Typography>
          <Grid container columnSpacing={4}>
            <Grid xs={8}>
              {cartList ? (
                <List
                  sx={{
                    backgroundColor: '#dadada',
                    padding: 0,
                  }}
                >
                  {cartList.map((item) => (
                    <Fragment key={item.cart_id}>
                      <ListItem sx={{ padding: '1em' }}>
                        <ListItemAvatar
                          sx={{ width: '100px', height: '100px' }}
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={item.image}
                            alt={item.name}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          sx={{ fontSize: '1.2em', paddingX: '1em' }}
                          primary={item.name}
                          secondary={
                            <Fragment>
                              {item.color} x {item.size} 数量…{item.quantity}
                              <br />¥{item.price}
                            </Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="fullWidth" />
                    </Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="h2" component="body">
                  カートの中身が空です
                </Typography>
              )}
            </Grid>
            <Grid xs={4} sx={{ position: 'relative' }}>
              <Card
                sx={{
                  // position: '-webkit-sticky',
                  position: 'sticky',
                  top: '180px',
                }}
              >
                <CardActions>
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    sx={{ color: '#000', fontWeight: 600 }}
                    fullWidth
                    onClick={async () => {
                      await dispatch(orderProduct(cartList, totalPrice))
                      navigate('/')
                    }}
                  >
                    注文を確定する
                  </Button>
                </CardActions>
                <CardContent>
                  <Divider variant="middle" />
                  <Box paddingY="0.8em">
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      textAlign="left"
                      component="h3"
                    >
                      注文内容
                    </Typography>
                    <dl className="mt-4">
                      <div className="flex justify-between">
                        <dt>商品の小計：</dt>
                        <dd>¥{totalPrice.toLocaleString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>配送料・手数料：</dt>
                        <dd>¥{postage.toLocaleString()}</dd>
                      </div>
                    </dl>
                  </Box>
                  <Divider variant="middle" />
                  <dl className="py-4 font-bold text-red-700">
                    <div className="flex justify-between">
                      <dt>ご請求額：</dt>
                      <dd>¥{(totalPrice + postage).toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Payment
