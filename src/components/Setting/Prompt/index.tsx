import { useEffect, useState } from 'react'
import { Space, Table, Modal, Form, Input } from 'antd'
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
  character: string
  prompt: string
  tags: string[]
}

const data: DataType[] = [
  {
    key: '1',
    character: 'Chater',
    prompt: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    character: 'Code Master',
    prompt: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    character: 'Analysis Expert',
    prompt: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },

  {
    key: '1',
    character: 'Chater2',
    prompt: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    character: 'Code Master2',
    prompt: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    character: 'Analysis Expert2',
    prompt: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

export default function () {
  //   const dispatch = useAppDispatch()
  //   const settingState = useAppSelector(state => state.setting)

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    layout: 'vertical',
    character: '',
    prompt: '',
  })
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

  const showModal = (record: DataType) => {
    setFormValues({
      layout: 'vertical',
      character: record.character,
      prompt: record.prompt,
    })
    setIsModalOpen(true)
  }

  useEffect(() => {
    form.setFieldsValue(formValues)
  }, [formValues])

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // const setStore = (key: string, value: string | boolean | number) => {
  //   window.Main.setStore(key, value)
  // }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Character',
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      key: 'prompt',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              showModal(record)
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
      <Table pagination={{ pageSize: 3 }} columns={columns} dataSource={data} />
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          layout={'vertical'}
          form={form}
          // onFinish={onFinish}
          style={{ maxWidth: 600 }}
          initialValues={formValues}
        >
          <Form.Item
            label="Character"
            name="character"
            style={{ marginBottom: 12 }}
          >
            <Input placeholder="Please input your act." />
          </Form.Item>
          <Form.Item label="Prompt" name="prompt">
            <Input placeholder="Please input your prompt." />
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
