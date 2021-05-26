import React from 'react'
import { useRoute } from '@react-navigation/core'
import { Center } from 'native-base'
import Video from 'react-native-video'
import { RouteProp } from '@react-navigation/native'

type PlayerRouteParams = RouteProp<{ params: { url: string } }, 'params'>

export function Player(){
  const { params } = useRoute<PlayerRouteParams>()

  return (
    <Center flex={1}>
      <Video 
        source={{
          uri: params.url
        }}
      />
    </Center>
  )
}