---
title: 将 Props 传递给组件
---

React 组件使用 *props* 来互相通信。每个父组件都可以提供 props 给它的子组件，从而将一些信息传递给它。Props 可能会让你想起 HTML 属性，但你可以通过它们传递任何 JavaScript 值，包括对象、数组和函数。

## 熟悉的 props

Props 是你传递给 JSX 标签的信息。例如，`className`、`src`、`alt`、`width` 和 `height` 便是一些可以传递给 `<img>` 的 props：

```jsx
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://react.dev/images/docs/scientists/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}

```

你可以传递给 `<img>` 标签的 props 是预定义的（ReactDOM），但是你可以将任何 props 传递给 **你自己的** 组件。

## 向组件传递 props 

### 将 props 传递给子组件

```jsx
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```



### 在子组件中读取 props

```jsx
function Avatar({ person, size }) {
  // 在这里 person 和 size 是可访问的
}
```



### 给 prop 指定一个默认值

如果你想在没有指定值的情况下给 prop 一个默认值，你可以通过在参数后面写 `=` 和默认值来进行解构：

```jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```



## 使用 JSX 展开语法传递 props

有时候，传递 props 会变得非常重复：

```jsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

因为这些组件不直接使用他们本身的任何 props，所以使用更简洁的“展开”语法是有意义的：

```jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

这会将 `Profile` 的所有 props 转发到 `Avatar`，而不列出每个名字。



## 将 JSX 作为子组件传递 

嵌套浏览器内置标签是很常见的：

```jsx
<div>
  <img />
</div>
```

有时你会希望以相同的方式嵌套自己的组件：

```jsx
<Card>
  <Avatar />
</Card>
```

当你将内容嵌套在 JSX 标签中时，父组件将在名为 `children` 的 prop 中接收到该内容。

例如，下面的 `Card` 组件将接收一个被设为 `<Avatar />` 的 `children` prop 并将其包裹在 div 中渲染：

```jsx
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

```

可以将带有 `children` prop 的组件看作有一个“洞”，可以由其父组件使用任意 JSX 来“填充”。你会经常使用 `children` prop 来进行视觉包装：面板、网格等等。

<img src="https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/image-20260817151743979.png" alt="image-20260817151743979" style="zoom:25%;" />

## Props 如何随时间变化

> Props 是只读的时间快照：每次渲染都会收到新版本的 props。

下面的 `Clock` 组件从其父组件接收两个 props：`color` 和 `time`。

```jsx
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}

```

这个例子说明，**一个组件可能会随着时间的推移收到不同的 props。** Props 并不总是静态的！在这里，`time` prop 每秒都在变化。当你选择另一种颜色时，`color` prop 也改变了。Props 反映了组件在任何时间点的数据，并不仅仅是在开始时。

然而，props 是 不可变的。当一个组件需要改变它的 props（例如，响应用户交互或新数据）时，它不得不“请求”它的父组件传递 **不同的 props** —— 一个新对象！它的旧 props 将被丢弃，最终 JavaScript 引擎将回收它们占用的内存。

**不要尝试“更改 props”。** 当你需要响应用户输入（例如更改所选颜色）时，你可以“设置 state”。