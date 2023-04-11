import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { timeoutPromise } from '../../utils/fetch'
import { baseApiHost } from '../../app/api'
interface SettingModule {
  visible: boolean
  billUsage: number
  apikey: string
  loadAccount: boolean
  usemodel: string
  minimal: boolean
}

export const initialState: SettingModule = {
  visible: false,
  loadAccount: true,
  billUsage: 0,
  apikey: '',
  usemodel: '',
  minimal: true,
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
    setApikey: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.apikey = payload
    },
    setUsemodel: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.usemodel = payload
    },
    setLoadAccount: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.loadAccount = payload
    },
    setMinimal: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.minimal = payload
    },
  },
})

export const {
  setVisible,
  setUsage,
  setApikey,
  setUsemodel,
  setLoadAccount,
  setMinimal,
} = settingSlice.actions

export const fetchAccountDetail = createAsyncThunk(
  'setting/fetchAccountDetail',
  async (
    args: {
      date: string
    },
    { dispatch }
  ) => {
    const { date } = args
    dispatch(setLoadAccount(true))
    const request = async () => {
      const response = await fetch(`${baseApiHost}/account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_date: '2023-01-01',
          end_date: date,
        }),
      })
      return response.json()
    }

    Promise.race([
      timeoutPromise(
        5000,
        'Network congestion, check whether you have set up a proxy'
      ),
      request(),
    ])
      .then(resp => {
        const {
          basic: { apiKey, usemodel },
          usageData,
        } = resp.result
        dispatch(setApikey(apiKey))
        dispatch(setUsemodel(usemodel))
        if (resp.code === 0) {
          dispatch(setUsage(Math.round(usageData.total_usage)))
        }
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => {
        dispatch(setLoadAccount(false))
      })
  }
)

export default settingSlice.reducer
