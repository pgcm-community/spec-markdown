# Spec-MarkDown

本质是为了目前在写的 pgcm 社区所写的 markdown 编辑器, 仅使用了 React

```shell
# npm
npm install spec-markdown-editor

# pnpm
pnpm install spec-markdown-editor
```

例:

```jsx
import SpecMarkdown from 'spec-markdown-editor'

function App() {
  return (
    <>
      <SpecMarkdown />
    </>
  )
}
```

## 基本功能

- [x] 实时预览
- [x] 同步滚动
- [ ] 主题
- [ ] 快捷键
- [ ] 工具栏
- [ ] 图片
- [ ] 导入/ 导出

## 快捷键

| 按键       | 说明       |
| ---------- | ---------- |
| ctrl + b   | 加粗       |
| ctrl + 1~6 | 1~6 级标题 |
| ctrl + l   | 链接       |
| ctrl + i   | 斜体       |
| ctrl + u   | 删除线     |

## 补充

欢迎大家提交 issue 以及需求, 本人对 react 并不是很熟悉, 这也算是个练手的小玩意, Wechat:
![微信](https://xiaoli-wyy.oss-cn-hongkong.aliyuncs.com/wechat.jpg?x-oss-process=image/resize,h_500)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022, XiaoLi_1456
