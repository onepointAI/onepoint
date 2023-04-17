import { useEffect, useState } from 'react'
import { Space, Table, Modal, Form, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'

// import { useAppDispatch, useAppSelector } from '../../../app/hooks'
// import { StoreKey } from '../../../app/constants'
// import {
//   setMinimal,
//   setLng,
//   setContexual,
//   setStore as setStoreSet,
//   defaultVals,
// } from '../../../features/setting/settingSlice'

interface DataType {
  key: string
  act: string
  prompt: string
  tags: string[]
}

const data: DataType[] = [
  {
    key: '1',
    act: 'John Brown',
    prompt: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    act: 'Jim Green',
    prompt: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    act: 'Joe Black',
    prompt: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export default function () {
  //   const dispatch = useAppDispatch()
  //   const settingState = useAppSelector(state => state.setting)

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const gettings = async () => {
    // const lng = await window.Main.getSettings(StoreKey.Set_Lng)
    // dispatch(setLng(lng || defaultVals.lng))
    // const storeSet = await window.Main.getSettings(StoreKey.Set_StoreChat)
    // dispatch(setStoreSet(storeSet || defaultVals.store))
    // const contextual = await window.Main.getSettings(StoreKey.Set_Contexual)
    // dispatch(setContexual(contextual || defaultVals.contexual))
    // const simpleMode = await window.Main.getSettings(StoreKey.Set_SimpleMode)
    // dispatch(setMinimal(simpleMode || false))
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // To disable submit button at the beginning.
  useEffect(() => {
    // gettings()
  }, [])

  const setStore = (key: string, value: string | boolean | number) => {
    window.Main.setStore(key, value)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Act',
      dataIndex: 'act',
      key: 'act',
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              showModal()
            }}
          >
            Edit
          </a>
          <a
            style={{ color: '#d03050' }}
            onClick={() => {
              record.prompt
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ]

  return (
    <div style={styles.wrap}>
      <Table columns={columns} dataSource={data} />
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          layout={'vertical'}
          form={form}
          // onFinish={onFinish}
          style={{ maxWidth: 600 }}
          // initialValues={{
          //   layout: 'vertical',
          //   model: settingState.usemodel,
          //   apikey: settingState.apikey,
          // }}
        >
          <Form.Item label="Model" name="model" style={{ marginBottom: 12 }}>
            <Select>
              {/* {Models.map(model => (
                  <Option key={model} value={model}>
                    {model}
                  </Option>
                ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="ApiKey" name="apikey">
            <Input.Password placeholder="Please input your apikey!" />
          </Form.Item>
        </Form>
      </Modal>
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
