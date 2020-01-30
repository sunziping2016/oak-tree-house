---
title: Rust学习笔记（未完待续）
date: 2019-09-08T13:54:09Z
tags: [Rust, 编程]
---

这篇文章是Rust的学习笔记，主要内容来自Rust官方的[《The Rust Programming Language》](https://doc.rust-lang.org/book/)。

<!-- more -->

## 1 常见编程概念

### 1.1 变量和可变性

默认通过`let x;`定义的变量是不可变的，这样可以更安全且更利于并发。通过`let mut x;`定义可变的变量。可以在变量名后面后缀`= init_value`初始化。初始化不是必须的。

使用`const NAME: type = value;`定义常量，其中类型注解和初始化不能省略。常量可以被定义于任何作用域，如全局作用域，而变量不行。常量只能被常量表达式初始化。常量生命期是整个程序运行的，而其作用域是它被声明的作用域。

可以通过多次`let x;`来屏蔽先前定义的变量，常量不能这么做。新的变量与被屏蔽的变量不必是同一类型的。

### 1.2 数据类型

Rust是静态类型语言，所有变量的类型在编译期确定。

#### 1.2.1 标量类型

Rust有四种标量类型，分别是整数、浮点数、Bool和字符。其中整数类型如下表所示：

| Length | Signed | Unsigned |
|-|-|-|
| 8-bit | i8 | u8 |
| 16-bit | i16 | u16 |
| 32-bit | i32 | u32 |
| 64-bit | i64 | u64 |
| 128-bit | i128 | u128 |
| arch | isize | usize |

其中`isize` 和`usize`在x86系统上是32位的，在x64系统上是64位的。下表是整型字面常量，除了`Byte`字面常量，其他类型字面常量都允许有类型后缀如`57u8`，同时`_`可以作为视觉上的分隔符，如`1_000`。

| Number literals | Example |
|-|-|
| Decimal | 98_222 |
| Hex | 0xff |
| Octal | 0o77 |
| Binary | 0b1111_0000 |
| Byte (u8 only) | b'A' |

Rust默认使用`i32`，而`isize`和`usize`主要用于集合上的索引。在debug模式下，整数溢出会导致程序panic；在release模式下，溢出不会报错，而会发生wrap。如果你想显式地要wrap，可以使用`std::num::Wrapping`。

Rust有两种浮点数类型`f32`和`f64`。默认使用`f64` 。也可以采用后缀修改字面常量的类型。

Rust的`bool`类型有两种取值：`true`和`false`。其大小是1字节。

Rust的`char`类型占四字节，可以代表任意Unicode字符。字符字面常量由单引号括住（区别于字符串，是用双引号括住）。

#### 1.2.2 复合类型

Rust有两种复合类型，元组和数组。

元组有固定长度，元素类型可以不同，但不能改变。用括号括住，逗号分隔的列表表示元组，如`(500, 6.4, 1u8)`，其类型为`(i32, f64, u8)`。可以使用模式匹配获取元组内的东西，如`let (x, y, z) = tup;`。除此之外也可以用`.0`、`.1`来获取第0个元素、第1个元素等等。

数组的每个元素都必须是相同的类型，它也拥有固定的长度。用中括号括住，逗号分隔的列表表示数组，如`[1, 2, 3, 4, 5]`，其类型为`[i32; 5]`。如果想创建多个同一值的数组，语法如`[3; 5]`。可以通过`arr[index]`访问，其中`index`是`usize`类型。越界访问可以通过编译，但程序运行时会有runtime错误。

元组和数组的末尾都可以有多余的逗号，单元组只能用`(x,)`表示。

### 1.3 函数

使用`fn`关键字声明函数，形如`fn func() {}`。建议变量和函数命名都采用蛇式命名法（如`snake_case`）。即使函数在后面定义，也能使用。

函数可以带有参数，形如`fn func(x: i32, y: i32) { ... }`，每个参数都需要跟类型注解。函数调用形如`func(x, y)`。

**语句**是不返回值的，而**表达式**则会求值。用`let`创建并初始化变量和函数定义都是语句。块`{}`创建了新的作用域，其值是最后一个表达式的值，如果没有则返回空元组`()`。

通过`fn func() -> type { ...; value }` 创建一个有返回值的函数。注意这里不能写成`{ ...; value; }`，这样相当于返回空元组`()`。可以通过`return`关键字提早返回。

### 1.4 注释

`// ...`一直到行末构成单行注释。

### 1.5 控制流

#### 1.5.1 `if`表达式

`if`表达式形如`if condition { ... } else { ... }`其中`else`分支是不必须的，而`condition`的类型必须是`bool`。Rust不会将非`bool`类型自动转化为`bool`类型。使用下方的代码可以构建多条件分支：

```rust
if condition1 {
  // ...
} else if condition2 {
  // ...
} else if condition3 {
  // ...
} else {
  // ...
}
```

使用太多的`else if`可能使代码看起来混乱，建议可以使用`match`。

`if`是一种表达式，可以嵌套在别的表达式中，但其各支产生的值必须是同一类型。注意省略的`else`分支具有`()`类型的值；`if`表达式如果是语句的开头，需要括号括起。

#### 1.5.2 循环

Rust有3种循环：`loop`、`while`和`for`。

`loop`循环形如`loop { ... }`会不停地执行。可以在循环内，通过`break value;`返回一个值，`value`不是必须的（此时返回`()`）。

`while`循环形如`while condition { ... }`。`for`循环形如`for element in iterator { ... }`。如果`a`是数组，通过`a.iter()`得到迭代器；通过`begin..end`可以得到一个范围迭代器，`end`可以省略，它有`rev()`方法可以倒过来迭代。注意`while`和`for`循环返回`()`。

## 2 理解所有权

### 2.1 什么是所有权

有些语言使用垃圾回收管理内存，而另一些语言需要手动分配和释放。而Rust采用所有权管理内存，所有权不会带来额外的性能开销。

记住以下几条：

- Rust中的每一个值都有一个变量是它的所有者
- 一个时候只能有一个所有者
- 离开所有者作用域时，值被丢弃

变量从它声明开始一直到当前作用域结束都始终有效。

`String`类型是一种可变的字符串，通过`String::from("hello")`可以从字符串常量中构造出`String`类型的对象。其内容就是放在堆上，栈上仅保留指针。为了能把内存返回操作系统，Rust引入所有权。当所有者变量离开作用域时，`drop`函数会被调用，进而内存会被释放。

对于简单的类型，下面的代码会复制值产生两个对象。但对于没有实现`Copy` trait的对象如`String`类型的，这会是一个移动操作，`s1`将无效。如果要复制，可以`let s2 = s1.clone();`。如果一个类型的某些部分实现了`Drop` trait，那么就无法将该类型注解为有`Copy` trait的。

```rust
let s1 = ...;
let s2 = s1;
```

以下的类型实现了`Copy` trait：

- 所有的整数类型；
- 所有的Bool类型；
- 所有的浮点数类型；
- 所有的字符类型；
- 元素都实现了`Copy` trait的元组类型；
- 元素实现了`Copy` trait的数组类型。

函数的传参和返回，与赋值类似都会发生所有权转移。可以通过传递参数将所有权转移至函数，再通过返回值将所有权转移回来（Rust允许多返回值），然而这种做法过于琐碎，应当使用引用。

### 2.2 引用和借用

使用`&variable`可以创建对变量的引用，使用`&mut variable`创建对变量的可变引用。如果`variable`的类型是`Type`，则其引用的类型是`&Type`，可变引用的类型是`&mut Type`。对引用的赋值、传参和返回不会移交所有权，这被称为借用（borrowing）。

在某一作用域内对某一变量只能同时有要么一个可变引用，要么任意数目不可变引用。注意引用的作用域是从它引入一直到最后一次使用。这个机制是为了避免数据竞争（data race），当下面三条发生时就会有数据竞争：

- 多个指针同时读取一个数据；
- 至少有一个指针被用来写数据；
- 没有同步机制。

返回局部变量的引用是个错误。

### 2.3 切片类型

另一种不需要所有权的数据类型是切片，切片可以引用容器的一段连续的元素，而非整个容器。通过`&s[starting_index..ending_index]`获取切片。内部实现上，切片存储起始位置和长度。如果想要从开始切片，可以省略`starting_index`；如果想要切片到结尾，可以省略`ending_index`。

字符串的切片必须是在合法的UTF-8编码边界处。字符串切片和字符串字面常量的类型都是`&str`。对于元素是`Type`类型的数组切片，其类型是`&[Type]`。

## 3 对结构化数据使用结构体

结构体和枚举是Rust创建新的类型的基础。

### 3.1 定义并实例化结构体

如下定义结构体：

```rust
struct Name {
  field1: Type1,
  field2: Type2,
  // ...
  fieldN: TypeN,
}
```

实例化结构体如下，其中字段的顺序不必和定义的顺序一致：

```rust
let foo = Name {
  field1: value1,
  field2, // shorthand for `field2: field2,'
  // ...
}
```

访问字段采用`foo.field`的方式。只有当`foo`是可变的时候，才能修改`foo.field`，且Rust不支持某几个字段是可变的。此外还可以从现有的实例中更新得到一个新的实例：

```rust
let bar = Name {
  field1: value1,
  // ...
  ..foo
}
```

此外也可以创建没有具名字段的元组结构体。其定义和使用如下：

```rust
struct Name(Type1, Type2, /* ... */, TypeN);

