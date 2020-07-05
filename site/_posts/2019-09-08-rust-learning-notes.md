---
title: Rust学习笔记
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

Rust中的测试是一个被注解上`test`属性的函数。当用Cargo创建一个库项目的时候，一个包含着一个测试函数的测试模块会被生成，就像下方的代码。每个测试都是独立的一个线程。默认情况下一个测试函数panic则代表测试出错，通过加入`#[should_panic]`注解使测试函数不panic表示出错，它有一个`expected`参数表示期待的错误内容。

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn exploration() {
        assert_eq!(2 + 2, 4);
    }
}
```

一般测试模块会使用`use super::*;`，方便测试，起可见性规则与一般模块一致。

你可以使用`assert_eq!`、`assert_ne!`、`assert!`之类的宏断言。前两者能给出错误更详细的信息，其左右参数位置在Rust中并不重要，它们要求参数实现了`PartialEq`和`Debug` traits。这三个函数之后的参数会被传递给`format!`宏，用于更好地显示错误。

测试函数可以返回`Result<T, E>`，当返回`Err(...)`时，测试失败。此时不应该使用`#[should_panic]`。

### 9.2 控制测试是如何运行的

`cargo test --`中，`--`前的参数是cargo的参数，之后的参数是测试程序的参数。测试程序的参数如下：

|参数名|含义|
|-|-|
|`--test-threads`|并行线程数，设为1避免并行|
|`--show-output`|不捕获程序的输出|

`cargo test`可以跟位置参数，就会运行测试名字包含该参数的测试。使用`#[ignore]`注解可以标注测试函数被忽略，然后使用`cargo test -- --ignored`可以运行被忽略的测试。

### 9.3 测试的组织

测试一般分为两类，单元测试和集成测试。前者小而精，后者则测试整个库。

使用`#[cfg(test)]`注解告诉Rust只在`cargo test`的时候编译代码。由于集成测试不和实际代码在同一目录，因而不需要该注解。

集成测试通常放在`tests`目录下。每个文件都会被编译成独立的crate。通过`cargo test --test integration_test`可以只跑特定的集成测试。如果有共用的函数可以放到子目录下，如`tests/common/mod.rs`

## 10 函数式语言特色：迭代器和闭包

### 10.1 闭包

通过`|param1, ... | { statements; ... }` 定义闭包。如果闭包只是一个表达式，花括号可以省略。闭包在可以推导类型的时候，并不需要像函数那样注解类型，不过也可以注解上类型`|param1: type1, ... | -> retType { ... }`。注意一个闭包只能有一个实际的类型。每个闭包都有它们独立的类型，即使签名一样类型也不一样。

每个函数至少实现了以下trait中的一个：`Fn`、`FnMut`和`FnOnce`。可以使用trait限制。如下面的代码：

```rust
struct Caller<T: Fn(u32) -> u32> {
    func: T,
}
```

使用闭包可以捕获变量。闭包可以通过三种方式捕获变量：

- `FnOnce`：消耗了捕获的对象，为了消耗，它获取了所有权，这种闭包只能被调用一次；
- `FnMut`：获取了可变引用，这种闭包可以修改变量；
- `Fn`：获取了不可变引用。

其中`Fn`继承自`FnMut`，`FnMut`继承自`FnOnce`。当你创建一个闭包时，Rust根据闭包如何使用环境中的值来确定其类型。

在参数列表前加入`move`能强制闭包获取所有权。

### 10.2 迭代器

