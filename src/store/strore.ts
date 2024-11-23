import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tabReducer from './tabSlice';
import licenseReducer from './licenseSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    tab: tabReducer,
    license: licenseReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;