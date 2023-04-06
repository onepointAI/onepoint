import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingModule {
  visible: boolean
}

export const initialState: SettingModule = {
  visible: false,
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setVisible: (state, action: PayloadAction<boolean>) => {
      const { payload } = action
      state.visible = payload
    },
  },
})

export const { setVisible } = settingSlice.actions
export default settingSlice.reducer
