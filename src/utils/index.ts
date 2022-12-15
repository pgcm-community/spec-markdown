//获取当前选择的位置
import { HistoryLinkType } from "../types/config";

export function getCursorPosition(el: HTMLTextAreaElement) {
  let { selectionStart, selectionEnd } = el
  return [ selectionStart, selectionEnd ]
}

// 设置光标位置
export function setSelectionRange(el: HTMLTextAreaElement, selectionStart: number, selectionEnd: number, isFocus: boolean = true) {
  let timer = setTimeout(() => {
    if(isFocus) {
      let { scrollTop } = el
      el.focus();
      el.scrollTop = scrollTop   // 保持聚焦后页面不滚动到底部
    }
    el.setSelectionRange(selectionStart, selectionEnd)   // 光标选中指定的文本
    clearTimeout(timer)
  }, 0)
}

// 获取当前光标位置的 三个坐标
export function selection(el: HTMLTextAreaElement, text: string) {
  let [ selectionStart, selectionEnd ] = getCursorPosition(el)
  return {
    start: text.slice(0, selectionStart),
    current: text.slice(selectionStart, selectionEnd),
    end: text.slice(selectionEnd)
  }
}

// 改变基础的文字操作， 如： 加粗， 斜体
export function changeSelectedText(
  el: HTMLTextAreaElement,
  text: string,
  setText: Function,
  symbol: string
) {
  let [ selectionStart, selectionEnd ] = getCursorPosition(el)
  const select = selection(el, text)

  let result = select.start + symbol + select.current + symbol + select.end

  let start = selectionStart + symbol.length
  let end = selectionEnd + symbol.length

  setSelectionRange(el, start, end)
  setText(result)
}

// 添加标题: 一级标题， 二级标题
export function addTitle(el: HTMLTextAreaElement, text: string, setText: Function, symbol: string) {
  let [ selectionStart, selectionEnd ]= getCursorPosition(el)
  const select = selection(el, text)

  let result = `${select.start}\n${symbol} ${select.current}\n${select.end}`

  let start = selectionStart + symbol.length + 2
  let end = selectionEnd + symbol.length + 2

  setSelectionRange(el, start, end)
  setText(result)
}

// 添加链接
export function addLink(el: HTMLTextAreaElement, text: string, setText: Function) {
  let [ selectionStart, selectionEnd ] = getCursorPosition(el)
  const select = selection(el, text)

  let result = `${select.start}[${select.current}](https://)\n${select.end}`

  let start = selectionStart === selectionEnd ? selectionStart + 3 : selectionEnd + 3
  let end = selectionEnd + 11

  setSelectionRange(el, start, end)
  setText(result)
}

// 通过当前元素的光标位置记录光标的历史位置
export function recordCursorHistoryByElement (historyLink: HistoryLinkType, el: HTMLTextAreaElement) {
  let [selectionStart, selectionEnd] = getCursorPosition(el)
  historyLink.selectionStart = selectionStart
  historyLink.selectionEnd = selectionEnd
}
