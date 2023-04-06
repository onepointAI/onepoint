import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    background-color: rgba(0,0,0,0);
  }

  .ant-list-item:hover {
    background-color: #F3F3F3;
    cursor: pointer;
  }
`
