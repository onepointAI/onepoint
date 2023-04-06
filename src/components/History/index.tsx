import {
  Avatar, List, Skeleton, Divider,
} from 'antd';

const logo = 'https://i.postimg.cc/tTJ3yHM9/pointer.png';
interface PresetType {
  logo: string
  title: string
  loading: boolean
}

const padding = 15;

// interface PresetType {
//   logo: string
//   title: string
//   loading: boolean
// }

interface Props {
  // presetList: PresetType[]
}

export function History(props: Props) {
  // const { presetList } = props
  return (
    <>
      <Divider style={{ margin: 0 }} />
      {/* @ts-ignore */}
      <div style={styles.searchRegion}>
        {/* <List
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
                  Show
                </a>,
              ]}
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
        /> */}
      </div>
    </>
  );
}

const styles = {
  searchRegion: {
    // display: 'flex',
    // flexDirection: 'row',
  },
};
