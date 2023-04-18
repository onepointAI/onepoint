import { useEffect, useState, useRef } from 'react'
import { Divider, Button, Alert, ConfigProvider } from 'antd'
import PubSub from 'pubsub-js'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyOutlined, ClearOutlined, SoundOutlined } from '@ant-design/icons'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { BuiltInPlugins, StoreKey } from '../../app/constants'
import {
  fetchChatResp,
  fetchWebCrawlResp,
  setCurPrompt,
  saveResp,
} from '../../features/chat/chatSlice'
import { setSelection, setUrl } from '../../features/clipboard/clipboardSlice'
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
  // const [showUrl, setShowUrl] = useState<string>('')
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
      if (!usePlugin?.nostore && !minimal && settingState.store) {
        dispatch(setCurPrompt(''))
        dispatch(
          saveResp({
            preset: presetState.currentPreset,
            content: '',
          })
        )
        fetchChatList()
      }
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

  const speakRsp = (resp: string) => {
    window.Main.speakText(resp)
  }

  const copyRsp = (resp: string) => {
    window.Main.copyText(resp)
    PubSub.publish('tips', {
      type: 'success',
      message: 'Copyed Successfully',
    })
  }

  const delRecord = async (index?: number) => {
    if (typeof index === 'undefined') return
    const list = await window.Main.removeChat(presetState.currentPreset, index)
    PubSub.publish('tips', {
      type: 'success',
      message: 'Deleted successfully',
    })
    dispatch(setCurPrompt(''))
    dispatch(
      saveResp({
        preset: presetState.currentPreset,
        content: '',
      })
    )
    setChatList(list)
  }

  const atemptChange = (resp: string) => {
    window.Main.attemptChange(resp.replace(/^`{3}[^\n]+|`{3}$/g, ''))
  }

  const doRequest = (txt: string) => {
    const qa = txt
    dispatch(setSelection({ txt: '', app: '' }))
    dispatch(
      fetchChatResp({
        prompt: qa,
        preset: presetState.currentPreset,
      })
    )
  }

  const doSummaryWebsite = (url: string) => {
    dispatch(setUrl({ url: '' }))
    dispatch(
      fetchWebCrawlResp({
        url,
      })
    )
  }

  const cancelRequest = () => {
    dispatch(
      setSelection({
        txt: '',
        app: '',
      })
    )
  }

  const showCopyFromEditor = () => {
    return showSelection ? (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(23, 10, 89)',
          },
        }}
      >
        <div style={styles.selectWrap}>
          <span style={styles.selection}>
            Sure operate the selection in{' '}
            <span
              style={styles.selectApp}
            >{`${clipboardState.selectApp}`}</span>
            ?
          </span>
          <Button
            type="primary"
            style={{ marginRight: 5 }}
            onClick={() => doRequest(clipboardState.selectTxt)}
          >
            Yes
          </Button>
          <Button type="text" onClick={() => cancelRequest()}>
            No
          </Button>
        </div>
      </ConfigProvider>
    ) : null
  }

  const showSelectUrl = () => {
    return clipboardState.url && usePlugin?.monitorBrowser ? (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(23, 10, 89)',
          },
        }}
      >
        <div style={styles.selectWrap}>
          <span style={styles.selection}>
            <span>Summarize this page? </span>
            {/* <span style={styles.url}>{clipboardState.url}</span>*/}
          </span>
          <Button
            // type="text"
            type="primary"
            style={{ marginRight: 5 }}
            onClick={() => doSummaryWebsite(clipboardState.url)}
          >
            Yes
          </Button>
          <Button type="text" onClick={() => cancelRequest()}>
            No
          </Button>
        </div>
      </ConfigProvider>
    ) : null
  }

  const showPrompt = (prompt: string, minimal?: boolean) => {
    return !minimal && !usePlugin?.nostore ? (
      <div style={styles.requestWrap}>➜ {prompt}</div>
    ) : null
  }

  const showReply = (response: string, minimal?: boolean, index?: number) => {
    return (
      <div style={styles.replyWrap as React.CSSProperties}>
        <div style={styles.mdWrap}>
          <ReactMarkdown
            children={response}
            components={{
              code({ inline, className, children, ...props }) {
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
          {/* {response && (minimal || usePlugin?.nostore)  ? (
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
          ) : null} */}
        </div>
        {response ? (
          <>
            <Divider style={{ margin: '5px 0' }} />
            <div style={styles.bottomRspWrap}>
              <Button
                type="text"
                block
                onClick={() => atemptChange(response)}
                style={styles.attemptBtn}
              >
                Attempt Change
              </Button>
              <SoundOutlined
                style={styles.speakIcon as React.CSSProperties}
                onClick={() => speakRsp(response)}
              />
              <CopyOutlined
                style={styles.copyIcon as React.CSSProperties}
                onClick={() => copyRsp(response)}
              />
              <ClearOutlined
                style={styles.clearIcon as React.CSSProperties}
                onClick={() => delRecord(index)}
              />
            </div>
          </>
        ) : null}
      </div>
    )
  }

  const respContent = chatState.resp[presetState.currentPreset]
  const showContent = showSelection || respContent || chatState.respErr
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
        {showSelectUrl()}
        {!minimal
          ? chatList.map((chat, index) => (
              <div key={chat.prompt + index}>
                {showPrompt(chat.prompt, minimal)}
                {showReply(chat.response, minimal, index)}
              </div>
            ))
          : null}
        {/* need to separate prompt and resp  */}
        {chatState.curPrompt ? showPrompt(chatState.curPrompt, minimal) : null}
        {respContent ? showReply(respContent) : null}
        {chatState.webCrawlResp ? showReply(chatState.webCrawlResp) : null}
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
  url: {
    maxWidth: 400,
    display: 'inline-block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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
    fontSize: 15,
    lineHeight: '20px',
    fontWeight: 'bold',
    padding: '7px 45px 7px 45px',
  },
  replyWrap: {
    position: 'relative',
    backgroundColor: '#FFF',
    fontSize: 14,
    lineHeight: 2.5,
    padding,
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
  bottomRspWrap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  speakIcon: {
    position: 'absolute',
    marginRight: 30,
    right: 65,
    top: 10,
  },
  copyIcon: {
    position: 'absolute',
    marginRight: 15,
    right: 45,
    top: 10,
  },
  clearIcon: {
    position: 'absolute',
    right: 25,
    top: 10,
  },
  attemptBtn: {
    width: 300,
    fontSize: 12,
    fontWeight: 'bold',
  },
}
