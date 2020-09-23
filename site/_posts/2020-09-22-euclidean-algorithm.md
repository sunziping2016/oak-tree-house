---
title: 欧基里德算法
author: 孙子平
date: 2020-09-22T05:22:02Z
category: 数学
tags: [数学, 数论]
---

这篇文章主要介绍了：

1. 最大公约数（GCD）与欧基里德算法；
2. 平衡欧基里德算法；
3. 扩展欧基里德算法。

<!-- more -->

## 1 GCD与欧基里德算法

### 1.1 整除和素数

**除法定理** $\forall m,a(m,a\in\mathbb{Z}\land m,a>0\rightarrow\exists!q,r(q,r\in\mathbb{Z}\land 0\leq r<|m|\land a=mq+r))$。其中，$q$称为**商**，$r = (a\mod m)$称为**余**。如果$r=0$，那么我们说$m$**整除**$a$，$m$是$a$的约数，记作$m|a$。
