import { useEffect, useState } from 'react'
import { Progress, Button, Form, Input, Select, Alert, Spin } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Models, StoreApiKey, StoreModelKey } from '../../../app/constants'
import { fetchAccountDetail } from '../../../features/setting/settingSlice'

const { Option } = Select

export default function () {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({})
  const dispatch = useAppDispatch()
  const settingState = useAppSelector(state => state.setting)
  const [saveSuc, setSaveSuc] = useState<boolean>(false)

  const formatDate = (num: number) => {
    return num.toString().padStart(2, '0')
  }

  // To disable submit button at the beginning.
  useEffect(() => {
    const date = new Date()
    const nowDate = `${date.getFullYear()}-${formatDate(
      date.getMonth() + 1
    )}-${formatDate(date.getDate())}`
    forceUpdate({})
    dispatch(
      fetchAccountDetail({
        date: nowDate,
      })
    )
  }, [])

  useEffect(() => {
    form.resetFields()
  }, [settingState])

  const onFinish = (values: any) => {
    setSaveSuc(true)
    window.Main.setStore(StoreApiKey, values.apikey)
    window.Main.setStore(StoreModelKey, values.model)
  }

  return (
    <div style={styles.wrap}>
      <Spin tip="Loading..." spinning={settingState.loadAccount}>
        <div style={styles.inner}>
          <div style={styles.title}>Account Usage</div>
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
              model: settingState.usemodel,
              apikey: settingState.apikey,
            }}
          >
            <Form.Item label="Model" name="model" style={{ marginBottom: 12 }}>
              <Select>
                {Models.map(model => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="ApiKey" name="apikey">
              <Input.Password placeholder="Please input your apikey!" />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Submit
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
