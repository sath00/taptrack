import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { persistStore, persistReducer } from 'redux-persist'
import storage from './storage'
import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
}

const rootReducer = combineReducers({
  auth: authSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  })

  const persistor = persistStore(store)

  // Create extended store type with persistor
  const extendedStore = Object.assign(store, {
    __persistor: persistor
  })

  return extendedStore
}

export const wrapper = createWrapper(makeStore, { debug: false })

// Infer types from the store
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
