import {
  Avatar, List, Skeleton, Divider,
} from 'antd';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setListVisible as setPresetListVisible } from '../../features/preset/presetSlice';

export interface PresetType {
  logo: string
  id: string
  title: string
  loading: boolean
}

interface Props {
  onPresetChange: (preset: string) => unknown
}

const padding = 15;
export function Preset(props: Props) {
  const { onPresetChange } = props;
  const presetState = useAppSelector((state) => state.preset);
  const dispatch = useAppDispatch();

  return presetState.listVisible ? (
    <>
      <Divider style={{ margin: 0 }} />
      {/* @ts-ignore */}
      <div style={styles.searchRegion}>
        <List
          className="demo-loadmore-list"
          // loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={presetState.builtInPlugins}
          renderItem={(item) => (
            <List.Item
              className="ant-list-item"
              actions={[
                <a key="list-loadmore-edit" style={{ marginRight: padding, color: '#a6a6a6' }}>
                  Edit
                </a>,
              ]}
              onClick={() => {
                onPresetChange(item.title);
                dispatch(setPresetListVisible(false));
              }}
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
  ) : null;
}

const styles = {
  searchRegion: {
    // display: 'flex',
    // flexDirection: 'row',
  },
};
