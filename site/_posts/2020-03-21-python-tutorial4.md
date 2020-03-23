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

if __name__ == '__main__':
    print('Fibonacci less than 100:')
    for i in fib(100):
        print(i)
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

## 2 进一步关于模块

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

if __name__ == '__main__':
    print('Fibonacci less than 100:')
    for i in fib(100):
        print(i)
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

<style lang="scss">
p.svg-diagram {
  text-align: center;
  svg {
    max-width: 100%;
  }
}
</style>