let foo = Name(value1, value2, /* ... */, valueN);
```

即使字段类型完全一致，不同的元组结构体也是不同的类型。元组结构体可以解构（如`let Name(var1, ...) = foo;`），也可以通过`.`然后跟索引访问元素。

结构体也可以没有字段，这时结构体被称为类单位结构体（unit-like structs），它们和`()`很像。

在`println!`的格式化字符串中的`{:?}`代表使用`Debug`格式输出，用`{:#?}`代表有更好看格式的`Debug`输出。在结构体定义前添加`#[derive(Debug)]`，即可使结构体实现`Debug` trait。

### 3.2 方法语法

方法的第一个参数必须是`self`，代表调用时的结构体实例。定义方法形式如下：

```rust
impl StructName {
  fn func(&self, param1: Type1 /**, ... **/) -> RetType {
    // ...
  }
}
```

注意`func`的第一个参数`&self`，实际上，方法可以获取所有权`self`、不可变借用`&self`或者可变借用`&mut self`。`object.something()`方法调用时，Rust会对`object`自动引用或解引用。

此外也可以在`impl`块里定义不以`self`为参数的函数（它们不是方法），可以通过`StructName::func()`调用。

同一个结构体有多个`impl`块是合法的。

## 4 枚举和模式匹配

Rust的枚举类型更像是函数式编程语言的代数数据类型。

### 4.1 定义枚举

如下定义枚举：

```rust
enum Name {
  Value1, // Without data
  Value2(Type1, Type2 /*, ... */),
  Value3 { name1: Type1, name2: Type2 /*, ... */},
}
```

用`Name::Value1`、`Name::Value2(type1, type2 /*, ... */)`或`Name::Value3 { name1: type1, name2: type2 /*, ... */ }`创建枚举对象。

枚举也可以拥有`impl`块，即拥有方法。

标准库有个`Option`枚举，用于代表可以缺失的值，它的定义如下：

```rust
enum Option<T> {
    Some(T),
    None,
}
```

可以使用`Some(value)`来创建`Option`值，如果使用`None`，需要类型注解，注意使用它们不需要加前缀。

### 4.2 `match`控制流运算符

如下定义`match`表达式：

```rust
match value {
  pattern1 => value1,
  pattern2 => value2,
  // ...
}
```

其中每一支的值也可以是个块语句；每一支的模式可以是字面值、变量和枚举值构造器（想不出更好的名词了）。模式匹配必须匹配完所有的可能。可以在最后的模式中使用`_`占位符捕获所有可能。

### 4.3 用`if let`简化控制流

如下使用`if let`：

```rust
if let pattern = value {
  // ...
} else {
  // ...
}
```

其中`pattern`和`match`表达式的一致，`else`可选。`if let`等价于单支`match`。

## 5 使用包、Crate和模块管理增长中的项目

Rust使用一系列的特色来管理代码，包括哪些细节需要暴露、哪些细节是私有的以及哪些名字属于程序。这些特性被称为模块系统，它包含：

- 包：Cargo的特色，用以构建、测试和分享crate；
- Crate：树状的模块，提供一个库或可执行；
- 模块和use：使你能控制组织、作用域和路径的权限；
- 路径：一种命名如结构体、函数或模块的组件的方法。

### 5.1 包和Crate

Crate要么是binary（有可执行文件），要么是library（只是库）。Crate root是一个源文件，Rust从那里开始编译，并由此组成了crate的根模块。一个包是一个或多个crate，它必须包含`Cargo.toml`来指定如何构建crate。

一个包至多只能包含一个library crate，但它可以包含任意个binary crate。

如下创建一个包：

```bash
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml
src
$ ls my-project/src
main.rs
```

`Cargo.toml`没有提到`src/main.rs`，因为Cargo遵循了这样一个约定：`src/main.rs`是与包同名的binary crate的根。同样的，如果包目录下`src/lib.rs`，那这是与包同名的library crate的根。Cargo会将crate root传递给`rustc`来编译。此外可以在`src/bin`目录下添加多个源文件，每个源文件都是独立的binary crate。

### 5.2 定义模块来控制作用域和隐私

使用`mod`关键字定义一个模块，然后指明模块名和花括号，模块中可以有其他模块、结构体、枚举、常量、traits和函数，如下：

```rust
mod name {
  mod nested_mod {
    // ...
  }
}
```

### 5.3 使用路径引用模块树中的东西

一个路径可以有两种形式：

- 绝对路径：使用crate名字或者`crate`字面量，这是从crate根开始寻找的；
- 相对路径：使用`self`、`super`或者当前模块中的标识符，这是从当前模块开始寻找的。

使用`super`可以引用父模块。对于可能会一起移动的的模块，应该使用相对路径；对于可能会分开移动的模块，应该使用绝对路径。路径采用`::`将多个名字连接在一起。

默认情况下所有的Rust的东西（函数、方法、结构体、枚举、模块和常量）都是私有的。父模块的东西无法访问子模块的私有东西，但子模块的东西可以访问祖先模块的东西。

通过在东西前面增加`pub`关键字即可使东西变为公有的，这样就能在外部访问到模块内部的东西。注意同一模块内部的兄弟部分是可以互相访问的。此外结构体成员也默认是私有的，需要`pub`关键字变为公有的，方法也是如此。如果有字段不是`pub`的，就无法在外部构造这个对象。而枚举则不一样，如果枚举是`pub`的，那么它的所有成员都是`pub`的。

### 5.4 使用`use`将路径带进作用域中

使用`use`后面跟路径和`;`可以将名字带入本作用于，类似文件系统中的符号链接。当使用相对路径，必须在前面加上`self::`。未来可能不需要加`self::`。

一般而言，我们将函数的父模块而非函数本身，用`use`带入作用域。而结构体、枚举等其他东西，我们会指定完整路径。除非有重名的情况。如果两个东西重名，这是个错误。

可以用`as`关键字重命名：

```rust
use std::fmt::Result;
use std::io::Result as IoResult;
```

`use`导入的名字默认是私有的。使用`pub use`可以重新将名字导出。

如果`use`的根路径是外部的crate名字，即可导入这个crate。`std`是跟随Rust语言的标准库，无需在`Cargo.toml`中指定，其他库需要指定。

可以通过以下方式同时导入多个路径：

```rust
use std::{cmp::Ordering, io};
use std::io::{self, Write};
use std::collections::*; // 通配符
```

### 5.5 将模块分到多个文件中

使用`mod name;`可以将名为`name.rs`文件的内容作为名为`name`的子模块。如下面的示例：

```rust
// src/lib.rs
mod front_of_house;

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}

// src/front_of_house.rs
pub mod hosting;

// src/front_of_house/hosting.rs
pub fn add_to_waitlist() {}
```

## 6 常见容器

### 6.1 使用向量存储一系列值

向量的类型为`Vec<T>`。它只能存储同一类型的值。

可以使用`Vec::new`函数创建向量，使用`push`方法可以添加元素，也可以使用`vec!`宏创建，如下：

```rust
let v1 = Vec::new();
v1.push(5);
let v2 = vec![1, 2, 3];
```

可以通过`&v[index]`获取一个引用，也可以通过`v.get(index)`获得一个`Option<&T>`值。前者如果访问越界会panic，而后者会返回`None`。

可以使用for循环遍历元素：

```rust
let mut v = vec![100, 32, 57];
for i in &v {
    println!("{}", i);
}
for i in &mut v {
    *i += 50;
}
```

### 6.2 使用字符串存储UTF-8编码的文本

Rust中的字符串通常是指两种类型：`String`和`&str`，而非单一一种类型，这两个都是用UTF-8编码的。

可以通过以下的方式创建字符串：

```rust
let mut s = String::new();
let s = "initial contents".to_string();
let hello = String::from("你好");
```

通过以下方式追加字符串：

```rust
let mut s = String::from("foo");
s.push_str("bar");
s.push('l');
```

`push_str`和`push`都不会移交所有权。也可以使用`+`来连接字符串，如下：

```rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // 注意s1被移动了
```

`+`会使用如下的方法（非泛型版），而`&String`可被强转为`&str`，因而`+`的左操作数会被获取所有权，而右操作数不会：

```rust
fn add(self, s: &str) -> String { /* ... */ }
```

可以使用`format!`宏更方便地格式化字符串，它和`println!`很像：

```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
let s = format!("{}-{}-{}", s1, s2, s3);
```

对字符串的下标索引是个错误，因为它可能会截断一个字符，而且不同的计数方法会有不同结果，此外从头开始计算字符个数会使得下标索引不是常数复杂度。

可以对字符串进行切片操作，但切片边界必须是合法的UTF-8边界，否则会panic。

使用`str.chars()`可以获得字符，而`str.bytes()`可以获得UTF-8内部编码。

### 6.3 使用哈希映射存储键值对

类型`HashMap<K, V>`可以以`K`类型为键存储`V`类型。使用`new`函数可以创建对象，使用`insert`可以插入，或者使用`collect`将元组的向量转成哈希映射，如下：

```rust
use std::collections::HashMap;
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
// or
let teams  = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];
let scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
```

`insert`会移交所有权。使用`get`方法可以根据键获取值，参数为引用，返回的类型为`Option<&v>`。可以使用如下方式遍历：

```rust
for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

`insert`会覆盖旧值。可以使用`Entry`搭配`or_insert`不覆盖旧值地插入新值，如下：

```rust
let text = "hello world wonderful world";
let mut map = HashMap::new();
for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    *count += 1;
}
```

## 7 错误处理

Rust将错误分成两类，一种是可恢复的错误、另一种是不可恢复的错误。

### 7.1 使用`panic!`处理不可恢复错误

使用`panic!`宏可以终止程序运行。默认情况下，它会回退栈并释放资源。这会造成更大的可执行文件。将下面两行加入`Cargo.toml`，可以使`panic!`直接调用`abort`：

```ini
[profile.release]
panic = 'abort'
```

`panic!`如下使用：

```rust
fn main() {
    panic!("crash and burn");
}
```

默认`panic!`只打印最后的函数栈，使用环境变量`RUST_BACKTRACE=1`可以完整打印函数调用栈。

### 7.2 使用`Result`处理可恢复错误

`Result`枚举的定义如下：

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

我们可以使用`match`表达式匹配错误。一些`error`对象还有`kind`方法，可以进一步用`match`表达式匹配。

对于`Result<T, E>`类型，还有`unwrap`方法，如果出错会自动调用`panic!`。类似地，还有`expect`函数可以选择出错信息：

```rust
let f = File::open("hello.txt").unwrap();
let f = File::open("hello.txt").expect("Failed to open hello.txt");
```

除了直接处理错误，也可以将错误传递出去。基本方法也是使用`match`表达式。也可以使用`?`运算符。`?`运算符放在`Result`值的后面，会达到一样的效果。它还会调用`from`函数，对错误进行类型转换：

```rust
fn read_username_from_file() -> Result<String, io::Error> {
    let mut s = String::new();
    File::open("hello.txt")?.read_to_string(&mut s)?;
    Ok(s)
}
```

注意`?`运算符只能在返回`Result`的函数内调用。`main`函数也可以返回`Result`，如下，这里`Box<dyn Error>`是个trait对象，表示一切错误：

```rust
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let f = File::open("hello.txt")?;
    Ok(())
}
```

### 7.3 该不该使用`panic!`

在写示例、原型或者测试不需要良好的错误处理，可以直接调用`unwrap`。同样地，如果你确信代码不会有异常，也可以用`unwrap`。

## 8 泛型、Trait和生命周期

### 8.1 泛化数据类型

使用类型参数由尖括号括起来，跟在函数名后面就可以定义泛型函数。其中类型参数命名通常较短，由一个字母组成，使用驼峰命名。如下：

```rust
fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

