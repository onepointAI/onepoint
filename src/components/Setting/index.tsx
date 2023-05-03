import { Tabs, Divider, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import {
  SettingFilled,
  UserOutlined,
  UsbOutlined,
  MacCommandOutlined,
} from '@ant-design/icons'
import Basic from './Basic'
import Account from './Account'
import Prompt from './Prompt'
import Advanced from './Advanced'
import { useAppSelector } from '../../app/hooks'

export function Setting() {
  const settingState = useAppSelector(state => state.setting)
  const { t } = useTranslation()

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
                  {t('Setting')}
                </span>
              ),
              key: '1',
              children: <Basic />,
            },
            {
              label: (
                <span>
                  <UserOutlined />
                  {t('Account')}
                </span>
              ),
              key: '2',
              children: <Account />,
            },
            {
              label: (
                <span>
                  <MacCommandOutlined />
                  {t('Prompts')}
                </span>
              ),
              key: '3',
              children: <Prompt />,
            },
            {
              label: (
                <span>
                  <UserOutlined />
                  {t('Advanced')}
                </span>
              ),
              key: '4',
              children: <Advanced />,
              disabled: true,
            },
            {
              label: (
                <span>
                  <UsbOutlined />
                  {t('Plugins')}
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
  },
}
