import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { 
  persistStore, 
  persistReducer, 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from 'redux-persist'

import AsyncStorage from '@react-native-async-storage/async-storage'

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'persistedReducer',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export let persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch;