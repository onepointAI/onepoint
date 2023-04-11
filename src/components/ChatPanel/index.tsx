import { useEffect, useState, useRef } from 'react'
import { Divider, Button, Alert } from 'antd'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyOutlined } from '@ant-design/icons'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { BuiltInPlugins } from '../../app/constants'
import { fetchChatResp } from '../../features/chat/chatSlice'
import { presetMap, PresetType } from '../../features/preset/presetSlice'
import { ChatContent } from '../../../electron/client/store'
import { StoreKey } from '../../app/constants'

export function ChatPanel() {
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const settingState = useAppSelector(state => state.setting)
  const clipboardState = useAppSelector(state => state.clipboard)
  const [minimal, setMinimal] = useState<boolean>(true)
  const [chatList, setChatList] = useState<ChatContent[]>([])
  const [showSelection, setShowSelection] = useState<boolean>(false)
  const [usePlugin, setUsePlugin] = useState<PresetType>()
  const contentWrapRef = useRef<HTMLDivElement>(null)
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
    if (!chatState.isGenerating && contentWrapRef) {
      setTimeout(() => {
        console.log('scrollToBottom >>>>>>', contentWrapRef.current) // not effect
        contentWrapRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
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
  }, [presetState.currentPreset, prompt])

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

  const showPrompt = (prompt: string, history?: boolean) => {
    return <div style={styles.requestWrap}>➜ {prompt}</div>
  }

  const showReply = (response: string, history?: boolean) => {
    return (
      <div style={styles.replyWrap}>
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
          {response ? (
            <>
              <Divider
                style={{ margin: history ? '15px 0 10px 0' : '24px 0' }}
              />
              <Button
                type="text"
                block
                onClick={() => atemptChange(response)}
                style={{ fontSize: history ? 10 : 12, fontWeight: 'bold' }}
              >
                Attempt Change
              </Button>
            </>
          ) : null}
        </div>
        {response ? <CopyOutlined style={styles.copyIcon} /> : null}
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
      <div style={styles.history} ref={contentWrapRef} id="scrollView">
        {showCopyFromEditor()}
        {!minimal
          ? chatList.map(chat => (
              <>
                {showPrompt(chat.prompt, true)}
                {showReply(chat.response, true)}
              </>
            ))
          : null}
        {chatState.curPrompt ? showPrompt(chatState.curPrompt, true) : null}
        {chatState.resp ? showReply(chatState.resp) : null}
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
    maxHeight: 300,
    overflow: 'auto',
  },
  selection: {
    color: 'rgb(74 74 74)',
    marginRight: 20,
  },
  selectApp: {
    fontStyle: 'italic',
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
    maxHeight: 300,
    overflow: 'auto',
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
    right: 20,
  },
}
