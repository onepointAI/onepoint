import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { baseApiHost } from '../../app/api'

interface ChatModule {
  resp: string
  visible: boolean
  inputDiabled: boolean
}

export const initialState: ChatModule = {
  resp: '',
  visible: true,
  inputDiabled: false,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    saveResp: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.resp = payload
    },
    setVisible: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.visible = payload
    },
    setInputDisabled: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.inputDiabled = payload
    },
  },
})

export const { saveResp, setVisible, setInputDisabled } = chatSlice.actions
export const fetchChatResp = createAsyncThunk(
  'chat/fetchChatResp',
  async (
    args: {
      question: string
    },
    { dispatch }
  ) => {
    const { question } = args
    dispatch(setInputDisabled(true))
    const response = await fetch(`${baseApiHost}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
      }),
    })

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader()

    let str = ''
    let shown = false
    while (true) {
      if (!reader) break
      const { value, done } = await reader.read()
      if (done) break
      if (!shown) {
        dispatch(setVisible(true))
        shown = true
      }
      str += value
      console.log('resp:', str)
      dispatch(saveResp(str))
    }
    dispatch(setInputDisabled(false))
  }
)
export default chatSlice.reducer
