---
title: Haskell学习笔记（未完待续）
date: 2019-02-26 16:45:29
categories: Haskell
tags: [Haskell, 编程, 函数式]
summary: 这篇文章是我Haskell的学习笔记，内容来自《Learn You a Haskell for Greate Good》中文版。
---

这篇文章是我Haskell的学习笔记，内容来自《Learn You a Haskell for Greate Good》中文版。

<!--more-->

## 1 各就各位，预备！
使用`ghci`打开REPL交互环境。可以输入表达式常看其结果。通过`:l module`可以载入模块。

支持的运算符有一元负号`-`（唯一的一元运算符），双目运算符有算术`+`、`-`、`*`、`/`（参数为Num类），关系`==`、不等于`/=`（参数为Eq类）等等。

如果表达式存在负数常量，最好用括号括起来（`5 * -3`会报错，`5 * (-3)`则不会）。

函数有**中缀函数**（运算符）和**前缀函数**。调用前缀函数的格式为`func arg1 arg2 ...`。函数应用拥有最高优先级。二元函数可以使用中缀函数的形式调用``arg1 `func` arg2``。

函数定义的格式为`func param1 param2 ... = expression`。函数定义没有顺序的概念。

有如下函数：
1. `succ`和`pred`：一元，获取后继和前趋，参数为Enum类；
2. `min`和`max`：二元，获取最小和最大值，参数为Ord类;
3. `div`和`mod`：二元，整数取整和求余，参数为Integral类。

if表达式形如`if boolExpr then expr1 else expr2`，else不可省略。

**列表**是单类型的数据结构。字符串是列表的语法糖。使用`list ++ list`可以连接列表，其复杂度正比于左边列表的长度。使用`elem:list`可插入元素到列表头部，`[1, 2, 3]`实际上是`1:2:3:[]`的语法糖。使用`list !! index`可以索引元素（`index`为Int类型）。列表可以嵌套，但类型必须一致。列表可以比较，采用字典序。

列表有以下函数：
1. `head list`：返回`list`的第一个元素；
2. `tail list`：返回`list`中除第一个元素的剩余部分（是一个列表）；
3. `init list`：返回`list`中除最后一个元素的剩余部分（是一个列表）；
4. `last list`：返回`list`的最后一个元素；
5. `length list`：返回`list`的长度（Int类型）；
6. `null list`：返回`list`是否为空；
7. `reverse list`：返回翻转的`list`；
8. `take num list`：返回`list`中的前`num`个元素（列表长度可小于`num`）；
9. `drop num list`：返回`list`删除前`num`个元素的结果（列表长度可小于`num`）；
10. `maximum list`和`minimum list`：返回最大最小值；
11. `sum list`和`product list`：返回加和和乘积；
12. `elem value list`：返回`value`是否在`list`中，通常以中缀函数调用。

可以使用`[elem1..elemN]`产生一个区间，其元素为Enum，如果需要更改步长，可以采用`[elem1,elem2..elemN]`。使用`[elem1..]`或`[elem1,elem2..]`可创建无穷列表，可以充分利用Haskell的惰性求值。注意浮点数可能有误差。

有以下的生成列表的函数：
1. `cycle list`：创建一个循环`list`的无穷列表；
2. `repeat elem`：创建一个循环`elem`的无穷列表；
3. `replicate count elem`：创建一个将`elem`循环`count`次的列表。

使用`[expr | bindOrPredict, ...]`可以创建列表推导式，其中`bindOrPredict`为形如`name <- list`的绑定或Bool表达式的谓词，`expr`和谓词都可以含有绑定创建的名字，可以有多个谓词和绑定，可以嵌套。

**元组**将多个不同类型的值合成为一个值。不同长度、不同元素类型的元组都是不同的类型。元组是固定大小的。不存在单元素的元组。

元组有以下函数：
1. `fst tuple`和`snd tuple`：`tuple`为二元组，分别返回第一个元素和第二个元素；
2. `zip list1 list2`：将两个列表交叉配对，返回元素为二元组的列表，较长的列表会被截断。

## 2 相信类型
在GHCi使用`:t expr`查看表达式的类型。列表的类型为`[type]`，元组的类型为`(type1, ... , typeN)`。可以给函数显示的类型声明，形如`func :: argType1 -> ... -> argTypeN -> retType`。函数类型中可以包含**类型变量**，这样的函数称为**多态函数**。

