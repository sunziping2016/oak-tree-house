---
title: Python教程4 - 模块
author: 孙子平
date: 2020-03-21T10:09:02Z
category: Python
tags: [Python, 编程, 教程]
series: Python教程
sidebar:
  - /_posts/2019-11-01-python-tutorial1.html
  - /_posts/2019-11-11-python-tutorial2.html
  - /_posts/2020-02-06-python-tutorial3.html
  - /_posts/2020-03-21-python-tutorial4.html
---

这篇教程讲了Python的模块，主要内容来自[6. 模块 — Python 3.7.7 文档](https://docs.python.org/zh-cn/3.7/tutorial/modules.html)。

<!-- more -->

## 1 介绍

当你使用交互的Python解释器时，你会发现一旦你退出了解释器，你的所有定义的函数和变量都丢失。如果你想保存下你的代码，你就需要用文本编辑器，将代码保存成`.py`文件，也就是**脚本**。

有时你希望自己的某个代码片段能在多个项目中使用，却不需要拷贝来拷贝去。Python可以允许你将代码保存成文件，被其他脚本或者交互式解释器使用。这样的文件我们称之为**模块**。这些模块可以被**导入**到其他模块或交互式解释器中。在所有的模块中，会有一个最顶层的模块包含执行的入口，我们称之为**主模块**。

在每个模块的内部，会有一个全局变量`__name__`存储着模块的名字，如果是主模块，`__name__`的值为`'__main_'`。

首先你可以创建一个`fibonacci.py`。你既可以用文本编辑器编辑后保存至某个项目文件夹或者桌面，也可以是PyCharm之类的IDE新建工程添加文件，内容如下：

```python
def fib(n):   # 返回小于n的斐波那契数列
    result = []
    a, b = 0, 1
    while a < n:
        result.append(a)
        a, b = b, a+b
    return result

def main():
    print('Fibonacci less than 100:')
    for i in fib(100):
        print(i)

if __name__ == '__main__':
    main()
```

然后你可以执行它，就像我们先前做的那样，这时`fib.py`这个文件就成了主模块，`__name__`的值为`'__main__'`，`if`语句成立。

当然你也可以导入这个模块。第一步是打开命令行，对于Windows上没有使用IDE的同学，可以打开cmd，输入`cd "PATH_TO_FOLDER"`，这里`PATH_TO_FOLDER`需要改成`fibonacci.py`所在的目录，这一步是切换工作目录；对于Windows上使用PyCharm的同学按`Alt+F12`或者点击下方的`Terminal`。接着在命令行中输入`python`运行交互式解释器，输入以下的代码：

```python
>>> import fibonacci
>>> fibonacci.fib(100)
[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
>>> fibonacci.__name__
'fibonacci'
```

上面的代码中`import fibonacci`就是Python导入模块的方式，这里`import fibonacci`，会执行`fibonacci.py`中的代码，并将其中的全局对象（全局变量和全局函数等）收集起来，存放到`fibonacci`这个对象中，供导入`fibonacci.py`的模块或交互解释器使用。这样你就可以通过`fibonacci`这个对象去访问`fibonacci.py`中的全局对象了。由于`__name__`的值为`'fibonacci'`，所以在导入的过程中没有像运行的过程中那样输出东西。

## 2 关于模块

### 2.1 模块只初始化一次

每个模块的语句仅在第一次被导入的时候被执行，这意味着多次导入的时候（甚至一个模块分别被多个模块导入的时候），模块只会被初始化一次。为了演示这种现象，我们可以修改`fibonacci.py`成下面的样子：

```python
print('initializing fibonacci')

def fib(n):   # 返回小于n的斐波那契数列
    result = []
    a, b = 0, 1
    while a < n:
        result.append(a)
        a, b = b, a+b
    return result

def main():
    print('Fibonacci less than 100:')
    for i in fib(100):
        print(i)

if __name__ == '__main__':
    main()
```

在同一目录添加一个`foo.py`，内容如下：

```python
import fibonacci

print('initializing foo')
```

这时候运行交互式解释器，执行下面的内容：

```python
>>> import foo
initializing fibonacci
initializing foo
>>> import fibonacci
>>> foo.fibonacci is fibonacci
True
```

在遇到`import foo`的时候，Python会去加载并执行`foo.py`。这时遇到了`import fibonacci`，又去加载并执行`fibonacci.py`，这就输出了第一条`initializing fibonacci`。执行完`fibonacci.py`，完成了`foo.py`中的`import fibonacci`就执行到输出`initializing foo`。最后`foo.py`执行完成，`import foo`也完成了。

```sequence [render p-class="svg-diagram"]
Python->foo.py:"import foo"\nstarted
foo.py->fibonacci.py:"import fibonacci"\nstarted
Note right of fibonacci.py: "print('initializing\n fibonacci')"
Note right of fibonacci.py: "def fib(n):\n..."
Note right of fibonacci.py: "def main():\n..."
Note right of fibonacci.py: "if __name__ == '__main__':\n..."
fibonacci.py->foo.py:"import fibonacci"\nfinished
Note right of foo.py: "print('initializing\n foo')"
foo.py->Python:"import foo"\nfinished
```

然后我们在交互式命令行输入的`import fibonacci`并没有触发重新加载，没有`initializing fibonacci`被打印出来。实际上可以看出，在`foo.py`中导入的`fibonacci`（`foo.fibonacci`）和我们刚刚命令行导入的`fibonacci`是一个对象。

### 2.2 模块的独立全局作用域

我们可以看到每个模块都有自己的全局作用域，比如在上一个例子中，被导入的`foo.py`的所有全局对象都存放在`foo`这个对象下，而`fibonacci.py`的所有全局对象存放在`foo.fibonacci`和`fibonacci`共同指向的对象下。这样每个模块的全局作用域都是独立的，模块的开发者就不用担心自己需要使用的全局对象和别人的冲突。

`import`语句一般放在文件的开始，但是这不是必须的。

### 2.3 import语句的变体

首先你可以使用`from module import name1, name2`只导入模块中的某些全局对象：

```python
>>> from fibonacci import fib, main
initializing fibonacci
```

此外你也可以使用`from module import *`导入模块的所有全局对象。它会导入那些不以`_`开头的名字。这在写代码的时候是不建议的，但如果你只是在交互式解释器里尝试，这是可以的。

```python
>>> from fibonacci import *
initializing fibonacci
>>> fib(10)
[0, 1, 1, 2, 3, 5, 8]
```

接着你可以通过`import module as name`来给导入的模块设置新的名字，这样做使得导入多个同名的模块成为了可能。

```python
>>> import fibonacci as fib
initializing fibonacci
>>> fib.fib(10)
[0, 1, 1, 2, 3, 5, 8]
```

最后你可以结合上面两种导入语句的方式，通过`from module import name1 as name2`来给导入的模块的全局对象设置新的名字，这使得导入多个同名的（不同模块的）全局对象成为了可能。

```python
>>> from fibonacci import fib as func
initializing fibonacci
>>> func(10)
[0, 1, 1, 2, 3, 5, 8]
```

### 2.4 模块搜索路径

当我们在命令行中输入`import foo`的时候，Python会在哪些地方搜索模块`foo.py`是否存在呢？从先到后它会查询这些路径：

1. 包含主模块的目录×如果是在交互模式中，则是当前路径）；
2. 环境变量`PYTHONPATH`中指定的路径；
3. 与安装环境相关的默认路径。

#### 2.4.1 环境变量

这里我介绍一下环境变量的相关概念。每个进程（运行着的程序）都会有各自的环境变量，你可以理解环境变量是字符串到字符串的键值对。默认情况下，当新的进程被创建时，它会继承父进程的所有环境变量。通过环境变量，父进程可以向子进程传递一些信息。

在各种环境变量中，最著名的是`PATH`环境变量，它存放着启动进程时的搜索路径，Windows系统上是分号`;`分隔的路径列表，POSIX系统上是冒号`:`分隔的路径列表。这个环境变量决定了你在命令行（如Windows的cmd，`Win + R`启动的运行对话框）里输入的命令会在哪里查找并且被启动，比如Windows上，命令行里输入`notepad`，这时候Windows就会顺着环境变量`PATH`里的目录查找，直到找到`C:\Windows\system32`这个路径，发现下面有`notepad.exe`就启动该程序。

如果你想要查看命令行中的环境变量，在Windows上可以输入`echo %PATH%`，在POSIX系统上可以输入`echo $PATH`。你也可以在命令行里**临时**设置环境变量，如添加`foo`路径到`PATH`里，Windows上可以`set PATH="foo;%PATH%"`，POSIX上可以`export PATH="foo:$PATH"`。如果你想要在Windows上永久地修改环境变量，你可以右击“计算机”，选择“属性”，点击左侧“高级系统设置”，选择“高级”Tab页，点击“环境变量”进行编辑。

`PYTHONPATH`和`PATH`环境变量是类似的，它们拥有相同的分隔符（Windows分号，POSIX冒号）。

#### 2.4.2 sys.path

`sys`是一个Python内置的模块，它里面包含了很多系统信息。其中它的`path`变量是一个字符串的列表，存放了Python的搜索路径。

```python
>>> import sys
>>> sys.path
['', '/usr/lib/python38.zip', '/usr/lib/python3.8', '/usr/lib/python3.8/lib-dynload', '/usr/lib/python3.8/site-packages']
```

这里我的环境是ArchLinux，所以具体的输出会有所差别。这里我们注意到列表的第一个是空目录，这表示当前交互式环境所在的目录。如果你将下面的代码保存成一个文件。第一个路径会变为主模块所在的文件夹。

```python
import sys
print(sys.path)
```

Python程序可以在运行时修改sys.path的值，从而改变搜索路径。

## 3 编译的Python文件

Python虽然是解释型语言，但它也有编译这个操作。这个编译和我们一般所指的C/C++之类的语言编译成机器指令是不同的，它会编译成一种非文本的字节码，这种字节码最后仍会被Python解释执行，是平台无关的，其执行速度与普通Python代码是一样的，但是其加载速度会快出很多。为了加速加载，Python会把每个模块编译后的版本存放到同目录下的`__pycache__/module.version.pyc`，如对`spam`模块，使用的是CPython 3.8，会编译成`__pycache__/spam.cpython-38.pyc`。

当运行的时候，Python会检查源文件和编译后文件的时间戳，如果发现源文件编译过了就会重新编译。

Python有两种情况不会检查编译后的缓存文件：

- 主模块一定会被重新编译；
- 没有对应源文件的缓存。

<style lang="scss">
p.svg-diagram {
  text-align: center;
  svg {
    max-width: 100%;
  }
}
</style>
