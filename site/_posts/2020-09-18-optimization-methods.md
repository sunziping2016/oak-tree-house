---
title: 最优化理论与算法
author: 孙子平
date: 2020-09-17T16:38:14Z
category: 数学
tags: [最优化, 数学]
---

本文的内容主要来自陈宝林的《最优化理论与算法（第2版）》。

<!-- more -->

## 1 引言

### 1.1 学科简述

（略）

### 1.2 线性与非线性规划问题

目标函数和约束函数都是线性的，称为**线性规划问题**，若含有非线性函数，称为**非线性规划问题**。

满足约束条件的点称为**可行点**，全体可行点组成的集合称为**可行集**或**可行域**。如果可行域是整个空间称为**无约束问题**。

**定义1.2.1** $f:\mathbb{R}^n\rightarrow\mathbb{R}$为目标函数，$S$为可行域，$\vec{x}'\in S$，若$\forall \vec{x}(\vec{x}\in S\rightarrow f(\vec{x})\geq f(\vec{x}'))$，则称$\vec{x}'$为$f$在$S$上的**全局极小点**。

**定义1.2.2** $f:\mathbb{R}^n\rightarrow\mathbb{R}$为目标函数，$S$为可行域，$\vec{x}'\in S$，若$\exists\epsilon(\epsilon\in\mathbb{R}^+\land\forall \vec{x}(\vec{x}\in N(\vec{x}',\epsilon)\rightarrow f(\vec{x})\geq f(\vec{x}')))$，则称$\vec{x}'$为$f$在$S$上的**局部极小点**。其中$N(\vec{x}',\epsilon)=\{\vec{x}|\;\|\vec{x}-\vec{x}'\|<\epsilon\}$为领域。

注：全局极小点不需要用到距离和范数，它和函数的最值定义几乎是一样的，只是定义域成了可行域。而局部极小点用到了领域，需要距离也就是范数，它和函数的极小值定义也几乎是一样的。

### 1.3 几个数学概念

#### 1.3.1 向量范数和矩阵范数

**定义1.3.1** 实值函数$\|\cdot\|:\mathbb{R}^n\rightarrow\mathbb{R}$称为**向量范数**，若满足$\forall\alpha,\vec{x},\vec{y}(\alpha\in\mathbf{R}\land \vec{x},\vec{y}\in\mathbf{R}^n)$：

1. 严格正定性：$\|\vec{x}\|\geq 0\land(\|\vec{x}\|=0\leftrightarrow\vec{x}=\vec{0})$；
2. 齐次性（线性形）：$\|\alpha\vec{x}\|=|\alpha|\cdot\|\vec{x}\|$
3. 三角不等式：$\|\vec{x}+\vec{y}\|\leq\|\vec{x}\|+\|\vec{y}\|$

常见的向量范数有：

1. $L_1$范数：$\|\vec{x}\|_1=\sum\limits_{j=1}^n |x_j|$
2. $L_2$范数：$\|\vec{x}\|_2=(\sum\limits_{j=1}^n x_j^2)^\frac{1}{2}$
3. $L_\infty$范数：$\|\vec{x}\|_\infty=\max\limits_j |x_j|$

注：这里的范数都称为$L_p$-范数，来源于$\|\vec{x}\|_p=(\sum\limits_{j=1}^n |x_j|^p)^\frac{1}{p}$。其中$\|\vec{x}\|_\infty=\lim\limits_{p\rightarrow+\infty}(\sum\limits_{j=1}^n |x_j|^p)^\frac{1}{p}$。

**定义1.3.2** $\|\cdot\|_\alpha,\|\cdot\|_\beta$为$\mathbb{R}^n$上的范数，若$\exists c_1, c_2(c_1, c_2\in\mathbb{R}^+\land\forall\vec{x}(\vec{x}\in\mathbb{R}^n\rightarrow c_1\|\vec{x}\|_\alpha\leq \|\vec{x}\|_\beta\leq c_2\|\vec{x}\|_\alpha))$，则称这两个**范数等价**。

$\mathbb{R}^n$中任何两个范数等价（这里必须是有限维，这个定理的证明我尚不能掌握，需要参考泛函分析）。

**定义1.3.3** $\mathbf{A}\in\mathbb{R}_{mn}$为矩阵，$\|\cdot\|_\alpha$为$\mathbb{R}^m$上的向量范数，$\|\cdot\|_\beta$为$\mathbb{R}^n$上的向量范数，定义**矩阵范数**$\|\mathbf{A}\|=\max\limits_{\|\vec{x}\|_\beta=1}\|\mathbf{A}\vec{x}\|_\alpha$。

注：这里可以想像成矩阵的范数，是其对应的线性映射，能够将一个向量拉长的最大倍数。

**定理1.3.1** 矩阵范数的性质：

1. $\|\mathbf{A}\vec{x}\|_\alpha\leq\|\mathbf{A}\|\cdot\|\vec{x}\|_\beta$；
2. $\|\lambda\mathbf{A}\|=|\lambda|\cdot\|\mathbf{A}\|$；
3. $\|\mathbf{A}+\mathbf{B}\|\leq\|\mathbf{A}\|+\|\mathbf{B}\|$；
4. $\|\mathbf{A}\mathbf{D}\|\leq\|\mathbf{A}\|\cdot\|\mathbf{D}\|$。

**定理1.3.1 (1) 证：**

$$
\begin{aligned}
            &\|\mathbf{A}\|=\max\limits_{\|\vec{x}\|_\beta=1}\|\mathbf{A}\vec{x}\|_\alpha \\
\Rightarrow &\|\mathbf{A}\|=\max\limits_{\|\frac{\vec{x}}{\|\vec{x}\|}_\beta\|_\beta=1}\|\mathbf{A}\frac{\vec{x}}{\|\vec{x}\|}_\beta\|_\alpha\;(\texttt{变量代换}) \\
\Rightarrow &\|\mathbf{A}\|=\max\frac{\|\mathbf{A}\vec{x}\|_\alpha}{\|\vec{x}\|_\beta}\;(\texttt{利用齐次性，并去掉了恒成立的max条}) \\
\Rightarrow &\|\mathbf{A}\|\geq\frac{\|\mathbf{A}\vec{x}\|_\alpha}{\|\vec{x}\|_\beta}
\end{aligned}
$$

**定理1.3.1 (3) 证：**

$$
\begin{aligned}
|\mathbf{A}+\mathbf{B}\|&=\max\limits_{\|\vec{x}\|_\beta=1}\|(\mathbf{A}+\mathbf{B})\vec{x}\|_\alpha \\
&\leq\max\limits_{\|\vec{x}\|_\beta=1}\|\mathbf{A}\vec{x}\|_\alpha + \|\mathbf{B}\vec{x}\|_\alpha\;(\texttt{三角不等式}) \\
&=\|\mathbf{A}\|+\|\mathbf{B}\|
\end{aligned}
$$

**定理1.3.1 (4) 证：**

$$
\begin{aligned}
\|\mathbf{A}\mathbf{D}\|&=\max\limits_{\|\vec{x}\|_\beta=1}\|\mathbf{A}\mathbf{D}\vec{x}\|_\alpha \\
&\leq\max\limits_{\|\vec{x}\|_\beta=1}\|\mathbf{A}\|\cdot\|\mathbf{D}\vec{x}\|_\gamma\;(\texttt{性质1}) \\
&=\|\mathbf{A}\|\cdot\|\mathbf{D}\|
\end{aligned}
$$

常见的矩阵范数有：

1. $\|\mathbf{A}\|_1=\max_j\sum\limits_{i=1}^m |a_{ij}|$；
2. $\|\mathbf{A}\|_2=\sqrt[]{\lambda_{\mathbf{A}^T\mathbf{A}}}$，（$\lambda$是最大特征值，这被称为$谱范数$）；
3. $\|\mathbf{A}\|_\infty=\max_i\sum\limits_{j=1}^n |a_{ij}|$。

注：这里$p$矩阵范数就是$L_p$向量范数的组合，我采用形象化的方式来解释这3种范数。先考虑第2个范数，它将球拉伸成椭球，长径拉伸最大值也就是其最大的奇异值；再考虑第1个范数，它将一个立方体拉伸成长方体，其中立方体的顶点是$[0,\dots,0,1,0,\dots,0]^T$，映射完后，相当于挨个取出列向量，求他们的$L_1$范数（求和），再取出最大的；最后考虑第3个范数，它同样将一个立方体拉伸成长方体，其中立方体的顶点是$[1,\dots,1]^T$，映射完后，相当于将行向量求和，最后取出最大的。

#### 1.3.2 序列的极限
