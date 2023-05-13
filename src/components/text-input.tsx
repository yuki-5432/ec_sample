import React, { FC } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

const TextInput: FC<TextFieldProps> = ({ ...TextFieldProps }) => {
  return <TextField {...TextFieldProps} />
}

export default TextInput
