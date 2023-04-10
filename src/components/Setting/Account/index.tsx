import { Progress } from 'antd'

export default function () {
  return (
    <div style={styles.wrap}>
      <div style={styles.title}>Account Usage</div>
      <Progress
        percent={40.9}
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
      />
    </div>
  )
}

const styles = {
  wrap: {
    paddingRight: 30,
    paddingTop: 10,
    paddingLeft: 20,
  },
  title: {
    fontSize: 14,
    color: 'rgb(10, 11, 60)',
  },
}
