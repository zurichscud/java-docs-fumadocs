---
title: this
---

JavaScript 中的 `this` 指向并不是在编写时决定的，而是在**函数被调用时**动态绑定的。掌握 `this` 的指向，关键在于查看**函数的调用方式和所在上下文**。

## 核心绑定规则

根据函数的调用形式，`this` 的指向分为以下 5 种主要情况：

### 1. 默认绑定（全局 / 独立调用）

当函数作为普通函数被直接调用时，`this` 指向全局对象。

- **非严格模式：** 指向 `window`（浏览器环境）或 `global`（Node.js 环境）。
- **严格模式 (`'use strict'`)：** 指向 `undefined`。

```js
function foo() {
  console.log(this);
}
foo(); // 非严格模式下输出 window；严格模式下输出 undefined
```

### 2. 隐式绑定（对象方法调用）

当函数作为某个对象的方法被调用时，`this` 指向**最后调用它的那个对象**（即点操作符 `.` 左侧的对象）。

```js
const obj = {
  name: 'Vue Dev',
  getName() {
    console.log(this.name);
  }
};

obj.getName(); // 输出 'Vue Dev'，this 指向 obj

// 注意：隐式丢失
const fn = obj.getName;
fn(); // 输出 undefined，此时为普通独立调用，this 指向 window/undefined
```

### 3. 显式绑定（`call` / `apply` / `bind`）

通过 `call`、`apply` 或 `bind` 可以手动强行指定函数执行时的 `this` 指向。

- **`call(thisArg, arg1, arg2...)`**：立即执行，参数逐个传递。
- **`apply(thisArg, [argsArray])`**：立即执行，参数以数组形式传递。
- **`bind(thisArg, arg1, arg2...)`**：**不立即执行**，返回一个新的绑定函数。

```js
function greet(lang1, lang2) {
  console.log(`${this.name} knows ${lang1} and ${lang2}`);
}

const person = { name: 'Fullstacker' };

greet.call(person, 'Vue', 'Java');    // Fullstacker knows Vue and Java
greet.apply(person, ['Vue', 'Java']);  // Fullstacker knows Vue and Java

const boundFn = greet.bind(person, 'Vue', 'Java');
boundFn();                            // Fullstacker knows Vue and Java
```

### 4. `new` 绑定（构造函数调用）

当使用 `new` 操作符调用函数时，会创建一个全新的对象，此时 `this` 绑定到这个**新创建的对象**上。

```js
function Person(name) {
  this.name = name;
}

const p = new Person('Developer');
console.log(p.name); // 'Developer'
```

### 5. 箭头函数

**箭头函数没有自己的 `this`**。它会捕获**声明时所在外层作用域**（非箭头函数/全局）的 `this` 作为自己的 `this`，且无法通过 `call/apply/bind` 改变。

```js
const obj = {
  name: 'App',
  delayLog() {
    // 普通函数里的 setTimeout 会丢失 this，但箭头函数会继承 delayLog 的 this
    setTimeout(() => {
      console.log(this.name); // 输出 'App'
    }, 100);
  }
};

obj.delayLog();
```

## 规则优先级比较

如果同一函数调用同时满足多种规则，按以下优先级决定 `this`：

$$\text{new 绑定} > \text{显式绑定 (call/apply/bind)} > \text{隐式绑定 (obj.fn)} > \text{默认绑定}$$

<Callback title="注意">

箭头函数优先继承外层作用域，不适用上述传统优先级的重写。

</Callback>

## 箭头函数的this

箭头函数**没有自己的 `this`**，它的 `this` 遵循**词法作用域（Lexical Scoping）\**原则：在\**定义时**静态继承外层最近的非箭头函数（或全局上下文）的 `this`，且**生命周期内永远保持不变**。

```jsx
const obj = {
  name: 'App',
  regularFn() {
    // 箭头函数没有自己的 this，向上继承 regularFn 的 this（即 obj）
    const arrowFn = () => console.log(this.name);
    arrowFn();
  }
};

obj.regularFn(); // 输出 'App'
```

<Callback title="setTimeout">
箭头函数没有自己的 this，它会继承定义时所在作用域的 this。

```js
const obj = {
  name: '张三',

  test() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
};

obj.test();//张三
```

</Callback>

