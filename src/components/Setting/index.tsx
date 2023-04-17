import { Tabs, Divider, ConfigProvider } from 'antd'
import {
  SettingFilled,
  UserOutlined,
  UsbOutlined,
  MacCommandOutlined,
} from '@ant-design/icons'
import Account from './Account'
import Basic from './Basic'
import Prompt from './Prompt'
import { useAppSelector } from '../../app/hooks'

export function Setting() {
  const settingState = useAppSelector(state => state.setting)
  // const dispatch = useAppDispatch()

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
              children: <Basic />,
            },
            {
              label: (
                <span>
                  <UserOutlined />
                  Account
                </span>
              ),
              key: '2',
              children: <Account />,
            },
            {
              label: (
                <span>
                  <UserOutlined />
                  Advanced
                </span>
              ),
              key: '3',
              children: <Account />,
              disabled: true,
            },
            {
              label: (
                <span>
                  <MacCommandOutlined />
                  Prompts
                </span>
              ),
              key: '4',
              children: <Prompt />,
              disabled: true,
            },
            {
              label: (
                <span>
                  <UsbOutlined />
                  Plugins
                </span>
              ),
              key: '5',
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
    // paddingBottom: 40,
  },
}
