import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import { useRoute } from '@react-navigation/core'
import { Button, Center, Fab, Icon, Modal, VStack } from 'native-base'
import { RouteProp } from '@react-navigation/native'
import Video from 'react-native-video'
import { Ionicons } from '@expo/vector-icons'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AirbnbRating } from 'react-native-ratings'

import { Input } from '../../components/Input'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { Content } from '../../components/Content'
import { getFeedback, setFeedback } from './slice'

type PlayerRouteParams = RouteProp<{ params: { url: string; id: number; title: string; } }, 'params'>

type VideoRateFormData = {
  comment: string;
};

const videoRateSchema = yup.object().shape({
  comment: yup.string().optional(),
});

export function Player(){
  const { params } = useRoute<PlayerRouteParams>()

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getFeedback({ videoId: params.id }))
  }, [dispatch])

  const { comment, rate, id } = useAppSelector(state => state.player.feedback)

  const [currentRate, setCurrentRate] = useState(rate || 0)

  useEffect(() => {
    if(currentRate === 0) {
      setCurrentRate(rate)
    }
  }, [rate, currentRate])

  const [ playing, setPlaying ] = useState(true)
  const [ finished, setFinished ] = useState(false)
  const [ showRateModal, setShowRateModal ] = useState(false)

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(videoRateSchema)
  })

  const { isSubmitting, errors } = formState

  const handleSetVideoFinished = useCallback(() => {
    setFinished(true)
  }, [])

  const handleToggleRateModal = useCallback(() => {
    setShowRateModal(state => !state)
    if(playing){
      setPlaying(state => !state)
    }
  }, [playing])

  const handleSubmitRate = useCallback<SubmitHandler<VideoRateFormData>>(
    async ({ comment }) => {
      await dispatch(setFeedback({ videoId: params.id, comment, rate: currentRate }))
    }, 
    [dispatch, currentRate]
  )

  const handleUpdateRateValue = useCallback((value: number) => {
    setCurrentRate(value)
  }, [])

  return (
    <Content>
      <Video 
        paused={!playing}
        source={{
          uri: params.url
        }}
        controls={true}
        style={styles.player}
        resizeMode='contain'
        onEnd={handleSetVideoFinished}
      />
      <Fab
        icon={<Icon as={<Ionicons name='star' />} color='brand.900' />}
        backgroundColor='trueGray.800'
        onPress={(event) => {
          event.persist()
          handleToggleRateModal()
        }}
        placement='top-right'
      />
      <Modal 
        isOpen={showRateModal} 
        onClose={(event: any) => {
          if(event){
            event.persist()
          }
          handleToggleRateModal()
        }}
        closeOnOverlayClick
      >
        <Modal.Content>
          <Modal.CloseButton/>
          <Modal.Header>Avaliar vídeo</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <AirbnbRating 
                reviews={['Muito ruim', 'Ruim', 'Ok', 'Bom', 'Muito bom']} 
                count={5}
                onFinishRating={handleUpdateRateValue}
                defaultRating={currentRate}
              />
              <Input 
                placeholder='Faça um comentário a respeito do vídeo' 
                controller={{
                  name: 'comment',
                  control,
                  defaultValue: comment || '',
                }}
                error={errors.comment}
                multiline={true}
                numberOfLines={4}
                textAlignVertical='top'
              />
            </VStack>
            <Button 
              mt='8' 
              colorScheme='pink' 
              _text={{
                fontSize: 'lg'
              }}
              onPress={handleSubmit(handleSubmitRate)}
              isLoading={isSubmitting}
            >
              {id ? 'ATUALIZAR' : 'ENVIAR'}
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Content>
  )
}

var styles = StyleSheet.create({
  player: {
    borderWidth: 1,
    flex: 1,
    width: '100%'
  },
});