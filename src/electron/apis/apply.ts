import { activeApp, applySelection } from '../os/applescript'
import { Singleton } from '../utils/global'

export default async (req: any, res: any) => {
  await activeApp(Singleton.getInstance().getRecentApp())
  const result = await applySelection()
  res.send({
    code: 0,
    result,
  })
}
