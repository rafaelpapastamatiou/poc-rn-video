import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../services/api';

type User = {
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

      return response.data
    }
    catch(err) {
      console.log(err)
      return rejectWithValue(err.message ? err.message : err)
    }
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
  reducers: {},
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
    )
  }
});