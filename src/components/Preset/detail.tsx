import { Avatar, List, Skeleton, Divider } from 'antd'
import PubSub from 'pubsub-js'
import { useAppSelector } from '../../app/hooks'
import { PresetType } from '../../@types'

interface Props {
  onPresetChange: (preset: PresetType) => void
}

const padding = 15
export function PresetDetail(props: Props) {
  const { onPresetChange } = props
  const presetState = useAppSelector(state => state.preset)
  return presetState.listVisible ? (
    <>
      <Divider style={{ margin: 0 }} />
      <>
        <List
          className="demo-loadmore-list"
          // loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={presetState.builtInPlugins}
          renderItem={item => (
            <List.Item
              className="ant-list-item"
              actions={[
                <a
                  key="list-loadmore-edit"
                  style={{ marginRight: padding, color: '#a6a6a6' }}
                  onClick={() => {
                    return
                  }}
                >
                  Edit
                </a>,
              ]}
              onClick={() => {
                onPresetChange(item.title)
                PubSub.publish('showPanel', {})
              }}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  style={{ paddingLeft: padding }}
                  avatar={<Avatar src={item.logo} />}
                  title={item.title}
                  description={item.desc}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </>
    </>
  ) : null
}
