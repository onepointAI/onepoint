import React, { useRef, useState } from 'react'
import { Input } from 'antd'
import PubSub from 'pubsub-js'
import { useTranslation } from 'react-i18next'

import {
  setInputDisabled,
  fetchChatResp,
  setCurPrompt,
  saveResp,
} from '../../features/chat/chatSlice'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { draggableStyle } from '../../utils'

export default function () {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState<string>('')
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const dispatch = useAppDispatch()
  useRef<HTMLTextAreaElement>(null)

  const search = async () => {
    if (!prompt) return
    dispatch(setInputDisabled(true))
    dispatch(setCurPrompt(prompt))
    dispatch(
      saveResp({
        preset: presetState.currentPreset,
        content: '',
      })
    )
    dispatch(
      fetchChatResp({
        prompt: `${prompt}`,
        preset: presetState.currentPreset,
      })
    )
  }

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value
    switch (val) {
      case '/':
        PubSub.publish('showPanel', {
          plugin: true,
        })
        break
      case '/s':
        PubSub.publish('showPanel', {
          setting: true,
        })
        break
      default:
        PubSub.publish('showPanel', {})
    }
    setPrompt(val)
  }

  return (
    <Input
      placeholder={t(
        "Type '/' to bring up the plugin list, or enter your question directly in the input box."
      )}
      allowClear
      onChange={onInputChange}
      bordered={false}
      style={styles.search}
      value={prompt}
      size="large"
      onPressEnter={() => search()}
      disabled={chatState.inputDiabled}
      onFocus={() =>
        PubSub.publish('showPanel', {
          chatPanel: true,
        })
      }
    />
  )
}

const styles = {
  search: {
    height: 40,
    resize: 'none',
    ...draggableStyle(false),
  } as React.CSSProperties,
}
