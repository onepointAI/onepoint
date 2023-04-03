import { Avatar, List, Skeleton, Divider } from 'antd'

const padding = 15

export interface PresetType {
  logo: string
  id: string
  title: string
  loading: boolean
}

interface Props {
  presetList: PresetType[]
  onChangePreset: (preset: string) => unknown
}

export function Preset(props: Props) {
  const { presetList, onChangePreset } = props
  return (
    <>
      <Divider style={{ margin: 0 }} />
      {/* @ts-ignore */}
      <div style={styles.searchRegion}>
        <List
          className="demo-loadmore-list"
          // loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={presetList}
          renderItem={item => (
            <List.Item
              className="ant-list-item"
              actions={[
                <a key="list-loadmore-edit" style={{ marginRight: padding }}>
                  Edit
                </a>,
              ]}
              onClick={() => { onChangePreset(item.title) }}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  style={{ paddingLeft: padding }}
                  avatar={<Avatar src={item.logo} />}
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </>
  )
}

const styles = {
  searchRegion: {
    // display: 'flex',
    // flexDirection: 'row',
  },
}
