export interface PluginType {
  logo: string
  id: PresetType
  title: PresetType
  loading: boolean
  inputDisable?: boolean
}

export interface PresetModule {
  listVisible: boolean
  builtInPlugins: PluginType[]
  currentPreset: PresetType
}

export type PresetType =
  | 'Casual'
  | 'Translate'
  | 'Summarize'
  | 'Prettier'
  | 'Analyze'
