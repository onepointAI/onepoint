import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BuiltInPlugins,
  Casual,
  Translate,
  Summarize,
  Prettier,
  Analyze,
} from '../../app/constants'

export const presetMap = {
  [Casual]: '',
  [Translate]: '请翻译以下内容：',
  [Summarize]: '请总结以下内容：',
  [Prettier]: '请直接重构这段代码：',
  [Analyze]: '请分析以下内容的含义：',
}

interface PresetType {
  logo: string
  id: string
  title: string
  loading: boolean
}

interface PresetModule {
  listVisible: boolean
  builtInPlugins: PresetType[]
  currentPreset: string
}

export const initialState: PresetModule = {
  listVisible: false,
  builtInPlugins: BuiltInPlugins,
  currentPreset: Casual,
}

export const presetSlice = createSlice({
  name: 'preset',
  initialState,
  reducers: {
    setListVisible: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.listVisible = payload
    },
    setPreset: (state, action: PayloadAction<string>) => {
      const { payload } = action
      state.currentPreset = payload
    },
  },
})

export const { setListVisible, setPreset } = presetSlice.actions
export default presetSlice.reducer
