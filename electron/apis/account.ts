import Store from 'electron-store'
import { StoreKey } from '../../src/app/constants'
import { BalanceResponse } from '../types'

const store = new Store()

export default async (req: any, res: any) => {
  const { start_date, end_date } = req.body
  const basePath = store.get(StoreKey.Set_BasePath) as string
  const apiHost = basePath || `https://closeai.deno.dev`
  const apiKey = store.get(StoreKey.Set_ApiKey) as string
  const usemodel = store.get(StoreKey.Set_Model) as string
  const basic = {
    apiHost,
    usemodel,
    apiKey,
  }

  try {
    const response = await fetch(
      `${apiHost}/v1/dashboard/billing/usage?start_date=${start_date}&end_date=${end_date}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    const usageData = (await response.json()) as BalanceResponse
    res.send({
      code: 0,
      result: {
        usageData,
        basic,
      },
    })
  } catch (e: any) {
    res.send({
      code: -1,
      result: {
        message: e.message,
        basic,
      },
    })
  }
}