有如下基本类型：
1. `Int`：有界的与机器相关的整数；
2. `Integer`：无界的高精度整数；
3. `Float`：单精度浮点数；
4. `Double`：双精度浮点数；
5. `Bool`：布尔值；
6. `Char`：Unicode字符。

**类型类**定义接口。一个类型可以是类型类的实例。带类型类的函数签名形如`func :: (TypeClass1 typeVar1, ..., TypeClassN typeVarN) => argType -> ... -> retType`，其中`=>`左侧的东西称为**类型约束**。

有如下类型类：
1. Eq：定义了`==`和`/=`；
2. Ord：是Eq的子类型类，还定义了`<`、`>`、`<=`和`>=`，`compare`比较两个Ord类型类的值返回`Ordering`类型的结果，它有3个值`GT`、`LT`和`EQ`；
3. Show：定义了`show`（将参数转为字符串）；
4. Read：定义了`read`（将字符串参数转换为实例，一般需要配合**类型注解**，形如`expr :: Type`）；
5. Enum：定义了`pred`和`succ`，包含`()`、`Bool`、`Char`、`Ordering`、`Int`、`Integer`、`Float`和`Double`；
6. Bounded：定义了多态常量`minBound`和`maxBound`，如果元组的每个元素类型都属于Bounded的实例，那么该元组的类型也是Bounded实例；
7. Num：是Show和Eq的子类型类，定义了数值运算，包含`Int`、`Integer`、`Float`和`Double`；
8. Floating：包含了`Float`和`Double`；
9. Integral：包含了`Int`和`Integer`，可以通过`fromIntegral`将Integral类型类的实例转换为Num类型类的实例。

## 3 函数的语法
**模式匹配**可以检查数据是否匹配模式，并从模式中解析出数据。其形式类似额外的函数定义，只不过参数不再是单一变量。模式匹配自上而下，通常结尾包含**万能模式**。除了函数定义之外，列表推导式中的绑定也可以使用模式匹配。失败的模式匹配是个运行错误。有以下的几种匹配：
1. 常量：参数为常量，匹配常量；
2. 元组：参数为`(var1, ..., varN)`，匹配一个元组；
3. 列表：参数为`x1:...:xN:xs`，其中`xs`也可以为`[]`，匹配一个列表的前几个（或全部）元素。

此外还有特殊的模式，叫**as模式**，形如`var@pattern`，可以保留整体引用。

模式是检查参数结构是否匹配，**哨卫**检查参数的性质是否为真。其形式如下：
```haskell
func params
    | predict1 = expr1
    ...
    | predictN = exprN
    | otherwise = expr
```
如果所有哨卫都没通过，且没有otherwise作为万能条件，就转入下一个模式。

使用`where`绑定可以将定义置于函数的末尾，也可以跟在哨卫的后面。形如：
```haskell
func params = expression
    where var1 = expr1
          ...
          varN = exprN
```
其名字的作用域只对函数可见。`where`绑定中也可以使用模式匹配。

使用`let`表达式可以定义局部变量（或函数），不能与哨卫配合使用。形如`let bindings in expr`。也可以使用模式匹配。在列表推导式中，可省略`in`绑定局部变量。GHCi中`let`的`in`部分也可以省略，名字会在整个回话中存在。

使用`case`表达式可以对表达式进行模式匹配，形如：
```haskell
case expression of pattern1 -> result1
                   ...
                   patternN -> resultN
```

## 4 你好，递归
递归在Haskell中有广泛的应用。

`zip`函数接受两个列表，返回一个元素是二元元组的列表，较长的列表会从中间断开。

## 5 高阶函数
Haskell的所有函数都是**柯里函数**（只有一个参数）。函数签名中的`->`是右结合的。可以以部分参数调用某函数，得到一个**部分应用**。通过**截断**，可以对中缀函数进行部分应用。将一个参数放在中缀函数的一侧，即可截断中缀函数。用括号括住一个二元运算符即可得到二元函数。

有以下函数：
1. `zipWith func list1 list2`：接受一个二元函数和两个列表，返回一个列表，其元素是两个列表的元素作为`func`参数的结果；
2. `takeWhile func list`：`func`是谓词，返回满足`func`的`list`的最长前缀；
3. `flip func`：接受一个二元函数，返回一个二元函数，交换它的两个参数；
4. `map func list`：接受一个一元函数和一个列表，返回一个列表，其元素是`list`的元素作为`func`参数后的结果；
5. `filter func list`：接受一个谓词和一个列表，返回一个列表，其元素为`list`元素作为`func`参数结果为真的那些参数。

