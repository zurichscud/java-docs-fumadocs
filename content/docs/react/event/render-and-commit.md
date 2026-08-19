---
title: 渲染管线
---

## 步骤 1: 触发一次渲染

有两种原因会导致组件的渲染:

1. 组件的 **初次渲染。**
2. 组件（或者其祖先之一）的 **状态发生了改变。**

### 初次渲染

当应用启动时，会触发初次渲染。框架和沙箱有时会隐藏这部分代码，但它是通过调用 [`createRoot`](https://zh-hans.react.dev/reference/react-dom/client/createRoot) 方法并传入目标 DOM 节点，然后用你的组件调用 `render` 函数完成的：

```jsx
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

### 状态更新时重新渲染

一旦组件被初次渲染，你就可以通过使用 `setState` 更新其状态来触发之后的渲染。更新组件的状态会自动将一次渲染送入队列。

## 步骤 2: React 渲染你的组件

在你触发渲染后，React 会调用你的组件来确定要在屏幕上显示的内容。

这个过程是递归的：如果更新后的组件会返回某个另外的组件，那么 React 接下来就会渲染 *那个* 组件，而如果那个组件又返回了某个组件，那么 React 接下来就会渲染 *那个* 组件，以此类推。这个过程会持续下去，直到没有更多的嵌套组件并且 React 确切知道哪些东西应该显示到屏幕上为止。

## 步骤 3: React 把更改提交到 DOM 上

在渲染（调用）你的组件之后，React 将会修改 DOM。

- **对于初次渲染**，React 会使用 [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API 将其创建的所有 DOM 节点放在屏幕上。
- **对于重渲染**，React 将应用最少的必要操作（虚拟DOM）

**React 仅在渲染之间存在差异时才会更改 DOM 节点。** 例如，有一个组件，它每秒使用从父组件传递下来的不同属性重新渲染一次。你可以添加一些文本到 `<input>` 标签，更新它的 `value`，但是文本不会在组件重渲染时消失：

```jsx
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

## State 具有快照特性

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

请注意，每次点击只会让 `number` 递增一次！

**设置 state 只会为下一次渲染变更 state 的值**。在第一次渲染期间，`number` 为 `0`。这也就解释了为什么在 **那次渲染中的** `onClick` 处理函数中，即便在调用了 `setNumber(number + 1)` 之后，`number` 的值也仍然是 `0`：

```jsx
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

以下是这个按钮的点击事件处理函数通知 React 要做的事情：

1. `setNumber(number + 1)`：number是0，所以`setNumber(0 + 1)`。React 准备在下一次渲染时将 `number` 更改为 `1`。
2. `setNumber(number + 1)`：number是0，所以`setNumber(0 + 1)`。React 准备在下一次渲染时将 `number` 更改为 `1`。
3. `setNumber(number + 1)`：number是0，所以`setNumber(0 + 1)`。React 准备在下一次渲染时将 `number` 更改为 `1`。

尽管你调用了三次 `setNumber(number + 1)`，但在 **这次渲染的** 事件处理函数中 `number` 会一直是 `0`，所以你会三次将 state 设置成 `1`。这就是为什么在你的事件处理函数执行完以后，React 重新渲染的组件中的 `number` 等于 `1` 而不是 `3`。

```jsx
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('你好');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`你向 ${to} 说了${message}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">发送</button>
    </form>
  );
}
```

**闭包捕获**：每次组件渲染时，`handleSubmit` 函数都会“捕获”当前渲染时的 `to` 和 `message` 变量（即 Alice 和你好）。

**独立定时器**：`setTimeout` 回调函数闭包绑定的是点击“发送”那一刻的 state 值，后续用户修改下拉框触发重新渲染，不会影响已经运行中的 `setTimeout` 所引用的旧值。
