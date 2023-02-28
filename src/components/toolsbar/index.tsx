import React from 'react'
import './index.scss'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <div className="tools-bar">
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_bold
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_italic
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_strikethrough
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          link
        </i>
      </div>
      <div className="tools-bar__item">
        <span className="iconfont material-icons">
          format_h1
        </span>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_h2
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_h3
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_h4
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          format_h5
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont material-icons">
          list
        </i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-list-numbered"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-code"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-code-block"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-quote"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-table"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-image"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-undo"></i>
      </div>
      <div className="tools-bar__item">
        <i className="iconfont icon-redo"></i>
      </div>
    </div>
  )
}
