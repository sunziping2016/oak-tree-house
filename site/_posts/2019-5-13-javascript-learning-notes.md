---
title: JavaScript学习笔记
date: 2019-5-13 00:12:11
categories: JavaScript
tags: [JavaScript, 编程]
summary: 这篇文章是JavaScript的学习笔记。内容主要来自MDN的JavaScript Guide - JavaScript | MDN。
---

这篇文章是JavaScript的学习笔记。内容主要来自MDN的[JavaScript Guide - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)。

<!--more-->

## 1 语法和类型

### 1.1 基础

JS采用Unicode字符集，并且大小写敏感。语句使用`;`结束。一行单条语句的`;`不是必需的。建议始终加上`;`。

### 1.2 注释

注释与C++类似，有单行注释`//`，和多行注释`/* */`。多行注释不能嵌套。

### 1.3 声明

有四种方式方式定义变量：

- 直接赋值：定义一个全局变量（不严格模式）
- `var`：定义一个变量（全局或局部作用域）
- `let`：定义一个局部变量（块作用域）
- `const`：定义一个常量

形式均类似`var name1 = value1 [, name2 = value2 [, ... [, nameN = valueN]]];`。合法的标识符由英文字母、`_`、`$`开头，后还可跟数字组成。

未初始化的变量值为`undefined`。使用未声明的变量会产生`ReferenceError`。

`undefined`转换成bool类型为`false`，转化成数字类型为`NaN`。`null`转换成bool类型为`false`，转化成数字类型为`0`。可以使用严格等号`===`判断一个变量是否为`undefined`或`null`。

（var）函数外声明的变量为全局变量，函数内部声明的变量为局部变量。ECMA2015中出现了块作用域（let），之前没有。JS函数可嵌套。

`var`声明的变量会被提前（相当与声明提前，但初始化并未提前）。`let`和`const`不会被提前。注意：函数声明也会被提前，也就是函数可以在声明前使用。

全局变量实际上是全局对象的属性，对于web而言，就是`window`。

`const`变量不能和同一作用域的其他函数和变量重名。`const`对象的属性不受保护，可重新赋值。

### 1.4 数据结构和类型

共有8种数据类型：

- 7种基础数据类型
  - `Boolean`：布尔
  - `null`
  - `undefined`
  - `Number`：数字
  - `BigInt`：高精度整数
  - `String`：字符串
  - `Symbol`：符号 (ECMA2015)
- 对象

JavaScript是动态类型语言。

字符串类型与数字类型进行`+`运算，数字类型转换为字符串类型。而其他的运算，字符串类型转换为数字类型。注意：可以通过一元`+`，将字符串转换为数字。

有以下两个函数可以进行字符串到数字的转换：

- `parseInt(string, radix)`：转换为整数
- `parseFloat(value)`：转换为浮点数

### 1.5 字面常量

数组字面常量是由`[]`括住的`,`分割的列表。未指定的元素将为`undefined`。如果列表的最后有尾随的逗号，将被忽略。建议省略的元素显式地用`undefined`表示。

`true`和`false`是两种布尔类型的字面常量。不要混淆基础的布尔类型和布尔对象。

整数字面常量有以下几种：

- 10进制：非0开头的数字序列
- 8进制：0开头，或0o（0O）开头
- 16进制：0x（0X）开头
- 2进制：0b（0B）开头

浮点字面常量与其他语言类似，一个浮点常量必须有一个数字和小数点或指数部分。

对象字面常量是由`{}`括住的`:`和`,`分割的键值对列表。不应在语句的开始处使用对象字面常量。键可采用标识符、字符串（包括空字符串）和数字。访问属性可采用`.`（必须是合法的标识符）或`[]`运算符（必须是值，如字符串）。

ES2015支持构造对象时指定原型（`__proto__: theProtoObj`）、简写`foo: foo`语句成`foo`、直接定义成员函数`name() {}`、调用基类`super.id`和运行时计算属性名`[expr]: value`。

正则表达式字面常量是由`//`括住的正则表达式。

字符串字面常量是由`''`或`""`括住的字符串。可调用字符串对象拥有的属性，如`length`。在ES2015中，还支持了模板字符串，`` `...${var}...` ``，可跨多行。此外还可以使用标签自定义字符串。字符串转义规则同其他语言。

