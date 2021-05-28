import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Center, Flex, Text, VStack, Icon } from 'native-base';
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { Feather } from '@expo/vector-icons'

import { Input } from '../../components/Input';
import { useAppDispatch } from '../../hooks/redux';
import { signIn } from './slice'
import { Content } from '../../components/Content';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatóŕia'),
});

export function SignIn() {
  const dispatch = useAppDispatch()

  const { control, handleSubmit, formState, setFocus, reset } = useForm({
    resolver: yupResolver(signInFormSchema)
  })

  const { isSubmitting, errors } = formState

  const handleSignIn = useCallback<SubmitHandler<SignInFormData>>(
    async ({ email, password }) => {
      await dispatch(signIn({ email, password }))
    }, 
    [dispatch]
  )

  return (
    <Content>
      <Flex width='100%' px='8' direction='column' alignItems='center' >
        <VStack space='md'>
          <Input
            label='E-mail'
            onSubmitEditing={() => setFocus('password')}
            returnKeyType='next'
            InputLeftElement={<Icon as={<Feather name="user" />} size='sm' ml='4'/>}
            error={errors.email}
            controller={{
              name: "email",
              control,
              rules: {
                required: true
              },
              defaultValue: ""
            }}
          />
          <Input
            label='Senha'
            type='password'
            returnKeyType='send'
            InputLeftElement={<Icon as={<Feather name="lock" />} size='sm' ml='4' />}
            error={errors.password}
            controller={{
              name: "password",
              control,
              rules: {
                required: true
              },
              defaultValue: ""
            }}
            onSubmitEditing={handleSubmit(handleSignIn)}
          />
        </VStack>
        <Button 
          colorScheme='pink'  
          mt='8' 
          variant='solid' 
          onPress={handleSubmit(handleSignIn)}
          isLoading={isSubmitting}
        >
          <Text>
            ENTRAR
          </Text>
        </Button>
        <Text textAlign='center' mt='4' fontSize='sm'>ESQUECI MINHA SENHA</Text>
      </Flex>
    </Content>
  );
}
