import React from 'react'
import ReactDOM from "react-dom/client";
import './styles/index.scss'
import MarkdownEditor from './editor'

function render(props) {
  const { container } = props;
  const root = ReactDOM.createRoot(
    container ?
      container.querySelector('#root') :
      document.querySelector('#root')
  )

  root.render(
    <MarkdownEditor mode="normal" />
  );
}

render({});
