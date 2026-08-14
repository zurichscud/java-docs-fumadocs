---
title: JSX语法

---

## 基本概念

JSX（JavaScript XML） 是 React 核心的语法扩展，它允许你在 JavaScript 代码中直接书写类似于 HTML 的结构。

虽然你看它长得像 HTML，但它本质上是 JavaScript 的语法糖。浏览器并不能直接运行 JSX，最终需要通过 Babel 等编译器将其转化为标准的 JavaScript 函数调用。

## 底层机制

在 React 17 之前，JSX 会被编译为 `React.createElement`；而在 React 17 及之后，它被编译为全新的 JSX 转换函数（jsx-runtime）：


```js tab="React16"
// 你写的 JSX
const element = <h1 className="title">Hello World</h1>;

// 经过编译器转换后的真实 JavaScript
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello World',
);
```

```js tab="React17"
// 你写的 JSX
const element = <h1 className="title">Hello World</h1>;

// 经过编译器转换后的真实 JavaScript
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx('h1', { className: 'title', children: 'Hello World' });
```

## 基本语法


### 动态表达式必须用`{}` 包裹

你可以在 `{}` 中插入任何有效的 JavaScript 表达式（如变量、函数调用、三元运算符等）：

```jsx
const name = 'Alice';
const element = <h1>Hello, {name.toUpperCase()}!</h1>;
```

| `{}` 中的值 | 是否渲染   | 渲染结果             |
| ----------- | ---------- | -------------------- |
| 字符串/数字 | ✅ 渲染     | 直接渲染             |
| 布尔值      | ❌ 不渲染   | 空                   |
| `null`      | ❌ 不渲染   | 空                   |
| `undefined` | ❌ 不渲染   | 空                   |
| 数组        | ✅ 部分情况 | 展开渲染元素         |
| JSX Element | ✅ 渲染     | 对应 DOM             |
| 对象        | ❌ 报错     | React 不知道如何渲染 |
| 函数        | ❌ 报错     | 不能直接渲染函数     |
| Symbol      | ❌ 报错     | 不支持               |

当数组被放进 `{}` 中时，React 会遍历数组，并根据元素的数据类型分别处理。

```jsx
function App() {
  const elements = [
    <li key="a">苹果</li>,
    <li key="b">香蕉</li>,
    <li key="c">橘子</li>
  ];

  // 在 {} 中传入数组 elements
  return <ul>{elements}</ul>;
}
```

```jsx
// React 处理后的渲染效果等同于：
return (
  <ul>
    <li key="a">苹果</li>
    <li key="b">香蕉</li>
    <li key="c">橘子</li>
  </ul>
);
```



### 只能有一个根标签

JSX 节点最终会被转译为单一的对象，因此必须包含在一个根节点内。如果你不想增加无意义的 HTML 嵌套，可以使用空标签（Fragment）：

```jsx
// 推荐写法
return (
  <>
    <h1>标题</h1>
    <p>内容</p>
  </>
);
```

### 属性名采用驼峰命名法

因为 JSX 更接近 JavaScript 而不是 HTML，所以许多原生属性名做了转换：

- class 转换为 className（避免与 JS 关键字冲突）

- for 转换为 htmlFor

- 事件绑定采用驼峰形式，如 onclick 变为 onClick

```js
<button className="btn-primary" onClick={handleClick}>点击我</button>
```

### 所有标签必须闭合

即便是单标签（如 `<img>`、`<input>`、`<br>`），在 JSX 中也必须加上自闭合斜杠 `/`：

```jsx
<img src="logo.png" alt="Logo" />
<input type="text" />
```

### 条件渲染

常用 `&&` 逻辑与运算符或三元运算符：

```jsx
function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>欢迎回来</p> : <button>请先登录</button>}
      {isLoggedIn && <button>退出登录</button>}
    </div>
  );
}
```

### 列表渲染

使用数组的 `.map()` 方法，且遍历产生的每一个节点必须包含独一无二的 `key` 属性：

```jsx
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### innerHTML渲染

dangerouslySetInnerHTML 是 React 中用来替代原生 DOM innerHTML 的属性。它的主要作用是将包含 HTML 标记的字符串直接渲染到页面节点（如 `<div>`）中。

与原生 DOM 直接赋值字符串不同，React 要求给 dangerouslySetInnerHTML 传递一个带有 `__html` 键名的对象：

```jsx
const rawHtml = '<p>这是一段包含 <strong>HTML 标签</strong> 的动态文本。</p>';

function MyComponent() {
  return (
    <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
  );
}
```

React 默认会对渲染的文本进行转义（防止 XSS 攻击）。当你使用 dangerouslySetInnerHTML 时，等于告诉 React：“我知道这段 HTML 是安全的，跳过转义直接注入。”