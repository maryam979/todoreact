import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState: {
    open: false,
  },
  reducers: {
    open: (state) => {
      state.open  = true
    },
    close: (state) => {
      state.open  = false
    },
    setOpen: (state, action:PayloadAction<boolean>) => {
      state.open = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
// export const { open, close, setOpen } = drawerSlice.actions

export default drawerSlice