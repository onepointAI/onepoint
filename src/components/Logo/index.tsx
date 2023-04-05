import { Image } from 'antd'
import { brand } from '../../app/images'
import {
  setVisible as setChatVisible,
} from '../../features/chat/chatSlice'
import {
  setListVisible as setPresetListVisible,
} from '../../features/preset/presetSlice'
import { useAppDispatch } from '../../app/hooks'

export function Logo() {
  const dispatch = useAppDispatch()
  return (
    <div style={styles.container}>
      <Image width={60} preview={false} src={brand} onClick={() => {
        dispatch(setChatVisible(false))
        dispatch(setPresetListVisible(true))
      }}
      />
    </div>
  )
}

const styles = {
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(255,90,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
