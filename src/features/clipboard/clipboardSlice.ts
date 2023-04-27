import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClipboardModule {
  selectTxt: string
  selectApp: string
  url: string
}

interface Selection {
  txt: string
  app: string
}

interface Url {
  url: string
}

export const initialState: ClipboardModule = {
  selectTxt: '',
  selectApp: '',
  url: '',
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
    setUrl: (state, action: PayloadAction<Url>) => {
      const { payload } = action
      state.url = payload.url
    },
  },
})

export const { setSelection, setUrl } = clipboardSlice.actions
export default clipboardSlice.reducer
