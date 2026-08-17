---
title: React 哲学
---

React 可以改变你对可见设计和应用构建的思考。

## 将 UI 拆解为组件层级结构 

当你使用 React 构建用户界面时，你首先会把它分解成一个个组件，然后，你需要把这些组件连接在一起，使数据流经它们。

![img](https://markdown-lai.oss-cn-hangzhou.aliyuncs.com/typora/s_thinking-in-react_ui_outline.png)

1. `FilterableProductTable`（灰色）包含完整的应用。
2. `SearchBar`（蓝色）获取用户输入。
3. `ProductTable`（淡紫色）根据用户输入，展示和过滤清单。
4. `ProductCategoryRow`（绿色）展示每个类别的表头。
5. `ProductRow`（黄色）展示每个产品的行。

在 `ProductTable`中，可以看到表头（包含 “Name” 和 “Price” 标签）并不是独立的组件。这是个人喜好的问题，你可以采取任何一种方式继续。在这个例子中，它是作为 `ProductTable` 的一部分，因为它展现在 `ProductTable` 列表之中。然而，如果这个表头变得复杂（举个例子，如果添加排序），创建独立的 `ProductTableHeader` 组件就变得有意义了。



现在你已经在原型中辨别了组件，并将它们转化为了层级结构。在原型中出现在其他组件内部的组件在层级结构中应作为子项出现:

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## 构建一个静态版本

> 构建一个静态版本需要写大量的代码，并不需要什么思考; 但添加交互需要大量的思考，却不需要大量的代码。

构建应用程序的静态版本来渲染你的数据模型，将构建 [组件](https://zh-hans.react.dev/learn/your-first-component) 并复用其它的组件，然后使用 [props](https://zh-hans.react.dev/learn/passing-props-to-a-component) 进行传递数据。Props 是从父组件向子组件传递数据的一种方式。

在大型项目中，自下而上构建更简单。

```jsx
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}

```



## 使用 **state** 实现UI交互

考虑将 state 作为应用程序需要记住改变数据的最小集合。组织 state 最重要的一条原则是保持它 [DRY（不要自我重复）](https://en.wikipedia.org/wiki/Don't_repeat_yourself)。计算出你应用程序需要的绝对精简 state 表示，按需计算其它一切。举个例子，如果你正在构建一个购物列表，你可将他们在 state 中存储为数组。如果你同时想展示列表中物品数量，不需要将其另存为一个新的 state。而是，可以通过读取你数组的长度来实现。

现在考虑示例应用程序中的每一条数据，其中哪些是 state 呢？

- 随着时间推移 **保持不变**？如此，便不是 state。
- 是否可以基于已存在于组件中的 state 或者 props **进行计算**？如此，便不是 state

让我们再次一条条验证它们:

1. products不是state，因为他不会随时间的推移而变化
2. 搜索文本似乎应该是 state，因为它会随着时间的推移而变化，并且无法从任何东西中计算出来。
3. 复选框的值似乎是 state，因为它会随着时间的推移而变化，并且无法从任何东西中计算出来。
4. 过滤后列表中的产品 **不是 state，因为可以通过被原始列表中的产品，根据搜索框文本和复选框的值进行计算**。

## 验证 state 应该被放置在哪里

在验证你应用程序中的最小 state 数据之后，你需要验证哪个组件是通过改变 state 实现可响应的，或者 **拥有** 这个 state。记住：React 使用单向数据流，通过组件层级结构从父组件传递数据至子组件。要搞清楚哪个组件拥有哪个 state。

state 应该被放置于哪里:

1. 通常情况下，你可以直接放置 state 于它们共同的父组件。
2. 你也可以将 state 放置于它们父组件上层的组件。
3. 如果你找不到一个合适来放这个 state 的地方，单独创建一个新的组件去管理这个 state，并将它添加到它们父组件上层的某个地方。



## 添加反向数据流 

目前你的应用程序可以带着 props 和 state 随着层级结构进行渲染。但是为了支持通过用户输入来改变 state，你需要让数据反向传输：深层结构的表单组件需要更新 `FilterableProductTable` 的 state。

当用户更改表单输入时，state 将更新以反映这些更改。state 由 `FilterableProductTable` 所拥有，所以只有它可以调用 `setFilterText` 和 `setInStockOnly`。使 `SearchBar` 更新 `FilterableProductTable` 的 state，需要将这些函数传递到 `SearchBar`：

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

在 `SearchBar` 中，添加一个 `onChange` 事件处理器，使用其设置父组件的 state：

```jsx
function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="搜索"
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}

```

