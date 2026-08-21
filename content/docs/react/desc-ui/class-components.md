---
title: 类组件
---

## 基础语法

在 React 中，创建 **Class 组件（类组件）** 需要继承 `React.Component`，并且必须实现 `render` 方法。

```jsx
import React, { Component } from 'react';

// 定义组件
class MyComponent extends Component {
  render() {
    return (
      <div>
        <h1>Hello from Class Component!</h1>
      </div>
    );
  }
}

export default MyComponent;
```

## 渲染

```jsx
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

1. React发现是类组件，随后使用new创建该类的实例，并通过该实例调用render方法

2. 将render返回的虚拟DOM转为真实DOM。随后呈现在页面中

### 根节点

 React 需要一个"入口":

```html
<body>
  <div id="root"></div>
</body>
```

React 不会接管整个页面，而是只管理这个节点：

```js
document.getElementById('root')
```

这个节点叫 **root container（根容器）**。

## 组件实例

在render中打印this：

```js
MyComponent {
  props: {},
  context:{},
  refs:{},
  state: null,
  ...
}
```

## props

### 传入props

父组件可以向子组件传入 props

```jsx
function App() {

  return (
    <User name="Tom" age={18} />
  );

}
```

### 接收props

父类构造函数将传入的 `props` 赋值给当前实例的 `this.props`

如果在类组件中定义了 `constructor`，必须将 `props` 传递给 `super(props)`，否则无法在组件中使用 `this.props`。

```js
class User extends React.Component {

  constructor(props) {
    super(props);

    console.log(props);
    console.log(this.props);
  }

  render() {
    return <div>{this.props.name}</div>;
  }
}
```

如果没有写`constructor`，JS会自动补全：

```js
// JavaScript 引擎自动补全的代码：
constructor(...args) {
  super(...args);
}
```

因此即使不写 `constructor`，`super(props)` 依然会被隐式执行，`this.props` 依然能在组件中正常使用

### 批量传入

父组件可以批量传入props

```jsx
const userInfo = {
  name: "Tom",
  age: 18,
  gender: "male"
};
```

```jsx
<User {...userInfo} />
```

React 会展开成：

```jsx
<User
  name="Tom"
  age={18}
  gender="male"
/>
```

React 支持多个展开 props，它会按照**从左到右合并**：

```jsx
<User {...obj1} {...obj2} />
```

多个展开对象可以混合普通 props，规则是一样的，后面的覆盖前面的：

```jsx
<User
  {...userInfo}
  id={100}
  {...obj}
/>
```

### 对props进行限制

React 中对 `props` 进行限制，主要有两种方式：

1. **PropTypes（运行时检查）**

2. **TypeScript（编译时检查，现代项目更推荐）**

`prop-types` 是 React 官方提供的运行时校验库。

安装：

```sh
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

class User extends React.Component {

  render() {

    return (
      <div>
        {this.props.name}
        {this.props.age}
      </div>
    );

  }

}


User.propTypes = {

  // 必须是字符串
  name: PropTypes.string,

  // 必须是数字
  age: PropTypes.number

};
```

如果：

```jsx
<User name={123} age="18" />
```

开发环境会提示：

```jsx
Warning: Invalid prop `name` of type `number`
```

- 限制 props 必传

```jsx
User.propTypes = {

  name: PropTypes.string.isRequired

};
```

- 限制 props 默认值

```jsx
User.defaultProps = {

  name:"匿名用户",

  age:0

};
```

我们可以将限制写在class中：

```jsx
import React from "react";
import PropTypes from "prop-types";

class User extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number
  };


  static defaultProps = {
    age: 18
  };


  render() {
    return (
      <div>
        姓名：{this.props.name}
        年龄：{this.props.age}
      </div>
    );
  }

}
```

## state

### 初始化state

React **class 组件设置 state** 有两种常见方式：

- constructor 初始化 state

```jsx
import React, { Component } from 'react';

class Counter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        {this.state.count}
      </div>
    );
  }
}

export default Counter;
```

- 直接声明 state

```jsx
class Counter extends React.Component {

  state = {
    count: 0
  };

  render() {
    return (
      <div>
        {this.state.count}
      </div>
    );
  }
}
```

等价于：

```jsx
constructor(props) {
  super(props);

  this.state = {
    count: 0
  };
}
```

### 设置state

修改 `state` 不能直接赋值，应该使用 `this.setState()`

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  add = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.add}>+1</button>
      </div>
    );
  }
}
```

`setState` 是**异步批处理**的。因此推荐传入函数

```jsx
addThree = () => {
  this.setState(prevState => ({
    count: prevState.count + 1
  }));

  this.setState(prevState => ({
    count: prevState.count + 1
  }));

  this.setState(prevState => ({
    count: prevState.count + 1
  }));
};
```

### 浅合并

> 浅合并：只合并第一层

类组件中的 `setState` **默认不是直接替换整个 state**，而是进行**浅合并（shallow merge）**。

```jsx
class App extends React.Component {
  state = {
    name: "Tom",
    age: 18
  };

  changeName = () => {
    this.setState({
      name: "Jack"
    });
  };
}
```

```jsx
this.setState({
  name: "Jack"
});
```

最后的结果：

```jsx
state = {
  name: "Jack",
  age: 18
}
```

## 事件处理函数

### this丢失问题

在 class 组件中，`render()` 里的事件处理函数可以调用 class 中定义的方法。但是这里面会存在方法中的`this`丢失的问题。

```jsx
class Counter extends React.Component {

  state = {
    count: 0
  };

  add() {
    this.setState({
      count: this.state.count + 1
    });
  }

  render() {
    return (
      <button onClick={this.add}>
        +1
      </button>
    );
  }
}
```

React会将传入的函数接收并执行，而不是直接执行`this.add`，这会导致`this`丢失

```js
const fn=this.add
fn()//this的默认绑定
```

### 方式1：使用箭头函数

```jsx
class Counter extends React.Component {

  state = {
    count: 0
  };

  add = () => {
    // this 指向 Counter实例
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return (
      <button onClick={this.add}>
        {this.state.count}
      </button>
    );
  }
}
```

class是构造函数的语法糖，箭头函数向上寻找this绑定就会找到Counter函数的this

### 方式2：constructor 中 bind

```jsx
class Counter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };

    this.add = this.add.bind(this);
  }


  add() {
    this.setState({
      count: this.state.count + 1
    });
  }


  render() {
    return (
      <button onClick={this.add}>
        {this.state.count}
      </button>
    );
  }
}
```

### 方式3：render中包一层箭头函数

箭头函数向上寻找，找到render中的this绑定

```jsx
class Counter extends React.Component {

  add() {
    console.log(this);
  }

  render() {
    return (
      <button
        onClick={() => this.add()}
      >
        click
      </button>
    );
  }
}
```

## 最佳实践

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  add = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.add}>+1</button>
      </div>
    );
  }
}
```
