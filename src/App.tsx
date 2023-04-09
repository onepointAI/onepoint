import React, { useEffect, useRef, useState } from 'react'
import { Input, Image } from 'antd'
import { GlobalStyle } from './styles/GlobalStyle'

import { ChatPanel } from './components/ChatPanel'
import { Setting } from './components/Setting'
import { Preset } from './components/Preset'
import { Logo } from './components/Logo'
// import { History } from './components/History'

import { useAppDispatch, useAppSelector } from './app/hooks'
import {
  setVisible as setChatVisible,
  setInputDisabled,
  fetchChatResp,
} from './features/chat/chatSlice'
import {
  setListVisible as setPresetListVisible,
  setPreset,
  presetMap,
} from './features/preset/presetSlice'
import { setVisible as setSettingVisible } from './features/setting/settingSlice'
import { setSelection } from './features/clipboard/clipboardSlice'

const { TextArea } = Input
export function App() {
  const [question, setQuestion] = useState<string>()
  const [inputVisible] = useState<boolean>(true)
  // const [selection] = useState<string>('')
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const clipboardState = useAppSelector(state => state.clipboard)
  const dispatch = useAppDispatch()
  useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    window.addEventListener('mousemove', event => {
      // TODO
      // let flag = event.target === document.documentElement
      // // @ts-ignore
      // window.Main.setWinMouseIgnore(flag)
    })
    window.Main.on('clipboard_change', (text: string) => {
      setQuestion(text)
    })

    window.Main.on(
      'selection_change',
      (selection: { txt: string; app: string }) => {
        const { txt, app } = selection
        // @ts-ignore
        dispatch(setSelection({ txt, app }))
        dispatch(setChatVisible(!!txt && !!app))
      }
    )

    window.Main.on('setting_show', () => showSetting())
  }, [])

  const showSetting = () => {
    dispatch(setPresetListVisible(false))
    dispatch(setSettingVisible(true))
    dispatch(setChatVisible(false))
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value
    switch (val) {
      case '/':
        dispatch(setPresetListVisible(true))
        dispatch(setSettingVisible(false))
        dispatch(setChatVisible(false))
        break
      case '/s':
        showSetting()
        break
      default:
        dispatch(setPresetListVisible(false))
        dispatch(setSettingVisible(false))
        dispatch(setChatVisible(false))
    }
    setQuestion(val)
  }

  const onPresetChange = (preset: string) => {
    dispatch(setPreset(preset))
    // 如果selection有值表示有选中文案
    // if (selection) {
    //   search(selection)
    //   dispatch(setPresetListVisible(false))
    // }
  }

  const search = async (newQuestion?: string) => {
    if (!question) return
    dispatch(setInputDisabled(true))
    dispatch(
      fetchChatResp({
        // @ts-ignore
        question: `${presetMap[presetState.currentPreset]}${question}
      `,
      })
    )
  }

  const preset = presetState.builtInPlugins.filter(
    p => p.title === presetState.currentPreset
  )
  const presetIcon = preset.length > 0 ? preset[0].logo : null

  return (
    <>
      <GlobalStyle />
      <div style={styles.container}>
        {/* @ts-ignore */}
        <div style={styles.inputWrap}>
          {presetIcon ? (
            <Image width={30} preview={false} src={presetIcon} />
          ) : null}
          {inputVisible ? (
            <Input
              placeholder="Enter '/' to process the selection, or directly enter the box to ask questions"
              allowClear
              onChange={onInputChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={question}
              size="large"
              onPressEnter={() => search()}
              disabled={chatState.inputDiabled}
            />
          ) : (
            <TextArea
              placeholder="Enter '/' to process the selection, or directly enter the box to ask questions"
              allowClear
              onChange={onInputChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={question}
              size="large"
            />
          )}
          <Logo />
        </div>
        <ChatPanel />
        <Preset onPresetChange={onPresetChange} />
        <Setting />
      </div>
    </>
  )
}

const padding = 15
const styles = {
  container: {
    backgroundColor: '#FFF',
    border: 'none',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    border: 'none',
    borderWidth: 0,
    borderColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding,
  },
}
