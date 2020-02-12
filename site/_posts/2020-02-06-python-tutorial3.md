---
title: Python教程3 - 复习实践篇
author: 孙子平
date: 2020-02-06T09:17:42Z
category: Python
tags: [Python, 编程, 教程]
series: Python教程
sidebar:
  - /_posts/2019-11-01-python-tutorial1.html
  - /_posts/2019-11-11-python-tutorial2.html
  - /_posts/2020-02-06-python-tutorial3.html
---

（施工中）

这篇文章是对我们之前所学知识的复习，也教授了一些新的知识，并且提供了一些习题来巩固大家所学的知识。由于我们已经大致掌握了Python命令式编程的设施，这里我就把很多细节补全，并且不再是按照人的学习顺序组织。这篇文章的内容适合不仅适合那些Python新手，也适合已经熟练运用Python的人巩固知识

<!-- more -->

## 1 内置对象

我们可能经常会用到**对象**这个词。按照[Python的官网上的说法](https://docs.python.org/3.7/reference/datamodel.html)，所谓对象就是一个有唯一ID、**值**和**类型**的东西。对象的ID和类型是不会改变的，而根据对象的值能否改变，对象可以分为**可变的（mutable）** 和 **不可变的（immutable）**，这是由它的类型决定的。有些容器如元组，虽然它的内容可能是个可变对象，但我们依旧认为它是个不可变对象。Python中的一切实体都是对象，或者说一切可被赋值给变量的都是对象。而**变量**是一种到对象的**引用**，它将一个对象**绑定**到了名字。当没有任何方法能够获取到某个对象时，那个对象就会被销毁。

Python的类型之间是有父子关系的。子类型会拥有父类型的所有方法。所有的类型都是`object`类型的子类型。比如`int`类型就是`object`类型的子类型，这种父子关系我们称为**继承（inheritance）**，因此我们说`int`类型继承自`object`类型。这里我们还需要引入一个名词叫**实例（instance）**，当我们说对象`a`是类型`A`的实例的时候，其实就在说对象`a`的类型是`A`或者`A`的子类型（包括直接或间接的）。比如`1`是`int`的实例，`'1'`是`str`的实例，而`1`和`'1'`都是`object`的实例，甚至Python中一切的对象都是`object`的实例。

::: tip 面向对象启蒙
面向对象编程启发自大自然。我们就以大自然中的动物为例，每个动物都有一些**属性**，比如性别，同时它们也有一些**方法**，比如繁殖。将这些属性和方法聚集在一起，这就是面向对象的第一个组成部分——**封装（encapsulation）**。而人类和鸟类都继承自动物，因此人类和鸟类都有繁殖这个方法，同时又有性别这个属性，这就是**继承（inheritance）**，面向对象编程的第二个重要组成部分。另一方面，子类型除了能继承父类型的所有方法之外，还能重新定义父类型的方法。比如人类的繁殖是胎生，而鸟类的繁殖就是卵生。这样同样是动物，却对同一个方法有不同的具体行为，这就是**多态（polymorphism）**。多态是面向对象编程的第三个重要组成部分。

最后，我和正在阅读这些文字的你都是人类和动物的**实例（instance）**，是一种**对象（object）**。
:::

下图是一些内置类型的继承关系，其中方框是内置类型，椭圆来自`collection.abc`，每个椭圆的内容都提供一些方法。以后如果有机会，我会再来介绍每个节点是什么含义，你可以点击[此处](https://docs.python.org/3.7/library/collections.abc.html#collections-abstract-base-classes)查看相关文档。

```graphviz [compile]
digraph abc {
  graph [rankdir=RL]
  subgraph abstract {
    Container
    Hashable
    Iterable
    Iterator -> Iterable
    Reversible -> Iterable
    Generator -> Iterator
    Sized
    Callable
    Collection -> Sized
    Collection -> Iterable
    Collection -> Container
    Sequence -> Reversible
    Sequence -> Collection
    MutableSequnece -> Sequence
    ByteString -> Sequence
    Set -> Collection
    MutableSet -> Set
    Mapping -> Collection
    MutableMapping -> Mapping
    MappingView -> Sized
    ItemsView -> MappingView
    ItemsView -> Set
    KeysView -> MappingView
    KeysView -> Set
    ValuesView -> MappingView
    ValuesView -> Set
    Awaitable
    Coroutine -> Awaitable
    AsyncIterable
    AsyncIterator -> AsyncIterable
    AsyncGenerator -> AsyncIterator
  }
  subgraph concret {
    node [shape=box]
    rank=same
    int
    float
    complex
    list
    tuple
    range
    str
    bytes
    bytearray
    memoryview
    set
    fronzenset
    dict
  }
  int -> Hashable
  float -> Hashable
  complex -> Hashable
  list -> MutableSequnece
  tuple -> Sequence
  tuple -> Hashable
  range -> Sequence
  range -> Hashable
  str -> Sequence
  str -> Hashable
  bytes -> ByteString
  bytes -> Hashable
  bytearray -> ByteString
  bytearray -> MutableSequnece
  memoryview -> Sequence
  memoryview -> Hashable
  set -> MutableSet
  fronzenset -> Set
  fronzenset -> Hashable
  dict -> MutableMapping
  dict -> Reversible
}
```

接下来介绍下面2个运算符和4个函数：

- `id(a)`函数：获取对象的ID，这个ID是个整数，而且在对象存在的期间是唯一的（不与其他对象一样）；
- `type(a)`函数：获取对象的类型；
- `a is b`和`a is not b`：判断`a`和`b`是不是同一对象，如果`id(a) == id(b)`，则就认为是同一对象；
- `isinstance(a, A)`：判断对象`a`是否是类型`A`的实例，注意这个运算符与`type(a) is A`还是有区别的比如`isinstance(1, object)`是真，但是`type(1)`是`int`不是`object`。
- `issubclass(A, B)`：判断类型`A`是否是类型`B`的子类型。

下面是例子。

```python
>>> id(1)  # 这个数字是会改变的
139698536331168
>>> type(1) is int  # 最好不要在此处使用 ==
True
>>> a = [1, 2, 3]
>>> b = [1, 2, 3]
>>> a == b
True
>>> a is b  # 对于相同值的可变对象，它们也可能不是同一对象，拥有不同的ID
False
>>> a is not b  # 上面式子的否定
True
>>> isinstance(1, int)
True
>>> isinstance('1', int)
False
>>> isinstance(1, object)
True
>>> isinstance('1', object)
True
>>> issubclass(int, object)
True
```

::: warning
请不要把判断对象相同运算符`is`、`is not`和判断值相等运算符`==`和`!=`搞混。
:::

::: tip
Python中经常有一些函数，其实也是类型，如`str`、`int`等，因为这个类型可以接受参数来实例化出对象，这种函数我们称为**构造函数（constructor）**。
:::

我们将在以后学习自定义的对象和类型，但其实**内置对象**已经足够我们使用。我们先从复习**内置对象**开始。

### 1.1 整数

Python内置支持无限位数的**整数**。它是一种不可变对象。

#### 1.1.1 整数字面量

**整数**的字面量可以是以下几种情况：

- 十进制：非0开头的十进制数，如`127`；
- 二进制：`0b`或`0B`开头的二进制数，如`0b1111111`；
- 八进制：`0o`或`0O`开头的八进制数，如`0o177`；
- 十六进制：`0x`或`0X`开头的十六进制数，使用`a`到`f`或`A`到`F`表示10到15，如`0x7f`。

其中十进制肯定是最常用的，而有时十六进制也很常用，因为2位16进制可以表示一个字节。

整数字面量的进制标识（类似`0x`）和数字以及数字和数字之间都可以加入下线符`_`，如`1_1`、`0x_ff`，而`11_`和`1__1`都是非法的。增加这个语法主要是为了方便很长的数字被阅读，不过这个语法也用得很少。

#### 1.1.2 整数与字符串的转换

`int`是整数的构造函数，它可以从浮点数和字符串中构造出整数：

- 对于参数为浮点数的情况，它会截断（正数是向下取整）；
- 对于参数为字符串的情况，它有第二个参数名叫`base`可以指定进制数，必须是2到36（因为数字+字母总共36个，只能表示36进制），默认为10进制，如果你指定0，则它会从开头的进制标识来推断是几进制。

```python
>>> int(0.9)
0
>>> int(-0.9)
0
>>> int('177')
177
>>> int('177', 8)
127
>>> int('0o177', base=0)
127
```

除了将某进制的字符串转成整型，还可以将整型转成指定进制的字符串。这里Python提供了以下函数：

- `str`：这其实是个通用的构造函数，可以将任意对象转换成字符串，对于整数它会转成10进制。
- `bin`：将整数转成2进制字符串，包含前缀`0b`；
- `oct`：将整数转成8进制字符串，包含前桌`0o`；
- `hex`：将整数转成16进制字符串，包含前缀`0x`。

下面给一些例子：

```python
>>> str(127)
'127'
>>> bin(127)
'0b1111111'
>>> oct(127)
'0o177'
>>> hex(127)
'0x7f'
>>> hex(127)[2:]  # 如果你不想要进制标识，可以用切片语法去除掉
'7f'
```

### 1.2 浮点数

浮点数能存储精度为15位有效数字左右的实数。它是一种不可变对象。

#### 1.2.1 浮点数字面量

浮点数的字面量格式大致如下：

$$\text{整数} \underbrace{. \text{小数}}_{\text{小数部分}} \overbrace{\text{e(或E)} \pm \text{指数}}^{\text{指数部分}}$$

它表示的数字其实就是：$\text{整数}.\text{小数}\times 10^{\text{指数}}$。这里整数、小数和指数可以是任意十进制数字，数字和数字之间可以插入`_`（但同样不常用）。浮点数的字面量可以省略一些部分，但必须满足如下规则：

- 整数和小数可以省略，但不可以同时省略：`1.e-2`和`.5e6`都是合法的浮点数，但是`.e-2`都不是合法的。
- 小数部分和指数部分可以省略，但不可以同时省略：`1e2`和`1.0`都是合法的浮点数，但`1`不是，实际上它是整数。

为了确保某些字面量是浮点类型，我们经常会加上`.0`，比如`1.0`，`0.0`。

#### 1.2.2 浮点数与字符串的转换

`float`是浮点数的构造函数，它可以从整数和字符串中构造出浮点数。同样地，你可以通过`str`函数将浮点数转成字符串。

#### 1.2.3 浮点数的精度问题

浮点数是有误差的，因此用等于去判断两个浮点数的值是否是相等的是有风险的：

```python
>>> 0.1 + 0.1 + 0.1 == 0.3
False
```

在[上一讲](/2019/11/11/python-tutorial2/#_1-1-3-比较运算符（comparison-operator）)中，我介绍了一种用两数只差小于某个很小的值来判断两个浮点数是否相等的方法。实际上，我后来查阅了一些文档，发现在Python 3.5中[新增](https://docs.python.org/3/whatsnew/3.5.html#pep-485-a-function-for-testing-approximate-equality)了用于判断两个实数是否相近的函数，使用方法如下：

```python
>>> import math
>>> math.isclose(0.1 + 0.1 + 0.1, 0.3)
True
```

#### 1.2.4 特殊的浮点数值

这里我们使用`import`语句导入了一个包，我们会在之后的课程里讲解这些。

注意浮点数的零有正零和负零之分，但是正零和父零是相等的：

```python
>>> +0
0
>>> -0    # 整数只有一种0
0
>>> +0.0
0.0
>>> -0.0  # 浮点数有两种0
-0.0
>>> +0.0 == -0.0  # 但这两种0是相等的。
True
```

此外浮点数还有3个特殊的值：`+inf`、`-inf`和`nan`，分别表示为正无穷、负无穷和不是一个数（not a number）。对于大到超出浮点数表示范围的数，就成了正负无穷。在很多语言包括Python的一些数学库（如numpy）中，浮点数除以0也会得到无穷，这是CPU指令约定成俗的，但是在Python中，它会额外检查除数，遇到0就报除零错误。

```python
>>> 1e1000
inf
>>> float('inf')
inf
>>> import numpy
>>> numpy.float64(1) / 0.0
<stdin>:1: RuntimeWarning: divide by zero encountered in double_scalars
inf
>>> 1.0 / 0.0
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ZeroDivisionError: float division by zero
```

如果出现了无穷相除、0相除（Python），或者无穷乘以0这种极限中的不定式的情况，就会产生`nan`值，`nan`很特殊，它是唯一一个不等于自身的浮点数。

```python
>>> inf = float('inf')
>>> inf / inf
nan
>>> nan = float('nan')
>>> nan == nan
False
```

### 1.3 字符串和Bytes

字符串类型用于存储文本数据，而Bytes用于存储二进制数据，它是种不可变对象，也是一种序列。

#### 1.3.1 字符串和Bytes的字面量

字符串和Bytes字面量都可以用一对单引号或双引号括起来，区别在于单引号括住的字符串中的双引号可以不必转义，同样的双引号括住的字符串中的单引号可以不必转义。此外字符串和Bytes也可以用三重引号括起，区别在于单重引号不能包含不加转义的换行和对应的引号，而三重引号则可以。

```python
>>> 'It\'s me.'
"It's me."
>>> "It's me."
"It's me."
>>> '''And then,
... that's you'''
"And then,\nthat's you"
```

字符串和Bytes字面量形式上的差别在于Bytes字面量有前缀`b`或`B`。字符串和Bytes字面量还可以有前缀`r`或`R`表示**原始字符串（raw string）**。前缀的大小写是忽略的，其顺序也是无所谓的。原始字符串中的`\`代表它本身，不再处理转义序列。原始字符串经常出现在Windows路径或者正则表达式中。此外字符串还允许有`f`或`F`前缀表示**格式化字符串**，我们将在以后的章节介绍这种。

#### 1.3.2 转义

下表是可以出现在字符串和bytes字面量中的转义字符列表：

|转义序列|含义|
|:-:|:-|
|`\`紧跟换行|`\`和换行被忽略|
|`\\`|反斜杠符 (\\)|
|`\'`|单引号 (')|
|`\"`|双引号 (")|
|`\a`|ASCII 响铃 (Bell，BEL)|
|`\b`|ASCII 退格 (Backspace，BS)|
|`\f`|ASCII 换页 (Formfeed，FF)|
|`\n`|ASCII 换行 (Linefeed，LF)|
|`\r`|ASCII 回车 (Carriage Return，CR)|
|`\t`|ASCII 水平制表符 (Horizontal Tab，TAB)|
|`\v`|ASCII 垂直制表符 (Vertical Tab，VT)|
|`\ooo`|8进制值为ooo的字符，o代表8进制数位，最多可以有3个数位|
|`\xhh`|16进制值为hh的字符，h代表16进制数位，必须2个数位|

除此之外，字符串还支持了额外的转义，列在了下表中，bytes不支持这些转义：

|转义序列|含义|
|:-:|:-|
|`\N{name}`|名字为`name`的 Unicode 字符|
|`\uxxxx`|16进制值为 xxxx 的16位字符，x表16进制数位，必须4个数位|
|`\Uxxxxxxxx`|16进制值为 xxxxxxxx 的32位字符，x表16进制数位，必须8个数位|

有一些小细节这里提示一下，原始字符串也可以转义引号，但反斜杠符仍会被保留，如`r"\""`是`"\\\""`；原始字符串也不能以反斜杠符结尾。

上面的两张表不必死记硬背，记住个大概就好，其中`\t`（水平制表）、`\r`（回车）、`\n`（换行）和`\xhh`这4种转义序列用得比较多。其中`\r`，我们在涉及文件输入输出时再细细介绍，这里我们给出一些例子：

```python
>>> print('1\t2\n3\t4')
1       2
3       4
>>> '\x0a' == '\n' # 换行符ASCII码为10，十六进制为0a
True
```

#### 1.3.3 字符与整数的转换

每个字符都是拥有一个编码的，字符编码中Unicode是ASCII的拓展，前者包含了我们用到的所有字符，包括中日韩表意文字、emoji等等，而后者只有128个字符，这个字符对应的编码称为**码位（code point）**。我们有两个函数对字符和码位互相转换：

- 通过`ord()`函数我们能获得长度为1的字符串或bytes对应的码位；
- 通过`chr()`函数我们能获得码位对应的长度为1的字符串。

```python
>>> ord('我')
25105
>>> chr(25105)
'我'
```

#### 1.3.4 编码与解码

文本在进行编码后就成了二进制数据，而二进制数据解码之后也就变回了文本。Python提供了负责这两种转化的**方法**（这里方法是指某个对象拥有的函数）：

- `str.encode(encoding='utf-8')`：将文本编码成二进制数据；
- `bytes.decode(encoding='utf-8')`：将二进制数据解码为文本。

编码默认是`utf-8`。对于中国大陆而言，由于Windows大都采用国标码记录中文，也就是`gbk`，所以`gbk`也会比较常见。想看完整的编码列表可以点击[此处](https://docs.python.org/3/library/codecs.html#standard-encodings)。下面给一些例子：

```python
>>> text = '你好世界'
>>> binary = text.encode()
>>> binary
b'\xe4\xbd\xa0\xe5\xa5\xbd\xe4\xb8\x96\xe7\x95\x8c'
>>> binary.decode()
'你好世界'
```

#### 1.3.5 将任何对象转换成字符串

Python提供了两个函数将对象转换为字符串：

- `str()`函数：将对象转成一个适合打印的形式；
- `repr()`函数：将对象转成一个包含很多信息的形式，如果可能，得到的字符串将是可以产生这个对象的Python代码。

可能即使这么说还是不够形象，我们给一个字符串的例子，对于字符串而言`str()`函数就是返回它本身：

```python
>>> print(str('1\t2'))
1       2
>>> print(repr('1\t2'))
'1\t2'
```

其实`print()`函数对于非字符串的对象会调用`str()`函数转换成字符串后再打印。另外我们可以看到，当Python的交互式模式输入的是表达式的时候，Python会调用`repr`函数打印这个表达式的值。

::: tip 原理
实际上`str()`会调用对象的`__str__()`方法，而`repr()`会调用对象的`__repr__()`方法。这些方法是所有对象都有的。

```python
>>> print("1\t2".__str__())
1       2
>>> print("1\t2".__repr__())
'1\t2'
```

:::

#### 1.3.6 作为可迭代对象和序列

关于可迭代对象和序列的介绍可以见[1.5.3 可迭代对象的操作](#_1-5-3-可迭代对象的操作)和[1.5.4 序列的操作](#_1-5-4-序列的操作)。作为不可变的序列，字符串和Bytes只支持获取长度，根据索引或切片获取元素等操作，不支持对索引或切片赋值，也不支持删除索引或切片等操作。

#### 1.3.7 常见的字符串方法

完整的字符串方法列表可以点击[此处](https://docs.python.org/3.7/library/stdtypes.html#string-methods)查看。

判断是否包含子串：

- `str.startswith(prefix)`：判断字符串是否以`prefix`开头；
- `str.endswith(suffix)`：判断字符串是否以`suffix`结尾；
- `str.find(sub)`：寻找字符串中包含子串`sub`的起始索引，如果找不到返回`-1`。

```python
>>> '1234'.startswith('12')
True
>>> '1234'.endswith('12')
False
>>> '1234'.find('23')
1
>>> '1234'.find('32')
-1
```

对字符串做一些变换（返回新的字符串）：

- `str.lower()`：将所有的字母转成小写；
- `str.uppper()`：将所有的字母转成大写；
- `str.strip()`：删除前导和后继空白符。

```python
>>> 'abc'.upper()
'ABC'
>>> '  a\tb\t '.strip()
'a\tb'
```

一些判断字符类型的函数：

- `str.isalpha()`：是否都是英文字母且长度至少为1；
- `str.isdigit()`：是否都是数字且长度至少为1；
- `str.isspace()`：是否是空白字符且长度至少为1。

分割与合并：

- `str.split(sep=None)`：以`sep`为分隔符分割字符串成列表，如果`sep`为`None`，则以空白符分割；
- `str.join(iterable)`：将可迭代对象以`str`为分隔符连接成字符串。

```python
>>> items = '1\t 2\n3'.split()
>>> items
['1', '2', '3']
>>> ','.join(items)
'1,2,3'
```

### 1.4 布尔

布尔对象只有两种值：真和假，分别用两个关键字`True`和`False`表示，它们是布尔类型仅有的两个实例。布尔类型实际上和整数类型比较类似，在绝大多是情况下，`True`和1有同样的表现，而`False`和0有同样的表现。`bool`是布尔类型的构造函数，可以将任意类型转为布尔类型。对于`if`语句和`while`语句中的条件表达式，其值会被转换为`bool`类型。

#### 1.4.1 其他类型转换到布尔类型

通常而言，我们认为以下的值是假的：

- 被定义成假的常量：`None`和`False`；
- 值为0的数值类型：如`0`，`0.0`等；
- 空的容器：`''`，`()`，`[]`，`{}`。

其他情况被认为是真值。

::: tip 原理
实际上，`bool()`会调用对象的`__bool__()`方法。如果这个方法没有定义，它会调用对象的`__len__()`方法看它是否非零，如果这个方法也没有，那这个对象就被认为是真的。
:::

### 1.5 列表和元组

列表和元组都是序列。其中列表是可变对象，而元组是不可变对象。

#### 1.5.1 列表和元组的字面量

::: warning
官方文档里面并没有采用列表字面量和元组字面量的词汇，所以我的说法可能是不标准的。官方采用列表显示（list display）指我这里说的列表字面量。而元组字面量我没有找到专业的名词。
:::

使用中括号`[]`括起，逗号分隔的表达式列表就能表示一个**列表**，最后一个表达式的尾部可以有一个可选的逗号。如果你采用多行来完成列表字面量，很推荐你在最后一个表达式的尾部加上逗号，这样以后你再添加元素会很方便。

```python
>>> list1 = [1, 2, 3, 4]
>>> list2 = [
...     'one',
...     'two',
...     'three',
...     'four',
... ]
>>> empty = []
>>> mono = ['a']
```

类似地，使用圆括号`()`括起，逗号分割的表达式就能表示一个**元组**，最后一个表达式尾部可以有一个可选的逗号。**当只有一个元素的时候，这个逗号是必须的**，如果不添加逗号，就成了一个加了括号改变优先级的表达式。

```python
>>> (1, 2, 3)
(1, 2, 3)
>>> (1)  # 错误的单元素元组表示方法
1
>>> (1,)
(1,)
>>> ()   # 空元组
()
```

值得一提的是，列表和元组的构造是支持解包语法的，这和我们之前说过的函数解包语法是类似的：

```python
>>> a = [3, 4]
>>> b = [1, 2, *a, *(5, 6), 7]
>>> b
[1, 2, 3, 4, 5, 6, 7]
```

此外，元组的括号在不引起歧义（如赋值语句的右侧）的时候是可以省略的。下方代码中，`b, c = 3, 4`利用了赋值语句左侧如果是多个目标，则右侧的可迭代对象会被展开挨个赋值给目标；最后一行是很Pythonic的交换两个变量。

```python
>>> a = 1, 2
>>> a
(1, 2)
>>> b, c = 3, 4
>>> b
3
>>> c
4
>>> b, c = c, b  # 交换两个变量
```

::: tip
Pythonic是对代码的一种要求，就是代码不仅是语法正确的，而且是遵循了Python的习俗的，容易被人理解的。
:::

::: tip 原理
Python哪些地方元组可以省略括号？就我看到的而言有如下地方：

- 表达式语句（支持解包）；
- 赋值语句右侧（支持解包）；
- 复合赋值语句右侧（不支持解包）；
- `yield`右侧（不支持解包）；
- 下标运算符内（不支持解包）；
- `return`右侧（不支持解包）

其中`yield`语句我们还没学过。
:::

#### 1.5.2 可迭代对象到列表和元组的转换

可迭代对象转成列表和元组可以直接使用列表和元组的构造函数：

```python
>>> list(range(10))
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> tuple(range(10))
(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
```

当你有多个可迭代对象，而你希望把它们拼接在一起，那么解包语法也是一个不错的选择，但注意这么做会把可迭代对象的所有值取出，占耗大量的内存，如果你希望得到一个惰性的迭代器，可以使用`itertools.chain()`：

```python
>>> [*range(5), *range(3)]
[0, 1, 2, 3, 4, 0, 1, 2]
>>> import itertools
>>> list(itertools.chain(range(5), range(3)))
[0, 1, 2, 3, 4, 0, 1, 2]
```

#### 1.5.3 可迭代对象的操作

**可迭代对象**是指能够一次返回一个元素的对象。可迭代对象包括序列如`list`、`str`和`tuple`、`range`，也包括映射`dict`，还有`enumerate`等等。

通过调用内置函数`iter()`可以获取可迭代对象的迭代器。所谓**迭代器**，是能够通过内置函数`next()`不断获取下一个元素的对象，直到抛出`StopIteration`异常终止（异常我们以后会介绍）。迭代器本身也是可迭代对象，调用`iter()`会获得自己，这使得迭代器能出现在可迭代对象出现的地方。一般而言一个迭代器只能使用一遍。如果你需要多遍遍历，你需要用`iter()`获取多个全新的迭代器。我们可以看看示例代码：

```python
>>> iterable = [1, 2]
>>> iterator = iter(iterable)
>>> next(iterator)
1
>>> next(iterator)
2
>>> next(iterator)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
StopIteration
>>> iterator = iter(iterable)
>>> iterator is iter(iterator)
True
```

::: tip 原理
这部分内容可能对于初学者过于深奥。请谨慎食用。

`iter()`函数会尝试调用可迭代对象的`iterable.__iter__()`方法获得迭代器；如果这个方法不存在，它会试图创建一个迭代器，这个迭代器会，从0开始用整数调用`iterable.__getitem__()`（基本等价于下标）获取元素直到出现`IndexError`异常。

`next()`函数会调用迭代器的`iterator.__next__()`方法。

:::

以下我们给出可迭代对象支持的操作，除了下面列出的操作，可迭代对象还支持**解包**和用`for`语句遍历：

|操作|结果|来源|
|:-|:-|:-|
|`iter(iterable)`{.text-no-wrap}|返回`iterable`的迭代器|`Iterable`要求的方法|
|`min(iterable)`{.text-no-wrap}|`iterable`最小的元素|`Iterable`提供的方法|
|`max(iterable)`{.text-no-wrap}|`iterable`最大的元素|^^|
|`sum(iterable, start=0)`{.text-no-wrap}|从`start`开始左往右对所有数据求和|^^|
|`all(iterable)`{.text-no-wrap}|`iterable`所有元素是否都是真|^^|
|`any(iterable)`{.text-no-wrap}|`iterable`是否存在某个元素是真|^^|
|`enumerate(iterable, start=0)`{.text-no-wrap}|返回一个迭代器，这个迭代器返回的元素是一个由序号（从`start`开始编号）和原可迭代对象的值组成的二元组，经常被用于`for`循环|^^|
|`map(function, iterable)`{.text-no-wrap}|返回一个迭代器，这个迭代器返回的元素是传给`function`得到`True`的元素|^^|
|`filter(function, iterable)`{.text-no-wrap}|返回一个迭代器，这个迭代器返回的是传给`iterable`元素给`function`得到的结果|^^|
|`zip(*iterables)`|返回一个迭代器，这个迭代器依次同时取出所有可迭代对象的元素，组成一个元组返回，经常用于`for`循环中|^^|

下面给出一些例子：

```python
>>> a = list(range(5, 10))  # 产生一个5到9的列表
>>> a
[5, 6, 7, 8, 9]
>>> import random
>>> random.shuffle(a)  # 随机打乱这个列表
>>> a
[5, 9, 7, 6, 8]
>>> min(a)
5
>>> max(a)
9
>>> sum(a)
35
>>> list(enumerate(a))  # 由于enumerate返回的是迭代器，所以需要list来转换为列表，下同
[(0, 5), (1, 9), (2, 7), (3, 6), (4, 8)]
>>> for i, v in enumerate(a):  # 这个是enumerate经常被使用的方式
...   print(str(i) + ': ' + str(v))
...
0: 5
1: 9
2: 7
3: 6
4: 8
>>> list(filter(lambda x: x > 6, a))  # 筛选出列表中大于6的元素
[9, 7, 8]
>>> list(map(lambda x: x * 2, a))  # 将列表中所有元素乘以2
[10, 18, 14, 12, 16]
>>> all(map(lambda x: x > 5, a))  # 测试是否所有元素都大于5
False
>>> any(map(lambda x: x > 5, a))  # 测试是否存在元素大于5
True
>>> list(zip(range(5, 10), range(10, 5, -1)))
[(5, 10), (6, 9), (7, 8), (8, 7), (9, 6)]
```

#### 1.5.4 序列的操作

所谓**序列**就是那些能够通过整数索引元素`s[i]`、并能通过`len()`函数获取长度的对象，所有的序列对象一定是**可迭代对象**（在先前的继承图中你可以看到`Sequence`继承自`Iterable`）。**可变的序列**是普通**序列**的子类型，除继承得到的方法之外，更进一步支持了对索引赋值`s[i] = value`、删除索引`del s[i]`和插入元素`s.insert(index, value)`这一些操作。这些继承关系可以用下图表示。

```graphviz [compile]
digraph {
  graph [rankdir=BT]
  subgraph abstract {
    MutableSequence -> Sequence -> Iterable
  }
  subgraph concret {
    node [shape=box]
    tuple, str, bytes, range, list, bytearray, memoryview
  }
  tuple -> Sequence
  str -> Sequence
  bytes -> Sequence
  range -> Sequence
  memoryview -> Sequence
  list -> MutableSequence
  bytearray -> MutableSequence
}
```

这里这些概念有些复杂，我们把这些操作制作成表格，方便大家理解，而后我们给出示例代码。首先是**序列**的操作列表，`list`、`tuple`、`str`、`bytes`、`bytearray`和`range`都支持下表中的操作：

|操作|结果|注释|来源|
|:-|:-|:-|:-|
|`x in s`{.text-no-wrap}|如果`s`的一个元素为`x`，则为`True`否则为`False`|如`str`、`bytes`和`bytearray`的一些序列使用`in`进行子串匹配|`Sequence`提供的方法|
|`x not in s`{.text-no-wrap}|如果`s`的一个元素为`x`，则为`False`否则为`True`|^^|^^|
|`s + t`{.text-no-wrap}|连接序列`s`和`t`，返回新的序列|这种连接如果需要执行多次会有较高的时间开销|某些序列拥有的额外方法，`range`之类的序列没有|
|`s * n`{.text-no-wrap}和`n * s`{.text-no-wrap}|重复序列`s` `n`次|如果`n`为负，则当做0处理返回空串，注意`s`中的对象发生的是浅拷贝|^^|
|`s[i]`{.text-no-wrap}|第$i$个元素，从0开始计数|如果$i$或$j$是负数，则分别等价于`len(s) + i`或`len(s) + j`，但`-0`仍是`0`|`Sequence`要求的方法|
|`s[i:j]`{.text-no-wrap}|找出所有下标$k$满足$k\in[i, j)$|^^|^^|
|`s[i:j:k]`{.text-no-wrap}|找出所有下标$x$满足$\exists n\in [0,\frac{j-i}{k}), x=i+nk$|^^|^^|
|`len(s)`{.text-no-wrap}|`s`的长度| |^^|
|`iter(s)`{.text-no-wrap}|返回`s`的迭代器| |`Sequence`提供的方法|
|`reversed(s)`{.text-no-wrap}|返回`s`的反向迭代器| |`Sequence`提供的方法|
|`s.index(x[, i[, j]])`{.text-no-wrap}|`x`出现在`s`中的第一次位置的下标，额外的参数基本等价于`s[i:j].index(x)`，找不到会抛出`ValueError`异常| |^^|
|`s.count(x)`{.text-no-wrap}|`s`中出现了`x`的总数| |^^|

下面是一些示例代码：

```python
>>> s, t = list(range(5)), list(range(5, 10))
>>> s
[0, 1, 2, 3, 4]
>>> t
[5, 6, 7, 8, 9]
>>> 5 in s
False
>>> 5 not in s
True
>>> s + t
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> s * 2
[0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
>>> s[-1]
4
>>> s[::-1]  # 一种颠倒序列的方式
[4, 3, 2, 1, 0]
>>> len(s)
5
>>> list(reversed(s))  # 另一种颠倒序列的方式
[4, 3, 2, 1, 0]
>>> s.index(3)
3
>>> s.count(1)
1
```

对于索引和切片下标值的含义，我们还是祭出下方的这个图，这是字符串`Python`的索引对应的位置。索引从0开始计数，索引6是个非法的索引，它**越界**了。此外还要注意切片是左闭右开的。

```ditaa [compile no-separation]
 +---+---+---+---+---+---+
 | P | y | t | h | o | n |
 +---+---+---+---+---+---+
   0   1   2   3   4   5   6
  -6  -5  -4  -3  -2  -1
```

接着是**可变序列**的操作列表，`list`和`bytearray`支持下表中的操作。

|操作|结果|注释|来源|
|:-|:-|:-|:-|
|`s[i] = x`{.text-no-wrap}|`s`中的第`i`个元素被替换为`x`| |`MutableSequence`要求的方法|
|`s[i:j] = t`{.text-no-wrap}|`s`从`i`到`j`（不包括`j`）的切片被替换为序列`t`| |^^|
|`del s[i:j]`{.text-no-wrap}|等价于`s[i:j] = []`| |^^|
|`s[i:j:k] = t`{.text-no-wrap}|将`s[i:j:k]`中的元素替换为序列`t`|切片和`t`的长度必须相等|^^|
|`del s[i:j:k]`{.text-no-wrap}|移除`s[i:j:k]`中的元素| |^^|
|`s.append(x)`{.text-no-wrap}|将`x`添加到`s`的末尾，等价于`s[len(s):len(s)] = [x]`| |`MutableSequence`提供的方法|
|`s.clear()`{.text-no-wrap}|移除`s`中的所有元素，等价于`del s[:]`|Python 3.3新加入的方法|某些可变序列拥有的额外方法|
|`s.copy()`{.text-no-wrap}|创建`s`的浅拷贝，等价于`s[:]`|^^|^^|
|`s.extend(t)`{.text-no-wrap}和`s += t`{.text-no-wrap}|用序列`t`扩展`s`，等价于`s[len(s):len(s)] = t`| |`MutableSequence`提供的方法|
|`s *= n`{.text-no-wrap}|更新`s`的内容重复`n`词|内容会被浅拷贝|某些可变序列拥有的额外方法|
|`s.insert(i, x)`{.text-no-wrap}|将`x`插入到`s`下表为`i`的地方，等价于`s[i:i] = [x]`| |`MutableSequence`要求的方法|
|`s.pop([i])`{.text-no-wrap}|返回下表为`i`的元素并且移除它，默认`i`为`-1`| |`MutableSequence`提供的方法|
|`s.remove(x)`{.text-no-wrap}|移除第一个值等于`x`的元素，没找到时抛出`ValueError`异常| |^^|
|`s.reverse()`{.text-no-wrap}|将`s`中的元素倒过来| |^^|

下面是示例代码：

```python
>>> s = list(range(5))
>>> s
[0, 1, 2, 3, 4]
>>> s[0] = 5
>>> s
[5, 1, 2, 3, 4]
>>> s[1:3] = [2, 1]
>>> s
[5, 2, 1, 3, 4]
>>> s[::-1] = s  # 一种原处颠倒序列的方法，和 s[:] = s[::-1] 以及 s.reverse() 等价
>>> s
[4, 3, 1, 2, 5]
>>> del s[::2]  # 删除下标是偶数的元素
>>> s
[3, 2]
>>> s.append(6)
>>> s
[3, 2, 6]
>>> s += [7, 8]
>>> s
[3, 2, 6, 7, 8]
>>> s *= 2
>>> s
[3, 2, 6, 7, 8, 3, 2, 6, 7, 8]
>>> s.pop()
8
>>> s
[3, 2, 6, 7, 8, 3, 2, 6, 7]
>>> s.remove(8)
>>> s
[3, 2, 6, 7, 3, 2, 6, 7]
>>> s.reverse()
>>> s
[7, 6, 2, 3, 7, 6, 2, 3]
```

注意`s * n`以及`s *= n`都是进行浅拷贝，这在二维数组的时候会出现问题，看下面的例子：

```python
>>> s = [[0]] * 3
>>> s
[[0], [0], [0]]
>>> s[0][0] = 1
>>> s
[[1], [1], [1]]
```

如果你想要避免这种情况，建议使用[1.5.5 列表推导式](#_1-5-5-列表推导式)。这里先给出代码：

```python
>>> s = [[0] for _ in range(3)]
>>> s
[[0], [0], [0]]
>>> s[0][0] = 1
>>> s
[[1], [0], [0]]
```

此外`list`还提供了以下方法：

- `list.sort(key=None, reverse=False)`：将列表排序。`key`是一个函数，接受元素，返回排序的键，如果`reverse`为`True`，改为由小到大排序。

示例代码如下：

```python
>>> fruits = ['orange', 'apple', 'banana']
>>> fruits_sorted = fruits[:]
>>> fruits_sorted.sort()  # 普通的排序方法
>>> fruits_sorted
['apple', 'banana', 'orange']
>>> fruits_with_index = list(enumerate(fruits))  # argsort的排序方法
>>> fruits_with_index
[(0, 'orange'), (1, 'apple'), (2, 'banana')]
>>> fruits_with_index.sort(key=lambda x: x[1])
>>> fruits_with_index
[(1, 'apple'), (2, 'banana'), (0, 'orange')]
>>> fruits_argsorted = list(map(lambda x: x[0], fruits_with_index))
>>> fruits_argsorted  # argsort排序完成，得到的结果就是数字。数组是从小到大各个元素的下标
[1, 2, 0]
```

::: tip 原理
TODO
:::

#### 1.5.5 列表推导式

列表推导式是一种创建列表更简介的方式。让我们先以创建一系列的平方数为例：

```python
>>> squares = []
>>> for x in range(10):
...     squares.append(x**2)
...
>>> squares
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

可以看到这里变量`x`在循环结束之后依旧存在。我们可以用下面不带任何副作用的函数式写法：

```python
squares = list(map(lambda x: x**2, range(10)))
```

但是这种写法**可读性**不是特别高，我们可以用下面的列表推导式的写法：

```python
squares = [x**2 for x in range(10)]
```

**列表推导式**语法上是由一个中括号括住的里面包含一个表达式紧跟`for`子句而后可跟任意数目的`for`和`if`子句。其结果就是一个新的列表，列表里面是在`for`和`if`语句上下文中对表达式求值得到值。

举个例子，下面的列表推导式会结合两个列表中的元素，如果它们是不相同的：

```python
>>> [(x, y) for x in [1,2,3] for y in [3,1,4] if x != y]
[(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]
```

它和下面的代码是等价的：

```python
>>> combs = []
>>> for x in [1,2,3]:
...     for y in [3,1,4]:
...         if x != y:
...             combs.append((x, y))
...
>>> combs
[(1, 3), (1, 4), (2, 3), (2, 1), (2, 4), (3, 1), (3, 4)]
```

此外列表推导式也可以嵌套：

```python
>>> matrix = [
...     [1, 2, 3, 4],
...     [5, 6, 7, 8],
...     [9, 10, 11, 12],
... ]
>>> [[row[i] for row in matrix] for i in range(4)]
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

这等价于：

```python
>>> transposed = []
>>> for i in range(4):
...     transposed.append([row[i] for row in matrix])
...
>>> transposed
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

又进一步等价于：

```python
>>> transposed = []
>>> for i in range(4):
...     # the following 3 lines implement the nested list comprehension
...     transposed_row = []
...     for row in matrix:
...         transposed_row.append(row[i])
...     transposed.append(transposed_row)
...
>>> transposed
[[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]]
```

### 1.6 slice

### 1.7 range和enumerate

### 1.8 字典

### 1.9 复数

## 2 表达式

注释

数学、比较、逻辑

## 3 语句

赋值、复合赋值

## 4 函数

## 5 习题