## 2 执行控制和错误处理

### 2.1 块语句

多条语句用花括号括起来构成块语句。经常被用于控制语句的语句体部分。

### 2.2 条件语句

if-else语句、switch语句与其他语言类似。

不建议直接在条件判断处使用赋值语句，如果确实需要，则加上括号，如`if ((x = y)) {}`

假值包括：

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- `""`（空字符串）

注意：`new Boolean(false)`的值为真。

### 2.3 异常处理语句

throw语句与其他语言相似，可以throw各种值。catch语句形式为`catch (catchID) { statements }`，其中的`catchID`作用域仅在`catch`块中。finally语句与Java类似。注意：`catch`中的return语句和异常抛出语句会被挂起，先执行`finally`中的语句，如果`finally`语句中存在return语句，则之前的返回值和抛出的异常不再起作用。

可以使用`Error`对象用于异常处理，它有`name`和`message`两个属性。

可以使用`Promise`用于异步或者延迟操作的控制处理。

### 2.4 循环

for、while、do...while、beak、continue语句与其他语言相似。break、continue语句可以带有label。

for...in语句遍历一个对象的所有属性。for...of语句遍历可迭代对象（`Array`、`Map`、`Set`、`Arguments`等等）。

## 3 函数

### 3.1 定义和调用函数

函数定义（又称函数声明、函数语句）形如`function name(parameterlist) { statements }`，其中`parameterlist`是逗号分隔的参数列表。`return`语句可以返回值。数据类型传参采用传值，对对象（包括Array）属性的修改会对外部可见。

函数表达式与函数声明形式类似，但作为语句的一个部分，其中`name`可选。也可以通过`Function`构造函数从字符串里构造出函数。函数表达式不会提前。

方法是一种作为对象属性的函数。

ES6支持默认形参，以及`...name`的方式声明剩余形参，其中`name`是存放额外参数的数组。

注意：函数声明会被提前。函数表达式赋值的对象会被提前，但其值为`undefined`。

函数调用语法和其他语言一样，可以递归。函数本身也是对象，可以通过`apply`方法或`call`方法调用。

### 3.2 作用域和函数栈

在函数内，可以访问函数内定义的变量（及函数）以及父函数所能访问到的变量（及函数），但不能访问到子函数的变量（及函数）。

在函数内部，可以通过`arguments.callee`引用自己，也可以通过`arguments[index]`和`arguments.length`获取参数及其个数。注意：`arguments`不是数组。函数调用提供的参数和函数声明提供的参数数目不一致，提供少了的参数是默认参数或（没默认参数）`undefined`，提供多了的参数可以通过`arguments`访问。

### 3.3 嵌套函数和闭包

嵌套函数会形成**闭包**，闭包内引用的外层作用域的变量会被保留，直到该闭包销毁。闭包按引用捕获外层变量。

注意：内层作用域会屏蔽外层作用域的同名变量。闭包不捕获`this`，闭包中的`this`变量为其**调用者**而非创建者。对于普通函数`this`是（构造函数）一个全新的对象或（strict模式的函数调用）`undefined`或（以对象方法的形式调用）原始对象。

### 3.4 箭头函数

语法形式如`(parameters, ...) => { statements }`或者`(parameters, ...) => expression`创建一个箭头函数。当形参个数为1个时，可省略括号，支持默认形参和剩余形参。箭头函数没有自己的`this`、`arguments`、`super`和`new.target`。

注意：箭头函数捕获`this`，箭头函数中的`this`变量为其**创建者**而非调用者。

### 3.5 预定义函数

- `eval`：执行字符串中的JS代码；
- `isFinite`、`isNan`：判断是否是有限数字和NaN；
- `parseFloat`、`parseInt`：解析字符串返回数字，`parseInt`还可以选择基数；
- `encodeURI`、`decodeURI`：将URI中的某些字符（不改变URI本身的地址）转换为转义字符，和转换回去；
- `encodeURIComponent`、`decodeURIComponent`：将整个URI的某些字符转换为转义字符，和转换回去。

## 4. 运算符

与其他类C语言类似。

赋值支持解包的语法：`var [var1, var2, ...] = array`。

相等判断有三类：

