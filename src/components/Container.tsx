import React, { FC, HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

const Container: FC<Props> = ({ children, className: addClass, ...Props }) => {
  const defaultClass = 'max-w-4xl mx-auto px-10'
  const newClass = addClass ? `${defaultClass} ${addClass}` : defaultClass
  return (
    <div {...Props} className={newClass}>
      {children}
    </div>
  )
}

export default Container
