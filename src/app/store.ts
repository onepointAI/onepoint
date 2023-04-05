import { configureStore, combineReducers } from '@reduxjs/toolkit'
import chatReducer, { initialState as chatInitState } from '../features/chat/chatSlice'
import presetReducer, { initialState as presetInitState } from '../features/preset/presetSlice'
import settingReducer, { initialState as settingInitState } from '../features/setting/settingSlice'
import clipboardReducer, { initialState as clipboardInitState } from '../features/clipboard/clipboardSlice'

export type StateType = {
  chat: typeof chatInitState;
  preset: typeof presetInitState;
  setting: typeof settingInitState;
  clipboard: typeof clipboardInitState;
}

export const initialState: StateType = {
  chat: chatInitState,
  preset: presetInitState,
  setting: settingInitState,
  clipboard: clipboardInitState
} 

const store = configureStore({
  reducer: combineReducers({
    chat: chatReducer,
    preset: presetReducer,
    setting: settingReducer,
    clipboard: clipboardReducer
  }),
  preloadedState: initialState,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store