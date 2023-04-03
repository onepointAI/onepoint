import React, { useEffect, useRef, useState } from 'react'
import { Select, Input, Avatar, Divider, List, Skeleton } from 'antd'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { GlobalStyle } from './styles/GlobalStyle'
import { Setting } from './features/Setting'
// import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const logo = 'https://i.postimg.cc/tTJ3yHM9/pointer.png'
interface PresetType {
  logo: string
  title: string
  loading: boolean
}

const { TextArea } = Input
const presetMap = {
  Translate: '请翻译以下内容：',
  Casual: '',
  Summarize: '请总结以下内容：',
  Prettier: '请优化以下代码：',
  Analyze: '请分析以下内容的含义：',
}

export function App() {
  const [question, setQuestion] = useState<string>()
  const [response, setResponse] = useState<string>('')
  const [preset, setPreset] = useState<string>('Casual')
  const [inputDisabled, setInputDisabled] = useState<boolean>(false)
  const [inputVisible] = useState<boolean>(true)
  const [respVisible, setRespVisible] = useState<boolean>(false)
  const [presetVisible, setPresetVisible] = useState<boolean>(false)
  const [historyVisible, setHistoryVisible] = useState<boolean>(false)
  const [settingVisible, setSettingVisible] = useState<boolean>(false)
  const [presetList, setPresetList] = useState<PresetType[]>([
    {
      logo,
      title: 'Translator',
      loading: false,
    },
    {
      logo,
      title: 'CodeMaster',
      loading: false,
    },
    {
      logo,
      title: 'Analyzer',
      loading: false,
    },
  ])
  useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // TODO
    // window.addEventListener('mousemove', event => {
    //   let flag = event.target === document.documentElement
    //   // @ts-ignore
    //   window.Main.setWinMouseIgnore(flag)
    // })

    window.Main.on('clipboard_change', (text: string) => {
      setQuestion(text)
    })
  }, [])

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value
    setPresetVisible(val === '/')
    setHistoryVisible(val ===  '/h')
    setSettingVisible(val === '/s')
    if (!val) {
      setRespVisible(false)
    }
    setQuestion(val)
  }

  const search = async () => {
    if (!question) return
    setInputDisabled(true)
    await axios
      .post(`http://127.0.0.1:4000/ask`, {
        // TODO
        // @ts-ignore
        question: presetMap[preset] + question,
      })
      .then(response => {
        console.log('result ==>', response.data)
        const { code, result } = response.data
        if (code === 0) {
          const { message, finish_reason, index } = result[0]
          const { role, content } = message
          setResponse(content)
          setRespVisible(true)
        } else {
          setResponse(JSON.stringify(response))
          setRespVisible(true)
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setInputDisabled(false)
      })
  }

  const getPresetOpts = () => {
    return Object.keys(presetMap).map(key => {
      return {
        value: key,
        label: key,
      }
    })
  }

  return (
    <>
      <GlobalStyle />
      {/* {contextHolder} */}
      <div style={styles.container}>
        {/* @ts-ignore */}
        <div style={styles.inputWrap}>
          {inputVisible ? (
            <Input
              placeholder="Do you have anything to ask onepoint?"
              allowClear
              onChange={onChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={question}
              size={'large'}
              onPressEnter={search}
              disabled={inputDisabled}
            />
          ) : (
            <TextArea
              placeholder="Do you have anything to ask onepoint?"
              allowClear
              onChange={onChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={question}
              size={'large'}
            />
          )}
          <Select
            defaultValue={preset}
            style={{ width: 150 }}
            bordered={false}
            options={getPresetOpts()}
            onChange={(text: string) => setPreset(text)}
          />
        </div>
        {respVisible ? (
          <>
            <Divider style={{ margin: 0 }} />
            {/* @ts-ignore */}
            <div style={styles.answerRegion}>
              <div style={styles.botAvatar}>
                <Avatar size={50} shape="square" src={logo} />
              </div>
              <div>
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          </>
        ) : null}
        {presetVisible ? (
          <>
            <Divider style={{ margin: 0 }} />
            {/* @ts-ignore */}
            <div style={styles.searchRegion}>
              <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={presetList}
                renderItem={item => (
                  <List.Item
                    className="ant-list-item"
                    actions={[
                      <a
                        key="list-loadmore-edit"
                        style={{ marginRight: padding }}
                      >
                        Edit
                      </a>,
                    ]}
                  >
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active
                    >
                      <List.Item.Meta                        
                        style={{ paddingLeft: padding }}
                        avatar={<Avatar src={item.logo} />}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </>
        ) : null}
        {
          historyVisible ? (
            <>
            <Divider style={{ margin: 0 }} />
            {/* @ts-ignore */}
            <div style={styles.searchRegion}>
              <List
                className="demo-loadmore-list"
                // loading={initLoading}
                itemLayout="horizontal"
                // loadMore={loadMore}
                dataSource={presetList}
                renderItem={item => (
                  <List.Item
                    className="ant-list-item"
                    actions={[
                      <a
                        key="list-loadmore-edit"
                        style={{ marginRight: padding }}
                      >
                        Show
                      </a>,
                    ]}
                  >
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active
                    >
                      <List.Item.Meta                        
                        style={{ paddingLeft: padding }}
                        avatar={<Avatar src={item.logo} />}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </>
          ) : null
        }
        {
          settingVisible ? <Setting /> : null
        }        
      </div>
    </>
  )
}

const padding = 15
const styles = {
  container: {
    backgroundColor: '#FFF',
    // height: 200,
    border: 'none',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  inputWrap: {
    display: 'flex',
    flexDirection: 'row',
    border: 'none',
    borderWidth: 0,
    borderColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding,
  },
  answerRegion: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding,
  },
  botAvatar: {
    width: 50,
    marginRight: 10,
  },
  searchRegion: {
    // display: 'flex',
    // flexDirection: 'row',
  },
  selectItem: {
    backgroundColor: '#F8F8F8',
    height: 60,
    padding,
  },
  searchItem: {
    backgroundColor: '#FFF',
    height: 60,
    padding,
  },
}
