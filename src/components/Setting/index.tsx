import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Tabs,
  Select,
  Divider,
  ConfigProvider,
  Alert,
} from 'antd'
import {
  SettingFilled,
  UserOutlined,
  LockOutlined,
  UsbOutlined,
  MacCommandOutlined,
} from '@ant-design/icons'
import Account from './Account'
import { useAppSelector } from '../../app/hooks'

const storeSuffix = '_apikey'

function TabWrap(props: any) {
  return <div style={styles.tabWrap}>{props.children}</div>
}

export function Setting() {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})
  const [saved, setSaved] = useState<boolean>(false)
  const [saveSuc, setSaveSuc] = useState<boolean>(false)
  const settingState = useAppSelector(state => state.setting)
  // const dispatch = useAppDispatch()

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({})
  }, [])

  const onFinish = (values: any) => {
    setSaved(true)
    setSaveSuc(true)
    // @ts-ignore
    window.Main.setStore(values.model + storeSuffix, values.apikey)
  }

  const renderSetting = () => {
    return (
      <TabWrap>
        <Form form={form} name="apiKey" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="model"
            label="AI Model"
            rules={[
              { required: true, message: 'Please select your ai model!' },
            ]}
          >
            <Select
              showSearch
              placeholder="ai model"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: 'ChatGPT',
                  label: 'ChatGPT',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="apikey"
            label="APIKEY"
            rules={[{ required: true, message: 'Please input your apikey!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="apikey"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Button type="primary" htmlType="submit" disabled={saved}>
                Save
              </Button>
            )}
          </Form.Item>
        </Form>
        {saveSuc ? (
          <Alert message="Save Success" type="success" showIcon />
        ) : null}
      </TabWrap>
    )
  }

  return settingState.visible ? (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(23, 10, 89)',
        },
      }}
    >
      <Divider style={{ margin: 0 }} />
      <div style={styles.wrap}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: (
                <span>
                  <SettingFilled />
                  Setting
                </span>
              ),
              key: '1',
              children: renderSetting(),
            },
            {
              label: (
                <span>
                  <UserOutlined />
                  Account
                </span>
              ),
              key: '2',
              children: Account,
            },
            {
              label: (
                <span>
                  <MacCommandOutlined />
                  Prompts
                </span>
              ),
              key: '3',
              children: 'Tab 3',
              disabled: true,
            },
            {
              label: (
                <span>
                  <UsbOutlined />
                  Plugins
                </span>
              ),
              key: '4',
              children: 'Tab 3',
              disabled: true,
            },
          ]}
        />
      </div>
    </ConfigProvider>
  ) : null
}

const styles = {
  wrap: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    // paddingTop: 30,
    paddingBottom: 40,
  },
  tabWrap: {
    paddingTop: 10,
  },
}
