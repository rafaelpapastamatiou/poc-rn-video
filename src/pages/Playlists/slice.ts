import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../services/api';

export type Video = {
  id: number;
  url: string;
  title: string;
}

type Playlist = {
  id: number;
  name: string;
  videos: Video[];
}

type InitialState = {
  playlists: Playlist[];
  isFetching: boolean;
  isError: boolean;
  error?: string;
}

export const getPlaylists = createAsyncThunk<any, undefined, {}>(
  'playlists/getPlaylists', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Playlist[]>('/playlists')

      if(response.status !== 200) {
        return rejectWithValue(response.data)
      }

      return response.data
    }
    catch(err) {
      console.log(err)
      return rejectWithValue(err.message)
    }
})

const initialState: InitialState = {
  playlists: [],
  isError: false,
  isFetching: false,
  error: ""
}

export const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPlaylists.pending, 
      (state) => {
        state.isFetching = true;
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      getPlaylists.fulfilled, 
      (state, { payload }) => {
        state.isFetching = false;
        state.playlists = payload;
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      getPlaylists.rejected, 
      (state, { error }) => {
        state.isFetching = false;
        state.isError = true;
        state.error = error.message;
      }
    )
  }
});