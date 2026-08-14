---
title: 快速入门
---

## 创建项目

### create-react-app

使用 create-react-app 脚手架创建React项目：

```sh
npx create-react-app my-react-app
```

项目基于webpack打包构建

### vite

create-react-app 已经不是 React 官方推荐的新项目创建方式了。React 官方更推荐使用基于 Vite、Next.js 等方案。

```sh
pnpm create vite my-app --template react
```

### umi

Umi 是蚂蚁集团的底层前端框架

```sh
pnpm dlx create-umi@latest
```
`pnpm dlx` 中的 dlx 是 download and execute（下载并执行） 的缩写，作用类似于 npm 的 npx。

表示：

1. 临时下载 `create-umi` 这个 npm 包
2. 使用最新版本（`@latest`）
3. 执行它里面提供的命令
4. 执行结束后，不会把它安装到当前项目的 `node_modules`

## 项目结构

### index.html



### App.jsx

根组件。通常承载最外层的布局结构、全局上下文初始化或顶层路由分发。


### Babel

浏览器的 JS 引擎只能识别标准的 JS 代码，并不认识 React 独有的 JSX 语法，也无法直接运行最新的 ESNext 前沿语法。Babel 的作用就是将这些高级/非标准代码“降级翻译”为所有浏览器都能理解的普通 JavaScript（ES5/ES6）。


### main.js

整个应用的起点。它通过 ReactDOM.createRoot 将根组件挂载到 index.html 的 DOM 节点上，并在此处引入全局样式、路由以及状态管理的 Provider。


## React库

在 React 14 版本之前，这两个库是合并在一起的。后来 React 官方决定将它们拆分，其核心目的是为了实现跨平台架构。

### React（核心库）

- 角色：定义组件与状态逻辑的通用核心。

- 主要职责：

    - 组件化机制：定义类组件、函数组件以及 JSX 语法。

    - 状态管理：提供 Hooks（如 useState, useEffect）和生命周期机制。

    - 虚拟 DOM（Virtual DOM）构建：在内存中创建和维护组件的状态树，并计算状态更新时的差异（Diffing 算法）。


### React-DOM（渲染器）

- 角色：针对 Web 浏览器 环境的具体渲染实现。

- 主要职责：

    - 渲染挂载：将 React 计算出的虚拟 DOM 转换并渲染为实际的浏览器 DOM 节点（例如通过 createRoot().render()）。

    - 事件处理与合成：接管浏览器的真实 DOM 事件（如 click, input），并将其转化为 React 的合成事件系统（Synthetic Events）。

    - 服务端渲染（SSR）支持：提供 react-dom/server 用于在服务器端（Node.js 等）将组件渲染为 HTML 字符串。

| **平台 / 宿主环境** | **核心逻辑库** | **对应的渲染器（Renderer）** | **最终产物**          |
| ------------------- | -------------- | ---------------------------- | --------------------- |
| **Web 网页**        | `react`        | **`react-dom`**              | 浏览器 DOM 节点       |
| **移动端 App**      | `react`        | `react-native`               | iOS / Android 原生 UI |
| **3D / WebGL**      | `react`        | `@react-three/fiber`         | Three.js 3D 场景      |
| **终端命令行**      | `react`        | `ink`                        | CLI 命令行界面        |



```jsx
// 1. 从 'react' 导入：负责定义组件结构和逻辑
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>点击数: {count}</button>;
}

// 2. 从 'react-dom/client' 导入：负责将 React 组件真正的“画”到浏览器页面上
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />);
```

## 挂载到HTML

React 将根组件挂载到 HTML，本质上是通过 **ReactDOM 创建一个 React 根节点（Root），然后把组件树渲染到指定 DOM 容器中**。

```html
<!DOCTYPE html>
<html>
<head>
  <title>React App</title>
</head>
<body>

<div id="root"></div>

</body>
</html>
```



```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root')!
)

root.render(
  <App />
)
```

## 组件

React支持两种组件写法

### 函数组件

在 React 中，const Button = `<button>点击</button>` 定义的是一个React 元素（即已渲染好的虚拟 DOM 节点），它是静态的，无法接收外部数据或动态变化。

而函数组件写法 `const Button = (props) => <button>{props.text}</button>` 之所以被设计成函数，核心原因是：

1. 接收参数：

```jsx
// ❌ 如果只是一个变量：内容被死死写固定了
const Button = <button>点击</button>;

// 无论你在哪里用它，它永远都只能叫“点击”，无法定制
<div>
  {Button} 
  {Button}
</div>
```

但如果把它定义成函数，它就可以像普通函数一样接收参数（Props），从而实现灵活复用：

```jsx
// ✅ 定义为函数：可以根据传入的数据“动态计算”出不同的 UI
function Button({ text, type }) {
  return <button className={type}>{text}</button>;
}

// 使用时传入不同的参数（Props）
<div>
  <Button text="提交" type="primary" />
  <Button text="取消" type="secondary" />
</div>
```

2. 动态渲染

函数内可根据 props 或 state 返回不同的 JSX，实现逻辑分支。

3. 生命周期与 Hooks 

函数组件配合 Hooks（如 useState、useEffect）能够管理内部状态和副作用，这是普通元素无法做到的

```jsx
import React, { useState } from 'react';

function Counter({ initialCount = 0 }) {
  // 定义状态
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter-card">
      <h3>当前计数: {count}</h3>
      <button onClick={() => setCount(count + 1)}>加 1</button>
      <button onClick={() => setCount(count - 1)}>减 1</button>
    </div>
  );
}

export default Counter;

```

4. 组合能力

函数组件可以嵌套其他组件，形成树形结构，便于拆分和复用 UI。

> 简单说：元素是“结果”，函数是“工厂”。

### 类组件

通过继承 `React.Component` 实现，使用 `this.state` 管理状态，并依赖生命周期钩子。

```jsx
import React, { Component } from 'react';

class CounterClass extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount || 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <h3>当前计数: {this.state.count}</h3>
        <button onClick={this.increment}>加 1</button>
      </div>
    );
  }
}

export default CounterClass;
```