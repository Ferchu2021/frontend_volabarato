import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import travelReducer from './slices/travelSlice'
import subscriberReducer from './slices/subscriberSlice'
import bookingReducer from './slices/bookingSlice'
import userReducer from './slices/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    travels: travelReducer,
    subscribers: subscriberReducer,
    bookings: bookingReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
