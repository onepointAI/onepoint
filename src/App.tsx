import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { Image, message } from 'antd'
import common from './electron/constants/common'
import PubSub from 'pubsub-js'
import { MoreOutlined } from '@ant-design/icons'
import { GlobalStyle } from './styles/GlobalStyle'
import { ChatPanel } from './components/ChatPanel'
import { Setting } from './components/Setting'
import { Preset } from './components/Preset'
import { Logo } from './components/Logo'
import Search from './components/Search'
import { Prompt as PromptModal } from './components/Modal/prompt'

import { init as initI18n } from './i18n'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { StoreKey } from './app/constants'
import { draggableStyle } from './utils'
import { setVisible as setChatVisible } from './features/chat/chatSlice'
import {
  setListVisible as setPresetListVisible,
  setPreset,
} from './features/preset/presetSlice'
import {
  setVisible as setSettingVisible,
  setMinimal,
  setLng,
  setContexual,
  setStore as setStoreSet,
  defaultVals,
} from './features/setting/settingSlice'
import { setUrl, setSelection } from './features/clipboard/clipboardSlice'

import {
  selection_change,
  url_change,
  setting_show,
} from './electron/constants/event'
import { PresetType, PanelVisible } from './@types'
interface Tips {
  type: 'success' | 'error' | 'warning'
  message: string
}

export function App() {
  const [show, setShow] = useState<boolean>(false)
  const presetState = useAppSelector(state => state.preset)
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useAppDispatch()
  useRef<HTMLTextAreaElement>(null)

  const preset = presetState.builtInPlugins.filter(
    p => p.title === presetState.currentPreset
  )
  const presetIcon = preset.length > 0 ? preset[0].logo : null

  // TODO: need to perf
  const getSettings = async () => {
    const getter = window.Main.getSettings
    const lng = await getter(StoreKey.Set_Lng)
    dispatch(setLng(lng || defaultVals.lng))
    initI18n(lng)
    setShow(true)
    const storeSet = await getter(StoreKey.Set_StoreChat)
    dispatch(setStoreSet(storeSet || defaultVals.store))
    const contextual = await getter(StoreKey.Set_Contexual)
    dispatch(setContexual(contextual || defaultVals.contexual))
    const simpleMode = await getter(StoreKey.Set_SimpleMode)
    dispatch(setMinimal(simpleMode || false))
  }

  useLayoutEffect(() => {
    getSettings()
  }, [])

  useEffect(() => {
    if (common.production()) {
      window.addEventListener('mousemove', event => {
        const flag = event.target === document.documentElement
        window.Main.ignoreWinMouse(flag)
      })
    }
    window.Main.on(
      selection_change,
      (selection: { txt: string; app: string }) => {
        const { txt, app } = selection
        dispatch(setSelection({ txt, app }))
        dispatch(setChatVisible(!!txt && !!app))
      }
    )
    window.Main.on(url_change, (selection: { url: string }) => {
      const { url } = selection
      dispatch(setUrl({ url }))
      dispatch(setChatVisible(true))
    })
    window.Main.on(setting_show, () =>
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
  }, [])

  const showPanel = (options: PanelVisible) => {
    const { plugin, setting, chatPanel } = options
    dispatch(setPresetListVisible(!!plugin && !setting && !chatPanel))
    dispatch(setSettingVisible(!plugin && !!setting && !chatPanel))
    dispatch(setChatVisible(!plugin && !setting && !!chatPanel))
  }

  const onPresetChange = (preset: PresetType) => {
    dispatch(setPreset(preset))
    window.Main.setUsePreset(preset)
  }

  return show ? (
    <>
      <GlobalStyle />
      {contextHolder}
      <div style={styles.container}>
        <div style={styles.inputWrap}>
          {presetIcon ? (
            <Image
              width={30}
              style={styles.nonDragable}
              preview={false}
              src={presetIcon}
              onClick={() =>
                showPanel({
                  plugin: true,
                })
              }
            />
          ) : null}
          <Search />
          <MoreOutlined
            style={styles.moreIcon}
            onClick={() => {
              PubSub.publish('showPromptModal')
            }}
          />
          <Logo />
        </div>
        <ChatPanel />
        <Preset onPresetChange={onPresetChange} />
        <Setting />
        <PromptModal />
      </div>
    </>
  ) : null
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
    ...draggableStyle(true),
  } as React.CSSProperties,
  nonDragable: {
    ...draggableStyle(false),
  } as React.CSSProperties,
  moreIcon: {
    fontSize: 20,
    margin: '0 10px',
    ...draggableStyle(false),
  },
}
