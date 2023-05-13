import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import ProductCard from '../components/product-card'
import { fetchCollection } from '../features/collection/collectionSlice'

const Collection = () => {
  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => state.collection.collection)
  const loading = useAppSelector((state) => state.collection.loading)

  useEffect(() => {
    dispatch(fetchCollection())
  }, [])

  return (
    <>
      <div className="h-[100px]"></div>
      <section className="py-10 max-w-4xl m-auto">
        <div className="mb-10">
          <h2 className="font-bold text-blue-800 text-2xl">商品一覧</h2>
        </div>
        <ul className="grid grid-cols-3 gap-4">
          {collection?.map((item) => {
            return <ProductCard key={item.id} loading={loading} {...item} />
          })}
        </ul>
      </section>
    </>
  )
}

export default Collection
