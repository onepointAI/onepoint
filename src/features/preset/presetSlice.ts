import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BuiltInPlugins, Casual } from '../../app/constants'
import { PresetModule, PresetType } from '../../@types'

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
    setPreset: (state, action: PayloadAction<PresetType>) => {
      const { payload } = action
      state.currentPreset = payload
    },
  },
})

export const { setListVisible, setPreset } = presetSlice.actions
export default presetSlice.reducer
