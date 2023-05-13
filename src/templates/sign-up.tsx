import { Button } from '@mui/material'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import TextInput from '../components/text-input'
import { logOut, signUp } from '../features/auth/authSlice'

const SignUp = () => {
  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const inputUser = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setUser(e.target.value)
      console.log(user)
    },
    // [user, setUser]
    [setUser, user]
  )

  const inputEmail = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setEmail(e.target.value)
    },
    [setEmail]
  )
  const inputPassword = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPassword(e.target.value)
    },
    [setPassword]
  )
  const inputConfirm = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setConfirm(e.target.value)
    },
    [setConfirm]
  )

  const dispatch = useAppDispatch()
  // const authUser = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()

  return (
    <div className="py-40 bg-white">
      <div className="mx-auto px-6 max-w-2xl">
        <h2 className="text-xl font-bold">アカウント登録</h2>
        <div className="grid grid-columns-1 gap-5 mt-7">
          <TextInput
            label="name"
            fullWidth={true}
            id="name"
            required={true}
            type="text"
            name="name"
            onChange={inputUser}
          />
          <TextInput
            label="email"
            fullWidth={true}
            id="email"
            required={true}
            type="email"
            name="email"
            onChange={inputEmail}
          />
          <TextInput
            label="password"
            fullWidth={true}
            id="password"
            required={true}
            type="password"
            name="password"
            onChange={inputPassword}
          />
          <TextInput
            label="password再確認"
            fullWidth={true}
            id="confirm"
            required={true}
            type="password"
            name="confirm"
            onChange={inputConfirm}
          />
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: '1.4rem', fontWeight: 700 }}
            onClick={async () => {
              console.log('click!')
              const data = await dispatch(
                signUp(user, email, password, confirm)
              )
              data && navigate('/')
            }}
          >
            送信
          </Button>
          <Button variant="outlined">削除</Button>
        </div>
      </div>
    </div>
  )
}

export default SignUp
