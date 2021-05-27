import React, { ReactNode } from 'react'
import { Center } from 'native-base'

interface ContentProps {
  children: ReactNode;
}

export const Content = ({
  children
}: ContentProps) => {
  return (
    <Center flex={1} backgroundColor='#171717'>
      {children}
    </Center>
  )
}