- `==`&`!=`：不严格相等判断，进行必要的类型转换后再判断；
- `===`&`!==`：严格相等判断，不进行类型转换（类型不符则一定不等）；
- `Object.is(a, b)`：与严格相等的不同之处在于，`Object.is(-0, +0)`为false，而`Object.is(NaN, NaN)`为true。

对于数学运算，除以`0`会产生`Infinity`。ES7支持`**`作为乘方运算符。

对于位运算符，会将操作数转化为32为整型，高位丢弃。右移运算符分为符号右移`>>`和补0右移`>>>`。

对于逻辑运算符，`expr1 && expr2`在`expr1`能转换为false时返回`expr1`，否则返回`expr2`。`expr1 || expr2`在`expr1`能转换为true时返回`expr1`，否则返回`expr2`。

使用`+`可以连接字符串。

`delete`表达式可以有以下几种形式：

- `delete objectName`：只能针对隐式声明的变量（不采用`var`，而是直接赋值）；
- `delete objectName.property`：删除属性；
- `delete objectName[index]`：删除元素，不影响数组长度；
- `delete property`：只能在`with`语句中用。

`delete`表达式会返回布尔值，操作可行返回`true`，不可行返回`false`。用`var`定义的变量和内置属性都无法删除。

`typeof operand`或者`typeof (operand)`返回`operand`类型对应的字符串。`typeof null`返回`"object"`。对于对象，一律返回`"object"`；对于函数和方法。一律返回`"function"`。

`void (expression)`或者`void expression`会对`expression`进行求值，却不返回结果（也就是返回`undefined`）。

对于关系运算符，`propNameOrNumber in objectName`返回对象是否存在某属性，可用于数组和对象。`objectName instanceof objectType`返回对象是否为某类型的实例。

### 4.1 表达式

JavaScript包含以下5种表达式：

- 数学
- 字符串
- 逻辑
- 初等
- 左值

#### 4.1.1 初等表达式

`this`关键字指当前的对象。`()`用于调整优先级。此外，非标准的JS还支持两种推导式语法：数组推导式`[for (x of y) x]`和生成器推导式`(for (x of y) x)`。

#### 4.1.2 左值表达式

`new`可以创建对象的实例。`super`可以调用父对象的函数。通过展开运算符`...array`可以将数组展开至字面数组或者函数参数处。

## 5 数字和日期

### 5.1 数字

在JavaScript中，所有的数字都是64位浮点数。

`Number`对象有如下的属性和方法。

- `MAX_VALUE`、`MIN_VALUE`：最大和最小的数字；
- `NAN`、`NEGATIVE_INFINITY`、`POSITIVE_INFINITY`：NaN，正无穷和负无穷；
- `EPSILON`：1和比1大的最小数之间的差；
- `MIN_SAFE_INTEGER`、`MAX_SAFE_INTEGER`：最小和最大的安全整数，分别是（$-2^{53}+1$和$+2^{53}-1$）；
- `parseFloat()`、`parseInt()`：和全局的一样；
- `isFinite()`、`isNaN()`：和全局的类似，但是不会将参数转换为数字；
- `isInteger()`：返回是否是整数；
- `isSafeInteger()`：返回是否是安全整数。

`Number.prototype`有如下方法：

- `toExponential()`：返回指数形式的字符串；
- `toFixed()`：返回浮点形式的字符串；
- `toPrecision()`：返回指定精度的浮点形式的字符串。

### 5.2 Math对象

`Math`对象包含了如`PI`和`E`之类的常量，还有各种数学函数。

### 5.3 Date对象

`Date`对象的范围是-100,000,000天到100,000,000天相较于1970年1月1日UTC时间。

通过`new Date()`创建`Date`对象，参数可以是

- 无：现在的时间戳；
- 代表时间戳的字符串：形如`Month day, year hours:minutes:seconds`，可以省略小时、分钟或秒。
- 代表年（FullYear）、月、日的整数
- 代表年（FullYear）、月、日、小时、分钟、秒的整数

注意：月份从0计数。年份（非FullYear）是从1900开始的年数。

`Date`对象的方法大致有如下几类：

- set方法
- get方法
- to方法：返回字符串
- 解析UTC时间

## 6 文字处理

### 6.1 字符串