**lambda函数**形如`\param1 ... paramN -> expr`，可以创建一个临时的函数。

Haskell有**折叠**函数，将列表归约为单个值。左折叠无法处理无限列表，右折叠可以。有如下函数：
1. `foldl func init list`：左折叠，`func`为二元函数，第一个为累加值，第二个为`list`的元素；
2. `foldr func init list`：右折叠，`func`为二元函数，第一个为`list`的元素，第二个为累加值；
3. `foldl1 func list`和`foldr1 func list`：左折叠和右折叠，无初始值；
4. `scanl func init list`和`scanr func init list`：左扫描和右扫描，与折叠类似，不过值会被累积地记录在一个列表中；

函数应用符`$`的定义为`f $ x = f x`，右结合，具有低优先级，可以用来减少括号。

函数组合`.`的定义为`f . g = \x -> f (g x)`，右结合。

## 6 模块
**导入**模块的语法为`import module`。在GHCi中，可以通过`:m + module1 ... moduleN`。如果只导入一个模块的某几个函数，可以用`import module (func1, ..., funcN)`。如果导入一个模块除某些函数之外的函数，可以用`import module hiding (func1, ..., funcN)`。如果希望导入的东西都需要模块名前缀，即**限定导入**，可以用`import qualified module`，也可以设置别名`import qualified module as alias`。

`Data.List`模块里有以下函数：
1. `words str`：以空白符为分隔，将`str`切割成字符串列表；
2. `unwords strList`：以空格为分隔，合并字符串列表；
3. `group list`：返回列表的列表，将相邻的相同元素组合成一个列表；
4. `sort list`：给`list`排序
5. `inits list`和`tails list`：返回列表的列表，从左到右依次返回前缀的列表和后缀的列表；
6. ``list1 `predict` list2``，其中`predict`是`isPrefixOf`、`isInfixOf`和`isSuffixOf`：判断是否为前缀、中缀和后缀；
7. `foldl' func init list`和`foldl1' func list`：严格左折叠，不延迟计算；
8. `find predict list`：返回`Maybe`类型，表示是否在`list`中找到`predict`为真的元素。

`Data.Char`模块里有以下函数：
1. `ord char`：返回`char`的Unicode码；
2. `chr num`：返回`num`对应的Unicode字符；
3. `digitToInt char`：返回16进制字符`char`对应的数字；
4. `isDigit`：返回字符是否是十进制数字。

我们用`Maybe a`类型来表示一个可以为空或包含一个元素的类型。如果为空，就用`Nothing`，如果不为空就用`Just value`。

`Data.Map`模块提供了映射的数据结构`Map k a`，一般使用限定引入。它提供了以下函数：
1. `fromList list`：`list`是关联列表（其元素是键值对元组），构建映射（重复键中的旧键会被忽略）；
2. `lookup key map`：在映射中查找键，返回`Maybe`包装的值；
3. `insert key value map`：向映射插入键值对；
4. `size map`：返回映射的大小；
5. `fromListWith func list`：`func`接受两个值，返回一个值，`list`是关联列表，构建映射，如果有重复的键，调用`func`。

通过以下方式导出模块中的函数：
```haskell
module name
( func1
, func2
...
, funcN
) where
```

其中`name`也可以是`path.name`，`name`必须与文件名对应，`path`是`.`分隔的路径，必须与文件夹名称对应。

## 7 构造我们自己的类型和类型类
使用`data Type = DataCtor1 Params1 | ... | DataCtorN ParamsN`定义自定义类型。其中`DataCtor1`到`DataCtorN`是**值构造器**，可以有任意参数（包括无参数），它与普通函数没有差别。`Params1`到`ParamsN`是空格分隔的类型列表，表示值构造器的参数的类型。

可以使用`DataCtor arg1 ... argN`进行模式匹配。

在导出类型时，使用`Type(DataCtor1, ..., DataCtorN)`导出某几个值构造器，使用`Type(..)`导出所有值构造器，也可以不带括号，不导出值构造器。

使用**记录语法**可以方便地处理多字段的情况，格式如下：
```haskell
data Type = DataCtor { field1 :: Type1
                     , ...
                     , fieldN :: TypeN }
```

