import React from 'react'
import { useRoute } from '@react-navigation/core'
import { Center } from 'native-base'
import { RouteProp } from '@react-navigation/native'

type PlayerRouteParams = RouteProp<{ params: { url: string } }, 'params'>

export function Player(){
  const { params } = useRoute<PlayerRouteParams>()

  return (
    <Center flex={1}>
     
    </Center>
  )
}