JavaScript的字符串采用UTF-16编码。

对于字符串字面常量，通过`\x`可以转义16进制字符；通过`\u`后跟4个16进制字符可以转义UTF-16字符；在ES6中可以通过`\u{xxxx}`转义Unicode字符。通过`String.fromCodePoint()`可以将Unicode编码的数字转成字符，通过`String.prototype.codePointAt()`可以返回指定位置的Unicode字符。

String对象是对String基础数据类型的一层封装。对于字符串字面常量的成员函数调用，会创建临时的String对象完成。注意：应尽量使用String基础数据类型而非String对象。

String对象只有一个属性`length`。String对象和基础数据类型都是不可变的，对元素的赋值是无效的。

String有如下方法：

- `charAt`、`charCodeAt`和`codePointAt`：返回指定位置的字符或编码；
- `indexOf`和`lastIndexOf`：返回子串的位置；
- `startsWith`、`endsWith`和`includes`：返回字符串是否以子串开头、结尾或包含子串；
- `concat`：连接字符串；
- `fromCharCode`和`fromCodePoint`：从编码中构建字符串；
- `split`：以某字符串为分隔符分割字符串；
- `slice`、`substring`和`substr`：取出子字符串；
- `match`、`matchAll`、`replace`和`search`：使用正则表达式匹配；
- `toLowerCase`和`toUpperCase`：大小写转换；
- `normalize`：返回Unicode正规化的字符串；
- `repeat`：重复字符串；
- `trim`：删除前导和后继字符。

