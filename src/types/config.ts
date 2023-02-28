export const RETRACT: number = 4


/**
 * 正常模式 工具栏 编辑区 预览区
 * 编辑模式 工具栏 编辑区
 * 预览模式 工具栏 预览区
 * 展示模式 预览区
 */
export type ModeType = 'normal' | 'preview' | 'edit' | 'exhibition'

export interface PropType {
  text?: string, // 文本内容
  // setValue: Function,
  mode?: ModeType // 编辑器模式
}

export interface EditorType {
  mode: ModeType // 编辑器模式
  htmlString: string // 展示的 html
}

// 操作历史记录
export interface HistoryLinkType {
  value: string
  pre: HistoryLinkType | null
  next: HistoryLinkType | null
  selectionStart: number
  selectionEnd: number
}

// 代码块语言
export interface CodeType {
  code: string
  language: string
}
