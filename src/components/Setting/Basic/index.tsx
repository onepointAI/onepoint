import { useEffect, useState } from 'react'
import { Select, Spin, Switch, Space } from 'antd'
import { StoreKey } from '../../../app/constants'

const defaultVals = {
  lng: 'English',
  store: 0,
  contexual: 0,
  minimal: false,
}
export default function () {
  const [lng, useLng] = useState<string>(defaultVals.lng)
  const [store, useStore] = useState<number>(defaultVals.store)
  const [contextual, useContextual] = useState<number>(defaultVals.contexual)
  const [minimal, useMinimal] = useState<boolean>(defaultVals.minimal)

  const gettings = async () => {
    const lng = await window.Main.getSettings(StoreKey.Set_Lng)
    lng && useLng(lng || defaultVals.lng)
    const storeSet = await window.Main.getSettings(StoreKey.Set_StoreChat)
    storeSet && useStore(storeSet || defaultVals.store)
    const contextual = await window.Main.getSettings(StoreKey.Set_Contexual)
    contextual && useContextual(contextual || defaultVals.contexual)
    const simpleMode = await window.Main.getSettings(StoreKey.Set_SimpleMode)
    simpleMode && useMinimal(simpleMode || defaultVals.minimal)
  }

  // To disable submit button at the beginning.
  useEffect(() => {
    gettings()
  }, [])

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
                  useLng(val)
                  setStore(StoreKey.Set_Lng, val)
                }}
                value={lng}
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
                  useStore(val)
                  setStore(StoreKey.Set_StoreChat, val)
                }}
                value={store}
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
                  useContextual(val)
                  setStore(StoreKey.Set_Contexual, val)
                }}
                value={contextual}
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
            <div style={styles.title}>Simple Mode</div>
            <Switch
              defaultChecked
              checked={minimal}
              onChange={val => {
                useMinimal(val)
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
