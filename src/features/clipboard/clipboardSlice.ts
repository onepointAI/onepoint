import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClipboardModule {
  selectTxt: string
  selectApp: string
}

interface Selection {
  txt: 'string'
  app: 'app'
}

export const initialState: ClipboardModule = {
  selectTxt: '',
  selectApp: '',
}

export const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<Selection>) => {
      const { payload } = action
      state.selectTxt = payload.txt
      state.selectApp = payload.app
    },
  },
})

export const { setSelection } = clipboardSlice.actions
export default clipboardSlice.reducer
