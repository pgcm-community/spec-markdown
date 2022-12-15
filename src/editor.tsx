import React, { useState, useRef, useCallback, useEffect, useReducer } from 'react'
import './styles/editor.css'
import md from './components/markdown'
import { ModeType, HistoryLinkType, RETRACT, PropType, EditorType } from './types/config'
import {
  getCursorPosition,
  changeSelectedText,
  setSelectionRange,
  addTitle,
  addLink,
  recordCursorHistoryByElement
} from './utils'
import ToolsBar from './components/toolsbar'

// 0: none; 1: 编辑区主动触发滚动; 2: 展示区主动触发滚动
let scrolling: 0 | 1 | 2 = 0
let scrollTimer: string | number | NodeJS.Timeout | undefined
let historyTimer: any = null // 历史记录定时器
let mkRenderTimer: any = null // markdown渲染定时器
let historyLink: HistoryLinkType = {
  value: '',
  pre: null,
  next: null,
  selectionStart: 0,
  selectionEnd: 0
}

type RenderType = (
  state: EditorType,
  { type, payload }: { type: string; payload?: any }
) => EditorType

const render: RenderType = (state, { type, payload }) => {
  switch(type) {
    case 'toggleMode':
      return { ...state, mode: payload };
    case 'toggleLoading':
      return { ...state, loading: payload };
    case 'changeHtmlString':
      return { ...state, htmlString: payload };
  }
  return state
}

const MarkdownEditor: React.FC<PropType> = (props) => {
  const [value, setValue] = useState('')

  const {
    text,
    mode = ModeType.NORMAL,
  } = props

  const [state, dispatch] = useReducer<RenderType, EditorType>(
    render,
    {
      htmlString: '',
      mode
    },
    (initState: EditorType) => initState
  )

  const editRef = useRef<any>(null)
  const showRef = useRef<any>(null)


  // 同步滚动
  const handleScroll = useCallback((event: any) => {
    if (state.mode !== ModeType.NORMAL) return

    let { target } = event
    let scale = getScale(target)

    if (target.nodeName === 'TEXTAREA') {
      if (scrolling === 0) scrolling = 1
      else if (scrolling === 2) return

      driveScroll(scale, showRef.current)
    } else {
      if (scrolling === 0) scrolling = 2
      else if (scrolling === 1) return

      driveScroll(scale, editRef.current)
    }
  }, [state.mode])

  // 驱动一个元素进行滚动
  const driveScroll = useCallback((scale: number, el: HTMLElement) => {
    let { scrollHeight, clientHeight } = el
    el.scrollTop = (scrollHeight - clientHeight) * scale // scrollTop的同比例滚动

    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      scrolling = 0
      clearTimeout(scrollTimer)
    }, 200)
  }, [])

  const getScale = useCallback((el: HTMLElement) => {
    let { scrollHeight, scrollTop, clientHeight } = el
    return scrollTop / (scrollHeight - clientHeight)
  }, [])

  const handleKeyUp = (event: any) => {
    let { keyCode, metaKey, ctrlKey, altKey, shiftKey } = event
    let el = editRef.current
    let [ start, end ] = getCursorPosition(el)

    // ctrl 开头的组合按键
    if(metaKey || ctrlKey) {
      if (altKey) {

      } else {
        // ctrl + z 撤销
        if(keyCode === 90) {
          if(!historyLink.pre) return;
          else {
            let { value, selectionStart, selectionEnd } = historyLink.pre
            setValue(value)
            historyLink = historyLink.pre
            setSelectionRange(el, selectionStart, selectionEnd)
          }
          event.preventDefault()
        } else if(keyCode === 89) {  // ctrl + Y 前进
          if(!historyLink.next) return;
          else {
            let { value, selectionStart, selectionEnd } = historyLink.next
            setValue(value)
            historyLink = historyLink.next
            setSelectionRange(el, selectionStart, selectionEnd)
          }
          event.preventDefault()
        }
      }
    } else {
      if(keyCode === 9) {  // Tab缩进
        let paragraph = value.split('\n'),
          stringCount = 0,
          selectionStart: number = start,
          selectionEnd: number = end,
          len = paragraph.length,
          addlSpaceCount = 0,
          newValue = ''

        // 光标未选中文字
        if (start === end) {
          newValue = value.slice(0, start) + ' '.repeat(RETRACT) + value.slice(end);
          selectionStart += RETRACT
          selectionEnd += RETRACT
        } else {   //  光标选中了文字
          for(let i = 0; i < len; i++) {
            let item = paragraph[i]
            let nextStringCount = stringCount + item.length + 1

            // 将选中的每段段落前缩进
            if(nextStringCount > start && stringCount < end) {
              let newParagraph = ' '.repeat(RETRACT) + item
              addlSpaceCount += RETRACT
              paragraph[i] = newParagraph
              // 获取取消缩进后的光标开始位置和结束位置
              if(start > stringCount) selectionStart += RETRACT;
              if(end < nextStringCount) selectionEnd += addlSpaceCount
            } else if(stringCount > end) break;

            stringCount = nextStringCount
          }
          newValue = paragraph.join('\n')
        }

        setValue(newValue)
        setSelectionRange(el, selectionStart, selectionEnd)
        event.preventDefault()
      }
    }
  }

  // 编辑区的点击事件
  const editClick = useCallback((e: { target: any }) => {
    recordCursorHistoryByElement(historyLink, e.target)
  }, [])

  useEffect(() => {
    historyLink.value = value
    setValue(text || '')
  }, [])

  useEffect(() => {
    if(mkRenderTimer) clearTimeout(mkRenderTimer);

    mkRenderTimer = setTimeout(() => {
      let htmlString = md.render(`${value}`)
      dispatch({ type: 'changeHtmlString', payload: htmlString })
      clearTimeout(mkRenderTimer)
      // 展示区同步滚动
      driveScroll(getScale(editRef.current), showRef.current)
    }, 200)
    // 记录历史记录
    let [ selectionStart, selectionEnd ] = getCursorPosition(editRef.current)
    if(historyTimer) clearTimeout(historyTimer);
    historyTimer = setTimeout(() => {
      historyLink.next = {
        value,
        pre: historyLink,
        next: null,
        selectionStart,
        selectionEnd
      }
      historyLink = historyLink.next
      clearTimeout(historyTimer)
    }, 1000)
  }, [value])

  return (
    <div className="App">
      <div className="markdown-main">
        <ToolsBar></ToolsBar>
        <main className="content-body">
          {(state.mode === ModeType.NORMAL || state.mode === ModeType.EDIT) && (
            <textarea
              ref={editRef}
              className="md_textarea"
              onClick={editClick}
              onScroll={handleScroll}
              onKeyDownCapture={handleKeyUp}
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          )}
          {state.mode !== ModeType.EDIT && (
            <div
              ref={showRef}
              id="write"
              onScroll={handleScroll}
              dangerouslySetInnerHTML={{ __html: state.htmlString }}
            ></div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MarkdownEditor
