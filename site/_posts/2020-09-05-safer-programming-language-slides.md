---
title: 更安全的编程语言（幻灯片）
author: 孙子平
date: 2020-09-04T18:24:50Z
category: 编程
tags: [编程, 静态分析]
marp: true
summary: 这是个幻灯片，用以介绍编程语言如何被设计成更安全、更抽象、更易于进行程序分析的。
---

<!--
paginate: true
style: |
  section {
    justify-content: start !important;
    padding: 80px 100px 80px 240px !important;
  }
  section.cover {
    justify-content: center !important;
  }
backgroundImage: url("/assets/blog/safer-programming-language-slides/background.svg")
-->

<!--
_class: cover
-->

<div />

# 更安全的程序设计语言 {.text-h2 .mt-auto}

——从常见漏洞的角度浅谈编程语言设计
{.text-right .my-0 .text-h4}

By 周旻 副研究员 & 孙子平
{.text-right .mt-0}

本幻灯片在CC BY 4.0下提供，转载请注明来自[https://szp.io](https://szp.io)。本幻灯片包含大量的个人观点，对错误的内容造成的损失，概不负责。
{.mt-auto .text-body-1 .text--disabled}

---

## 1 目录

---

## 2 空指针解引用
