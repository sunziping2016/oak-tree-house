---
title: Pug 学习笔记
date: 2016-9-24 12:00:00
category: 前端
tags: [Pug, 编程, 前端]
summary: 这篇博客是学习Pug的笔记。
---

## 1 文档类型（Doctype）

通过`doctype html`可以声明一个文档是`html`，此外`html`还可以被替换为`xml`、`transitional`、`strict`、`frameset`、`1.1`、`basic`、`mobile`和`plist`。也可以自定义`doctype`。

注意：`doctype`会进一步影响到文档的渲染。

<!--more-->

## 2 标签（Tags）

以文字开头的一行表示一个标签，缩进表示嵌套。

也可以通过`tag1: tag2`，在一行内创建嵌套的标签。

对于诸如`img`、`meta`、`link`等的自闭合标签，Pug会自动处理。也可通过后缀（属性之后）`/`强制闭合。

## 3 属性（Attributes）

紧跟在标签后形如`(name=value, ...)`，其中value可以是任意JavaScript。分隔的`,`可省略。`value`会被转义，如果需要避免转义，用`!=`替代`=`。

对于布尔属性，`value`也可以是布尔类型，属性真值同该布尔值。若完全省略`=value`则属性为真。对于`html`，Pug会采用简短形式（即不是`value="value"`而是`value`）。

对于单个较长的属性可以采用模板字符串。属性也可以跨越多行：

```pug
tag (
    name1=value1
    name2=value2
    ...
)
```

如果属性名包含了如`[]`和`()`的奇怪字符，需要用`""`或者`''`括注属性名。

对于`style`属性，`value`也可以是一个对象。

对于`class`属性，`value`也可以是一个包含类名的数组，或一个从类名映射到布尔值的对象。

对于`class`属性可以采用`tag.classname`的简便形式；对于`id`属性可以采用`tag#id`的简便形式。如果`tag`是`div`，则可以省略`tag`。其余的属性跟在上述简便形式之后。

在普通的属性之后添加`&attributes(object)`，可以把`object`的属性名和值作为标签的属性名和值。注意：通过这种方式添加的属性不会被转义。

## 4 纯文本（Plain Text）

`|`开头的行即为单行的纯文本。文本中可嵌入`html`。

在属性后添加空格而后紧跟文本，可以在行内嵌入该文本；在标签后紧跟`.`和换行，而后所有缩进层次内的都将被作为内嵌的文本。

## 5 注释（Comments）

`//`开头的行即为单行的注释，该注释会被转换成对应的`html`的注释。

`//-`开头的行为单行的不会出现在`html`中的注释。

`//`紧跟换行，而后所有缩进层次内的都将被作为注释。

Pug对于`html`条件注释没有特殊的支持。但是由于所有以`<`开头的行都会被作为纯文本，因而可直接嵌入`html`条件注释。

## 6 代码（Code）

`-`开头的行即为单行的`JavaScript`代码，代码执行的结果不会出现在`html`中。

`-`紧跟换行，而后所有缩进层次内的都将被作为代码。

`=`开头的行也为单行代码，但代码执行的结果会转义后出现在`html`中。其位置也可以紧跟在属性后。

`!=`开头的行也为单行代码，但代码执行的结果会直接出现在`html`中。其位置也可以紧跟在属性后。

## 7 插值（Interpolation）

纯文本中的`#{expression}`会被替换成`expression`转义后的值。如果纯文本中需要`#{`，可转义为`\#{`。

纯文本中的`!{expression}`会被替换成`expression`的值（不转义）。

标签插值的语法为`#[tag text]`。由于Pug会去除标签前后的空白字符，因而标签插值的语法对于需要控制空白字符的内联标签非常有用。

## 8 条件语句（Conditionals）

### 8.1 if-else语句

if-else语句形如：

```pug
if condition1
    ...
else if condition2
    ...
else
    ...
```

也可以采用unless语句：

```pug
unless condition
    ...
```

条件部分的括号，及`if`、`else`和`unless`前的`-`可省略。

### 8.2 case语句

case语句形如：

```pug
case variable
    when value
        ...
    ...
    default
        ...
```

只有当一个`when`语句块为空时，该语句块的执行才会移交到下一个`when`语句块。可以通过`- break`跳出`case`语句。

也可在`when value`和`default`后，紧跟`:`后跟上标签，在行内完成语句块。

## 9 循环语句（Iteration）

each语句形如：

```pug
each value, key in arrayOrObject:
    ...
else
    ...
```

对于数组会遍历数组元素，对于对象会遍历其属性。`, key`可以省略。`else`语句块也可以省略，该语句块会在迭代空数组或空对象时被执行。也可以用`for`替代`each`。

while语句形如：

```pug
while condition
    ...
```

## 10 过滤器（Filters）

过滤器，将纯文本作为输入，其输出的内容再被嵌入到Pug模板的输出中，所有的JSTransformer模块都可以作为过滤器，常见的过滤器有`:babel`、`:uglify-js`、`:scss`和`:markdown-it`。

过滤器语法如下：

```pug
:filter(key=value ...)
    ...
```

也可以采用单行的形式：

```pug
:filter(key=value ...) ...
```

其中`(key=value ...)`为选项可以省略，如果`key`为布尔类型，值为真，`=value`也可以省略。过滤器也可嵌套，语法类似`:filter1:filter2`。

注意：过滤器的渲染发生在编译阶段。

也可以自定义过滤器：

```javascript
options.filters = {
    'my-own-filter': function (text, options) {
        ...
    }
};
```

## 11 包含文件（Includes）

包含文件的语法如下：

```pug
include:filter file
```

其中`:filter`可选。如果`file`是Pug模板文件，会被Pug处理。如果`file`是其他文本文件，则文本被原处保留。`file`的路径如果是绝对路径，由`options.basedir`制定更目录，否则则为想对于当前编译文件的路径。

## 12 复用块（Mixins）

复用块的定义语法如下：

```pug
mixin name(parameters, ...restArguments)
    ...
```

使用的语法如下：

```pug
+name(arguments)(attributes)
   ...
```

其中，, `...restArguments`可选，所有的实参列表和形参列表连同`()`也可选。使用语法下面的块可选。通过`block`，可以在定义处引用使用处的块。`attributes`为`=`连接，空格分割的键值对（值已经被转义），连同`()`也是可选的。通过`attributes`对象，可以引用使用处的`attributes`。

## 13 模板继承（Template Inheritance）

声明一个可被派生模板修改的块的语法如下：

```pug
block name
    ...
```

其中，包含的子块为派生后默认的块，是可选的。通过在模板开始处声明`extends file`，可以从`file`派生出新的模板，然后通过`block name`可以重新定义块，通过`block prepend name`或`prepend name`可以在默认块前添加新的内容，通过`block append name`或`append name`可以在默认块后添加新的内容。
