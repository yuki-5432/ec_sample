import { Button } from '@mui/material'
import React, { ChangeEvent, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import TextInput from '../components/text-input'
import {
  logOut,
  sendPasswordMail,
  signIn,
  signUp,
} from '../features/auth/authSlice'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  const user = useAppSelector((state) => state.auth.user)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <div className="py-40 bg-white">
      <div className="mx-auto px-6 max-w-2xl">
        <h2 className="text-xl font-bold">ログイン</h2>
        <div className="grid grid-columns-1 gap-5 mt-7">
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
        </div>
        <div className="mt-8 flex justify-center space-x-8">
          <Button
            variant="contained"
            size="large"
            sx={{ fontSize: '1.4rem', fontWeight: 700 }}
            onClick={async () => {
              console.log('click!')
              const data = await dispatch(signIn(email, password))
              data && navigate('/')
            }}
          >
            送信
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            sx={{ fontSize: '1.2rem', fontWeight: 700 }}
            onClick={async () => {
              await dispatch(logOut())
              alert('ログアウトしました')
              navigate('/')
            }}
          >
            ログアウト
          </Button>
        </div>
        {!user?.uid && (
          <Button
            sx={{
              marginTop: '20px',
              textDecoration: 'underline',
            }}
            onClick={() => dispatch(sendPasswordMail(email))}
          >
            パスワードを忘れた場合
          </Button>
        )}
      </div>
    </div>
  )
}

export default SignIn
