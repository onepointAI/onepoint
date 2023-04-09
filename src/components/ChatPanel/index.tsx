import { useEffect, useState } from 'react'
import { Divider, Button, Alert } from 'antd'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAppSelector, useAppDispatch } from '../../app/hooks'

import { fetchChatResp } from '../../features/chat/chatSlice'
import { presetMap, PresetType } from '../../features/preset/presetSlice'
import { BuiltInPlugins } from '../../app/constants'

export function ChatPanel() {
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const clipboardState = useAppSelector(state => state.clipboard)
  const [showSelection, setShowSelection] = useState<boolean>(false)
  const [usePlugin, setUsePlugin] = useState<PresetType>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // TODO: should use id
    const plugin = BuiltInPlugins.filter(
      item => presetState.currentPreset === item.title
    )[0]
    setUsePlugin(plugin)
  }, [presetState.currentPreset])

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

  const atemptChange = () => {
    // @ts-ignore
    // del markdown syntax token
    window.Main.attemptChange(chatState.resp.replace(/^`{3}[^\n]+|`{3}$/g, ''))
  }

  const doRequest = (txt: string) => {
    // @ts-ignore
    const qaTpl = presetMap[presetState.currentPreset] as string
    const qa = qaTpl + txt
    setShowSelection(false)
    dispatch(
      fetchChatResp({
        question: qa,
      })
    )
  }

  const cancelRequest = () => {
    setShowSelection(false)
  }

  return chatState.visible &&
    (showSelection || chatState.resp || chatState.respErr) ? (
    <>
      <Divider style={{ margin: 0 }} />
      {chatState.respErr ? (
        <Alert message={chatState.respErrMsg} type="warning" showIcon />
      ) : null}
      {showSelection ? (
        <div style={styles.selectionWrap}>
          <span style={styles.selection}>
            Sure operate the selection
            {/* <span style={styles.selectTxt}>{`${
              String(clipboardState?.selectTxt)?.substring(0, 50) + '...'
            }`}</span>{' '} */}
            in{' '}
            <span style={styles.selectApp}>
              {`${clipboardState.selectApp}`}
            </span>
            ?
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
      ) : null}
      <div style={styles.answerRegion}>
        <div style={styles.markdownWrap}>
          <ReactMarkdown
            children={chatState.resp}
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
          {chatState.resp ? (
            <>
              <Divider style={{ margin: '25 0 0 0' }} />
              <Button
                type="text"
                block
                onClick={atemptChange}
                style={{ fontSize: 12, fontWeight: 'bold' }}
              >
                Attempt Change
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </>
  ) : null
}

const padding = 15
const styles = {
  selectionWrap: {
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
    // marginLeft: 4,
    // marginRight: 4,
    // color: 'rgb(255, 90, 0)',
  },
  selectTxt: {
    fontStyle: 'italic',
    marginLeft: 4,
    marginRight: 4,
    color: 'rgb(255, 90, 0)',
  },
  answerRegion: {
    backgroundColor: '#F8F8F8',
    fontSize: 13,
    padding,
    maxHeight: 300,
    overflow: 'auto',
  },
  markdownWrap: {
    marginRight: 30,
    marginLeft: 30,
    overflow: 'auto',
  },
}
