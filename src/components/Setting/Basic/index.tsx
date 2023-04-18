import { Select, Spin, Switch, Space } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { StoreKey } from '../../../app/constants'
import {
  setMinimal,
  setLng,
  setContexual,
  setStore as setStoreSet,
  // defaultVals,
} from '../../../features/setting/settingSlice'

export default function () {
  const dispatch = useAppDispatch()
  const settingState = useAppSelector(state => state.setting)
  const setStore = (key: string, value: string | boolean | number) => {
    window.Main.setStore(key, value)
  }

  return (
    <div style={styles.wrap}>
      <Spin tip="Loading..." spinning={false}>
        <div style={styles.inner}>
          <Space size={25}>
            <div style={{ width: 240 }}>
              <div style={styles.title}>Language</div>
              <Select
                style={{ width: '100%' }}
                placeholder="Select A Language"
                onChange={val => {
                  dispatch(setLng(val))
                  setStore(StoreKey.Set_Lng, val)
                }}
                value={settingState.lng}
                // defaultValue={{ value: lng, label: lng }}
                options={[
                  {
                    value: 'English',
                    label: 'English',
                  },
                  {
                    value: 'Chinese',
                    label: 'Chinese',
                  },
                ]}
              />
            </div>

            <div style={{ width: 240 }}>
              <div style={styles.title}>Store Chat History</div>
              <Select
                style={{ width: '100%' }}
                placeholder="Store Chat History"
                onChange={val => {
                  dispatch(setStoreSet(val))
                  setStore(StoreKey.Set_StoreChat, val)
                }}
                value={settingState.store}
                options={[
                  {
                    value: 1,
                    label: 'YES',
                  },
                  {
                    value: 0,
                    label: 'NO',
                  },
                ]}
              />
            </div>

            <div style={{ width: 240 }}>
              <div style={styles.title}>Contextual Num</div>
              <Select
                style={{ width: 200 }}
                placeholder="Save Chat"
                onChange={val => {
                  dispatch(setContexual(val))
                  setStore(StoreKey.Set_Contexual, val)
                }}
                value={settingState.contextual}
                options={[
                  {
                    value: 5,
                    label: '5',
                  },
                  {
                    value: 10,
                    label: '10',
                  },
                  {
                    value: 15,
                    label: '15',
                  },
                  {
                    value: 20,
                    label: '20',
                  },
                ]}
              />
            </div>
          </Space>
          <div style={styles.simpleMode}>
            <div style={styles.title}>Simple Mode(collapse panel)</div>
            <Switch
              defaultChecked
              checked={settingState.minimal}
              onChange={val => {
                dispatch(setMinimal(val))
                setStore(StoreKey.Set_SimpleMode, val)
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  )
}

const styles = {
  wrap: {
    paddingTop: 10,
  },
  inner: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 14,
    marginBottom: 5,
    color: 'rgb(10, 11, 60)',
  },
  simpleMode: {
    marginTop: 20,
  },
}
