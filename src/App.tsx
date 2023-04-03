import React, { useEffect, useRef, useState } from 'react'
import { Select, Input, Divider, Button, Image } from 'antd'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GlobalStyle } from './styles/GlobalStyle'
import { Setting } from './features/Setting'
import { History } from './features/History'
import { Preset, PresetType } from './features/Preset'

// import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// TODO：判断是否有选中文案，如是，则弹出 【ASK ONEPOINT】
const logo = 'https://i.postimg.cc/tTJ3yHM9/pointer.png'
const { TextArea } = Input
const presetMap = {
  Translate: '请翻译以下内容：',
  Casual: '',
  Summarize: '请总结以下内容：',
  Prettier: '请直接重构这段代码：',
  Analyze: '请分析以下内容的含义：',
}

export function App() {
  const [question, setQuestion] = useState<string>()
  const [response, setResponse] = useState<string>(
    '## 快速排序\n\n快速排序是一种常用的排序算法，采用分治思想。具体实现过程如下：\n\n1. 选择一个基准元素（通常为数组第一个元素）。\n2. 将数组中小于等于基准元素的数放到左边，大于基准元素的数放到右边。\n3. 对左右两个子集递归执行步骤1和步骤2。\n\n以下是使用JavaScript实现快速排序的代码：\n\n```javascript\nfunction quickSort(arr) {\n  if (arr.length <= 1) {\n    return arr;\n  }\n  \n  const pivotIndex = Math.floor(arr.length / 2);\n  const pivot = arr.splice(pivotIndex, 1)[0];\n  \n  const left = [];\n  const right = [];\n  \n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] < pivot) {\n      left.push(arr[i]);\n    } else {\n      right.push(arr[i]);\n    }\n   }\n   \n   return [...quickSort(left), pivot, ...quickSort(right)];\n}\n\n```\n\n其中`pivot`表示选取的基准元素，将其从原数组中删除并保存在变量中。然后遍历原数组，将小于`pivot`的数存入左侧子集，大于等于`pivot`的数存入右侧子集。最后通过递归调用自身对左右两个子集进行排序，并将结果合并返回。\n\n时间复杂度：O(nlogn)\n\n空间复杂度：O(n)\n\n稳定性：不稳定'
  )
  const [preset, setPreset] = useState<string>('Casual')
  const [inputDisabled, setInputDisabled] = useState<boolean>(false)
  const [inputVisible] = useState<boolean>(true)
  const [respVisible, setRespVisible] = useState<boolean>(false)
  const [presetVisible, setPresetVisible] = useState<boolean>(false)
  const [historyVisible, setHistoryVisible] = useState<boolean>(false)
  const [settingVisible, setSettingVisible] = useState<boolean>(false)
  const [selection, setSelection] = useState<string>()
  const [presetList, setPresetList] = useState<PresetType[]>([
    {
      logo,
      id: 'Translate',
      title: 'Translate',
      loading: false,
    },
    {
      logo,
      id: 'Casual',
      title: 'Casual',
      loading: false,
    },
    {
      logo,
      id: 'Summarize',
      title: 'Summarize',
      loading: false,
    },
    {
      logo,
      id: 'Prettier',
      title: 'Prettier',
      loading: false,
    },
    {
      logo,
      id: 'Analyze',
      title: 'Analyze',
      loading: false,
    },
  ])
  useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // TODO
    window.addEventListener('mousemove', event => {
      let flag = event.target === document.documentElement
      // @ts-ignore
      window.Main.setWinMouseIgnore(flag)
    })

    window.Main.on('clipboard_change', (text: string) => {
      setQuestion(text)
    })
    window.Main.on('selection_change', (selection: string) => {      
      setSelection(selection)
    })
  }, [])

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value
    setPresetVisible(val === '/')
    setHistoryVisible(val === '/h')
    setSettingVisible(val === '/s')
    if (!val) {
      setRespVisible(false)
    }
    setQuestion(val)
  }

  const atemptChange = () => {
    // @ts-ignore
    window.Main.attemptChange(response)
  }

  const search = async (newQuestion: string) => {
    if (!question) return
    setInputDisabled(true)

    // // @ts-ignore
    // console.log(`search qa: ${presetMap[preset]}${newQuestion||question}`);
    // return 

    await axios
      .post(`http://127.0.0.1:4000/ask`, {
        // TODO
        // @ts-ignore
        question: `${presetMap[preset]}${question}`,
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

  const onChangePreset = (preset: string) => {
    setPreset(preset)
    // 如果selection有值表示有选中文案
    if(selection) {
      search(selection)
      setPresetVisible(false)
    }
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
              placeholder="Enter '/' to process the selection, or directly enter the box to ask questions"
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
              placeholder="Enter '/' to process the selection, or directly enter the box to ask questions"
              allowClear
              onChange={onChange}
              bordered={false}
              style={{ height: 40, resize: 'none' }}
              value={question}
              size={'large'}
            />
          )}
          {/* <Select
            defaultValue={preset}
            style={{ width: 150 }}
            bordered={false}
            options={getPresetOpts()}
            onChange={(text: string) => setPreset(text)}
            value={preset}
          /> */}
          <div style={styles.logo}>
            <Image
              width={60}
              preview={false}
              src="https://i.imgur.com/T5ELmVC.png"
            />
          </div>
        </div>
        {respVisible ? (
          <>
            <Divider style={{ margin: 0 }} />
            {/* @ts-ignore */}
            <div style={styles.answerRegion}>
              {/* <div style={styles.botAvatar}>
                <Avatar size={50} shape="square" src={logo} />
              </div> */}
              <div style={styles.markdownRegion}>
                <ReactMarkdown
                  children={response}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          showLineNumbers={true}
                          children={String(children).replace(/\n$/, '')}
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
                <Divider style={{ margin: '25 0 0 0' }} />
                <Button type="text" block 
                  onClick={atemptChange}>
                  Attempt Change
                </Button>
              </div>
            </div>
          </>
        ) : null}
        {
          // @ts-ignore
          presetVisible ? <Preset presetList={presetList} onChangePreset={onChangePreset} /> : null
        }
        {
          // @ts-ignore
          historyVisible ? <History presetList={presetList} /> : null
        }
        {settingVisible ? <Setting /> : null}
      </div>
    </>
  )
}

const padding = 15
const styles = {
  container: {
    // position: "relative",
    backgroundColor: '#FFF',
    border: 'none',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  inputWrap: {
    // position: "fixed",
    // top: 0,
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
    // display: 'flex',
    // flexDirection: 'column',
    backgroundColor: '#F8F8F8',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    fontSize: 13,
    padding,
    maxHeight: 300,
    overflow: "auto"
  },
  markdownRegion: {
    marginRight: 30,
    marginLeft: 30,
    overflow: "auto"
  },
  botAvatar: {
    width: 50,
    marginRight: 10,
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
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(255,90,0)',
    alignItems: "center",
    justifyContent: "center"
  }
}