**模板字符串**是\`\`括起的字符串。模板字符串可以多行（保留回车符），也可以包含占位符，形如`${expression}`。

### 6.2 国际化

`Collator`、`NumberFormat`和`DateTimeFormat`的构造函数是`Intl`对象的属性，被用于国际化。

正则表达式的特殊字符如下：

- `\`：转义字符，注意：在字符串中还需要转义该字符；
- `^`：匹配开始，多行模式下匹配行首；
- `$`：匹配末尾，多行模式下匹配行末；
- `*`：出现0或多次，等价于`{0,}`；
- `+`：出现1或多次，等价于`{1,}`；
- `?`：出现0或1次，等价于`{0,1}`；
- `.`：匹配任意字符，默认情况下换行符除外；
- `(x)`：捕获组，可以用`\1`、`\2`等等来引用捕获组，在`replace`的第2个参数中，可以用`$&`、`$1`、`$2`等等来引用；
- `(?:x)`：不捕获的组；
- `x(?=y)`：匹配后面跟着`y`的`x`；
- `x(?!y)`：匹配后面不跟`y`的`x`；
- `(?<=y)x`：匹配前面有`y`的`x`；
- `(?<!y)x`：匹配前面没有`y`的`x`；
- `x|y`：匹配`x`或`y`；
- `{n}`：出现`n`次；
- `{n,}`：出现至少`n`次；
- `{n,m}`：出现`n`到`m`次；
- `[xyz]`：匹配`x`、`y`或`z`字符，特殊字符不用转义，只需要转义`-`、`^`、`]`和`\`；
- `[^xyz]`：匹配除`x`、`y`和`z`之外的字符；
- `\b`和`\B`：匹配单词边界和非单词边界，对于退格使用`[\b]`匹配；
- `\d`和`\D`：匹配数字和非数字；
- `\s`和`\S`：匹配空白符和非空白符；
- `\w`和`\W`：匹配英文数字和下线符或不匹配它们；
- `\cX`：匹配Ctrl—`X`；
- `\f`、`\n`、`\r`、`\t`、`\v`和`\0`：匹配换页、换行、回车、制表、垂直制表和空字符；
- `\xhh`、`\uhhhh`：8进制和16进制字符，必须是2位或4位十六进制字符；
- `\u{hhhh}`：只有设置了`u`才起效，匹配Unicode编码字符。

对于字符`*`、`/`、`\`等都需要用`\`转义。

有如下函数使用了正则表达式。

- `RegExp.prototype.exec`：执行一次搜索，返回匹配信息（包括`index`和`input`属性）；
- `RegExp.prototype.test`：测试是否匹配，返回Bool值；
- `String.prototype.match`：执行一次搜索，返回匹配信息，（对于设置了`g`的会搜索全部）；
- `String.prototype.matchAll`：执行搜索，返回捕获组的迭代器（Node.js是12开始支持）；
- `String.prototype.search`：执行搜索，返回出现的索引，找不到返回-1；
- `String.prototype.replace`：执行替换；
- `String.prototype.split`：切割字符串。

正则表达式对象包含`lastIndex`和`source`属性，`lastIndex`只在设置了`g`或`y`才启用，`source`是原始的正则表达式字符串。

有以下的设置选项：

- `g`：全局搜索；
- `i`：不区分大小写搜索；
- `m`：多行搜索；
- `s`：允许`.`匹配换行；
- `u`：见上，`Unicode`编码；
- `y`：sticky搜索（与`g`类似）。

### 6.3 正则表达式

可以使用`/xxxx/`或者`new RegExp('xxxx')`定义正则表达式。前者是在脚本加载时编译，后者是运行时编译。

## 7 容器

### 7.1 下标索引的容器

以下3种创建数组的方式等价，1) `new Array(element0, element1, ..., elementN)`，2) `Array(element0, element1, ..., elementN)`，3) `[element0, element1, ..., elementN]`。

创建空的定长数组也有3个方式，1) `new Array(arrayLength);`，2) `Array(arrayLength);`，3) `var arr = []; arr.length = arrayLength;`。

通过`array[index] = value`可以给数组赋值。如果`index`不是整数，则会创建一个属性。

注意：不建议使用`for...in`遍历数组，因为属性也会被迭代。

数组有如下方法：

- `concat`：合并多个数组并将结果返回；
- `join`：连接数组成字符串；
- `push`和`pop`：在数组末尾插入或删除元素；
- `shift`和`unshift`：在数组开始处删除和插入元素；
- `slice`：抽取一段数组并返回；
- `splice`：删除或替换一段数组并返回被删除的元素；
- `reverse`：翻转数组；
- `sort`：排序，可以接受一个比较函数；
- `indexOf`和`lastIndexOf`：查找元素所在位置；
- `map`、`filter`和`forEach`：遍历数组，映射、过滤或者访问元素；
- `every`和`some`：映射后，判断是否所有值都为真或者有值为真；
- `reduce`和`reduceRight`：汇总数据。

通过`Array.prototype.someFunc.call(xxx)`可以对类似数组的对象调用函数，如`NodeList`和`arguments`。

`ArrayBuffer`代表了一块没有类型的存储空间，即*缓冲区*。`xxxArray`是*视图*，对`ArrayBuffer`的包装，这里`xxx`可以是`Int8`、`Uint8`、`Uint8Clamped`、`Int16`、`Uint16`、`Int32`、`Uint32`、`Float32`、`Float64`、`BigInt64`和`BigUint64`。

### 7.2 键索引的容器

相等比较时，遵行下面的规则：

- 相等性比较类似`===`；
- `-0`与`+0`相等；
- `NaN`与自己相等（与`===`不同）。

#### 7.2.1 Map

`Map`对象存储键值对。可以用`for...of`遍历得到`[key, value]`，顺序是插入的顺序。有如下属性和方法：

- `set(key, value)`：设置键值对；
- `get(key)`：查询键对应的值；
- `has(key)`：测试键是否存在；
- `delete(key)`：删除键值对；
- `clear()`：清空Map；
- `size`：大小。

`WeakMap`的值只能是对象，对键的持有是weak的，也就是说如果没有其他引用，这些对象会被键值对回收。

#### 7.2.2 Set

`Set`存储值的集合，可以用`for...of`以插入顺序遍历元素。有如下属性和方法：

- `add(value)`：添加值；
- `has(value)`：测试值是否存在；
- `delete(value)`：删除值；
- `clear()`：清空集合；
- `size`：大小。

可以通过`Array.from(set)`或`[...set]`从集合中创建数组；通过`new Set(array)`从数组中创建集合。

`WeakSet`与`WeakMap`类似。

## 8 对象

### 8.1 属性

JavaScript对象是属性的集合，属性包含了键值对，值可能是个函数，这就成了方法。

可以对属性赋值，访问未赋值的属性会得到`undefined`。访问属性可以用`object.id`或`object[value]`，键不是合法标识符的属性只能通过方括号访问（包括空串）。键只能是字符串或`Symbol`类型，其他类型的键会被转化为字符串。

ES5开始，有3种遍历属性的方式：

- `for...in`：遍历所有的可枚举属性，包括原型链；
- `Object.keys(o)`：返回所有属于该对象（不包括原型链）的可枚举属性的键的数组；
- `Object.getOwnPropertyNames(o)`：返回所有属于该对象的键（包括不可枚举属性）的数组。

### 8.2 构造

创建对象有如下的方式：

- 使用**对象初始化器**：`{property1: value1, ... }`，这里`property1`等可以是标识符、数字或字符串。如果是语句开始，需要加括号以避免和复合语句混淆。同样的对象初始化器产生的对象是不等的。所有对象字面表达式产生的对象都是`Object`的实例；
- 使用**构造函数**：通过构造函数定义对象（构造函数首字母应当大写），再通过`new`创建实例。定义时，使用函数，其内部可以用`this`指代对象，通过对`this`的赋值即可创建属性；
- 使用`Object.create`：它接受一个对象参数，返回新的对象，新对象的原型是该对象参数。

### 8.3 继承

JavaScript是基于原型的面向对象语言。JavaScript的所有对象都至少继承自另一个对象。被继承的对象称为**原型**。继承的属性都是来自构造函数的`prototype`对象。`this`指代调用对象。通过如下面所示的代码定义继承：

```JavaScript
function Base() {
    this.a = ...;
    this.b = ...;
}

