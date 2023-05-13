import { AddCircle, MoreVert, PlusOne } from '@mui/icons-material'
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { ChangeEvent, FC, useCallback, useState } from 'react'
import { Sku } from '../../features/product/productSlice'

type Props = {
  sku: Sku[]
  setSku: (value: Sku) => void
  deleteSku: (i: number) => void
}

const SkuTable: FC<Props> = ({ sku, setSku, deleteSku }) => {
  const [color, setColor] = useState(colors[0]),
    [size, setSize] = useState(sizes[0]),
    [stock, setStock] = useState('0')

  const inputColor = useCallback((e: SelectChangeEvent) => {
    setColor(e.target.value)
  }, [])

  const inputSize = useCallback((e: SelectChangeEvent) => {
    setSize(e.target.value)
  }, [])

  const inputStock = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setStock(e.target.value)
  }, [])

  const checkSku = useCallback(() => {
    const check = sku.filter((sku) => sku.color === color && sku.size === size)
    console.log(check)
    if (check.length > 0) {
      alert('SKUが重複しています')
      return false
    }
    setSku({ color: color, size: size, stock: stock })
  }, [sku, color, size])

  return (
    <Box>
      <Typography variant="subtitle1">SKU</Typography>
      <Box sx={{ textAlign: 'left', '> * + *': { marginLeft: '20px' } }}>
        <FormControl sx={{ minWidth: '150px' }}>
          <InputLabel id="color">color</InputLabel>
          <Select
            labelId="color"
            onChange={inputColor}
            defaultValue={colors[0]}
          >
            {colors.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: '150px', marginLeft: '20px' }}>
          <InputLabel id="size">size</InputLabel>
          <Select labelId="size" onChange={inputSize} defaultValue={sizes[0]}>
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          type="number"
          label="stock"
          sx={{ width: '100px', marginLeft: '20px' }}
          onChange={inputStock}
          defaultValue="0"
        />
        <IconButton sx={{ marginLeft: '20px' }} onClick={checkSku}>
          <AddCircle fontSize="large" />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell>COLOR</TableCell>
              <TableCell>SIZE</TableCell>
              <TableCell>STOCK</TableCell>
              <TableCell>EDIT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sku.map((prop, i) => (
              <TableRow key={`${prop.color}: ${prop.size}`}>
                <TableCell>{prop.color}</TableCell>
                <TableCell>{prop.size}</TableCell>
                <TableCell>{prop.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteSku(i)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
const colors = [
  'black',
  'white',
  'red',
  'blue',
  'orange',
  'purple',
  'yellow',
  'gray',
]

const sizes = ['S', 'M', 'L', 'XL']

export default SkuTable
