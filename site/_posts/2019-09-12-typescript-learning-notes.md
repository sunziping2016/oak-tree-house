---
title: TypeScipt学习笔记（未完待续）
date: 2019-09-11T18:31:16Z
tags: [JavaScript, 编程, 前端]
---

这篇文章是TypeScript的学习笔记，主要内容来自TypeScript官网的[handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)。

<!-- more -->

## 1 基础类型

TypeScript提供了如下类型：

- `boolean`：**Bool**类型；
- `number`：**数字**类型（包括整数和浮点数）；
- `string`：**字符串**类型；
- `type[]`或`Array<type>`：**数组**，其中`type`是某一类型，下同；
- `[type1, type2, ...]`：**元组**，对元组的下标索引会得到对应的类型，越界会报错；
- `enum Type {value1, value2, ...}`中的`Type`：**枚举**，通过`Type.value`来访问枚举值对应的整型，类似C语言，可以为枚举设置不同的整型值，也可通过`Type[index]`来访问整型对应的枚举值字符串；
- `any`：**任意**类型，与`Object`类型类似（注意大写），但`Object`类型只允许被赋予任意值，但不能访问任意属性和方法；
- `void`：用于函数返回值表示不返回值，对于`void`变量，则只能赋值`undefined`或者`null`（`--strictNullChecks`不开启）；
- `undefined`和`null`：与同名的值对应，默认情况下它们是所有其他类型的子类型，但`--strictNullChecks`开启时，它们只能赋值给`any`或者对应的类型或者`undefined`赋值给`void`；
- `never`：用于函数返回值类型，表示函数始终不返回（如抛异常），它是任意类型的子类型，但不是其他类型的父类型，即使是`any`也不能赋值给`never`；
- `object`：（注意小些）代表所有非原始数据类型的类型。

类型断言是告知编译器相信程序员所指定的类型，有两种等价的形式：`<type>value`和`value as type`。在使用`JSX`的时候只有第二种形式可用。

## 2 变量声明

与JavaScript相同，`var`有函数级作用域，可被定义多次；而`let`有块作用域，不能屏蔽同作用域同名变量。`const`的变量不能修改，但可以修改其成员。TypeScript支持数组解构（包括`let [first, ...rest] = [1, 2, 3, 4];`或省略部分元素）、元组解构（类似于数组）和对象解构（支持`...`剩余语法、属性重命名`let { a: newName } = o;`、默认值`let { a = 1001 } = o`）。此外还支持解构相反的传播语法，如`[0, ...first, ...second, 5]`和`{ ...defaults, food: "rich" }`。

## 3 接口

使用如下语法定义接口：

```typescript
interface Name {
  property: Type1;
  optionalProperty?: Type2;
  readonly ReadonlyProperty?: Type3;
  // 如果允许包含其他属性
  [propName: string]: any;
}
```

也可以用这样的类型代替接口`{ property: Type1, optionalProperty?: Type2 }`。

TypeScript还有`ReadonlyArray<T>`这种数组类型，只是可变方法都移除了。

此外还可以创建函数接口，其中参数名不必匹配：

```typescript
interface Func {
  // 函数类型
  (param1: Type1, param2: Type2): Type3;
}
```

此外也可以创建数组接口：

```typescript
interface StringArray {
  [index: number]: string;
}
```

类可以实现接口，如下：

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) { }
}
```

但注意一个类实现一个接口的时候，只有实例是检查的，而静态方法不检查。而类的构造函数属于静态方法，只有当把类作为实例的时候才能检查其构造函数。

此外还可以用`extends`关键字扩展接口。对于一个接口可以扩展多个接口。

## 4 类

总的来说TypeScript里的类和JavaScript的类似，这里着重于不同之处。TypeScript的类的字段要显式声明。子类构造函数必须调用`super()`。成员可以有访问权限`public`（默认）、`private`和`protected`。可以有`readonly`字段，必须由构造函数或声明处初始化。

此外还有抽象类，如下：

```typescript
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log("roaming the earth...");
  }
}
```

接口也可以继承类。

## 5 函数

函数类型为`(param1: type1, param: type2, ...) => returnType`。可选参数必须在必选参数的后面。可以对`this`参数加类型注解，确保它是某种类型。可以对一个函数的类型进行重载（不包括定义），如下：

```typescript
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
}
}
```

注意`function pickCard(x): any`不是重载的一部分。

## 6 泛型

可以给函数添加类型变量，创建泛型函数：

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

调用时，如果泛型是函数参数，可以省略模板参数。上述的函数，其类型写下来是`<U>(arg: U) => U`。此外在类名后面也可以添加类型变量，构成泛型类。

类似Java，类型变量可以有类型约束如`<T extends someType>`。

## 7 枚举

数字枚举如上所示，此外也可以有字符串枚举或者混合的。还有const枚举，形如`const enum Enum { ... }`，它会彻底在编译时移除，只能含有编译期计算的值。

## 8 类型推导

（未完待续）
