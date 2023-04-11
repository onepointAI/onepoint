import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { baseApiHost } from '../../app/api'
import { timeoutPromise } from '../../utils/fetch'

interface ChatModule {
  resp: string
  visible: boolean
  inputDiabled: boolean
  respErr: boolean
  respErrMsg: string
  curPrompt: string
  isGenerating: boolean
}

export const initialState: ChatModule = {
  resp: '',
  visible: false,
  inputDiabled: false,
  respErr: false,
  respErrMsg: '',
  curPrompt: '',
  isGenerating: false,
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
    setRespErr: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.respErr = payload
    },
    setRespErrMsg: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.respErrMsg = payload
    },
    setCurPrompt: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.curPrompt = payload
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.isGenerating = payload
    },
  },
})

export const {
  saveResp,
  setVisible,
  setInputDisabled,
  setRespErr,
  setRespErrMsg,
  setCurPrompt,
  setGenerating,
} = chatSlice.actions

export const fetchChatResp = createAsyncThunk(
  'chat/fetchChatResp',
  async (
    args: {
      prompt: string
      preset: string
    },
    { dispatch }
  ) => {
    const { prompt, preset } = args
    dispatch(setInputDisabled(true))
    dispatch(setRespErr(false))
    dispatch(setGenerating(true))

    const request = async () => {
      const response = await fetch(`${baseApiHost}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          preset,
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
    }

    Promise.race([
      timeoutPromise(
        5000,
        'Network congestion, check whether you have set up a proxy'
      ),
      request(),
    ])
      .then()
      .catch(e => {
        dispatch(setVisible(true))
        dispatch(setRespErr(true))
        dispatch(setRespErrMsg(e.message))
      })
      .finally(() => {
        dispatch(setGenerating(false))
        dispatch(setInputDisabled(false))
      })
  }
)
export default chatSlice.reducer
