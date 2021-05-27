import React, { useCallback, useEffect } from 'react';
import { Center, Accordion, Spinner, List, ArrowForwardIcon, Icon } from 'native-base';
import { Feather } from '@expo/vector-icons'
import {
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';

import { getPlaylists, Video as VideoType } from './slice'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Content } from '../../components/Content';

export function Playlist() {
  const navigation = useNavigation()

  const dispatch = useAppDispatch()

  const { isFetching, playlists } = useAppSelector((state) => state.playlists)
  
  useEffect(() => {
    dispatch(getPlaylists())
  } , [dispatch])

  const handleOpenVideo = useCallback((video: VideoType) => {
    navigation.navigate('Player', { id: video.id, title: video.title, url: video.url })
  }, [navigation])

  return (
    <Content>
      {isFetching 
      ? (
        <Spinner />
      )
      : (
        <Accordion index={[0]} flex={1} width='100%' borderRadius='0'>
          {playlists.map((playlist) => (
            <Accordion.Item key={playlist.id}>
              <Accordion.Summary>
                {playlist.name}
              </Accordion.Summary>
              <Accordion.Details>
                {playlist.videos.length > 0 && (
                  <List border='none' width='100%'>
                    {playlist.videos.map(video => (
                      <TouchableNativeFeedback 
                        key={video.id} 
                        onPress={() => handleOpenVideo(video)} 
                        style={{ width: '100%' }}
                      >
                        <List.Item 
                          _hover={{
                            backgroundColor: 'trueGray.800',
                            cursor: 'pointer'
                          }}
                          width='100%'
                        >
                          <List.Icon 
                            as={ <Icon as={<Feather name="play-circle" />} />} 
                            size={2} 
                            color='brand.900'
                          />
                          {video.title}
                        </List.Item>
                      </TouchableNativeFeedback>
                    ))}
                  </List>
                )}
              </Accordion.Details>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Content>
  )
}