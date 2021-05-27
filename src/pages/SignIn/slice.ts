import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../services/api';

type User = {
  id: number;
  name: string;
  email: string;
}

type InitialState = {
  user?: User;
  isFetching: boolean;
  isError: boolean;
  error?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface SignInSuccessData {
  user: User;
  token: string;
}

export const signIn = createAsyncThunk<any, SignInData, {}>(
  'auth/signin', 
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post<SignInSuccessData>('/signin', { email, password })

      if(response.status !== 200) {
        return rejectWithValue(response.data)
      }

      await AsyncStorage.setItem('auth', JSON.stringify(response.data))

      api.defaults.headers.authorization = response.data.token;
      // Para teste
      api.defaults.headers.user = response.data.user.id

      return response.data
    }
    catch(err) {
      console.log(err)
      return rejectWithValue(err.message ? err.message : err)
    }
})

export const signOut = createAsyncThunk<any, undefined, {}>(
  'auth/signOut', 
  async () => {
    await AsyncStorage.removeItem('auth')
    return true;
})

const initialState: InitialState = {
  user: undefined,
  isFetching: false,
  isError: false,
  error: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      signIn.pending, 
      (state) => {
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      signIn.fulfilled, 
      (state, { payload }) => {
        state.isFetching = false;
        state.user = payload;
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      signIn.rejected, 
      (state, { error }) => {
        state.isFetching = false;
        state.isError = true;
        state.error = error.message;
      }
    ),
    builder.addCase(
      signOut.fulfilled,
      (state) => {
        state.user = undefined;
      }
    )
  }
});