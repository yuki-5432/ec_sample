import {
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { doc, getDoc } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { Product, Sku } from '../features/product/productSlice'
import { db, FirebaseTimestamp } from '../firebase'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper'
import { AddShoppingCartRounded, Favorite } from '@mui/icons-material'
import { Box } from '@mui/system'
import { addProductToCart } from '../features/auth/authSlice'

interface Data extends Product {
  create_at: string
  updata_at: string
}

type AddProduct = Product & {
  added_at: string
  sku: Sku
  quantity: number
}

const ProductDetails = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Data | null>(null)
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const addProduct = useCallback(
    (size: string, color: string, quantity: number) => {
      const timestamp = FirebaseTimestamp.now()
      dispatch(
        addProductToCart({
          added_at: timestamp,
          cart_id: null,
          id: data!.id!,
          name: data!.name!,
          image: data!.images![0],
          color: color,
          size: size,
          quantity: quantity,
          price: data!.price!,
        })
      )
    },
    [data]
  )

  useEffect(() => {
    if (id) {
      const docRef = doc(db, 'products', id)
      getDoc(docRef)
        .then((docSnap) => {
          const data = { id: id, ...docSnap.data() }
          setData(data as Data)
        })
        .finally(() => setLoading(true))
    }
  }, [])

  return (
    <section className="py-10 bg-gray-200 mt-28">
      <div className="max-w-4xl mx-auto py-4">
        <div className="grid grid-cols-2 gap-x-10">
          <div className="w-full bg-red-300">
            {loading ? (
              <Splide aria-label="商品画像">
                {data?.images?.map((image) => (
                  <SplideSlide key={image} className="relative pt-[56.25%]">
                    <img
                      src={image}
                      alt={data.name ? data.name : '商品画像'}
                      className="absolute top-0 left-0 z-[1] w-full h-full object-cover"
                    />
                  </SplideSlide>
                ))}
              </Splide>
            ) : (
              <Skeleton />
            )}
            {loading ? (
              <Swiper
                spaceBetween={0}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {data?.images?.map((image) => (
                  <SwiperSlide key={image} className="relative pt-[56.25%]">
                    <img
                      src={image}
                      alt={data.name ? data.name : '商品画像'}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Skeleton />
            )}
          </div>
          <div className="w-full h-screen bg-blue-300 p-10">
            <Typography textAlign="left" variant="h4">
              {loading ? data?.name : <Skeleton />}
            </Typography>
            <Typography textAlign="right" variant="subtitle1">
              {loading ? `${data?.price}円` : <Skeleton />}
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="sku table">
                <TableHead>
                  <TableRow>
                    <TableCell>COLOR</TableCell>
                    <TableCell>SIZE</TableCell>
                    <TableCell>在庫</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.sku?.map((item) => (
                    <TableRow key={`${item.color} : ${item.size}`}>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell align="right">
                        {Number(item.stock) ? (
                          <IconButton
                            onClick={() =>
                              addProduct(item.size!, item.color!, 1)
                            }
                          >
                            <AddShoppingCartRounded />
                          </IconButton>
                        ) : (
                          <Typography variant="button" marginRight="5px">
                            売切
                          </Typography>
                        )}
                        <IconButton>
                          <Favorite />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box marginTop="30px">
              {loading ? (
                <Typography variant="body2" component="p" textAlign="justify">
                  {data?.description}
                </Typography>
              ) : (
                <>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                  <Skeleton width="65%" />
                </>
              )}
            </Box>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
