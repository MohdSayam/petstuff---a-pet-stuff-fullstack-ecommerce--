import {configureStore} from '@reduxjs/toolkit';
// Import your reducers here as you create them
// import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer, 
  },
});