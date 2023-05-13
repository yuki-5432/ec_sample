import { MoreVert } from '@mui/icons-material'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material'
import React, { FC, MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  deleteProduct,
  setCollection,
} from '../features/collection/collectionSlice'
import { Product } from '../features/product/productSlice'
import image from '../img/sample1.jpg'

interface Props extends Product {
  loading?: boolean
}

const ProductCard: FC<Props> = ({ loading, id, name, description, images }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  console.log(`productCard${open}`)
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => state.collection.collection)

  return (
    <Card>
      <CardMedia
        sx={{ paddingTop: '56.25%' }}
        image={images ? images[0] : image}
        title="sample"
      />
      <CardContent>
        <Typography align="left" variant="h4" component="h3">
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="GrayText"
          component="p"
          align="justify"
        >
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'end' }}>
        <div>
          <IconButton
            id="sub-menu-button"
            aria-label="menu"
            aria-controls={open ? 'sub-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="sub-menu"
            MenuListProps={{
              'aria-labelledby': 'sub-menu-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                navigate(`/admin/product/${id}`)
                handleClose()
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              sx={{
                backgroundColor: '#ff0000',
                color: '#fff',
                '&:hover': { backgroundColor: '#fff', color: '#ff0000' },
              }}
              onClick={async () => {
                handleClose()
                await dispatch(deleteProduct(id!))
                const nextState = collection?.filter(
                  (product) => product.id !== id
                )
                dispatch(setCollection(nextState))
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </CardActions>
    </Card>
  )
}

export default ProductCard
