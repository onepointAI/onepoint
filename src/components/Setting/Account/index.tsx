import { useEffect, useState } from 'react'
import { Progress, Button, Form, Input, Select, Alert, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Models, StoreKey } from '../../../app/constants'
import { fetchAccountDetail } from '../../../features/setting/settingSlice'

const { Option } = Select

export default function () {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})
  const dispatch = useAppDispatch()
  const settingState = useAppSelector(state => state.setting)
  const [saveSuc, setSaveSuc] = useState<boolean>(false)

  const formatDate = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  const formatDateStr = (date: Date) => {
    return `${date.getFullYear()}-${formatDate(
      date.getMonth() + 1
    )}-${formatDate(date.getDate())}`
  }

  const refreshPage = () => {
    const date = new Date()
    const prevDate = new Date(date.valueOf() - 1000 * 60 * 60 * 24 * 99)
    dispatch(
      fetchAccountDetail({
        startDate: formatDateStr(prevDate),
        endDate: formatDateStr(date),
      })
    )
  }

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({})
    refreshPage()
  }, [])

  useEffect(() => {
    form.resetFields()
  }, [settingState])

  const onFinish = (values: any) => {
    setSaveSuc(true)
    window.Main.setStore(StoreKey.Set_BasePath, values.basePath)
    window.Main.setStore(StoreKey.Set_ApiKey, values.apikey)
    window.Main.setStore(StoreKey.Set_Model, values.model)
    refreshPage()
  }

  return (
    <div style={styles.wrap}>
      <Spin tip="Loading..." spinning={settingState.loadAccount}>
        <div style={styles.inner}>
          <div style={styles.title}>{t('Token Usage')}</div>
          <Progress
            style={{ marginBottom: 20 }}
            percent={settingState.billUsage}
            status={'active'}
            strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
          />

          <Form
            layout={'vertical'}
            form={form}
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
            initialValues={{
              layout: 'vertical',
              basePath: settingState.basePath,
              model: settingState.usemodel,
              apikey: settingState.apikey,
            }}
          >
            <Form.Item label={t('Base Path')} name="basePath">
              <Input placeholder="Like https://api.openai.com" />
            </Form.Item>
            <Form.Item label="ApiKey" name="apikey">
              <Input.Password
                placeholder={t('Please enter your API key first.')}
              />
            </Form.Item>
            <Form.Item
              label={t('Model')}
              name="model"
              style={{ marginBottom: 12 }}
            >
              <Select>
                {Models.map(model => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                {t('Submit')}
              </Button>

              <Button style={{ marginLeft: 10 }} onClick={refreshPage}>
                {t('Refresh')}
              </Button>
            </Form.Item>
          </Form>
        </div>

        {saveSuc ? (
          <Alert message="Save Success" type="success" showIcon />
        ) : null}
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
    color: 'rgb(10, 11, 60)',
  },
}
