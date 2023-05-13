import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from '@mui/material'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '../features/product/productSlice'

interface Props extends Product {
  loading: boolean
}

const ProductsList: FC<Props> = ({
  id,
  name,
  images,
  description,
  loading,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Link to={`${id}`}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={images ? images[0] : '/src/img/sample1.jpg'}
            alt={name ? name : '商品画像'}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}

export default ProductsList
