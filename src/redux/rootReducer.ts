import { combineReducers } from '@reduxjs/toolkit';

import { authSlice } from '../pages/SignIn/slice';
import { playlistsSlice } from '../pages/Playlists/slice';
import { playerSlice } from '../pages/Player/slice';

const appReducer = combineReducers({
  auth: authSlice.reducer,
  playlists: playlistsSlice.reducer,
  player: playerSlice.reducer
});

const rootReducer = (
  state: any,
  action: any,
): ReturnType<typeof appReducer> => {
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export type RootType = typeof rootReducer;

export default rootReducer;