这会自动生成提取字段的函数，如`field1`、`fieldN`。可以这样构建值，`DataCtor {field1=value1, ..., fieldN=valueN}`，这也可以作为模式匹配。

自定义类型也可以带有类型参数，形如`data Type a b ...`，这里`Type`不是类型，而是**类型构造器**。填满类型构造器的所有参数就可以得到类型。可以在声明中添加类型约束，形如`data (TypeClass1 typeArg1, ...) => Type a b ... = ...`，但请永远不要那么做。

注意：如果一个类型没有参数，或参数填满，则称这个类是**具体的**。凡是值的类型都是具体的。

值构造器和类型构造器可以同名，但可以根据上下文区分，请勿搞混。

在自定义类型后面添加`deriving (TypeClass1, ..., TypeClassN)`，可以将该类型作为类型类的实例。诸如Eq（先检查值构造器是否一致，再检查字段是否一致）、Show、Read、Ord（先比较值构造器，越靠前越小，再比较字段）、Enum、Bounded类型类都可以。

通过`type NewType = SomeType`可以创建类型别名，也可以带有类型参数，形如`type NewType a b = ...`。类型别名也可以$\eta$归约。

除了`Maybe`外，`Either`也经常用于错误处理，形式如下，错误使用`Left`，正确使用`Right`。

```haskell
data Either a b = Left a | Right b deriving (Eq, Ord, Read, Show)
```

还可以创建递归数据结构，这被用于构建列表和树。

通过下面所示的语法创建类型类，函数可以没有实现。许多类型类的函数互相调用，从而有最小的实现方式。

```haskell
class TypeClassName typeParam where
    funcName :: funcType
    funcName params = ...
    ...
```

实现类型类的语法如下所示。

```haskell
instance TypeClassName TypeName where
    funcName params = ...
```

也可以将一个类型类实现为另一个类型类的子类，这时语法形如`class (TypeClass type) => SubTypeClass type where ...`。类型类实例的类型也可以带参数，以Eq Maybe举例，形如`instance (Eq m) => Eq (Maybe m) where`。

通过GHCi中输入`:info TypeClass`或`:info Type`（或类型构造器）可以查看实现的类型类。、

`Functor`类型类定义如下：

```haskell
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```

fmap函数取一个函数和封装的数据，将函数应用到被封装的数据，返回结果。数组、Maybe、树、Either a都是函子。

类型有kind，类似于值有类型，可以再GHCi输入`:k Type`查看。

## 8 输入与输出

像诸如putStrLn返回的类型是`IO ()`，其中`()`是空元组。可以通过`do`将多个I/O操作合并成为一个操作，以`putStrLn`和`getLine`为例，如下：

```haskell
main = do
    putStrLn "Hello, what's your name?"
    name <- getLine
    ...
```

第3行的操作叫绑定名字，它从容器中取出值，绑定到指定的名字。不能为最后一个操作绑定名字。与列表推导式类似，可以在`do`语句块中使用`let`。`return`取一个值作为参数，并将它包装到容器中。因此`return ()`的类型就是`IO ()`。`return`不会中断`do`代码块的执行。可以通过`name <- return value`来绑定名字，当然使用`let`更好。

有如下几个实用的I/O函数：

- `putStrLn`：打印字符串并换行；
- `putStr`：打印字符串不换行；
- `putChar`：打印字符不换行，可以借此递归实现出`putStr`；
- `print`：等价于`putStrLn . show`；
- `when`：定义于`Control.Monad`，取一个布尔值和一个I/O操作，如果布尔值为真则返回I/O操作，否则返回`return ()`;
- `sequence`：接受一个I/O操作的列表，返回一个I/O操作，其内容是所有参数I/O操作执行后结果组成的列表；
- `mapM`：接受一个返回I/O操作的函数，和一个列表，将函数应用到列表的每一个元素上，再调用`sequence`，如果不关心返回值，可以调用`mapM_`；
- `forever`：接受一个I/O操作，返回一个永远重复执行该I/O操作的I/O操作；
- `forM`：与`mapM`相似，但参数顺序相反。

## 9 更多的输入输出操作

使用`getContents`读入所有字符直到遇到EOF，它是惰性的。`interact`接受一个字符串到字符串的函数，返回一个I/O操作，读入，应用函数并输出。

（未完待续）
