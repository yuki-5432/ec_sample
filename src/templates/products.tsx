import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ProductsList from '../components/ProductsList'
import { fetchCollection } from '../features/collection/collectionSlice'

const Products = () => {
  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => state.collection.collection)
  const loading = useAppSelector((state) => state.collection.loading)

  useEffect(() => {
    dispatch(fetchCollection())
  }, [])

  return (
    <section className="mt-28 py-10">
      <div className="max-w-4xl mx-auto px-10">
        <h1 className="text-3xl font-bold">商品一覧</h1>
        <ul className="grid grid-cols-3 gap-10">
          {collection?.map((product) => (
            <ProductsList key={product.id} loading={loading} {...product} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Products
