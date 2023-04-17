import React, { useEffect, useRef, useState } from 'react'
import { Input, Image, message } from 'antd'
import PubSub from 'pubsub-js'
import { GlobalStyle } from './styles/GlobalStyle'
import { ChatPanel } from './components/ChatPanel'
import { Setting } from './components/Setting'
import { Preset } from './components/Preset'
import { Logo } from './components/Logo'
// import { defaultVals as settingDefaults } from './components/Setting/Basic'
// FullscreenExitOutlined

import { useAppDispatch, useAppSelector } from './app/hooks'
// import { StoreKey } from './app/constants'
import {
  setVisible as setChatVisible,
  setInputDisabled,
  fetchChatResp,
  setCurPrompt,
  saveResp,
} from './features/chat/chatSlice'
import {
  setListVisible as setPresetListVisible,
  setPreset,
} from './features/preset/presetSlice'
import {
  setVisible as setSettingVisible,
  // setMinimal,
} from './features/setting/settingSlice'
import { setUrl, setSelection } from './features/clipboard/clipboardSlice'
import { PresetType, PanelVisible } from './@types'

interface Tips {
  type: 'success' | 'error' | 'warning'
  message: string
}

export function App() {
  // const { TextArea } = Input
  // const [inputVisible] = useState<boolean>(true)
  // const [selection] = useState<string>('')
  // const [minimal, useMinimal] = useState<boolean>(settingDefaults.minimal)
  // const clipboardState = useAppSelector(state => state.clipboard)
  const [prompt, setPrompt] = useState<string>('')
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const settingState = useAppSelector(state => state.setting)
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useAppDispatch()
  useRef<HTMLTextAreaElement>(null)

  const preset = presetState.builtInPlugins.filter(
    p => p.title === presetState.currentPreset
  )
  const presetIcon = preset.length > 0 ? preset[0].logo : null

  useEffect(() => {
    window.addEventListener('mousemove', event => {
      // TODO
      // let flag = event.target === document.documentElement
      // // @ts-ignore
      // window.Main.setWinMouseIgnore(flag)
    })
    window.Main.on('clipboard_change', (text: string) => {
      setPrompt(text)
    })
    window.Main.on(
      'selection_change',
      (selection: { txt: string; app: string }) => {
        const { txt, app } = selection
        dispatch(setSelection({ txt, app }))
        dispatch(setChatVisible(!!txt && !!app))
      }
    )
    window.Main.on('url_change', (selection: { url: string }) => {
      const { url } = selection
      console.log('=== url change ===>', url)
      dispatch(setUrl({ url }))
      dispatch(setChatVisible(true))
    })
    window.Main.on('setting_show', () =>
      showPanel({
        setting: true,
      })
    )
    PubSub.subscribe('tips', (name: string, data: Tips) => {
      const { type, message } = data
      messageApi.open({
        type,
        content: message,
      })
    })
    PubSub.subscribe('showPanel', (name: string, data: PanelVisible) => {
      showPanel(data)
    })
    window.Main.setUsePreset('Chat')
  }, [])

  // const setStore = (key: string, value: string | boolean | number) => {
  //   window.Main.setStore(key, value)
  // }
  // const getMinimalMode = async () => {
  //   const simpleMode = await window.Main.getSettings(StoreKey.Set_SimpleMode)
  //   dispatch(setMinimal(simpleMode || false))
  // }
  // useEffect(() => {
  //   getMinimalMode()
  // }, [])
  // const changeMode = () => {
  //   // const mode = !minimal
  //   // useMinimal(mode)
  //   dispatch(setMinimal(!settingState.minimal))
  // }

  const showPanel = (options: PanelVisible) => {
    const { plugin, setting, chatPanel } = options
    dispatch(setPresetListVisible(!!plugin && !setting && !chatPanel))
    dispatch(setSettingVisible(!plugin && !!setting && !chatPanel))
    dispatch(setChatVisible(!plugin && !setting && !!chatPanel))
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value
    switch (val) {
      case '/':
        showPanel({
          plugin: true,
        })
        break
      case '/s':
        showPanel({
          setting: true,
        })
        break
      default:
        showPanel({})
    }
    setPrompt(val)
  }

  const onPresetChange = (preset: PresetType) => {
    dispatch(setPreset(preset))
    window.Main.setUsePreset(preset)
    // 如果selection有值表示有选中文案
    // if (selection) {
    //   search(selection)
    //   dispatch(setPresetListVisible(false))
    // }
  }

  const search = async () => {
    if (!prompt) return
    dispatch(setInputDisabled(true))
    dispatch(setCurPrompt(prompt))
    dispatch(saveResp(''))
    dispatch(
      fetchChatResp({
        // @ts-ignore
        prompt: `${prompt}`,
        preset: presetState.currentPreset,
      })
    )
  }

  return (
    <>
      <GlobalStyle />
      {contextHolder}
      {true ? (
        <div style={styles.container}>
          {/* @ts-ignore */}
          <div style={styles.inputWrap}>
            {presetIcon ? (
              <Image
                width={30}
                preview={false}
                src={presetIcon}
                onClick={() =>
                  showPanel({
                    plugin: true,
                  })
                }
              />
            ) : null}
            <Input
              placeholder="Enter '/' to process the selection, or directly enter the box to ask questions"
              allowClear
              onChange={onInputChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={prompt}
              size="large"
              onPressEnter={() => search()}
              disabled={chatState.inputDiabled}
              onFocus={() =>
                showPanel({
                  chatPanel: true,
                })
              }
            />
            {/* <div style={styles.exitOrOut} onClick={changeMode}>
              { !settingState.minimal ? <FullscreenExitOutlined /> : <FullscreenOutlined />}                            
            </div> */}

            <Logo />
          </div>
          <ChatPanel />
          <Preset onPresetChange={onPresetChange} />
          <Setting />
        </div>
      ) : (
        // guardian mode
        <Logo guardian />
      )}
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
  exitOrOut: {
    marginRight: 10,
  },
}
