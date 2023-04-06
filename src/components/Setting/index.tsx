import { useEffect, useState } from 'react';
import {
  Button, Form, Input, Select, Divider,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks';

const storeSuffix = '_apikey';
export function Setting() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const settingState = useAppSelector((state) => state.setting);
  // const dispatch = useAppDispatch()

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values: any) => {
    console.log('Finish:', values);

    // @ts-ignore
    window.Main.setStore(values.model + storeSuffix, values.apikey);
  };

  return settingState.visible ? (
    <>
      <Divider style={{ margin: 0 }} />
      <div style={styles.wrap}>
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            name="model"
            rules={[
              { required: true, message: 'Please select your ai model!' },
            ]}
          >
            <Select
              showSearch
              placeholder="ai model"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.label ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())}
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
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true)
                  || !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Save
              </Button>
            )}
          </Form.Item>
        </Form>
      </div>
    </>
  ) : null;
}

const styles = {
  wrap: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    paddingTop: 30,
    paddingBottom: 40,
  },
};
