---
title: GraphQL学习笔记
author: 孙子平
date: 2020-06-27T16:32:04Z
cover: /assets/blog/graphql-learning-notes/graphql.png
category: 前端
tags: [前端, 编程]
---

这篇文章是在我写山楂记账的过程中，尝试使用新的API调用方式。因此重新考虑了曾经接触过的GraphQL，决定学习一下。内容主要来自[Introduction to GraphQL | GraphQL](https://graphql.org/learn/) 。

<!-- more -->

## 1 查询和更改

最简单的查询像下面这样：

```graphql
{
  <object> {
    # can contain comment
    <field1>
    # can be a sub-selection for field refering objects
    <field2> {
      <sub-field1>
      <sub-field2>
      ...
    }
    ...
  }
}
```

查询中的每一个字段（包括标量字段）和嵌套对象都可以带有参数：

```graphql
{
  <object>(<argument1>: <value1>, ...) {
    ...
    <fieldN>(<argument2>: <value2>, ...)
  }
}
```

参数拥有不同的类型，比如原文例子的`height(unit: FOOT)`就是枚举。用户可以自定义了类型。

默认情况下，查询返回的字段会与查询的字段一致，不包括参数。使用别名可以避免查询到结果同名造成的错误。

```graphql
{
  <alias1>: <object1> { ... }
  <alias2>: <object2> { ... }
}
```

可以使用片段来减少重复的查询。片段可以访问到查询或更改定义的变量。

```graphql
query <operation>(<$var>: <type> = <value>) {
  <alias1>: <object1>(<argument1>: <value1>) {
    ...<fragment>
  }
  <alias2>: <object2>(<argument2>: <value2>) {
    ...<fragment>
  }
}

fragment <fragment> on <type> {
  <field1>
  ...
}
```

之前我们一直才用简写的方式省略了`query <operation>`。这里`query`是操作类型，也可以为`mutation`、`subscription`等等。`<operation>`是个对操作有意义的名字，多文档操作时是必须的，它对于日志输出很有帮助。

如果不使用变量，随着一些查询的变更，我们可能需要重新序列化成GraphQL格式。对此我们可以使用变量：

1. 讲查询使用的静态值改为`$variableName`；
2. 声明`$variableName`作为查询接受的变量；
3. 通过另外的某种格式如JSON，将变量传递进来。

```graphql
query <operation>(<$var1>: <type1>, ...) {
  ...
}
```

变量定义中的名字必须是`$`开头的。其类型只能为标量、枚举或者输入对象类型。默认情况下，变量定义默认是可选的，但如果变量类型后面有`!`或者变量被传递给了一个要求非空的参数时，变量就成为必须的了。通过`<$var1>: <type1> = <value1>`可以设定变量中的默认值。

GraphQL中还有指令，它可以附着于字段或者片段包含上。目前有两个字段：

- `@include(if: Boolean)`：当条件成立时，包含字段；
- `@skip(if: Boolean)`：当条件成立时，跳过字段。

通过下面的方式可以创建更改，并指定返回的字段：

```graphql
mutation <operation>(<$var1>: <type1>, ...)  {
  field1
  field2
  ...
}
```

查询是平行运行的，但是更改被担保是顺序执行的。

如果你需要的数据类型是个接口或者联合，你需要使用内联片段访问数据，就像下面这样。

```graphql
query <operation> {
  ... on <Type> {
    field1
    ...
  }
  ...
}
```

GraphQL可以通过指定`__typename`元字段，包含额外的类型信息。

## 2 模式和类型

一个模式大致像下面的样子：

```graphql
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

其中`Character`是一个GraphQL对象类型。`name`和`appearsIn`是字段。`String`是内置标量类型。`!`表示不可为空。`[Episode!]!`表示Episode的数组，同时数组及其元素不为空。

每个字段都可以有0到多个参数，例如`length(unit: LengthUnit = METER): Float`。参数都是具名的。有默认值的参数就是可选的。

GraphQL有两种类型比较特殊：

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

一个服务可以有一个query类型和0个或多个mutation类型。它们与普通对象类型类似，不过它们定义了入口。

GraphQL有如下的内置标量类型：

- `Int`：32位有符号整型；
- `Float`：双精度浮点数；
- `String`：UTF-8字符串；
- `Boolean`：`true`或`false`；
- `ID`：唯一标识符，不需要给人读的。

你也可以像下面那样自定义标量类型：

```graphql
scalar Date
```

或者像下面那样定义枚举类型：

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

对象类型、标量、枚举是你在Graphql中唯一能定义的类型。你可以使用非空修饰符`!`，非空修饰符也可以用于参数。也可以定义列表，并且与非空修饰符配合使用。

GraphQL还提供了接口。接口是抽象的类型，它拥有一系列字段需要被实现。就像下面这样。

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

接口经常和内联片段配合使用。

联合类型则类似下方：

```graphql
union SearchResult = Human | Droid | Starship
```

通过下面的方法可以定义输入对象：

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

输入对象可以引用其他输入对象，但不能与输出对象混用。且输入对象的字段不能有参数。

## 3 验证

一个片段不能引用自己。如果我们要查询一个字段，它必须存在。如果我们查询的字段不是标量和枚举，那么我们需要指定想要得到的字段；而对于标量，你不应该指定想要得到的字段。

## 4 执行

GraphQL执行的时候，回由一种叫resolver的函数获取当前类型，然后如果返回的类型是标量或者枚举就完成了，否则会调用另一个resolver获取下一个类型。

一个resolver接受四个参数：

- `obj`：前一个对象；
- `args`：参数；
- `context`：上下文，表示一些额外的信息，如数据库；
- `info`：本次访问相关的信息；

## 5 内省

通过查询`__schema`可以获取一些内省信息。`__type(name: "<name>")`可以查询某个名字的类型。等等。
