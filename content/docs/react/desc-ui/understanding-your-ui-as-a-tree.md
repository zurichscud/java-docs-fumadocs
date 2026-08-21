---
title: "将 UI 视为树"
---

React 以及许多其他 UI 库，将 UI 建模为树。

## 将 UI 视为树

树是项目和 UI 之间的关系模型，通常使用树结构来表示 UI。例如，浏览器使用树结构来建模 HTML（DOM）与CSS（CSSOM）。移动平台也使用树来表示其视图层次结构。

## 渲染树

组件的一个主要特性是能够由其他组件组合而成。在 [嵌套组件](https://zh-hans.react.dev/learn/your-first-component#nesting-and-organizing-components) 中有父组件和子组件的概念，其中每个父组件本身可能是另一个组件的子组件。

```jsx
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}
```

![image-20260817172828027](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260817172828027.png)

## 模块依赖树

![image-20260817173224377](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260817173224377.png)
