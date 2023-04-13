export interface BalanceResponse {
  total_usage: number
}
export interface ChatContent {
  prompt: string
  response: string
}
export enum ERR_CODES {
  NETWORK_CONGESTION = -1000,
  NOT_SET_APIKEY = -998,
  TIMEOUT = -999,
}
