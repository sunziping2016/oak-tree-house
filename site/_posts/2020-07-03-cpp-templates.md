---
title: C++模板
author: 孙子平
date: 2020-07-03T09:52:39Z
cover: /assets/blog/cpp-templates/cpp.png
category: C++
tags: [C++, 编程, 泛型]
---

本文是对《C++ Templates》第二版英文原版的学习笔记。部分内容会参考[Walton1128](https://github.com/Walton1128)翻译的[《C++ Templates 第二版》中文翻译](https://github.com/Walton1128/CPP-Templates-2nd--)

<!-- more -->

## 1 函数模板

### 1.1 模板概览

#### 1.1.1 定义模板

模板的形式为`template<...>`，中间省略号代表上逗号`,`分割的模板参数列表。以下是一个简单的例子：

```cpp
template<typename T>
T max(T a, T b)
{
  return a < b ? b : a;
}
```

`typename`关键字用以引入一个类型参数，也可以使用`class`关键字，模板参数除此之外还有非类型模板参数。`T`是一个标识符。这里的`T`必须支持`<`运算和拷贝赋值。

#### 1.1.2 使用模板

通过使用`::max(a, b)`就可以使用改模板函数。使用全局作用域限定符是为了避免与`std::max`冲突。当使用不同类型的参数时，函数会**实例化**（模板参数替换成具体参数的过程）成多个实体。`void`也是一个合法的类型参数。

#### 1.1.3 两阶段翻译

尝试对模板实例化那些不支持的模板需要的操作的类型，会是个编译错误。所以模板经历了两次编译

1. 在定义阶段，忽略模板参数检查模板自身的正确性，可检查的错误包括语法错误、使用未知变量名、未通过且不依赖于模板参数的静态断言；
2. 在实例化阶段，模板再次被检查。

这导致模板在实例化的过程中，编译器必须看到模板的定义。因而模板一般被置于头文件中。注意：某些编译器在定义阶段没有完整地检查。

### 1.2 模板实参推导

模板参数可以只是实际类型的一部分。就像下面那样。

```cpp
template<typename T>
T max(T const& a, T const& b)
{
  return a < b ? b : a;
}
```

传递`int`给模板函数参数则`T`会是`int`。

自动类型转换在模板类型推导中是受限的：

- 当以引用传参的时候，即使是最平凡的转换也不被允许。类型必须精确匹配；
- 当以值传参的时候，只支持`decay`的普通类型转换：忽略cv限定，去除引用，数组转指针，函数转函数指针。如果两个函数参数使用了同一个类型参数，则类型参数decayed的类型必须一致。

如果类型推导失败，可以手动指定类型，就像`max<double>(4, 7.2)`。

类型推导会忽略函数的默认参数。如果要支持设定函数默认参数，需要给模板参数也提供一个默认参数。

### 1.3 多个模板参数

考虑下面的函数：

```cpp
template<typename T1, typename T2>
T1 max(T1 a, T2 b)
{
  return a < b ? b : a;
}
```

我们注意到函数的返回参数被强制转换为了第一个参数的类型，这不符合我们的预期。为此我们有3中解决方案。

#### 1.3.1 返回类型为模板参数

模板参数推导不考虑返回值。由于模板参数的指定必须从左到右依次指定，所以一般将返回类型置于模板其他类型参数之前。

#### 1.3.2 返回类型推导

在C++14中，你可以使用auto关键字。类似`auto max(T1 a, T2 b)`。实际上，对于不带尾随返回类型的auto返回类型，编译器会从函数体中推断类型。这要求函数定义必须存在，且多个返回语句的类型必须一致。

在C++11中，你可以使用尾随返回类型，类似`auto max(T1 a, T2 b) -> decltype(a<b?b:a)`。实际上`decltype(true?b:a)`也可行。为了避免`T1`或`T2`可能为引用类型，我们可以用`typename std::decay<decltype(true?a:b)>::type`。

需要注意的对于`auto`变量的赋值类型始终会被`decay`，`auto`返回值也是如此。

#### 1.3.3 返回共同类型

在C++11中，使用`std::common_type<Types...>::type`可以获得多个类型共同的类型。在C++14中，可以使用`std::common_type_t<Types...>`。`std::common_type`同样decay。

### 1.4 默认模板参数

在C++11之前只有类模板支持默认模板参数。C++11之后，所有类型的模板都支持默认模板参数。默认模板参数可以不是在模板参数的最后。

### 1.5 重载函数模板

函数模板也支持重载。普通函数可以与同名同类型的模板函数共存。只有当模板版本能够产生一个更好的匹配的时候（如更少的类型转换），才会选用模板版本。你也可以通过指定一个空模板参数列表`::max<>(7, 42)`，强制使用模板版本。模板参数推导是不会考虑到自动类型转换的，所以当普通函数能自动类型转换成功的话，而模板函数无法匹配的时候，普通函数就会被选用。

也可以重载多个模板的版本，但如果两个模板都能匹配上函数就会发生错误。因此通常重载函数模板时，需要确保对任意一个调用只有一个模板匹配。

在重载函数模板的时候要尽可能少做改动。比如不要混用按值传参和按引用传参。下面是个反面的例子：

```cpp
#include <cstring>

template<typename T>
T const& max (T const& a, T const& b)
{
  return b < a ? a : b;
}

char const* max (char const* a, char const* b)
{
  return std::strcmp(b,a) < 0 ? a : b;
}
// maximum of three values of any type (call-by-reference)
template<typename T>
T const& max(T const& a, T const& b, T const& c)
{
  return max (max(a,b), c); // error if max(a,b) uses call-by-value
  // 我的注释：这里对于T: const char *来讲，两个max都是匹配到的非模板函数版本
}

int main ()
{
  char const* s1 = "frederic";
  char const* s2 = "anica";
  char const* s3 = "lucas";
  auto m = ::max(s1, s2, s3); //run-time ERROR
}
```

此外，还要确保函数模板被调用时，其前方某处有定义。下面是一个反面的例子：

```cpp
// maximum of two values of any type:
template<typename T>
T max (T a, T b)
{
  std::cout << "max<T>() \n";
  return b < a ? a : b;
}
// maximum of three values of any type:
template<typename T>
T max (T a, T b, T c)
{
  return max (max(a,b), c); // uses the template version even for ints
}                           //because the following declaration comes
                            // too late:

// maximum of two int values:
int max (int a, int b)
{
  std::cout << "max(int,int) \n";
  return b < a ? a : b;
}

int main()
{
  ::max(47,11,33); // OOPS: uses max<T>() instead of max(int,int)
}
```

### 1.6 难道，我们不应该

#### 1.6.1 按值传递还是按引用传递

按引用传递对于非简单类型可能能省去拷贝成本，但出于以下原因，按值传递通常更好：

- 语法简单。
- 编译器能够更好地进行优化。
- 移动语义通常使拷贝成本比较低。
- 某些情况下可能没有拷贝或者移动。

模板有一些额外情况：

- 模板既可以用于简单类型，也可以用于复杂类型，因此如果默认选择适合于复杂类型可能方式，可能会对简单类型产生不利影响。
- 作为调用者，你通常可以使用`std::ref()`和`std::cref()`来按引用传递参数。（参见7.3）
- 虽然按值传递 string literal 和 raw array 经常会遇到问题，但是按照引用传递它们通常只会遇到更大的问题。（参见7）

#### 1.6.2 为什么不inline

模板不需要inline。唯一的例外是模板全特化，这时代码不再是泛型。严格地从语言角度来看，inline只意味着在程序中函数的定义可以出现很多次。当然，编译器在做决定的时候依然会将关键字inline纳入考虑因素。

#### 1.6.3 为什么不constexpr

8.2会讨论一些constexpr的例子，为了更专注于模板的原理，接下来的讨论会跳过模板。

### 1.7 总结

- 函数模板定义了一组适用于不同类型的函数。
- 当向模板函数传递变量时，函数模板会自行推断模板参数的类型，来决定去实例化出那种类型的函数。
- 你也可以显式的指出模板参数的类型。
- 你可以定义模板参数的默认值。这个默认值可以使用该模板参数前面的模板参数的类型，而且其后面的模板参数可以没有默认值。
- 函数模板可以被重载。
- 当定义新的函数模板来重载已有的函数模板时，必须要确保在任何调用情况下都只有一个模板是最匹配的。
- 当你重载函数模板的时候，最好只是显式地指出了模板参数得了类型。
- 确保在调用某个函数模板之前，编译器已经看到了相对应的模板定义。

## 2 类模板

容器类是类模板的典型应用。本章我们将用栈作为一个例子。

### 2.1 Stack类模板的实现

类模板的声明和定义都放在头文件里。

#### 2.1.1 声明一个类模板

```cpp
template<typename T>
class Stack {
  ...
};
```

这里可以用`class`关键字替代`typename`关键字。`T`这个类型就和普通类型一样，可以被用于声明成员变量类型，和成员函数的返回值类型及形参类型。

这个类的类型是`Stack<T>`，其中`T`是模板参数。在使用类型的时候，你必须指明`Stack<T>`，除非可以推导出T的类型。不过在类模板内部可以使用`Stack`代替`Stack<T>`，推荐在类模板内使用`Stack`。但在类模板外，你就需要使用`Stack<T>`，如下：

```cpp
template<typename T>
bool Stack<T>::operator== (Stack<T> const& lhs, Stack<T> const& rhs);
```

在只需要类的名字而不是类型的地方，只能用`Stack`，如构造函数和析构函数。

不同于非模板类，不可以在局部作用于声明和定义模板，可以在全局、命名空间或者其他类里定义。

#### 2.1.2 成员函数的实现

定义类模板的成员函数时，必须指出它是一个模板，且模板的类型需要完整地给出。

```cpp
template<typename T>
void Stack<T>::push (T const& elem)
{
  elems.push_back(elem);
}
```

类模板也可以在类的定义中给出。

```cpp
template<typename T>
class Stack {
  ...
  void push (T const& elem) {
    elems.push_back(elem); // append copy of passed elem
  }
  ...
};
```

### 2.2 Stack类模板的使用

（未完待续）
