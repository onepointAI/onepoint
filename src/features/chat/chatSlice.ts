import axios from 'axios'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

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
    await axios
      .post('http://127.0.0.1:4000/ask', {
        question,
      })
      .then(response => {
        const { code, result } = response.data
        if (code === 0) {
          const { message } = result[0]
          const { content } = message
          dispatch(saveResp(content))
          dispatch(saveResp(content))
          dispatch(setVisible(true))
        } else {
          dispatch(saveResp(JSON.stringify(response)))
          dispatch(setVisible(true))
        }
      })
      .catch(error => {
        dispatch(saveResp(error.message))
        dispatch(setVisible(true))
      })
      .finally(() => {
        dispatch(setInputDisabled(false))
      })
  }
)
export default chatSlice.reducer
