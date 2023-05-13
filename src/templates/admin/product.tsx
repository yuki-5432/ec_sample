import { AddPhotoAlternate, DeleteForever } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, {
  ChangeEvent,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setLoad } from '../../features/load/loadSlice'
import { saveProduct, Sku } from '../../features/product/productSlice'
import { db, storage } from '../../firebase'
import SkuTable from './sku'

const Product = () => {
  const [name, setName] = useState(''),
    [id, setId] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [sku, setSku] = useState<Sku[]>([])
  const load = useAppSelector((state) => state.load.load)
  const navigate = useNavigate()

  const { postId } = useParams()

  useEffect(() => {
    if (postId) {
      const docRef = doc(db, 'products', postId)
      getDoc(docRef).then((docSnap) => {
        console.log(docSnap)
        console.log(docSnap.data())
        const data = docSnap.data()
        if (data) {
          setId(postId)
          setName(data.name)
          setDescription(data.description)
          setCategory(data.category)
          setGender(data.gender)
          setPrice(data.price)
          setImages(data.images)
          setSku(data.sku)
        }
      })
    }
  }, [])

  const dispatch = useAppDispatch()

  const inputName = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setName(e.target.value)
    },
    []
  )

  const inputDescription = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDescription(e.target.value)
    },
    []
  )

  const inputCategory = useCallback((e: SelectChangeEvent<string>) => {
    setCategory(e.target.value)
  }, [])

  const inputGender = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setGender(e.target.value)
    },
    []
  )

  const inputPrice = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPrice(e.target.value)
    },
    []
  )

  const imageInputRef = useRef<HTMLInputElement>(null)

  const inputFileSync = useCallback((e: MouseEvent) => {
    // document.getElementById('image')?.click()
    // imageInputRef.current?.click()
    console.log(e.currentTarget)
    e.currentTarget.querySelector('input')!.click()
  }, [])

  const inputSku = useCallback((value: Sku) => {
    if (value.color === '') {
      alert('colorを入力してください')
      return false
    } else if (value.size === '') {
      alert('sizeを入力してください')
      return false
    }
    setSku((prevState) =>
      [...prevState, value].sort((a, b) => {
        const colorA = a.color!,
          colorB = b.color!
        if (colorA < colorB) {
          return -1
        } else if (colorA > colorB) {
          return 1
        } else {
          const sizeA = sizeCast(a.size!)!,
            sizeB = sizeCast(b.size!)!
          return sizeA - sizeB
        }
      })
    )
  }, [])

  const deleteSku = useCallback(
    (index: number) => {
      const newSku = sku.filter((_, skuI) => index !== skuI)
      setSku(newSku)
    },
    [sku]
  )

  const imagesDelete = useCallback(
    (e: MouseEvent) => {
      console.log(images)
      console.log(e.currentTarget.id)
      setImages(images.filter((image) => image !== e.currentTarget.id))
    },
    [images]
  )

  const uploadImage = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('upload')
    if (e.target.files) {
      dispatch(setLoad(true))
      const file = e.target.files[0]
      console.log(file)

      const imagesRef = ref(storage, `product/${file.name}`)
      const uploadTask = await uploadBytes(imagesRef, file)
        .then(async (snapshot) => {
          // alert('upload complete')
          console.log(snapshot)

          const url = await getDownloadURL(ref(storage, snapshot.ref.fullPath))
          console.log(url)
          setImages((prevState) => [...prevState, url])
          console.log(images)
          return snapshot
        })
        .catch((e) => {
          console.log(e)
          alert('失敗')
        })
        .finally(() => dispatch(setLoad(false)))
    }
  }, [])

  return (
    <section id="product" className="py-40 bg-stone-400 text-neutral-800">
      <div className="mx-auto max-w-2xl px-6 space-y-10 mb-10">
        <h2 className="font-bold text-4xl text-center">商品登録</h2>
      </div>
      <div className="mx-auto max-w-2xl px-6">
        <TextField
          required
          type="text"
          label="name"
          variant="standard"
          value={name}
          fullWidth
          onChange={inputName}
        />
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 bg-black">
            {images.map((url) => {
              return (
                <div key={url} className="relative">
                  <div className="absolute top-2 right-2 z-[1]">
                    <IconButton color="warning" id={url} onClick={imagesDelete}>
                      <DeleteForever fontSize="large" />
                    </IconButton>
                  </div>
                  <img
                    className="object-cover object-center aspect-square bg-white"
                    src={url}
                    alt={`${name}preview`}
                  />
                </div>
              )
            })}
          </div>
        )}
        <Button
          variant="text"
          sx={{
            color: '#000',
            fontSize: '1.2em',
            fontWeight: 700,
            justifyContent: 'left',
          }}
          fullWidth
          onClick={inputFileSync}
        >
          商品画像をアップデート
          <AddPhotoAlternate sx={{ verticalAlign: 'middle' }} />
          {/* </InputLabel> */}
          <Input
            ref={imageInputRef}
            id="image"
            type="file"
            sx={{ display: 'none' }}
            onChange={uploadImage}
          />
        </Button>
        <TextField
          required
          type="text"
          label="description"
          multiline
          fullWidth
          rows={4}
          variant="standard"
          value={description}
          onChange={inputDescription}
        />
        <Box sx={{ maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="category">category</InputLabel>
            <Select
              labelId="category"
              value={category}
              label="category"
              onChange={inputCategory}
            >
              <MenuItem value="t-shirt">Tシャツ</MenuItem>
              <MenuItem value="jacket">ジャケット</MenuItem>
              <MenuItem value="outer">アウター</MenuItem>
              <MenuItem value="pants">パンツ</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormControl fullWidth>
          <FormLabel sx={{ textAlign: 'left' }}>性別</FormLabel>
          <RadioGroup
            row
            className="mt-4"
            onChange={inputGender}
            value={gender}
          >
            <FormControlLabel value="female" control={<Radio />} label="女性" />
            <FormControlLabel value="male" control={<Radio />} label="男性" />
          </RadioGroup>
        </FormControl>
        <TextField
          required
          type="number"
          fullWidth
          variant="standard"
          label="price"
          value={price}
          onChange={inputPrice}
        />
        <SkuTable sku={sku} setSku={inputSku} deleteSku={deleteSku} />
        <div>
          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{
              fontWeight: 700,
              minWidth: '160px',
              fontSize: '1.2em',
            }}
            onClick={async () => {
              await dispatch(
                saveProduct(
                  id,
                  name,
                  description,
                  category,
                  gender,
                  price,
                  images,
                  sku
                )
              )
              navigate('/admin/collection/')
            }}
          >
            送信
          </Button>
        </div>
      </div>
    </section>
  )
}

// const categories = [
//   { label: 'Tシャツ', id: 't-shirt' },
//   { label: 'ジャケット', id: 'jacket' },
//   { label: 'アウター', id: 'outer' },
//   { label: 'パンツ', id: 'pants' },
// ]

const sizeCast = (value: string) => {
  switch (value) {
    case 'S':
      return 0
    case 'M':
      return 1
    case 'L':
      return 2
    case 'XL':
      return 3
  }
}

export default Product
