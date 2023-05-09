import { Button } from 'antd'

interface Props {
  tips: string
  app?: string
  confirmFn: () => void
  cancelFn: () => void
}

export function OperatePanel(props: Props) {
  const { tips, app, confirmFn, cancelFn } = props
  return (
    <div style={styles.selectWrap}>
      <span style={styles.selection}>
        <span>{tips}</span>
        {app ? <span style={styles.selectApp}>{app}</span> : null}
      </span>
      <Button type="primary" style={{ marginRight: 5 }} onClick={confirmFn}>
        Yes
      </Button>
      <Button type="text" onClick={cancelFn}>
        No
      </Button>
    </div>
  )
}

const padding = 15
const styles = {
  selectWrap: {
    backgroundColor: 'rgb(240 240 240)',
    fontSize: 13,
    padding,
  },
  selection: {
    color: 'rgb(74 74 74)',
    marginRight: 20,
  },
  selectApp: {
    fontSize: 15,
    fontWeight: 'bold',
  },
}
