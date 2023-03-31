import { useEffect, useRef, useState } from 'react'
import { GlobalStyle } from './styles/GlobalStyle'
import { Container, Image, Logo, Text } from './styles/Main'
import { Button } from './components/Button'

function handleSayHello() {
  window.Main.sendMessage('Hello World');
  // console.log(window);
  console.log('Message sent! Check main process log in terminal.')
}

export function App() {
  const [text, setText] = useState<string>()
  const textInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    window.Main.on('copyText', (text: string) => {
      setText(text)
    })
  }, [])

  return (
    <>
      <div style={styles.container}>
        <div style={styles.inputWrap}>
          {/* <input style={styles.input} placeholder={"What do you want to ask to onepoint?"}/> */}
          <textarea 
            style={styles.input} 
            placeholder={"What do you want to ask to onepoint?"} 
            ref={textInputRef}
            value={text}
          />
        </div>        
        {/* <Logo
          src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
          alt="ReactJS logo"
        />
        <Text>An Electron boilerplate including TypeScript, React, Jest and ESLint.</Text>
        <Button onClick={handleSayHello}>Send message to main process</Button> */}
      </div>
    </>
  )
}

const styles = {
  container: {
    backgroundColor: "#FFF",
    width: 800,
    height: 60,
    borderRadius: 15,
    overflow: "hidden"
  },
  inputWrap: {
    // backgroundColor: "yellow",
    width: 800,
    height: 60,
    paddingLeft: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "blue"
  },
  input: {
    border: 0,
    width: 700,
    height: 30,
    fontSize: 20,
    marginTop: 15,
    outline: "none",
    // paddingTop: 20,
    // backgroundColor: "yellow"
  }
}
