import { useEffect, useState, useRef } from 'react'
import { Divider, Button, Alert } from 'antd'
import PubSub from 'pubsub-js'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyOutlined, ClearOutlined } from '@ant-design/icons'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { BuiltInPlugins, StoreKey } from '../../app/constants'
import {
  fetchChatResp,
  setCurPrompt,
  saveResp,
} from '../../features/chat/chatSlice'
import { presetMap } from '../../features/preset/presetSlice'
import { PluginType } from '../../@types'
import { ChatContent } from '../../../electron/types'

export function ChatPanel() {
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const settingState = useAppSelector(state => state.setting)
  const clipboardState = useAppSelector(state => state.clipboard)
  const [minimal, setMinimal] = useState<boolean>(true)
  const [chatList, setChatList] = useState<ChatContent[]>([])
  const [showSelection, setShowSelection] = useState<boolean>(false)
  const [usePlugin, setUsePlugin] = useState<PluginType>()
  const bottomLineRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const fetchChatList = async () => {
    const list = await window.Main.getChatList(presetState.currentPreset)
    setChatList(list)
  }

  const fetchMinimal = async () => {
    const minimal = await window.Main.getSettings(StoreKey.Set_SimpleMode)
    setMinimal(minimal || false)
  }

  useEffect(() => {
    if (!chatState.isGenerating && bottomLineRef) {
      setTimeout(() => {
        bottomLineRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [chatState.isGenerating])

  useEffect(() => {
    fetchMinimal()
  }, [settingState.minimal])

  useEffect(() => {
    // TODO: should use id
    const plugin = BuiltInPlugins.filter(
      item => presetState.currentPreset === item.title
    )[0]
    // @ts-ignore
    setUsePlugin(plugin)
    fetchChatList()
  }, [presetState.currentPreset, chatState.curPrompt])

  useEffect(() => {
    setShowSelection(
      !!clipboardState.selectTxt &&
        !!clipboardState.selectApp &&
        !!usePlugin?.inputDisable
    )
  }, [
    clipboardState.selectTxt,
    clipboardState.selectApp,
    usePlugin?.inputDisable,
  ])

  const copyRsp = (resp: string) => {
    window.Main.copyText(resp)
    PubSub.publish('tips', {
      type: 'success',
      message: 'copy success',
    })
  }

  const delRecord = async (index?: number) => {
    if (typeof index === 'undefined') return
    const list = await window.Main.removeChat(presetState.currentPreset, index)
    PubSub.publish('tips', {
      type: 'success',
      message: 'delete success',
    })
    dispatch(setCurPrompt(''))
    dispatch(saveResp(''))
    setChatList(list)
  }

  const atemptChange = (resp: string) => {
    window.Main.attemptChange(resp.replace(/^`{3}[^\n]+|`{3}$/g, ''))
  }

  const doRequest = (txt: string) => {
    // @ts-ignore
    const qaTpl = presetMap[presetState.currentPreset] as string
    const qa = qaTpl + txt
    setShowSelection(false)
    dispatch(
      fetchChatResp({
        prompt: qa,
        preset: presetState.currentPreset,
      })
    )
  }

  const cancelRequest = () => {
    setShowSelection(false)
  }

  const showCopyFromEditor = () => {
    return showSelection ? (
      <div style={styles.selectWrap}>
        <span style={styles.selection}>
          Sure operate the selection in{' '}
          <span style={styles.selectApp}>{`${clipboardState.selectApp}`}</span>?
        </span>
        <Button
          type="text"
          ghost
          danger
          style={{ color: 'rgb(255, 90, 0)' }}
          onClick={() => doRequest(clipboardState.selectTxt)}
        >
          Yes
        </Button>
        {/* TODO：clear the selections */}
        <Button type="text" ghost onClick={() => cancelRequest()}>
          No
        </Button>
      </div>
    ) : null
  }

  const showPrompt = (prompt: string, minimal?: boolean) => {
    return !minimal ? <div style={styles.requestWrap}>➜ {prompt}</div> : null
  }

  const showReply = (response: string, minimal?: boolean, index?: number) => {
    return (
      <div style={styles.replyWrap as React.CSSProperties}>
        <div style={styles.mdWrap}>
          <ReactMarkdown
            children={response}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    showLineNumbers
                    children={String(children).replace(/\n$/, '')}
                    // @ts-ignore
                    style={atomDark}
                    language={match[1]}
                    Pretag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          />
          {response && minimal ? (
            <>
              <Divider style={{ margin: '24px 0' }} />
              <Button
                type="text"
                block
                onClick={() => atemptChange(response)}
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                Attempt Change
              </Button>
            </>
          ) : null}
        </div>
        {response ? (
          <CopyOutlined
            style={styles.copyIcon as React.CSSProperties}
            onClick={() => copyRsp(response)}
          />
        ) : null}
        {response ? (
          <ClearOutlined
            style={styles.clearIcon as React.CSSProperties}
            onClick={() => delRecord(index)}
          />
        ) : null}
      </div>
    )
  }

  const showContent = showSelection || chatState.resp || chatState.respErr
  const showChat =
    ((chatState.visible && showContent) || !minimal) &&
    !settingState.visible &&
    !presetState.listVisible

  return showChat ? (
    <>
      <Divider style={{ margin: 0 }} />
      {chatState.respErr ? (
        <Alert message={chatState.respErrMsg} type="warning" showIcon />
      ) : null}
      <div style={styles.history}>
        {showCopyFromEditor()}
        {!minimal
          ? chatList.map((chat, index) => (
              <div key={chat.prompt}>
                {showPrompt(chat.prompt, minimal)}
                {showReply(chat.response, minimal, index)}
              </div>
            ))
          : null}
        {chatState.curPrompt ? showPrompt(chatState.curPrompt, minimal) : null}
        {chatState.resp ? showReply(chatState.resp) : null}
        <div ref={bottomLineRef}></div>
      </div>
    </>
  ) : null
}

const padding = 15
const styles = {
  selectWrap: {
    backgroundColor: 'rgb(240 240 240)',
    fontSize: 13,
    padding,
  },
  selection: {
    color: 'rgb(74 74 74)',
    marginRight: 20,
  },
  selectApp: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectTxt: {
    fontStyle: 'italic',
    marginLeft: 4,
    marginRight: 4,
    color: 'rgb(255, 90, 0)',
  },
  requestWrap: {
    backgroundColor: 'rgb(241 241 241)',
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 'bold',
    padding: '7px 45px 7px 45px',
  },
  replyWrap: {
    position: 'relative',
    backgroundColor: '#FFF',
    fontSize: 13,
    padding,
    // paddingRight: padding * 2,
  },
  mdWrap: {
    marginRight: 30,
    marginLeft: 30,
    overflow: 'auto',
  },
  history: {
    maxHeight: 400,
    overflow: 'auto',
  },
  copyIcon: {
    position: 'absolute',
    top: 17,
    right: 45,
    opacity: 0.6,
  },
  clearIcon: {
    position: 'absolute',
    top: 17,
    right: 20,
    opacity: 0.6,
  },
}
