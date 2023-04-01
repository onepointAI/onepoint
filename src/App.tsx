import React, { useEffect, useRef, useState } from 'react'
import { Select, Input, Avatar, Divider } from 'antd'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { GlobalStyle } from './styles/GlobalStyle'

const { TextArea } = Input

export function App() {
  const [question, setQuestion] = useState<string>()
  const [response, setResponse] = useState<string>("")
  const [inputDisabled, setInputDisabled] = useState<boolean>(false)
  const [inputVisible] = useState<boolean>(true)
  const [respVisible, setRespVisible] = useState<boolean>(false)
  useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
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
    if(!val) {
      setRespVisible(false)
    }
    setQuestion(val)
  }

  const search = async () => {
    if (!question) return
    setInputDisabled(true)
    await axios
    .post(`http://127.0.0.1:4000/ask`, {
      question: question
    })
    .then(response => {
      console.log('result ==>', response.data)
      const { code, result } = response.data
      if(code === 0) {
        const { message, finish_reason, index } = result[0]
        const { role, content } = message
        setResponse(content)
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

  return (
    <>
      <GlobalStyle />
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
            defaultValue="Casual Chat"
            style={{ width: 150 }}
            bordered={false}
            options={[
              { value: 'Casual Chat', label: 'Casual Chat' },
              { value: 'Translation', label: 'Translate' },
              { value: 'Summarize', label: 'Summarize' },
              { value: 'Analyze', label: 'Analyze' },
            ]}
          />
          {/* <Button type="dashed" onClick={askQuestion}>
            send
          </Button> */}
        </div>
        {
          respVisible ? (
            <>
              <Divider style={{ margin: 0 }}/>
              {/* @ts-ignore */}        
              <div style={styles.answerRegion}>
                <div style={styles.botAvatar}><Avatar size={50} shape="square" src={"https://i.postimg.cc/tTJ3yHM9/pointer.png"} /></div>
                <div> 
                <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            </>
          ) : null
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
    backgroundColor: "#F8F8F8",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding,
  },
  botAvatar: {
    width: 50,
    marginRight: 10,
  }
}
