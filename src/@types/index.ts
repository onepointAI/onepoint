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

export type PresetType = 'Chat' | 'Translate' | 'Summarize' | 'Code' | 'Analyze'

export interface PanelVisible {
  plugin?: boolean
  setting?: boolean
  chatPanel?: boolean
}
