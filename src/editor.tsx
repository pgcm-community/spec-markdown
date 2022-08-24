import React, { useState, useRef, useCallback, useEffect, useReducer } from 'react';
import './styles/editor.less';
import md from './components/markdown'
import { ModeType, HistoryLink, RETRACT, PropType, EditorType } from './types/config'
import {
  getCursorPosition,
  changeSelectedText,
  setSelectionRange,
  addTitle,
  selection,
  addLink
} from './utils'

// 0: none; 1: 编辑区主动触发滚动; 2: 展示区主动触发滚动
let scrolling: 0 | 1 | 2 = 0
let scrollTimer: string | number | NodeJS.Timeout | undefined;
let historyLink: HistoryLink = {
  value: '',
  pre: null,
  next: null,
  selectionStart: 0,
  selectionEnd: 0
}

type RenderType = (
  state: EditorType,
  { type, payload }: { type: string, payload?: any }
) => EditorType

const render: RenderType = (state, { type, payload }) => {
  return state
}

const MarkdownEditor: React.FC<PropType> = (props) => {
  const {
    mode = ModeType.NORMAL,
  } = props

  const [state, dispatch] = useReducer<RenderType, EditorType>(
    render,
    {
      htmlString: '',
      mode,
    },
    (initState: EditorType) => initState
  )

  const [htmlString, setHtmlString] = useState('')
  const [text, setText] = useState('')

  const edit = useRef<any>(null)
  const show = useRef<any>(null)

  const handleScroll = (block: number, event:any) => {
    if (state.mode !== ModeType.NORMAL) return

    let { scrollHeight, scrollTop, clientHeight } = event.target
    let scale = scrollTop / (scrollHeight - clientHeight)

    if(block === 1) {
        if(scrolling === 0) scrolling = 1;  
        if(scrolling === 2) return;    

        driveScroll(scale, show.current)  
    } else if(block === 2) {  
        if(scrolling === 0) scrolling = 2;
        if(scrolling === 1) return;    

        driveScroll(scale, edit.current)
    }
  }
  // 驱动一个元素进行滚动
  const driveScroll = (scale: number, el: HTMLElement) => {
    let { scrollHeight, clientHeight } = el
    el.scrollTop = (scrollHeight - clientHeight) * scale  // scrollTop的同比例滚动

    if(scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        scrolling = 0   
        clearTimeout(scrollTimer)
    }, 200)
  }
  
  useEffect(() => {
    setHtmlString(md.render(text))
  }, [text])
  

  // 快捷键
  const keyUP = ((e: any) => {
    let { keyCode, metaKey, ctrlKey, altKey, shiftKey } = e
    let editEl = edit.current
    let { selectionStart, selectionEnd } = getCursorPosition(e)

    const sele = selection(e, text)

    // ctrl
    if(metaKey || ctrlKey) {
      // 撤回
      if (keyCode === 90) {
        if(!historyLink.pre) return
        else {
          let { value, selectionStart, selectionEnd } = historyLink.pre
          setText(value)
          historyLink = historyLink.pre
          setSelectionRange(e, selectionStart, selectionEnd)
        }
        e.preventDefault()
      }
      // 前进
      else if (keyCode === 89) {
        if(!historyLink.next) return
        else {
          let { value, selectionStart, selectionEnd } = historyLink.next
          setText(value)
          historyLink = historyLink.next
          setSelectionRange(e, selectionStart, selectionEnd)
        }
        e.preventDefault()
      }
      // 加粗 ctrl + b
      else if (keyCode === 66) {
        changeSelectedText(edit.current, text, setText, '**')
        e.preventDefault()
      }
      // 斜体 ctrl + i
      else if (keyCode === 73) {
        changeSelectedText(edit.current, text, setText, '*')
        e.preventDefault()
      }
      // 删除线 ctrl + u
      else if (keyCode === 85) {
        changeSelectedText(edit.current, text, setText, '~~')
        e.preventDefault()
      }
      // 链接 ctrl + l
      else if (keyCode === 76) {
        addLink(edit.current, text, setText)
        e.preventDefault()
      }
      // 一级标题 ctrl + 1 
      else if (keyCode === 49) {
        addTitle(edit.current, text, setText, '#')
        e.preventDefault()
      }
      // 二级标题 ctrl + 2
      else if (keyCode === 50) {
        addTitle(edit.current, text, setText, '##')
        e.preventDefault()
      }
      // 三级标题 ctrl + 3
      else if (keyCode === 51) {
        addTitle(edit.current, text, setText, '###')
        e.preventDefault()
      }
      // 四级标题 ctrl + 4
      else if (keyCode === 52) {
        addTitle(edit.current, text, setText, '####')
        e.preventDefault()
      }
      // 五级标题 ctrl + 5
      else if (keyCode === 53) {
        addTitle(edit.current, text, setText, '#####')
        e.preventDefault()
      }
      // 六级标题 ctrl + 6
      else if (keyCode === 54) {
        addTitle(edit.current, text, setText, '######')
        e.preventDefault()
      }
    } else { // 只按一个键， 如：tab
      if(keyCode ===9) {
        let start = selectionStart
        let end = selectionEnd,
            result: string = ''

        // 没有选择文字
        if (start === end) {
          result = sele.start + '  '.repeat(RETRACT) + sele.end
          start += RETRACT
          end += RETRACT
        }

        setText(result)
        setSelectionRange(e, start, end)
        e.preventDefault()
      }
    } 
  })

  return (
    <div className="App">
      <div className="markdown-main">
        <main className="content-body">
          {
            (state.mode === ModeType.NORMAL || state.mode === ModeType.EDIT) &&
            <textarea
              ref={edit}
              className="md_textarea"
              onScroll={(e) => handleScroll(1, e)}
              onChange={(e) => setText(e.target.value)}
              onKeyDownCapture={keyUP}
              value={text}
            />
          }
          {
            state.mode !== ModeType.EDIT &&
            <div
              ref={show}
              id="write"
              onScroll={(e) => handleScroll(2, e)}
              dangerouslySetInnerHTML={{ __html: htmlString }}
            ></div>
          }
        </main>  
      </div>    
    </div>
  );
}

export default MarkdownEditor;
