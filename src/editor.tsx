import React, { useState, useRef, useCallback, useEffect } from 'react';
import './styles/editor.less';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'
import { ModeType, HistoryLink } from './types/config'
import { getCursorPosition, changeSelectedText } from './utils'


let scrolling: 0 | 1 | 2 = 0  // 0: none; 1: 编辑区主动触发滚动; 2: 展示区主动触发滚动
let scrollTimer: string | number | NodeJS.Timeout | undefined;
let historyLink: HistoryLink = {
  value: '',
  pre: null,
  next: null,
  selectionStart: 0,
  selectionEnd: 0
}

const md:any = new markdownIt({
  breaks: true,
  highlight: function (code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return `<pre><code class="hljs language-${language}>` +
          hljs.highlight(code, { language }).value +
          '</code></pre>'
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(code) + '</code></pre>'
  }
})


export default function MarkdownEditor() {
  const [htmlString, setHtmlString] = useState('')
  const [text, setText] = useState('')

  const edit = useRef<any>(null)
  const show = useRef<any>(null)

  const handleScroll = (block: number, event:any) => {
    let { scrollHeight, scrollTop, clientHeight } = event.target
    let scale = scrollTop / (scrollHeight - clientHeight)  // 改进后的计算滚动比例的方法

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

    // ctrl
    if(metaKey || ctrlKey) {
      if (keyCode === 90) {
        if(!historyLink.pre) return
        else {
          let { value, selectionStart, selectionEnd } = historyLink.pre
          setText(value)
          historyLink = historyLink.pre
        }
        e.preventDefault()
      }
    }    
  })

  return (
    <div className="App">
      <div className="markdown-main">
        <header>
          {/* <button onClick={(e) => changeSelectedText(edit.current, text, setText, '**', '加粗字体')}>加粗</button> */}
        </header>
        <main className="content-body">
          <textarea
            ref={edit}
            className="md_textarea"
            onScroll={(e) => handleScroll(1, e)}
            onChange={(e) => setText(e.target.value)}
            onKeyDownCapture={keyUP}
            value={text}
          ></textarea>
          <div
            ref={show}
            id="write"
            onScroll={(e) => handleScroll(2, e)}
            dangerouslySetInnerHTML={{ __html: htmlString }}
          ></div>
        </main>  
      </div>    
    </div>
  );
}
