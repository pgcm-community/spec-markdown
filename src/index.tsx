import React from 'react'
import ReactDOM from "react-dom/client";
import './styles/index.css'
import MarkdownEditor from './editor'
import { ModeType } from "./types/config";

function render(props) {
  const { container } = props;
  const root = ReactDOM.createRoot(container ? container.querySelector('#root') : document.querySelector('#root'))

  root.render(
    <MarkdownEditor mode={ModeType.NORMAL} />
  );
}

render({});