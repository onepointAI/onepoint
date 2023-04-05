import { Divider, Button } from 'antd'
import { useAppSelector, useAppDispatch } from '../../app/hooks'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { fetchChatResp } from '../../features/chat/chatSlice'
import { presetMap } from '../../features/preset/presetSlice'

export function ChatPanel() {
  const chatState = useAppSelector(state => state.chat)
  const presetState = useAppSelector(state => state.preset)
  const clipboardState = useAppSelector(state => state.clipboard)
  const dispatch = useAppDispatch()

  const atemptChange = () => {
    // @ts-ignore
    window.Main.attemptChange(chatState.resp)
  }

  const doRequest = (txt: string) => {
    // @ts-ignore
    const qaTpl = presetMap[presetState.currentPreset] as string
    const qa = qaTpl + txt
    dispatch(
      fetchChatResp({
        question: qa,
      })
    )
  }

  const hasSelection = clipboardState.selectTxt && clipboardState.selectApp

  return chatState.visible && (hasSelection || chatState.resp)? (
    <>
      <Divider style={{ margin: 0 }} />
      {hasSelection ? (
        <div style={styles.selectionWrap}>
          <span style={styles.selection}>
            Sure operate{' '}
            <span style={styles.selectTxt}>{`${
              String(clipboardState?.selectTxt)?.substring(0, 50) + '...'
            }`}</span>{' '}
            in{' '}
            <span
              style={styles.selectApp}
            >{`${clipboardState.selectApp}`}</span>
            ?
          </span>
          {/* 立即发问 */}
          <Button
            type="text"
            ghost
            danger
            onClick={() => doRequest(clipboardState.selectTxt)}
          >
            Yes
          </Button>
          {/* TODO：清空selection的值 */}
          <Button type="text" ghost>
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
                    showLineNumbers={true}
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
              <Button type="text" block onClick={atemptChange}>
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
    marginLeft: 4,
    marginRight: 4,
    color: 'rgb(255, 90, 0)',
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