迭代器是惰性遍历元素的。它们实现了这样一个trait。

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;

    // methods with default implementations elided
}
```

这里`Item`是关联类型，以后会涉及。当`next()`返回一个元素，如果迭代完成，返回`None`。

如果你想获取被迭代对象的所有权，并返回其拥有的对象，可以使用`into_iter()`，如果想要遍历可变引用，可以使用`iter_mut()`。

调用`next`的函数被称为消耗适配器（consuming adaptors），因为它们用完了一个迭代器，如`sum()`函数。另一些方法定义在`Iterator` trait上，它们被称为迭代器适配器（iterator adaptor）。它们可以被串联使用，由于迭代器是惰性的，所以需要被消耗适配器使用，才会计算，例如`map()`函数。

只要实现了`next()`函数就可以定义自己的迭代器。

## 11 关于Cargo和Crates.io

### 11.1 自定义构建

通过`cargo build`可以运行`dev` profile，通过`cargo build --release`可以运行`release` profile。

通过在`Cargo.toml`中加入`[profile.dev]`或`[profile.build]`，可以配置选项。其中一个是`opt-level`，即优化程度，默认如下：

```toml
[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3
```

### 11.2 发布Crate到Crates.io

使用`///`可以插入文档注释，文档注释支持Markdown格式。通过`cargo doc`构建文档，会输出到`target/doc`目录下。加上`--open`参数会打开文档。

一般而言文档注释中有以下大家都会用的小节：

- `# Examples`：示例；
- `# Panics`：哪些情况函数会panic；
- `# Errors`：如果一个函数返回`Result`，描述哪些错误会发生，以及在什么情况下发生；
- `# Safety`：如果函数是`unsafe`的，描述原因以及调用者应当遵循的约定。

文档中的代码块也会成为测试。

使用`//!`注释会对包含它的东西进行注释，而非对它之后紧随的进行注释。这通常用于根crate。

在[crates.io](https://crates.io)注册并且获取API token，可以使用`cargo login`登录。发布前，`Cargo.toml`中的`description`和`license`是必须的。使用`cargo publish`就可以发布。通过`cargo yank --veres 1.0.1`可以阻止这个版本被使用，再加上`--undo`可以撤销。

### 11.3 Cargo工作区

Cargo使用工作区来控制多个相关的包，它们共享`Cargo.lock`和输出目录。以下方的`Cargo.toml`为根，再通过`cargo new adder`等做法就可以创建包含多个包的工作区。

```toml
[workspace]

members = [
    "adder",
    "add-one",
    "add-two",
]
```

通过添加下面的代码到`adder/Cargo.toml`，可以添加依赖：

```toml
[dependencies]

add-one = { path = "../add-one" }
```

### 11.4 从Crates.io上安装二进制包

使用`cargo install`即可。

### 11.5 用自定义命令扩展Cargo

如果`PATH`路径下有`cargo-something`，那么可以通过`cargo something`来运行它。通过`cargo --list`可以列出安装的命令。

## 12 智能指针

智能指针通常使用结构体完成，它们实现了`Deref`和`Drop` traits。

### 12.1 使用`Box<T>`指向堆上的数据

Box不提供性能以及额外的功能，你可能会在以下情况下使用它们：

- 使用编译期大小未知的类型；
- 确保大量数据不会因为改变所有权被复制；
- 但你想拥有一个值，只关心它的某个trait而不是具体类型。

使用`Box::new()`可以将对象放置在堆上。

此外递归类型也需要用到box。

### 12.2 `Deref` Trait

普通的引用也是一种指针，你有时需要解引用`*p`来获取内容。Box也是类似的。通过下面的代码可以在栈上创建一个盒子对象：

```rust
struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

use std::ops::Deref;

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}
```

这时候，`*y`会被替换成`*(y.deref())`，其中的`*`是普通解引用，不会递归替换。因而`deref()`函数需要返回引用。

解引用强迫（Deref coercion）会把那些实现了`Deref` trait的类型转换为对应的类型。如`&String`会被转换为`&str`类型。解引用强迫会在你传递一个类型不一致的引用给函数时发生，而且可以发生多次。就像下面演示的那样。

```rust
fn hello(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
}
```

使用`DerefMut` trait可以定义可变对象解引用的效果。发生下面三种情况，会有解引用强迫：

- 从`&T`到`&U`，当`T: Deref<Target=U>`时；
- 从`&mut T`到`&mut U`，当`T: DerefMut<Target=U>`时；
- 从`&mut T`到`&U`，当`T: Deref<Target=U>`时。

### 12.3 `Drop` Trait

`Drop` trait有`fn drop(&mut self)`方法，实现后就可以自定义清理行为。变量以创造时相反的顺序被丢弃。

使用`std::mem::drop`函数可以丢弃值，不能直接调用变量的`drop()`方法。

### 12.4 `Rc<T>`引用计数智能指针

`Rc<T>`不能够在多线程中使用。需要`use std::rc::Rc;`来引入`Rc`。通过`Rc::new()`可以创建引用计数的变量，通过`Rc::clone()`可以复制变量，使引用计数增加。通过`Rc::strong_count()`可以获得引用计数的个数。`Rc<T>`只能拥有不可变的引用。

### 12.5 `RefCell<T>`和内部可变模式

内部可变性使得你能通过不可变引用修改数据。这在底层使用了`unsafe`。使用`RefCell<T>`，引用规则会在运行时检查。打破引用规则会造成程序panic。`RefCell<T>`同样不能够在多线程中使用。

可以通过`RefCell::new()`创建。再通过`.borrow_mut()`可以获取可变引用和`.borrow()`获取不可变引用。前者返回`RefMut<T>`类型，后者返回`Ref<T>`类型，它们都实现了`Deref` trait。通过这两种智能指针，`RefCell<T>`实现了计数。

结合`Rc<T>`和`RefCell<T>`，也就是，`Rc<RefCell<T>>`，就可以有多个所有权的可变数据。

### 12.6 循环引用会造成内存泄露

使用`Weak<T>`可以避免出现循环引用，使用`.upgrade()`方法会返回`Option<Rc<T>>`，使用`Rc::downgrade()`函数可以降级引用。通过`Rc::weak_count()`可以获得弱引用计数的个数。

## 13 无惧并发

### 13.1 使用线程

使用`thread::spawn`函数并传入闭包就可以启动一个线程。主线程结束后新线程也会结束。它会返回一个类型为`JoinHandle`的句柄，可以调用其`.join()`方法等待线程执行完毕。使用`thread::sleep`可以睡眠一定时间。

如果传入`spawn`的闭包使用了外部的变量。由于无法确认闭包运行的时间和外部变量的生命周期谁更长，所以会报错。通过加入`move`关键字可以解决这个问题。

### 13.2 使用消息传递来在线程间传输数据

信道（channel）是Rust用于消息传递的重要设施。一个信道由两个部分组成：发送者和接受者。前者传递数据给后者。如果它们中的一个drop了，那么这个信道就认为是关闭了。

使用`std::sync::mpsc::channel()`创建一个信道，其中mpsc是multiple producer, single consumer的简称。它会返回一个元组，即发送者和接受者。就像下面代码展示的那样。

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

如果`tx.send()`方法返回一个`Result<(), E>`，如果接收端关闭会报错。如果没有值发送，`rx.recv()`会阻塞住线程，其返回值实`Result<T, E>`类型，如果发送端关闭会报错。`rx.try_recv()`不会报错，它在没有值以及关闭的时候会返回错误。此外`rx`也是个迭代器，可以迭代输入的值，直到信道关闭。使用`mpsc::Sender::clone()`可以复制一个发送者。

### 13.3 共享状态的并发

为了访问mutex的数据，一个线程必须获得mutex的锁，使用完数据后，必须解锁，以使其他线程使用数据。

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

再访问数据前，我们使用`lock()`函数获取锁，这可能造成阻塞。如果获得锁的线程panic了，那么其他线程使用`lock()`函数会返回错误。获得锁之后就可以以可变引用的方式使用它。

实际上，lock返回了一个`MutexGuard`的智能指针，它实现了`Deref` trait，它也实现了`Drop` trait来自动地解锁。

`Arc<T>`和`Rc<T>`是类似的，只是它具有原子性，但会有性能损失。从某种角度来说`Mutex<T>`和`RefCell<T>`很像，它提供了内在可变性。

### 13.4 使用`Sync`和`Send`扩展并发

`Send` trait能够移交所有权到另一个线程中，几乎所有的类型都实现了`Send` trait，除了`Rc<T>`。如果一个类型是由`Send` trait组成的，那么它也实现了`Send` trait。

`Sync` trait能让数据的引用在多个线程中使用。也就是说`T`是Sync当且仅当`&T`是`Send`。初等类型都是`Sync`的，哪些由`Sync`组成的类型也是`Sync`的。

`Rc<T>`不是`Sync`。一般而言，具有内部可变性且非线程安全的类型不是`Sync`，`RefCell<T>`以及其他的`Cell<T>`也因此不是`Sync`。

`Send`和`Sync`是自动的，它们作为标记trait也没有方法需要实现。手动实现这两个类型是不安全的。

## 14 Rust的面向对象特性

面向对象语言有以下特色：

- 对象包括数据和方法；
- 通过封装隐藏实现细节；
- 以继承作为类型系统和代码复用，这其中包括了多态。

可以使用trait对象完成多态。一个trait对象指向一个实现了该trait的实例和一个用于查找trait方法的表格。我们需要使用指针创建动态对象，如`&`引用和`Box<T>`智能指针，而后使用`dyn`关键字，最后跟我们要的trait。就像下面的代码那样：

```rust
pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    pub components: Vec<Box<dyn Draw>>,
}
```

Trait对象使用动态分发，这区别于所有方法调用再编译器确定的静态分发。这会带来一些性能损失。

只有对象安全的trait才能成为trait对象，它的所有方法需要遵循两条原则：

- 返回类型不是Self；
- 没有泛型参数。

## 15 模式和匹配

一个模式包含以下东西：

- 字面量；
- 解构的数组、枚举、结构体和元组；
- 变量；
- 通配符；
- 占位符。

### 15.1 模式匹配可以使用到的地方

模式匹配可以出现在：

- `match`分支；
- `if let`表达式；
- `while let`循环；
- `for`循环；
- `let`语句；
- 函数参数。

### 15.2 模式匹配是否永真

一个永远能匹配的模式是永真的如`let x = 5;`，而有些可能不能匹配，称为不是永真的，如`if let Some(x) = a_value`。函数参数，`let`语句和`for`语句只能接受永真模式。

### 15.3 模式语法

模式中的命名变量是永真模式。可以使用`|`匹配多个模式。可以使用`..=`匹配一个两端包含的范围，如`1..=5`。此外支持各种解构，可以使用`_`忽略一些值，或者使用`_`开头的变量表示不使用的变量。可以使用`..`忽略剩余的部分（包括结构体、元组）。可以在Match守卫上增加`if`的条件，但其优先级较`|`低。可以使用`@`绑定正在测试的某个值，如`id_variable @ 3..=7`。

## 16 高级特性

### 16.1 不安全Rust

使用`unsafe`关键字开启一个块，就可以使用不安全超能力，包括：

- 解引用裸指针；
- 调用不安全的函数和方法；
- 访问或修改一个可变静态变量；
- 实现一个不安全的trait；
- 访问union。

但这不包括关闭借用检查和其他检查。

裸指针可以是不可变的或者可变的，分别用`*const T`和`*mut T`表示。不同于引用和智能指针，裸指针可以：

- 同时拥有不可变和可变指针指向同一个区域；
- 指向的内存可以不合法；
- 可以为空；
- 并不自动清理。

```rust
let mut num = 5;

let r1 = &num as *const i32;
let r2 = &mut num as *mut i32;

let address = 0x012345usize;
let r = address as *const i32;

unsafe {
    println!("r1 is: {}", *r1);
    println!("r2 is: {}", *r2);
}
```

向上面的方式可以创建裸指针，这不需要unsafe。

在函数前加上`unsafe`可以创建不安全函数。你必须在`unsafe`块中调用它。

```rust
unsafe fn dangerous() {}

unsafe {
    dangerous();
}
```

使用`extern`可以指定外部的函数，如外部C函数：

```rust
extern "C" {
    fn abs(input: i32) -> i32;
}
```

也可以以某种方式导出Rust函数成别的语言的，这里就不是使用`extern`块：

```rust
#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}
```

Rust中用静态变量指代全局变量。静态变量和常量很像，但实际上常量允许内容不在同一个内存区域。静态变量还可以是可变的，但这时候访问或修改变量就是不安全的。

```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_count(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}
```

如果一个trait的某个方法不能被编译器验证其不变性，那么就是一个不安全的trait。实现这个trait也需要加上`unsafe`。比如`Sync`和`Send`就是。

```rust
unsafe trait Foo {
    // methods go here
}

unsafe impl Foo for i32 {
    // method implementations go here
}
```

### 16.2 高级Trait

通过在trait中加入形如`type Item;`的部分就可以制定一个关联类型。`trait`中的方法可以使用这个类型。而`trait`的实现必须指定这个具体的类型。关联类型和泛型很像，但是前者只能对某个类型实现一次trait，而后者可以针对类型实现多个不同泛型参数的同种trait。

Rust支持默认的泛型参数，形如`<PlaceholderType=ConcreteType>`。这在运算符重载中用到。Rust不允许创建运算符。你可以通过实现`std::ops`下的trait完成运算符重载。如加法trait如下：

```rust
trait Add<RHS=Self> {
    type Output;

    fn add(self, rhs: RHS) -> Self::Output;
}
```

Trait之间以及类型自带的方法都是可以重名的。默认情况下，编译器调用类型自带的方法。但有时可以显示调用某个方法，如`Trait::method(&instance)`。对于没有`self`参数，需要才用完全限定语法`<Type as Trait>::function(receiver_if_method, next_arg, ...);`。

可以使用`trait ChildTrait: SuperTrait { ... }`，指定某个trait需要另一个trait。

使用newtype模式，可以绕过实现trait必须和trait或类型在同一crate的限制。如下：

```rust
use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w = {}", w);
}
```

此外`Wrapper`还可以实现`Deref` trait。

### 16.3 高级类型

通过`type Type1 = Type2;`可以创建类型别名。但这失去了类型检查。它也可以带有泛型参数。

此外Rust有个特殊的类型`!`表使用不返回。`continue`就有`!`类型。

`str`就是一种动态大小类型（DST）。Rust拥有`Sized` trait表示类型是否编译期知道大小。这个Trait是自动实现的。同时Rust默认对每个泛型函数的类型参数都加入了`Sized`。你可以通过`fn generic<T: ?Sized>(t: &T) { ... }`来取消这种行为，这样`T`可能是也可能不是`Sized`。

### 16.4 高级函数和闭包

通过`fn(type1, ...) -> retType`，可以定义函数指针类型。普通函数的名字就是函数指针值。`fn`是类型而非trait。函数指针实现了`Fn`、`FnMut`和`FnOnce`。实际上元组结构体和元组结构体枚举的构造器就是一个函数。

如果你要返回闭包，可以才用`Box<dyn Fn(type1, ...) -> retType>`的形式。

### 16.5 宏

Rust的宏指使用`macro_rules!`的声明性宏和3种过程宏：

- 自定义`#[derive]`宏；
- 类似属性的宏；
- 类似函数的宏。

宏会被展开成为更多的代码。宏能有不同数目和类型的参数。宏由于是用代码产生代码，因而更难读懂和维护。宏必须在作用域内才能使用。

声明性宏，如`vec!`宏：

```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

`#[macro_export]`表示当这个宏可以被模块外导入。`vec!`内部的结构类似match表达式。完整的匹配格式见[Macros By Example - The Rust Reference](https://doc.rust-lang.org/reference/macros-by-example.html)

过程宏以代码作为输入，输出代码。当创建宏的时候，这个代码必须位于自己的crate，并且有一个特殊的crate类型。如下：

```rust
use proc_macro;

#[some_attribute]
pub fn some_name(input: TokenStream) -> TokenStream {
}
```

这里定义了一个`some_attribute`的过程宏，它们以TokenStream作为输入输出。

一个为了自定义`derive`的crate需要在创建时的`Cargo.toml`中加入：

```toml
[lib]
proc-macro = true
```

然后内容如下：

```rust
extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

属性过程宏的使用如下：

```rust
#[route(GET, "/")]
fn index() {}
```

定义方法如下：

```rust
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream { ... }
```

函数的过程宏使用如下：

```rust
let sql = sql!(SELECT * FROM posts WHERE id=1);
```

定义方式如下：

```rust
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream { ... }
```
