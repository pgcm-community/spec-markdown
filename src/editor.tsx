import React, { useState, useRef, useCallback } from 'react';
import './styles/editor.less';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'

const md:any = markdownIt({
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
  const [text, setText] = useState('')

  const edit = useRef(null)
  const show = useRef(null)
  const parseText = (e:any) => {
    setText(md.render(e))
  }

  // const handleScroll = useCallback(event: any) => {
  //   let { scrollHeight, scrollTop } = event.target
  //   let scale = scrollTop / scrollHeight

  //   if (type === 1) {
  //     let { scrollHeight } = show.current
  //     show.current.scrollTop = scrollHeight * scale
  //   } else if (type === 2) {
  //     let { scrollHeight } = edit.current
  //     edit.current.scrollTop = scrollHeight * scale
  //   }
  // }
  
  return (
    <div className="App">
      <div className="markdown-main">
        <main className="content-body">
          <textarea
            ref={edit}
            className="md_textarea"
            onChange={(e) => parseText(e.target.value)}
          ></textarea>
          <div
              ref={show}
              id="write"
              dangerouslySetInnerHTML={{ __html: text }}
            ></div>
        </main>  
      </div>    
    </div>
  );
}
