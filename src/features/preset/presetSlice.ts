import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  BuiltInPlugins,
  Chat,
  Translate,
  Summarize,
  Code,
  Analyze,
} from '../../app/constants'
import { PresetModule, PresetType } from '../../@types'

export const presetMap = {
  [Chat]: '',
  [Translate]: '请翻译以下内容：',
  [Summarize]: '请总结以下内容：',
  [Code]:
    '请重构这段代码，并返回高亮显示的语法(markdown)，注意不需要辅助说明：',
  [Analyze]: '请分析以下内容的含义：',
}

export const initialState: PresetModule = {
  listVisible: false,
  builtInPlugins: BuiltInPlugins,
  currentPreset: Chat,
}

export const presetSlice = createSlice({
  name: 'preset',
  initialState,
  reducers: {
    setListVisible: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.listVisible = payload
    },
    setPreset: (state, action: PayloadAction<PresetType>) => {
      const { payload } = action
      state.currentPreset = payload
    },
  },
})

export const { setListVisible, setPreset } = presetSlice.actions
export default presetSlice.reducer
