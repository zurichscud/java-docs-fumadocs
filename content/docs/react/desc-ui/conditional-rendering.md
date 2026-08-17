---
title: 条件渲染
---

- 你可以使用 `if` 语句来选择性地返回 JSX 表达式。
- 你可以选择性地将一些 JSX 赋值给变量，然后用大括号将其嵌入到其他 JSX 中。
- 在 JSX 中，`{cond ? <A /> : <B />}` 表示 *“当 `cond` 为真值时, 渲染 `<A />`，否则 `<B />`”*。
- 在 JSX 中，`{cond && <A />}` 表示 *“当 `cond` 为真值时, 渲染 `<A />`，否则不进行渲染”*。

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



## 条件返回 JSX

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```



## 选择性地返回 `null`

在一些情况下，你不想有任何东西进行渲染。这种情况下，你可以直接返回 `null`。

```jsx
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```



## 三目运算符

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```





## 与运算符

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

你可以认为，*“当 `isPacked` 为真值时，则（`&&`）渲染勾选符号，否则，不渲染。”*

<Callback type="warn"  title="切勿将数字放在 && 左侧">
JavaScript 会自动将左侧的值转换成布尔类型以判断条件成立与否。然而，如果左侧是 0，整个表达式将变成左侧的值（0），React 此时则会渲染 0 而不是不进行渲染。
</Callback>

## 选择性地将 JSX 赋值给变量

这种方式是最冗长的，但也是最灵活的。

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```