类似地，在结构体名中加尖括号括住的类型参数就可以定义泛型结构体，同样地枚举也可以是泛型的：

```rust
struct Point<T> {
    x: T,
    y: T,
}
impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}
```

注意对于方法，需要在`impl`后面声明类型，Rust才能知道`Point`后面跟的是具体类型还是泛化类型。上面最后一个例子就是具体类型的例子。

### 8.2 Trait：定义共同行为

Trait更像是接口，但有稍微的不同。如下定义trait：

```rust
pub trait TraitName {
    fn method(&self) -> ReturnType;
    fn method_with_default_impl(&self) -> ReturnType {
        // ...
    }
}

impl TraitName for StructOrEnumName {
    fn method(&self) -> ReturnType {
        // ...
    }
}
```

Trait实现的一个约束是trait本身和要实现的类型中至少有一个是属于该crate的。

Trait可以有默认实现，如果要采用默认实现，只要`impl`块不给出实现即可。默认实现可以调用同Trait的其他函数。

可以将trait作为参数或返回值，使用`+`连接多个trait，如下：

```rust
pub fn func(item: impl TraitName1 + TraitName2) {
    // ...
}
```

实际上，这是下面代码trait限制的语法糖：

```rust
pub fn func<T: TraitName1 + TraitName2>(item: T) {
    // ...
}
```

