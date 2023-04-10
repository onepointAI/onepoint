import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { timeoutPromise } from '../../utils/fetch'
import { baseApiHost } from '../../app/api'
interface SettingModule {
  visible: boolean
  billUsage: number
}

export const initialState: SettingModule = {
  visible: false,
  billUsage: 0,
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setVisible: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.visible = payload
    },
    setUsage: (state, action: PayloadAction<number>) => {
      const { payload } = action
      state.billUsage = payload
    },
  },
})

export const { setVisible } = settingSlice.actions

export const fetchChatResp = createAsyncThunk(
  'chat/fetchChatResp',
  async () => {
    const request = async () => {
      await fetch(`${baseApiHost}/bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: '2023-01-11',
          end_date: '2023-12-24',
        }),
      })
    }

    Promise.race([
      timeoutPromise(
        5000,
        'Network congestion, check whether you have set up a proxy'
      ),
      request(),
    ])
      .then()
      .catch(e => {})
      .finally(() => {})
  }
)

export default settingSlice.reducer
