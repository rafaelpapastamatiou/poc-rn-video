import React, { useCallback } from 'react'
import { Button, Icon } from 'native-base'
import { Feather } from '@expo/vector-icons'

import { Content } from '../../components/Content'
import { useAppDispatch } from '../../hooks/redux'
import { signOut } from '../SignIn/slice'

export function Menu(){
  const dispatch = useAppDispatch()

  const handleSignOut = useCallback(async() => {
    await dispatch(signOut())
  }, [dispatch])

  return (
    <Content>
      <Button
        startIcon={(
          <Icon 
            as={<Feather name='log-out' />}
          />
        )}
        colorScheme='pink'
        onPress={handleSignOut}
      >
        Sign out
      </Button>
    </Content>
  )
}