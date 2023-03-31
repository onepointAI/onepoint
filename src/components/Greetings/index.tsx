import { Button } from '../Button'
import { Container, Image, Logo, Text } from './styles'


export function Greetings() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');
    // console.log(window);
    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <Container>
      <div style={styles.wrapper}>
        <div style={styles.inputWrap}>
          <input style={styles.input}/>
          <Logo
            src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
            alt="ReactJS logo"
          />
        </div>       
      </div>
      <Text>An Electron boilerplate including TypeScript, React, Jest and ESLint.</Text>
      <Button onClick={handleSayHello}>Send message to main process</Button>
    </Container>
  )
}
 
const styles = {
  wrapper: {
    height: 400,
    backgroundColor: "#FFF"
  },
  inputWrap: {
    backgroundColor: "#FFF", 
    width: 400, 
    height: 250,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  input: {
    flex: 1,
    border: 0,
    fontSize: 20,    
    outline: "none",
    backgroundColor: "blue"
  }
}
