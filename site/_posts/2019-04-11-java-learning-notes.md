---
title: Java学习笔记
date: 2019-04-11 22:08:45
tags: [Java, 编程]
summary: 该学习笔记着重于Java相较于C++等编程语言的独特之处。内容主要来自The Java™ Tutorials和JAVA8 官网笔记教程。
---

该学习笔记着重于Java相较于C++等编程语言的独特之处。内容主要来自 *[The Java™ Tutorials](https://docs.oracle.com/javase/tutorial/java/TOC.html)* 和 *[JAVA8 官网笔记教程](https://zq99299.github.io/java-tutorial/)* 。

<!--more-->

## 1 语言基础
### 1.1 变量

**变量**分为以下4种类型，其中前2种合称为**字段**：

- **实例变量**（非静态字段）
- **类变量**（静态字段）
- **局部变量**
- **参数**，包括构造器和异常处理器

一个类型的字段、方法和嵌套类型统称为**成员**。合法的**标识符**由大小写敏感的字母、数字、\$和\_组成，其中数字不能作为第一个字符，不建议使用$。不建议以\_开头。标识符不能与**关键字**相同。

**建议：**对于变量一般采用**驼峰命名法**，即首字母小写后续单词首字母大写；对于常量一般全部大写，\_分隔各个单词。

#### 1.1.1 基本数据类型

共有8种基本类型`byte`（1字节）、`short`（2字节）、`int`（4字节）、`long`（8字节）、`float`（4字节）、`double`（8字节）、`boolean`和`char`（**2字节**）。`int`和`long`的包装器`Integer`和`Long`提供了诸如`compareUnsigned`和`divideUnsigned`之类的无符号操作。`java.math.BigDecimal`提供了精确的实数。基本数据类型不存在无符号类型，除了`boolean`之外的基础数据类型大小固定。此外，双引号括住的字符串默认是`java.lang.String`类，它是不可变的。

##### 默认值

未被初始化的字段会被初始化为`0`（基本数据类型）或者`null`（对象）。局部变量不会自动初始化，访问未被初始化的局部变量将导致编译错误。不建议依赖自动初始化。

##### 字面常量

字面常量代表一个固定值，可以直接向基本类型的变量赋值（无需`new`）。

##### 整型字面常量

若后缀为L或者l，则其类型为`long`，否则为`int`。建议使用大写`L`，避免和数字`1`搞混。可用`int`类型的字面常量初始化`byte`、`short`、`int`和`long`。`long`类型的字面常量只可初始化`long`。默认为10进制。`0X`或者`0x`前缀表示16进制；`0B`或者`0b`表示2进制；`0`开头的表示8进制。

**注意：** 大小超过`int`类型的字面常量却未指明是`long`类型是一个编译错误。

##### 浮点型常量

若后缀为F或者f，则其类型为`float`；若不存在后缀或后缀为D或者d，则其类型为`double`。

##### 字符和字符串常量

`char`和`String`类型可以存储任何Unicode(UTF-16)的字符。可直接在源代码中使用这些字符，也可以`\uXXXX`（XXXX为4位16进制数字）转义。使用单引号代表字符；使用双引号代表字符串。

此外还有**转义序列**，如`\b`（退格符）、`\t`（水平制表符）、`\n`（换行符）、`\f`（换页符）、`\r`（回车符）、`\"`（双引号）、`\'`（单引号）、`\\`（反斜杠符）。

**`null`字面常量**可赋值给任何非基本数据类型变量。`<typename>.class`用于得到类型本身（其类型为`Class`），这被称作**类字面常量**（*class literal*）。

##### 在数字字面常量中使用下线符

可以使用\_分割数字（包括整型和浮点型常量），增加代码可读性，只允许在两个数字之间插入一个或多个\_。

#### 1.1.2 数组

Java的数组定长。里面的每一项目称为**元素**，通过**下标**索引（从0开始）。通过`<type>[] <identifier>;`定义一个可以引用数组的变量（数组大小不是类型的一部分）。通过`new <type>[<length>]`来创建数组（内容会被0初始化）。可以用`{ <value1>, ... }`初始化；可使用`new <type>[] { <value1>, ... }`赋值，其中最后一个`,`可选。支持多维数组及其初始化，其低维数组长度可不一样。`<array>.length`可用来得到数组长度。

**注意**：将`[]`至于标识符后面也是可行的，但并不推荐。需要注意两者在遇到多变量定义时的差别，前者对所有变量都将产生数组的修饰作用，后者只对其所属的那一个变量产生作用。

采用`java.lang.System`的以下函数复制数组：

```java
public static void arraycopy(Object src, int srcPos,
                             Object dest, int destPos, int length)
```

此外`java.util.Arrays`提供了很多数组的工具，诸如`copyOfRange`（返回新数组）、`binarySearch`、`equals`、`fill`、`sort`和`parallelSort`（并发排序）。

### 1.2 运算符

**运算符优先级**为后缀、单目、算术、移位、关系、按位、逻辑、条件、赋值；除赋值运算符外，结合性自左至右；赋值运算符结合性自右至左。这些和C/C++一致。

`+`和`+=`用于连接字符串。`==`运算符判断是否值相等（基本类型）或者是否为同一对象（包括`String`）；`equals()`方法判断对象（非数组）内容是否一样（`equals()`的默认行为等价于==运算符）。`instanceof`运算符只能用于判断是否是类和数组（元素是类）的实例，它与关系运算符（偏序而非等价）具有同一优先级。`null`不是任一类型的实例。`boolean`类型只可参与逻辑和双目按位运算。数学类型（包括`char`类型）不可参与逻辑运算，不可强制转型为`boolean`类型，其中浮点数类型不可参与位运算。`boolean`类型和数字类型不可互相转化。选择和循环语句的条件判断必须是`boolean`类型。逻辑运算符遵循短路原则。`>>`运算符采用算术移位；`>>>`运算符采用逻辑移位。窄化转换必须采用显示的类型转换。混合类型运算会自动进行类型提升，算术等运算中的`byte`、`short`和`char`类型会被直接提升至int类型。Java没有`sizeof`运算符。逗号运算符只能用于`for`循环的初始化和步进表达式处，可在初始化表达式中定义多个同一类型的对象。默认整型常量为`int`类型；默认浮点型常量为`double`类型。对象的赋值运算符仅复制对象引用。

### 1.3 表达式、语句和块

语句分为两类**声明语句**和**流程控制语句**。

只有以下4种表达式能作为**表达式语句**：
- 赋值表达式；
- 自增和自减；
- 方法调用；
- 对象创建表达式。

### 1.4 流程控制语句

`switch`语句可以测试整型及其包装类，枚举类型或者`String`对象（SE 7）。对于`String`对象会调用`String.equals`判断是否相等。如果`switch`语句中的测试表达式为`null`，会抛出`NullPointerException`，应当避免这种情况的发生。

增加了foreach的语法，可用于任何可迭代对象。标签可置于迭代语句前，从而使带标签的`break <label>;`和`continue <label>;`语句跳转至制定的循环层次。

## 2 类和对象

### 2.1 类

#### 2.1.1 声明类

类大致按照如下声明：

```java
<accessModifier> class <name> extends <superClass> implements <interface1>, ...
{
    // body
}
```

其中`<accessModifier>`为`public`，`private`等等，可以省略。`extends <superClass>`和`implements <interface1>, ...`也可以省略。

#### 2.1.2 声明成员变量（字段）

字段声明形如`<accessModifier> <type> <name>;`，其中`<accessModifier>`可以是`public`，`private`等等，也可以省略。

#### 2.1.3 声明方法

方法声明如下：

```java
<accessModifier> <returnType> <name>(<paramType> <paramName>, ... ) {
    // body
}
```

一般而言，方法应当是个动词后面可跟名词或形容词，采用驼峰命名。方法可被**重载**，根据**方法签名**（形参列表）区分。**注意：** 返回值不属于方法签名。

#### 2.1.4 为你的类提供构造函数

类通过与之重名的构造器进行初始化，与方法一样也可重载，它没有返回值，除此之外声明和方法一样。当类没有其他构造器的时候会有一个默认的无参构造器，如果它有父类，则会调用父类的无参构造函数。如果一个类没有父类，那它隐式地含有父类Object。如果父类没有无参构造函数，子类没有构造函数会造成编译错误。如果一个类没有访问某个类构造函数的权限，那它不能创造该类的对象。

#### 2.1.5 传递信息给方法或构造函数

如果你想要将一个方法传递给另一个方法，请使用**lambda表达式**或**方法引用**。

通过函数的最后一个参数采用`<type>... <identifier>`的形式，可以实现可变参数列表，其中`identifier`是`type`类型的数组，对于基本类型会自动包装，也可传递与之对应的数组。

参数名字在其作用域内必须是唯一的，它会覆盖同名的字段，良好的风格应避免这种事发生。

基本类型的传参使用按值。引用数据类型参数也是传值调用，但它的内容可能发生变化。

### 2.2 对象

#### 2.2.1 创建对象

通过`new <className>(<arg>, ...)`创建对象。使用`<type> <name>;`可以声明一个指向对象的变量。

#### 2.2.2 使用对象

对于类内的方法，可直接使用名字访问字段；对于类外的方法，可采用`<objectReference>.<fieldName>`访问字段。调用方法也与之类似。不再使用的对象会被**垃圾回收**。`

### 2.3 更多关于对象

#### 2.3.1 从方法内返回值

使用`return <value>;`返回值，对于返回值为void的方法，则return语句不包含`<value>`。return的类型必须与方法的返回值类型一致，或是返回值类型的子类，否则是编译错误。子类方法的返回值可以是父类被覆盖方法返回值的子类，这称之为**协变返回类型**。

#### 2.3.2 使用this关键字

在方法或构造函数内，this指向当前对象。通过`this()`在构造器内的第一行处调用其他构造器。

#### 2.3.3 类成员的访问权限控制

**访问权限**从大到小依次为`public`、`protected`、包访问权限和`private`。有两层访问权限控制：

- 顶层：public或包访问权限。
- 成员层：public、private、protected或包访问权限。

下面的表展示了访问权限：


| Modifier      | Class | Package | Subclass | World |
|:--------------|:------|:--------|:---------|:------|
| public        |Y      | Y       | Y        | Y     |
| protected     |Y      | Y       | Y        | N     |
| *no modifier* |Y      | Y       | N        | N     |
| private       |Y      | N       | N        | N     |

#### 2.3.4 理解类成员

这里讨论的是静态字段和方法。使用`static`修饰字段或方法可令其称为静态字段或方法。可以通过类名（以及实例）访问。和`final`（表示不可变）结合，可以用于定义常量。

#### 2.3.5 初始化字段

可通过包含前向引用的表达式初始化字段。初始化顺序按照定义顺序。可在构造器内进行赋值。可通过类内的`static { <statements> }`静态初始化块初始化静态成员。非静态字段可通过类内的`{ <statements> }`初始化块初始化。一个类可以拥有多个初始化块，按照其出现的先后次序依次执行。类的静态成员在类被第一次使用时初始化。使用final方法的返回值可以被用于初始化字段，调用非final方法进行初始化可能会造成问题。

Java中类的字段、`static`方法和`final`方法施行前期绑定，其余都施行后期绑定。初始化的顺序为:

1. 将整个对象初始化为全`0`（对于对象引用则会拥有`null`）；
2. 递归初始化父类；
3. 依次按照初始化语句（定义先后顺序），初始化块和构造器初始化对象。

**注意：** 如果在父类构造器内部调用子类方法，这时子类获得的是一个半初始化的对象。因此应当避免在类的构造器内调用可被后期绑定的方法。

### 2.4 嵌套类

Java可在类内定义另一个类，这样的类称为**嵌套类**。有两类嵌套类：

- 静态的：**静态嵌套类**
- 非静态的：**内部类**

嵌套类的权限可以是private、public、protected或包访问权限。

有两种特殊的内部类：

- 局部类
- 匿名类

内部作用域会屏蔽同名的外部作用域名字。

**注意：** 对内部类（包括局部类和匿名类）的序列化是强烈不建议的。

#### 2.4.1 内部类

内部类可访问外部类的所有字段。外部类的非静态方法可以直接用内部类的名称访问内部类，除此之外，访问内部类需要使用`<outer>.<inner>`。除了编译期常量表达式初始化的`static final`字段，内部类不允许有`static`成员（包括接口）。

**注意：内部类的实例化必须与外部类对象相关联。** 这也就是说，内部类可以通过内部类的方法、外部类的非静态方法以及`.new`的语法实例化。

在内部类方法内使用`<OuterClass>.this`访问外部对象。在外部类静态方法或外部类外，使用`<outerObject>.new <InnerClass>`通过外部类对象引用创建内部对象。如果继承自内部类，必须在子类构造器内使用`<enclosingClassReference>.super()`。如果继承自外部类，内部类的名称是前期绑定，所以不存在内部类的多态。

#### 2.4.2 静态嵌套类

静态嵌套类通过`<OuterClass>.<StaticNestedClass>`访问，不可直接访问外部类的非静态字段。静态嵌套类的行为同顶级类的行为一样。静态嵌套类可嵌套于接口中。

#### 2.4.3 局部类

定义在方法或者块内的类称为**局部类**。局部类没有访问权限修饰，其作用域与局部变量一致。除了编译期常量表达式初始化的`static final`字段，局部类不允许有`static`成员。局部类可以访问方法内部的`final`或等价于`final`（不存在对变量的赋值）的局部变量和参数。定义在非静态方法内部的局部类可以访问外部类的所有成员，定义在静态方法内部的局部类只可以访问外部类的静态成员。

interface默认是static的。因而不存在局部接口。

#### 2.4.4 匿名类

通过`new <BaseClassOrInterfaceName>(<arguments>, ...) { <ClassDefinition> }`。匿名类在访问权限、成员限制等方面与局部类基本一致，此外匿名类无法定义构造函数。


#### 2.4.5 lambda 表达式

当一个接口只存在一个抽象方法的时候，可以用lambda表达式实现该接口。语法为`(<parameters>, ...) -> <expression>`或者为`(<patameters>, ...) -> { <statements> }`，可以省略形参的类型，此外，若只有一个形参，可省略括号。和局部类及匿名类一样lambda表达式可以捕获同样的变量及参数。lambda表达式不产生新一层的作用域，因而在lambda表达式中覆盖外层变量是个编译错误。Java通过上下文判断lambda表达式的目标类型，包括：

- 变量声明
- 复制
- 返回语句
- 数组初始化
- 方法或构造器实参（重载判断和实参类型推断）
- lambda表达式的函数体
- 条件表达式
- 转型表达式

同样不建议对lambda表达式进行序列化。`java.util.function`提供了一些函数式编程的设施。可以使用聚合操作结合函数式编程处理流中的元素。

##### 方法引用

当lambda表达式仅仅是调用函数时，可采用**方法引用**。共有4类方法引用，包括：

- 静态方法的引用：`<ContainingClass>::<staticMethodName>`
- 某一对象方法的引用：`<containingObject>::<instanceMethodName>`
- 某一类型任意对象同一方法的引用：`<ContainingType>::<methodName>`
- 构造器的引用：`<ClassName>::new`

### 2.5 枚举类型

通过`enum <TypeName> { <CONSTANTS>, ... }`创建枚举类型，其中最后一个`,`可选，通过`<TypeName>.<CONSTANTS>`访问常量。通过`enum <TypeName> { <CONSTANT> (<constructArguments>, ...), ... ; private final <fields>; ... ; <ConstructorAndMethods> }`为`enum`定制字段和方法。枚举可嵌套在接口中。枚举类型隐式地是从继承自`java.lang.Enum`的，拥有`values()`（`static`）、`toString()`和`ordinal()`等方法。`enum`类型的`switch`语句`case`字句必须为其该`enum`类型的常量。

## 3 注解

**注解**是一种元数据，对程序的执行不产生直接的影响。

### 3.1 基础语法

基本的形式为`@Annotation(name = value, … )`，其中内部的键值对称为**元素**，可分为有名的和无名的。对于只有一个键值对的注解可省略为`@Annotation(value)`，对于没有键值对的注解，可省略括号。注解可应用注解可应用于字段、方法和类。Java SE 8中，注解还可应用与类型的使用处，这被称为**类型注解**，如：

- `new`表达式
- 类型转换
- `implements`子句
- 异常声明

### 3.2 声明注解类型

通过`@interface <AnnotationName> { <Type> <name>() default <value>; … }`声明注解类型，其中`default <value>`可省略，支持数组。可通过`@Documented`使定义的注解类型出现在Javadoc生成的文档里。注解的访问权限可为`public`或包访问权限。

### 3.3 预定义注解

在`java.lang`预定义了以下注解：`@Deprecated`、`@Override`和`@SuppressWarnings`。**`@Deprecated`** 表明所标识的元素不被建议使用，当使用这个元素时，编译器会产生一个警告。建议在这类元素的注释中添加`@deprecated`标签，注明不被建议的原因。**`@Override`** 提示编译器某个元素需要覆盖其父类的元素。若没有覆盖，编译器将产生一个错误。**`@SuppressWarnings(value = <StrWarning>)`** 指示编译器抑制某个警告。在Java中，警告分成两类`deprecation`和`unchecked`。可通过`@SuppressWarnings({“unchecked”, “deprecation”})`同时指定多种错误。**`@SafeVarargs`** 应用于方法或者构造器，用于抑制潜在对`varargs`不安全操作的警告。**`@FunctionalInterface`** 提示编译器某个类型声明被期望是个函数式接口。

那些应用于其他注解的注解称为**元注解**。java.lang.annotation定义了一些元注解。**`@Retention(value = EnumValue)`** 指定被标注的注解如何存储：

- `RetentionPolicy.SOURCE`：只留存在源代码内，被编译器忽略；
- `RetentionPolicy.CLASS`（默认）：只保留到中间代码内，被JVM忽略；
- `RetentionPolicy.RUNTIME`：保留到JVM中，可被运行环境使用。

**`@Documented`** 当元素使用这个标签时，会被Javadoc记录进文档。**`@Target(value = EnumValue)`** 指示该标签可被应用的元素：

- `ElementType.ANNOTATION_TYPE`：应用于其他注解类型；
- `ElementType.CONSTRUCTOR`：应用于其他构造器；
- `ElementType.FIELD`：应用于字段或者属性；
- `ElementType.LOCAL_VARIABLE`：应用于局部变量；
- `ElementType.METHOD`：应用于方法；
- `ElementType.PACKAGE`：应用于包声明；
- `ElementType.PARAMETER`：应用于方法的参数；
- `ElementType.TYPE`：应用于一个类的任一元素。

**`@Inherited`** 指示该注解会被子类继承，默认是不会继承的。只对应用于类声明的注解有效。**`@Repeatable(value = ContainerAnnotationClass)`** 指示该注解可重复多次。

### 3.4 可重复注解

可重复注解会被保存在一个**容器注解**内。注解容器内部必须有一个数组类型的`value`元素。

## 4 接口和继承

### 4.1 接口

接口与类类似都是引用类型。接口只能包含常量、抽象方法签名、默认方法、静态方法和嵌套类型。只有默认方法和静态方法有函数体。接口无法被实例化。

接口定义如下：

```java
<accessModifier> interface <name> extends <Interface> ... {
    // body
}
```

接口体内部的抽象方法没有函数体，默认方法由`default`修饰，静态方法由`static`修饰。其方法隐式地为`public`的，其字段隐式地为`public static final`的。

对于类，使用`implements`关键字可以实现接口。

向接口添加默认方法和静态方法，接口的使用者无须重新编译。

可以在类中嵌套接口，此时该接口的访问权限可以为`public`、`protected`、包访问权限和`private`，接口为隐式地静态成员。也可以在接口中嵌套接口，此时其访问权限隐式地为`public`的。不可以在方法以及块中嵌套接口。

### 4.2 继承

通过`extends`继承。除了Object类外，所有的类都有父类，如未显式指明，其父类即为Object。

子类继承了父类的public和protected成员，如果位于同一个包，它还会继承包权限的成员。可以使用、替换、遮蔽它们。

子类向父类的转型可以是**隐式转型**，而父类向子类的转型必须是**显式转型**。可以使用`instanceof`运算符避免显示转型的运行时错误。

Java对所有转型都会进行检查，包括**向下转型**（RTTI）。若无法向下转型，抛出`ClassCastException`异常。

Java中，最多只能继承自一个类，但可实现多个接口。

#### 4.2.1 覆盖和遮蔽方法

可以在子类中重载或覆盖父类方法，`@Override`注解确保是覆盖父类方法。被覆盖的方法返回值可是子类方法返回值的派生类型。其访问权限可扩大，不可缩小。

|            | 父类实例方法 | 父类静态方法 |
|:----------:|:-----------|:-----------|
| 子类实例方法 | 覆盖        | 编译错误    |
| 子类静态方法 | 编译错误    | 遮蔽        |

- **类的`extends`与`implements`冲突：** 实例方法比接口默认方法更为优先；
- **类的多个`implements`冲突：** 被覆盖的接口默认方法被忽略（菱形继承）；其余情况即多个default方法冲突，或default方法与abstract方法冲突时，编译器报错。

#### 4.2.2 使用关键字super

可使用`super`访问父类的成员。可通过`super()`在构造器内的第一行处调用父类构造器，若无则自动调用父类的无参构造器。

#### 4.2.3 将Object类作为父类

所有的类在无特殊指明时，都从`Object`类继承。以下是这个类的一些方法：

- `protected Object clone() throws CloneNotSupportedException`
  创建并返回对象的拷贝。
- `public boolean equals(Object obj)`
  判断对象是否与另一个相等。
- `protected void finalize() throws Throwable`
  回收前被垃圾回收器调用。**不建议在其中释放资源。**
- `public final Class getClass()`
  返回对象运行时的类。
- `public int hashCode()`
  返回一个对象的散列值。
- `public String toString()`
  返回一个代表对象的字符串。

`Object`的`clone()`方法在对象未实现`Cloneable`接口时会抛出`CloneNotSupportedException`异常；如果实现了，默认的`clone()`方法会创建一个与原对象拥有相同值的新对象，包括相同的对象引用。因此，对于含有对象引用的对象应当覆盖默认的`clone()`方法。


`getClass()`方法返回一个`Class`对象，拥有`getSimpleName()`、`getSuperclass()`、`getInterfaces()`、`isAnnotation()`、`isInterface()`、`isEnum()`、`getFields()`、`getMethods()`等方法。

如果两个对象相等，那它们的散列值必须相同。

### 4.3 final类和方法
`final`变量初始化后不可改变其值，（对于对象的引用，引用不可改变，但对象可以改变）。`final`参数由函数传参初始化，类的`final`字段可在初始化快内或构造器内初始化。未初始化的`final`变量是个编译错误。

**注意**：对于编译时已知的常量（编译期常量表达式初始化的`static final`字段），编译器会在原处展开其值。**若该常量定义处发生变更，需要对使用此常量的所有源文件重新进行编译。**

`final`方法不可覆盖。所有的`private`方法都隐式地是`final`方法。对于父类和子类中签名相同的`private`方法，两者独立不构成覆盖。`final`类不可继承。其所有的方法都隐式地是`final`方法。

**注意：** 构造函数调用的方法应该都是final的，否则子类覆盖方法会产生意想不到的结果。

### 4.4 抽象方法和类

通过`abstract`声明一个**抽象方法**，含有**抽象方法**的类称为**抽象类**，抽象类必须被显示也声明为`abstract`的。通过`abstract`声明一个抽象类，可避免此类被实例化。

## 5 数字与字符串

### 5.1 数字

标准库提供了**包装器**类，当需要对象却只有基本类型的时候，会自动**打包**，同样，当需要基本类型却只有对象的时候，会自动**解包**。

所有的数字类型继承自`Number`，包括`Byte`、`Integer`、`Double`、`Short`、`Float`、`Long`以及用于高精度的`BigDecimal和BigInteger`和用于多线程操作的`AtomicInteger`和`AtomicLong`。以下是`Number`类具有的方法：

- `byte byteValue()` `short shortValue()` `int intValue()` `long longValue()` `float floatValue()` `double doubleValue()`将`Number`对象转型成基本数据类型。
- `int compareTo(Byte anotherByte)` `int compareTo(Double anotherDouble)` `int compareTo(Float anotherFloat)` `int compareTo(Integer anotherInteger)` `int compareTo(Long anotherLong)` `int compareTo(Short anotherShort)`将`Number`对象与实参比较大小。
- `boolean equals(Object obj)`判断两个对象是否相同。

以`Integer`类为例，每一个`Number`子类还包含以下的几个方法：

- `static Integer decode(String s)`解析整数，可接受10进制、8进制和16进制。
- `static int parseInt(String s)` `static int parseInt(String s, int radix)`返回整数，radix可接受10进制、2进制、8进制和16进制。
- `String toString()` `static String toString(int i)`返回对象对应的`String`对象。
- `static Integer valueOf(int i)` `static Integer valueOf(String s)` `static Integer valueOf(String s, int radix)`返回对象对应的`Integer`对象。

可通过`System.out.printf`或`String.format`格式化输出字串，与C语言中的使用方法基本相同。以下是不同之处：

- **`%n`**：与平台相关的换行符。不建议使用`\\n`。
- **时间格式化符号**：对于`Calendar`对象，有以下格式化符号：
  - **`tB`**：区域特定化的月份全名；
  - **`td`**：2位数的日期，必要时带前导0；
  - **`te`**：2位数的日期，不带前导0；
  - **`ty`**：2位数的年份；
  - **`tY`**：4位数的年份；
  - **`tl`**：12小时制的小时；
  - **`tM`**：2位数的分钟，必要时带前导0；
  - **`tp`**：区域特定化的上下午；
  - **`tM`**：2位数的月份，必要时带前导0；
  - **`tD`**：%tm/%td/%ty。
- **`,`**：区域特定化的数字分割符。

可通过`java.text.DecimalFormat`类格式化数字。`java.lang.Math`则提供了更多数学相关的常数和方法。

### 5.2 字符和字符串

`Character`类和`String`类是不可改变的。`java.lang.Character`提供了字符处理的一些方法。转义字符与C语言相同。`java.lang.String`提供了字符处理的一些方法，其中`format()`和输出有相同的使用方法。`StringBuilder`是一种可以修改的字符串。

## 6 泛型

泛型使得类型可以作为类、接口、方法的参数。使用泛型可以有以下好处：更强的类型检查、消除转型等等。

### 6.1 泛型类型

**泛型类型**是指泛型的类或接口。（这里不再用尖括号代表可变动项）通过“`class name<T, … > {}`”和“`interface name<T, … > {}`”定义泛型类和泛型接口。其中`T`称为**类型变量**，不可为基本类型变量。通过 “`name<t, ...>`”调用泛型类和接口。当可从上下文推断类型时，可以只留一对空尖括号，这被称为**钻石**。

原始类型是泛型类或接口不带类型参数。这和它的参数类型是Object等价。不建议使用原始类型。

### 6.2 泛型方法

在函数返回值类型前面添加`<T, ...>`可以创建泛型方法。可以使用**类型推断**，省略函数的尖括号。类型推断会根据函数的实参、返回值推断一个最具体的类型。

### 6.3 受限类型参数

可以限定类型变量必须是某些类型的子类，这被称为**受限类型参数**，格式为`<T extends S1 & S2 ... >`，这里`extends`也被用于接口。

### 6.4 通配符

使用通配符可以限定泛型的类型。

- `name<? extends T>`：上限通配符（T也可以是接口），输入变量通常使用。
- `name<?>`：无限定通配符。当输入变量只使用了Object类方法的时候使用。
- `name<? super T>`：下限通配符，输出变量通常使用。

如果既输入又输出的变量，不使用通配符。

编译器推断通配符具体类型的过程称为**通配符捕获**。

### 6.5 类型擦除

为了实现泛型，Java编译器做了如下的事：

- 将所有类型参数替换成限定的的类型（Object如果没有），产生子界面
- 如果需要，插入类型转化
- 产生桥接方法以保证多态性

## 7 包

通过在源文件的第一行添加`package <packagename>;`组织成一个可被`import`包。其中的`<packagename>`必须和该文件的目录名保持一致（由`.`充当`/`分隔）。一个源文件内至多有一个`public`类，该类名必须与文件名相同（区分大小写）。其余类拥有包访问权限。

**注意**：包的本质是一个独立的模块，一个模块则是由一组类组成的。这个模块在Java中被组织成一个目录，这组类被组织为同一目录下的不同Java源文件，源文件与一个公开类一一对应。包既是模块化的手段，也是避免冲突的一种实现方法。

当一个源文件没有声明属于某一包，则该源文件属于这个目录下的**默认包**。通过`import <packagename>.<classname>;`导入某个类，也可通过`import <packagename>.*;`导入整个模块，这时访问这些类不带模块的名称和路径。通过静态导入`import static <packagename>.<classname>.<membername>`，可仅导入某个类的所有静态成员，也可通过`import static <packagename>.<classname>.*;`导入某个类的所有静态成员，这时访问这些成员不带类名。

## 8 异常

异常如下分类：

- Checked Exception：应当被处理的异常
- Unchecked Exception：包含以下两类
  - Error及其子类：致命的错误
  - RuntimeException及其子类：程序逻辑上的错误

对于Checked Exception，方法要么捕获它，要么提供`throws`抛出异常列表的声明。对于Unchecked Exception则没这类限制。

异常处理格式如下：

```java
try {
    // try body
} catch (ExceptionType name) {
    // catch body
} finally {
    // finally body
}
```

try-with-resources的格式如下，括号内结尾无分号，可以跟catch块，AutoClosable是：
```java
try (
    AutoClosable name = new ;
    ...
) {
    // try body
}
```

在函数右括号后面`throws Exception, ...`可以指定方法抛出的异常。

抛出异常的格式为`throw throwableObject`，其中`throwableObject`必须是`Throwable`的子类。

## 9 并发

有两种方法创建线程，推荐前者

- 实现`Runnable`接口的`run`函数，并将该对象提供给`Thread`构造函数。
- 派生`Thread`类，实现其`run`函数。

`Thread.start`可以启动线程；`Thread.sleep`可以睡眠，睡眠可能有`InterruptedException`；`Thread.interrupted`可以判断线程是否中断；`Thread.interrupt`发起中断；`Thread.join`等待线程退出。

在方法的返回类型前添加`synchronized`即创建了同步方法，一个对象的所有同步方法同一时刻只能有一个在执行。构造函数不能是同步方法。

使用`synchronized(object) { statements }`可以创建同步块，object的所有同步块同一时候只能有一个在执行。
