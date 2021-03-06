---
title: 编译原理1：介绍
author: 孙子平
date: 2020-08-04T14:56:23Z
category: 编程
tags: [编程, 编译原理]
series: 编译原理
sidebar:
  - /_posts/2020-08-04-compiler-ch1.html
---

从这个系列开始，我会阅读《编译原理》第二版英文版，并摘录重点内容。希望我能坚持下去。第一章是介绍。

<!-- more -->

本书介绍了如何设计和实现编译器。本章介绍不同形式的语言转换器，概览了编译器的结构，并且讨论了编程语言的趋势和机器架构。

## 1 语言处理器

**编译器**就是从**源语言**转换为对应的**目标语言**的程序。**解释器**是另一种语言处理器，它直接执行源程序。编译器产生的机器语言通常更高效，而解释器通常更方便调试。

一些程序可以辅助编译器：

- **预处理器**：合并文件，展开宏。
- **汇编器**：编译器可以产生更易于调试的汇编语言程序，再由汇编器转换成可重定位机器码。
- **链接器**：大程序通常分开编译，再由链接器把可重定位目标文件和库文件链接成机器码；之后由**加载器**将所有的可执行目标文件载入内存。

## 2 编译器结构

编译器可以大致分为两个部分：

- **分析**：分析部分将源程序转化为中间表示及**符号表**；如果源程序语法不正确或者语义不可靠时，分析部分应当给出提示；通常被称为编译器**前端**。
- **合成**：合成可执行程序；通常被称为编译器**后端**。

接下来的小节会细分编译器的步骤。

### 2.1 词法分析

**词法分析**（lexical analysis）又称**扫描**（scanning）。将字符流分隔成**词素**。对于每个词素，词法分析器产生一个**token**：

$$\langle\textit{token-name}, \textit{attribute-value}\rangle$$

其中*token-name*是一个抽象的符号，*attribute-value*则指向符号表，并且是可选的。

::: tip 词法分析例子

$$\texttt{position = initial + rate * 60}$$

对于上面的代码，会产生下面的一系列词素：

$$\langle\textbf{id},1\rangle~\langle=\rangle~\langle\textbf{id},2\rangle~\langle+\rangle~\langle\textbf{id},3\rangle~\langle*\rangle~\langle 60\rangle$$

词法分析时，空白符就被忽略了。这里数字1、2、3表示符号表中的项，而最后的$\langle 60\rangle$代表常亮，实际上可能是$\langle\textbf{number},4\rangle$，这里作了简化处理。

:::

### 2.2 语法分析

编译器的第二个步骤是**语法分析**（syntax analysis）又称**解析**（parsing）。解析器会从token流中构建出一个树形表示**语法树**。

:::tip 语法分析例子

对于上面的词法分析结果，会产生下面的语法树，这里采用的是我们熟悉的优先级：

```text
      =
    /   \
<id, 1>  +
       /   \
  <id, 2>   *
          /   \
     <id, 3>   60
```

:::

### 2.3 语义分析

**语义分析**（semantic analysis）使用语法树和符号表中的信息检查源代码的语义一致性。它会收集类型信息，保存到语法树或符号表中。

语义分析中很重要的一部分是**类型检查**（type checking）。编译器还会允许一些类型转换，称之为**强制转换**（coercion）。

### 2.4 中间代码生成

在编译成目标代码时，编译器或许会构造处1种或多种中间表示。语法树也是一种中间表示。

**三地址码**是一种典型的中间表示。三地址码由三个操作数构成，它有以下的特点：

- 每一个指令右手边最多只有一个运算，这就使得运算的优先级被表现了出来。
- 编译器会生成一些临时变量。
- 一些指令可能少于三个操作数。

### 2.5 代码优化

机器无关的代码优化可以使最终代码更好。可能是更快或者体积更小。

### 2.6 代码生成

代码生成器以中间表示为输入，生成目标语言。如果目标语言是机器语言，那会对每个变量进行寄存器或内存地址的分配。

### 2.7 符号表管理

符号表存储了名字的熟悉，如其类型、作用域。

### 2.8 将步骤组合为Pass

几个步骤可以被合并成一个**pass**，完成一次输入和输出。比如词法分析、语法分析、语义分析、中间代码生成可以是一个pass，代码优化是另一个可选的pass，最后后端有一个代码生成的pass。

一些编译器有精心设计的中间表示可以用以支持多个源语言和目标语言，这时候只要组合前后端即可。

### 2.9 编译器构建工具

1. **Parser生成器**：根据语法自动生成语法分析器。
2. **Scanner生成器**：根据词法自动生成词法分析器。
3. **语法制导翻译引擎**：产生遍历语法树的过程，并生成中间代码。
4. **代码生成器生成器**：从翻译规则中生成代码生成器。
5. **数据流分析引擎**：分析数据流，便于优化。
6. **编译器构建工具集**。

## 3 编程语言的演化

（略）

## 4 构建编译器的科学

### 4.1 编译器设计和实现中的建模

一个很好的建模是有限状态自动机和正则表达式，它们会在第3章介绍，它们经常被用于词法分析。此外还有上下文无关文法，经常用于描述嵌套的括号和控制结构，这会在第4章介绍。树是很好的建模手段，会在第5章介绍。

### 4.2 代码优化的科学

我们会在第9章中看到诸如图、矩阵、线性程序的建模对优化代码是。

编译器优化必须满足以下目标：

- 正确
- 对大多数程序性能提升
- 编译时间合理
- 工程量可控

## 5 编译技术的应用

### 5.1 实现高级编程语言

低级语言通常更高效但高级语言的优化弥补了这点，同时高级语言更容易编写。

许多语言可以有用户自定义聚合类型和高级控制流（循环、过程调用），编译器通过数据流分析可以优化这些代码。

面向对象主要有两个思想：数据抽象和属性继承。

Java是类型安全的，数据访问会有运行时检查。它没有指针，不支持指针算术。它有垃圾回收。这些都使得它更易于编写，但有运行时的性能损失。编译器优化可以去除不必要的范围检查、使不被过程外部访问的对象放在栈上、最小化垃圾回收的性能损失。此外Java还是可移植的。程序以字节码形式发布，而后被动态编译。

### 5.2 对计算机架构的优化

几乎所有的高性能系统都利用了两个基础技术：**并行**（parallelism）和**内存层次**（memory hierarchies）。

#### 并行

并行可以有不同的层次，如指令层次，多个指令同时执行；或者处理器层次，不同的线程同时执行。

指令的并行对程序员是不可见的
