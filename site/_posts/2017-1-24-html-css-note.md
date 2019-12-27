---
title: HTML/CSS拾遗（未完待续）
date: 2017-1-24 12:00:00
category: 前端
tags: [HTML, CSS, 前端]
summary: 这篇学习笔记主要参考自MDN上的Learn Web Development。摘录的内容是我认为重要的，或是容易被遗忘的细节。
---

这篇学习笔记主要参考自MDN上的 *[Learn Web Development](https://developer.mozilla.org/en-US/docs/Learn)*。摘录的内容是我认为重要的，或是容易被遗忘的细节。

<!--more-->

## 1 CSS笔记

### 1.1 简介

#### 1.1.1 位置

CSS 可以通过外部样式表（`<link rel="stylesheet" href="...">`）、内部样式表（`<style>...</style>`）和内联样式（`style="..."`，只有CSS声明，尽量避免）添加到HTML中。

#### 1.1.2 语法

属性（Properties）和值（Values）组成了CSS声明（CSS declaration，`property: value`）。若干条CSS声明组成了CSS声明块（`{declaration;...}`）。搭配上相应的选择器（Selectors），就组成了CSS规则（CSS Rulesets/CSS Rules）。对于CSS声明，若其属性不存在或其值不合法，都会被忽略。

声明块的末尾分号可省略。一些声明块可嵌套（如@开头的规则）。空声明块完全合法。

#### 1.1.3 选择器

简单选择器有：

- 元素选择器（`tag`）
- 类选择器（`.class`）
- ID选择器（`#id`）
- 通用选择器（`*`）

属性选择器(由`[]`扩住)有：

- 存在和值属性选择器（存在`[attr]`、相等`[attr=val]`和属于空白符分割的列表`[attr~=val`]）
- 子字符串属性选择器（多用于语言的等于val或以val-开头`[attr|=val]`、开头`[attr^=val]`、结尾`[attr$=val]`和包含`[attr*=val]`）

伪类选择器（由:开始）有：

- `:link`未浏览链接（请遵守 LVHA 顺序）
- `:visited`已浏览链接
- `:hover`悬停
- `:active`激活（鼠标按下，作用于`<a>`和`<button>`等）
- `:focus`获得输入焦点
- `:enabled`可用和`:disabled`不可用
- `:valid`合法和`:invalid`不合法（针对 input 和 form）
- `:required`必选和`:optional`可选（针对 input 和 textarea）
- `:in-range`在数值允许范围内和`:out-of-range`在数值允许范围外（针对有范围的 input）
- `:read-only`只读和`:read-write`可写
- `:indeterminate`不确定的（针对 radio 和 checkbox）
- `:checked选中`（针对 radio、checkbox 和 option）
- `:default`默认的按钮
- `:empty`无孩子
- `:root`即`<html>`
- `:target`即URL中的id所指的标签
- `:first`打印的第一页、`:left`打印处于左边的页和`:right`打印处于右边的页
- `:first-child`第一个孩子、`:last-child`最后一个孩子和`:only-child`唯一一个孩子
- `:nth-child()`第n个孩子（an+b,、even、odd）和`:nth-last-child()`最后n个孩子
- `:first-of-type`第一个该类型的孩子、`:last-of-type`最后一个该类型的孩子和`:only-of-type`唯一一个该类型的孩子
- `:nth-of-type()`第n个该类型的孩子和`:nth-last-of-type()`最后n个该类型的孩子
- `:lang()`语言（参数为语言编码）
- `:not()`非（参数为简单选择器）

伪元素选择器（由::开始）有：

- `::before`虚拟的第一个孩子（默认 inline）和`::after`虚拟的最后一个孩子
- `::first-line`第一行（屏幕）和`::first-letter`第一个字母
- `::selection`选中

选择器组合有：

- `AB` 同时符合A和B
- `A B` A的后代B
- `A > B` A的直接孩子B
- `A + B` A的下个兄弟B
- `A ~ B` A的所有接下来的兄弟B

用`,`分割一个规则的多个选择器。

#### 1.1.4 值和单位

长度或大小的单位有：

- 绝对单位：px、mm、cm、in、pt（1/72in）和pc（12pt）
- 相对单位：
  - em：字体大小，大写M的宽。默认的浏览器字体大小为16px
  - ex, ch：小写x的高和数字0的宽
  - rem：始终等于默认字体大小下的em
  - vw, vh：1/100视窗的大小

0可以不包含单位。`line-height`中的无单位数值会相当于一个乘法因子。`animation-iteration-count`也是不包含单位的。

也可以使用百分数指定宽、高和字体相对于父标签的大小。

可以通过`#`后跟16进制表示颜色，也可通过`rgb()`，`hsl()`及包含透明通道的`rgba()`和`hsla()`构造颜色。

### 1.2 给文本添加样式

### 1.3 给盒框添加样式

### 1.4 布局

（未完待续）
