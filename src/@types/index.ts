export interface PluginType {
  logo: string
  id: PresetType
  title: PresetType
  desc?: string
  loading: boolean
  inputDisable?: boolean
  nostore?: boolean
  monitorClipboard?: boolean
  monitorBrowser?: boolean
}
export interface PresetModule {
  listVisible: boolean
  builtInPlugins: PluginType[]
  currentPreset: PresetType
}

export enum PresetType {
  Casual = 'Casual',
  Translator = 'Translator',
  Summarizer = 'Summarizer',
  Programmer = 'Programmer',
  Analyst = 'Analyst',
}

export interface PanelVisible {
  plugin?: boolean
  setting?: boolean
  chatPanel?: boolean
}

export interface DataType {
  key: string
  character: string
  prompt: string
}

export interface PosType {
  posX: number
  posY: number
}
