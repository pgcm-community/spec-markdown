export const RETRACT: number = 2

export enum ModeType {
    NORMAL = 'normal',
    EDIT = 'edit',
    PREVIEW = 'preview',
}

export interface PropType {
    // text: string, // 文本内容
    // setText: Function,
    mode?: ModeType, // 编辑器模式
}

export interface EditorType {
    mode: ModeType, // 编辑器模式
    htmlString: string, // 展示的html
}

export interface HistoryLink {
    value: string,
    pre: HistoryLink | null,
    next: HistoryLink | null,
    selectionStart: number;
    selectionEnd: number;  
}

export interface CodeType {
    code: string,
    language: string,
}