function Derived() {
    Base.call(this);
    this.c = ...;
}

Derived.prototype = Object.create(Base.prototype);
Derived.prototype.constructor = Derived;
```

其中的`Derived`函数也可以如下写，下面的`base`只是一个普通的名字：

```JavaScript
function Derived() {
    this.base = Base;
    this.base();
    this.c = ...;
}
```

当JavaScript遇到`new`操作符，它会创建一个对象，并将它的内部属性`[[Prototype]]`设置成构造函数的`prototype`属性，再将该对象作为`this`传递给构造函数。

当访问属性的时候，JavaScript先查看该对象是否有这个属性，有的话就采用，如果没有就查看`[[Prototype]]`属性的对象，如此继续下去。

如果给`constructor.prototype`添加属性，那么所有该构造函数的对象都会拥有这个属性。

### 8.4 getter和setter

对于对象字面量，可以通过如下方式构造getter和setter：

```JavaScript
var o = {
    get b() {
        return ...;
    }
    set c(x) {
        ...
    }
};
```

也可以通过如下方式创建getter和setter：

```JavaScript
Object.defineProperty(o, 'b', {
    get: function() { return ...; },
    set: function(y) { ... }
});
```

也可以通过`Object.defineProperties`定义，形式如下：

```JavaScript
Object.defineProperties(o, {
    'b': { get: function() { return ,,,; } },
    'c': { set: function(x) { ... } }
});
```

使用`delete`可以删除非继承属性。

只有当两个对象是同一个对象，才相等。

## 9 使用Pormise

![Promise状态转化图](https://mdn.mozillademos.org/files/15911/promises.png)

Promise用于异步函数回调，其构造函数接受一个函数，形如`(resolve, reject) => ...`，如果成功则调用resolve可以传递一个值；如果失败则调用reject也可以传递一个值。

Promise拥有如下方法：

- `then(onFulfilled, onRejected)`：调用指定的handler，返回一个新的promise用于形成链。如果`onFulfiled`不是函数，则以“Identity”替代；如果`onRejected`不是函数，则以“Thrower”替代。如果指定的handler
  - 返回一个值，则`then`返回的promise以该值resolve；
  - 不返回值，则`then`返回的promise以`undefined` resolve
  - 抛出异常，则`then`返回的promise以该异常reject；
  - 返回一个已经resolve的promise，则`then`返回的promise以该promise resolve的值resolve；
  - 返回一个已经reject的promise，则`then`返回的promise以该promise reject的值reject；
  - 返回一个pending的promise，则`then`返回的promise的resolve/reject将紧随handler返回的promise的resolve/reject。
- `catch(onRejected)`：等价于`then(null, onRejected)`。

ES2017加入了`async/await`语法糖，形如：

```JavaScript
async function foo() {
    try {
        const result = await doSomething();
        ...
    } catch (error) {
        ...
    }
}
```

`await`后面根一个promise，如果该promise resolve了，则返回resolve的值；如果reject了，则以异常抛出的形式抛出reject的值。`async`函数返回一个promise。

当promise被reject时，会有以下两个消息中的一个发往全局对象（window）或者Worker（process）：

- `rejectionhandled`：当一个promise reject，并被处理时发出；
- `unhandledrejection`：当一个promise reject，但没有handler时发出。

在这两种情况下，会有一个`PromiseRejectionEvent`对象作为参数，它有`promise`和`reason`两个属性。

注意：Node.js与上面描述的有些许不同。

此外还有如下4个函数：

- `Promise.resolve`和`Promise.reject`：创建一个已经resolve或已经reject的Promise；
- `Promise.all`和`Promise.race`：执行数组所有的promise或竞争。

即使是已经resolve的对象，传递给`then()`的函数也会异步调用（过一会调用）。

## 10 迭代器和生成器

### 10.1 迭代器

所谓迭代器，就是有`next()`方法，返回一个有两个属性的对象：

- `value`：序列中的下一个值，当`done`为`true`时可省略；
- `done`：最后一个值是否已经被获取（`true`时，迭代器位于past the end）。

可迭代对象是值实现了`Symbol.iterator`返回一个迭代器的对象。

`String`、`Array`、`TypedArray`、`Map`和`Set`都是可迭代对象。

### 10.2 生成器

生成器形如下面的代码，函数内可以yield多次：

```JavaScript
function* foo() {
    ...
    yield value;
    // or
    yield* iterable;
    ...
}
```

它会返回一个生成器，它是可迭代对象，每个生成器只能遍历一次。实际上生成器的`Symbol.iterator`方法返回了它自己。

`next()`方法还接受一个值，这个值通过`result = yield value`得到。调用`throw()`方法还可以在生成器中抛出异常。

## 11 元编程

### 11.1 Proxy

在ES6中，`Proxy`对象可以可以拦截某些操作，实现自定义行为。

使用方法为`var newObject = new Proxy(oldObject, handler);`，这里handler为一个对象，其方法就是trap（陷阱）。trap的行为必须遵守invariants。关于trap、它所拦截的对象和invariants见[Meta programming - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Meta_programming#Handlers_and_traps)。

使用`Proxy.revocable`可以创建一个可撤销的Proxy。它返回一个对象，其`proxy`属性是代理的对象，其`revoke()`方法可以撤销代理。

### 11.2 Reflection

Reflect主要是将对象的操作变成函数，并与Proxy对象的方法一一对应。包含如下的函数：

- `Reflect.has()`：检查是否有属性；
- `Reflect.apply()`：将`this`和参数列表应用到函数；
- `Reflect.defineProperty()`：与`Object.defineProperty()`不同，如果失败不抛出异常，而是返回`false`。

## 12 模块

**命名导出**：可以在定义变量、函数、类的时候用`export`导出，如`export const foo = 42;`。也可以在文件最后用花括号扩住、逗号分隔的列表导出，如`export { foo, bar }`。

使用`import { foo, bar } from 'path'`即可导入，其中`path`是相对或绝对（即相对于站点根目录）路径。

使用了模块导入导出的主模块，需要按照如下方式导入HTML：

```html
<script type="module" src="path"></script>
```

注意，模块和标准脚本是不同的，不添加`type="module"`会使`import`和`export`语句报错。此外还有如下不同：

- 在本地加载模块会遇到CORS错误，而标准脚本不会；
- 模块默认是strict模式；
- 默认为defer的；
- 从主模块导入的模块对外部是不可见的。

**默认导出**：通过`export default expression;`可以默认导出。再通过`import name from 'path';`或者`import {default as name} from 'path';`导入。

`export`和`import`都可以带别名，如`export { foo as bar };`和`import { bar as foo } from 'path';`。

还可以创建模块对象，形如`import * as Module from 'path';`。

还有聚合模块，用以将多个模块聚合在一起。有这样的语法：`export * from 'path';`和`export { name } from 'path';`。

使用`import()`函数可以动态加载模块，它返回Promise。
