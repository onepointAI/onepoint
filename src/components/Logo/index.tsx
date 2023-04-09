import { Image } from 'antd'
import { searchLogov2, logoSpin } from '../../app/images'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

import { setVisible as setChatVisible } from '../../features/chat/chatSlice'
import { setListVisible as setPresetListVisible } from '../../features/preset/presetSlice'

export function Logo() {
  const dispatch = useAppDispatch()
  const chatState = useAppSelector(state => state.chat)
  return (
    <div style={styles.container}>
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
        <img style={styles.loading} src={logoSpin} />
      ) : null}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 50,
    height: 50,
  },
}
