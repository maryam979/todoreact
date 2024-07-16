// Assuming your redux store setup is like this:
// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import drawerSlice from './drawerSlice';
import  authSlice from './authSlice';
// Import other reducers as needed
const store = configureStore({
  reducer: {
    drawer: drawerSlice.reducer,
    auth : authSlice.reducer,
    
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
