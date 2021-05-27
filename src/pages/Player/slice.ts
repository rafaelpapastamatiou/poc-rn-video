import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../services/api';

export type VideoFeedback = {
  id?: number;
  comment: string;
  rate: number;
}

type InitialState = {
  feedback: VideoFeedback;
  isFetching: boolean;
  isSaving: boolean;
  isError: boolean;
  error?: string;
}

interface GetFeedbackProps {
  videoId: number;
}

interface SetFeedbackProps {
  videoId: number;
  rate: number;
  comment: string;
}

export const getFeedback = createAsyncThunk<any, GetFeedbackProps, {}>(
  'player/getFeedback', 
  async ({ videoId }, { rejectWithValue }) => {
    try {
      const response = await api.get<VideoFeedback>(`/videos/${videoId}/feedback`)

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

export const setFeedback = createAsyncThunk<any, SetFeedbackProps, {}>(
  'player/setFeedback', 
  async ({ videoId, comment, rate }, { rejectWithValue }) => {
    try {
      const response = await api.put<VideoFeedback>(
        `/videos/${videoId}/feedback`,
        {
          comment,
          rate
        }
      )

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
  feedback: {
    comment: '',
    rate: 0
  },
  isError: false,
  isFetching: false,
  isSaving: false,
  error: ""
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getFeedback.pending, 
      (state) => {
        state.isFetching = true;
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      getFeedback.fulfilled, 
      (state, { payload }) => {
        state.isFetching = false;
        state.feedback = payload;
        state.isError = false;
        state.error = '';
      }
    ),
    builder.addCase(
      getFeedback.rejected, 
      (state, { error }) => {
        state.isFetching = false;
        state.isError = true;
        state.error = error.message;
        state.feedback = initialState.feedback;
      }
    ),
    builder.addCase(
      setFeedback.pending,
      (state) => {
        state.isSaving = true;
        state.isError = false;
        state.isFetching = false;
        state.error = ';'
      }
    ),
    builder.addCase(
      setFeedback.fulfilled,
      (state, { payload }) => {
        state.feedback = payload;
        state.isSaving = false;
        state.isFetching = false;
        state.isError = false;
      }
    ),
    builder.addCase(
      setFeedback.rejected,
      (state, { error }) => {
        state.isSaving = false;
        state.isError = true;
        state.isFetching = false;
        state.error = error.message;
        state.feedback = initialState.feedback;
      }
    )
  }
});