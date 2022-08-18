//获取当前选择的位置
export function getCursorPosition(el: HTMLTextAreaElement) {
    let { selectionStart, selectionEnd } = el
    return { selectionStart, selectionEnd }
}

// 
export function changeSelectedText(el: HTMLTextAreaElement, text: string, setText: Function, symbol: string, value: string) {
    let { selectionStart, selectionEnd } = getCursorPosition(el)
    let str1 = el.value.substring(0, selectionStart)
    let str2 = el.value.substring(selectionStart, selectionEnd)
    let str3 = el.value.substring(selectionEnd)

    let result = str1 + symbol + str2 + symbol + str3

    setText(result)
}