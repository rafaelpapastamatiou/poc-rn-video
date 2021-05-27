import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use(async(config) => {
  const authString = await AsyncStorage.getItem('auth')

  if(authString){
    const auth = JSON.parse(authString)
    config.headers.authorization = `Bearer ${auth.token}`

    if(process.env.NODE_ENV === 'development'){
      config.headers.user = auth.user.id
    }
  }

  return config;
})