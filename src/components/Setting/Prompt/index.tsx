import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Space, Table, Modal, Form, Input } from 'antd'
import PubSub from 'pubsub-js'
import type { ColumnsType } from 'antd/es/table'
import { Prompts_Link } from '../../../app/constants'
import { DataType } from '../../../@types'

export default function () {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [promptList, setPromptList] = useState<DataType[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [former, setFormer] = useState<string>('')
  const [formValues, setFormValues] = useState({
    layout: 'vertical',
    character: '',
    prompt: '',
  })

  const getPromptList = async () => {
    const list = await window.Main.getPromptList()
    setPromptList(list)
  }

  useEffect(() => {
    getPromptList()
  }, [])

  const showModal = (record?: DataType) => {
    setIsEdit(!!record)
    setFormer(record ? record.character : '')
    setFormValues({
      layout: 'vertical',
      character: record?.character || '',
      prompt: record?.prompt || '',
    })
    setIsModalOpen(true)
  }

  useEffect(() => {
    form.setFieldsValue(formValues)
  }, [formValues])

  const handleSave = async () => {
    const { character, prompt } = form.getFieldsValue()
    let list = []
    if (isEdit) {
      list = await window.Main.editPrompt(former, character, prompt)
    } else {
      list = await window.Main.addPrompt(character, prompt)
    }
    PubSub.publish('tips', {
      type: list ? 'success' : 'error',
      message: list ? t('Saved successfully') : t('Duplicated Character'),
    })
    if (list) {
      setPromptList(list)
    }
    setIsModalOpen(false)
  }

  const handleDelete = async (record: DataType) => {
    const { character } = record
    const list = await window.Main.removePrompt(character)
    PubSub.publish('tips', {
      type: list ? 'success' : 'error',
      message: list ? t('Removed successfully') : t('Remove Error'),
    })
    if (list) {
      setPromptList(list)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const jumpReference = () => {
    window.Main.jumpLink(Prompts_Link)
  }

  const columns: ColumnsType<DataType> = [
    {
      title: t('Character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('Prompt'),
      dataIndex: 'prompt',
      key: 'prompt',
    },
    {
      title: t('Action'),
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
              handleDelete(record)
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
      <Button type="primary" style={styles.addBtn} onClick={() => showModal()}>
        Add
      </Button>
      <Table
        pagination={{ pageSize: 3 }}
        columns={columns}
        dataSource={promptList}
      />
      <Modal open={isModalOpen} onOk={handleSave} onCancel={handleCancel}>
        <Form
          layout={'vertical'}
          form={form}
          // onFinish={onFinish}
          style={{ maxWidth: 600 }}
          initialValues={formValues}
        >
          <Form.Item
            label={t('Character')}
            name="character"
            style={{ marginBottom: 12 }}
          >
            <Input placeholder={t('Please enter the role.')} />
          </Form.Item>
          <Form.Item label={t('Prompt')} name="prompt">
            <Input placeholder={t('Please input your prompt.')} />
          </Form.Item>
          {/* <Form.Item label="Reference" name="reference"> */}
          <a href="javascript:void(0);" onClick={() => jumpReference()}>
            {t('Prompt Reference')}
          </a>
          {/* </Form.Item> */}
        </Form>
      </Modal>
    </div>
  )
}

const styles = {
  wrap: {
    paddingTop: 10,
    height: 400,
    overflow: 'auto',
  },
  addBtn: {
    margin: '0px 0px 10px 10px',
  },
}
