import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md: any = new MarkdownIt({
  html: true,
  breaks: true,
  highlight: (code, language) => {
    if (language && hljs.getLanguage(language)) {
      try {
        return (
          `<pre><code class="hljs language-${language}>` +
          hljs.highlight(code, { language }).value +
          '</code></pre>'
        )
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(code) + '</code></pre>'
  }
})
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-container'), 'spoiler', {
    validate: (params) => {
      return params.trim().match(/^spoiler\s+(.*)$/);
    },

    render: (tokens, idx) => {
      let m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

      if (tokens[idx].nesting === 1) {
        // opening tag
        return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';

      } else {
        // closing tag
        return '</details>\n';
      }
    }
  })
  .use(require('markdown-it-task-checkbox'), {
    disabled: true,
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'cbx_',
    ulClass: 'task-list',
    liClass: 'task-list-item'
  })
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-footnote'))

export default md
