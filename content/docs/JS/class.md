---
title: class
---



JavaScript 中的 `class`（类）在 ES6（2015年）引入，本质上是基于原型的继承机制（Prototypal Inheritance）的**语法糖**。它提供了更清晰、更符合面向对象编程（OOP）习惯的语法。



## 类声明与实例化

使用 `class` 关键字定义类，使用 `constructor` 定义构造函数。通过 `new` 关键字实例化对象。

```js
class User {
  constructor(name, role = 'User') {
    this.name = name; // 实例属性
    this.role = role;
  }

  // 实例方法（保存在 User.prototype 上）
  sayHi() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

const alice = new User('Alice');
alice.sayHi(); // Output: Hello, I'm Alice
```

语法细节：

- Class 内部的代码默认在严格模式（`"use strict"`）下运行。

## 类的继承

子类通过 `extends` 继承父类。如果子类定义了 `constructor`，**必须**在访问 `this` 之前调用 `super()`。

```js
class Admin extends User {
  constructor(name, permissions) {
    super(name, 'Admin'); // 调用父类的 constructor(name, role)
    this.permissions = permissions;
  }

  // 重写父类方法
  sayHi() {
    super.sayHi(); // 可用 super 调用父类方法
    console.log(`Permissions: ${this.permissions.join(', ')}`);
  }
}

const admin = new Admin('Bob', ['read', 'write']);
admin.sayHi();
```

## 实例成员

### 定义

-  方法一：类体声明字段

```js
class User {
  // 1. 公有实例属性
  role = 'User';
  age = 18;

  // 2. 私有实例属性（使用 # 前缀，外部无法访问）
  #token = 'abc-123-secret';

  getToken() {
    return this.#token; // 类内部可以正常访问
  }
}

const user1 = new User();
console.log(user1.role); // "User"
console.log(user1.getToken()); // "abc-123-secret"
// console.log(user1.#token); // ❌ 报错：SyntaxError
```

- 方法二：在 `constructor` 构造函数内部定义

适合属性初始值需要从**外部传参**进来的场景。

```js
class User {
  constructor(name, age) {
    // 通过 this 挂载到当前实例上
    this.name = name;
    this.age = age;
  }
}

const user2 = new User('Alice', 25);
console.log(user2.name); // "Alice"
```

### usage



## 静态成员

静态属性属于**类（Class）本身**，**不属于**任何实例对象，也不会被实例继承。通常用来存储配置、常量或全局共享状态。

### 定义

-  方法一：使用 `static` 关键字声明

在类内部属性名前加上 `static` 关键字。

```js
class AppConfig {
  // 1. 公有静态属性
  static API_BASE_URL = 'https://api.example.com';
  static MAX_CONNECTIONS = 5;

  // 2. 私有静态属性（只能在类本身的静态方法中访问）
  static #apiKey = 'SECRET_KEY_999';

  static getApiKey() {
    return AppConfig.#apiKey;
  }
}

// 通过“类名.属性名”直接访问：
console.log(AppConfig.API_BASE_URL); // "https://api.example.com"
console.log(AppConfig.getApiKey());   // "SECRET_KEY_999"

const config = new AppConfig();
console.log(config.API_BASE_URL); // ❌ undefined（实例上拿不到静态属性）
```

- 方法二：在类定义外部直接挂载

JavaScript 中的类本质上也是一个函数对象，可以直接在定义后给它添加属性。

```js
class AppConfig {}

// 直接在类对象上赋值
AppConfig.VERSION = '1.0.0';

console.log(AppConfig.VERSION); // "1.0.0"
```

### usage

静态方法调用时，内部的 `this` 指向的是**类本身**（Class 函数），而不是具体的**实例对象**，因此在静态方法中无法通过 `this.属性名` 来获取实例属性。

```js
class User {
  // 实例属性
  age = 25;

  static checkAge() {
    // ❌ 无法获取实例的 age
    console.log(this.age); // undefined
    
    // ⚠️ 注意：JavaScript 中函数本身有 name 属性，因此在类 User 中，this.name 会打印出类名 "User"
    console.log(this.name); // "User"（这是类的名称，不是实例的 name）
  }
}

User.checkAge();
```



## Getter / Setter

拦截对属性的访问和赋值操作

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  get area() {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(5);
console.log(c.area); // 78.5398... （像访问属性一样使用，无需加符号括号 ()）
```



## 与原型链的底层对应关系

虽然写的是 `class`，但底层依然是 JavaScript 的原型继承：

| **Class 语法**         | **底层原型对应机制**                                         |
| ---------------------- | ------------------------------------------------------------ |
| `class User`           | 定义构造函数 `function User() {...}`                         |
| 类构造体内的普通方法   | 挂载在 `User.prototype` 上（所有实例共享）                   |
| `static` 静态方法/属性 | 直接挂载在函数对象本身上，例如 `User.sayHi`                  |
| `extends` 继承         | 建立原型链关联：`Child.prototype.__proto__ = Parent.prototype` |