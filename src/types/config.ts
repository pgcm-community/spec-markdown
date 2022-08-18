export enum ModeType {
    NORMAL = 'normal',
    EDIT = 'edit',
    PREVIEW = 'preview',
}

export interface HistoryLink {
    value: string,
    pre: HistoryLink | null,
    next: HistoryLink | null,
    selectionStart: number;
    selectionEnd: number;  
}