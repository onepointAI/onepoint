import { useEffect } from 'react'
import { Image } from 'antd'
import { searchLogov2, logoSpin } from '../../app/images'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import { setVisible as setChatVisible } from '../../features/chat/chatSlice'
import { setListVisible as setPresetListVisible } from '../../features/preset/presetSlice'

interface Props {
  guardian?: boolean
}

export function Logo(props: Props) {
  const { guardian } = props
  const dispatch = useAppDispatch()
  const chatState = useAppSelector(state => state.chat)

  useEffect(() => {
    if (guardian) {
      // remote.getCurrentWindow().setPosition(10, 10)
    }
  }, [guardian])

  return (
    <div style={guardian ? styles.guardian : styles.container}>
      <Image
        width={40}
        preview={false}
        src={searchLogov2}
        style={{ opacity: chatState.inputDiabled ? 0.8 : 1 }}
        onClick={() => {
          dispatch(setChatVisible(false))
          dispatch(setPresetListVisible(true))
        }}
      />
      {chatState.inputDiabled ? (
        <img
          style={guardian ? styles.guardLoad : styles.loading}
          src={logoSpin}
        />
      ) : null}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  guardian: {
    position: 'absolute',
    right: 30,
    bottom: 100,
    width: 200,
    height: 300,
    overflow: 'auto',
    flexDirection: 'column',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    padding: 20,
    textAlign: 'right',
  } as React.CSSProperties,
  guardLoad: {
    position: 'absolute',
    right: 14,
    top: 15,
    width: 50,
    height: 50,
  } as React.CSSProperties,
  loading: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 50,
    height: 50,
  } as React.CSSProperties,
}
