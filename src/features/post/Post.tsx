import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { addPost, removePost } from './postSlice'

const Post = () => {
  const postData = useSelector((state: RootState) => state.post.value)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')

  const dispatch = useDispatch()

  const postAdd = () => {
    dispatch(
      addPost({
        id: postData.length,
        name: name,
        content: content,
      })
    )

    setName('')
    setContent('')
  }

  const remove = (e: number) => {
    dispatch(removePost(e))
  }

  return (
    <div className="bg-black py-12">
      <div className="w-[960px] mx-auto px-8">
        <ul>
          {postData.map((item) => {
            return (
              <li key={item.id}>
                <div className="p-4 bg-blue-800 text-white shadow-md text-4xl font-bold">
                  {item.name}
                </div>
                <p className="text-justify bg-white text-black text-2xl p-8">
                  {item.content}
                </p>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={() => remove(item.id)}
                >
                  削除
                </button>
              </li>
            )
          })}
        </ul>
        <div className="py-20">
          <input
            className="p-8 text-xl mr-12 text-black"
            type="text"
            placeholder="お名前"
            onChange={(e) => setName(e.currentTarget.value)}
            value={name}
          />
          <input
            className="p-8 text-xl text-black"
            type="text"
            placeholder="投稿内容"
            onChange={(e) => setContent(e.currentTarget.value)}
            value={content}
          />
          <div className="mt-10">
            <button className="btn-primary" type="button" onClick={postAdd}>
              投稿
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post