此外也可以使用`where`更清晰地显示：

```rust
fn some_function<T, U>(t: T, u: U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{
    // ...
}
```

也可以使用`impl TraitName`作为返回值类型，但你只能返回一种类型。

### 8.3 用生命周期验证引用

每个引用都有生命周期。一般情况下生命周期和类型一样都会被推断。生命周期注解必须以`'`开头而后跟很简单的名称如`'a`，它被放在`&`之后。下面是一些例子：

```rust
&i32
&'a i32
&'a mut i32
```

就像声明泛型类型参数，我们可以在同样的位置声明泛型生命周期参数。像下面这样：

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

上面的函数使得返回值的生命周期是参数中生命周期较短的那个。注意生命周期参数不会修改参数或返回值的声明周期，它们只是用于是借用检查器拒绝不满足的情况。

在函数内，Rust无需帮助就能检查生命周期，但当函数有到外部或来自外部的引用，这件事就不太可能了，所以我们需要手动注解。

并不是所有的参数都需要注解。当函数返回引用时，它一定会包含某个参数的生命周期（如果不这样，说明这个引用来自于局部变量）。

结构体也可以包含生命周期注解，这种情况下，每个引用都需要有一个类型注解。

Rust提供了3条生命周期省略规则，那些函数或方法的参数的生命周期称为输入生命周期，那些返回值的生命周期称为输出生命周期。如果规则应用完毕后，仍有引用的生命周期未解决就会报错：

1. 所有的引用参数获得它们各自的生命周期参数；
2. 如果只有一个输入生命周期参数，这个生命周期会赋值给所有输出生命周期参数；
3. 如果有多个输入生命周期参数，但其中一个是`&self`或`&mut self`，那么`self`的生命周期会赋值给所有输出生命周期参数。

还有一种特殊的生命周期叫`'static`，它表示引用在整个程序运行时都有效。

## 9 写自动测试

### 9.1 如何写测试

Rust中的测试是一个被注解上`test`属性的函数。当用Cargo创建一个库项目的时候，一个包含着一个测试函数的测试模块。

（未完待续）
