---
title: 最优化理论与算法第2章：线性规划的基本性质
author: 孙子平
date: 2020-09-20T05:29:41Z
category: 数学
tags: [最优化, 数学]
series: 最优化方法
sidebar:
  - /_posts/2020-09-18-optimization-methods1.html
  - /_posts/2020-09-20-optimization-methods2.html
---

本文的内容主要来自陈宝林的《最优化理论与算法（第2版）》第2章《线性规划的基本性质》。

<!-- more -->

## 1 标准形式及图解法

### 1.1 标准形式

一般线性规划问题，可以写成下列**标准形式**：

$$\begin{aligned}
\min         \;\;\;\;&\vec{c}^T\vec{x} \\
\text{s. t.} \;\;\;\;& \mathbf{A}\vec{x}=\vec{b} \\
             \;\;\;\;& \vec{x}\geq\vec{0}
\end{aligned}$$

其中$\vec{c},\vec{x}\in\mathbb{R}^n$，$\mathbf{A}\in\mathbb{R}^{m\times n}$，$\vec{b}\in\mathbb{R}^m$。同时一般假定$\vec{b}\geq\vec{0}$。

**极大化转换**：若优化目标为$\max$，则另$\vec{c}'=-\vec{c}$。

**约束方程常量为负**：若$b_i<0$，另$b_i=-b_i',a_{ij}=-a_{ij}'$。

**决策变量无非负限制**：若$x_j$无非负限制，可以另$x_j=x_j'-x_j''$，其中$x_j',x_j''\geq 0$。

**决策变量有上下界**：若$x_j\geq l_j$，另$x_j'=x_j-l_j$；若$x_j\leq u_j$，另$x_j'=u_j-x_j$。注：此方法与约束方程为不等式类似，如果同时存在上下界，就引入松弛变量。

**约束方程为不等式**：若给定的问题为：

$$\begin{aligned}
\min         \;\;\;\;&\vec{c}^T\vec{x} \\
\text{s. t.} \;\;\;\;& \mathbf{A}\vec{x}\leq\vec{b} \\
             \;\;\;\;& \vec{x}\geq\vec{0}
\end{aligned}$$

可以引入**松弛变量**$\vec{x}'\in\mathbb{R}^m$，化为下列标准式：

$$\begin{aligned}
\min         \;\;\;\;&\vec{c}^T\vec{x} \\
\text{s. t.} \;\;\;\;& \mathbf{A}\vec{x}+\vec{x}'=\vec{b} \\
             \;\;\;\;& \begin{bmatrix}\vec{x}\\\vec{x}'\end{bmatrix}\geq\vec{0}
\end{aligned}$$

**含有绝对值**：若给定的问题为（这里使用$|\cdot|$表示逐个元素的绝对值）：

$$\begin{aligned}
\min         \;\;\;\;&\vec{c}^T|\vec{x}| \\
\text{s. t.} \;\;\;\;& \mathbf{A}\vec{x}=\vec{b}
\end{aligned}$$

可以引入$\vec{u}=\frac{|\vec{x}|+\vec{x}}{2},\vec{v}=\frac{|\vec{x}|-\vec{x}}{2}$，于是我们有$\vec{u},\vec{v}>\vec{0},\vec{x}=\vec{u}-\vec{v},|\vec{x}|=\vec{u}+\vec{v}$，化为下列标准式：

$$\begin{aligned}
\min         \;\;\;\;&\vec{c}^T(\vec{u}+\vec{v}) \\
\text{s. t.} \;\;\;\;& \mathbf{A}(\vec{u}-\vec{v})=\vec{b} \\
             \;\;\;\;& \begin{bmatrix}\vec{u}\\\vec{v}\end{bmatrix}\geq\vec{0}
\end{aligned}$$

TODO: 写个程序演示一下？

### 1.2 图解法

线性不等式的几何意义是半平面，因此对于两变量线性规划，可以使用**图解法**：

1. 作出线性规划问题的可行域；
2. 作出目标函数的等值线；
3. 移动等值线到可行域边界得到最优点。

注意，目标函数的梯度指向目标函数增大的方向。

线性规划可能存在**无穷多个最优解**，这些解组成了可行域的一条边；线性规划可行域为空集，则线性规划**无解**。若可行域无界，则该线性规划可能**无界**，即**不存在有限最优值**（这种情况也是无最优解）。

$$\text{线性规划问题} \begin{cases}
  \text{有可行解} \begin{cases}
    \text{有最优解} \begin{cases}
      \text{唯一解} \\
      \text{无穷多解}
    \end{cases} \\
    \text{无界（必要条件是可行域无界）}
  \end{cases} \\
  \text{有可行解}
\end{cases}$$

## 2 基本性质

### 2.1 可行域

**定理2.2.1** 约束条件为线性等式或者不等式的线性规划的可行域是凸集。

注：由凸集的有限交是凸集即可得证。

### 2.2 最优极点

考虑标准形式的可行域，其极点为$\vec{x}_1,\cdots,\vec{x}_k$，极方向为$\vec{d}_1,\cdots,\vec{d}_l$，由表示定理可以知道，可行点$\vec{x}$可以表示为：

$$\begin{aligned}
&\vec{x}=\sum_{j=1}^k\lambda_j\vec{x}_{j}+\sum_{j=1}^l\mu_j\vec{d}_j\\
&\sum_{j=1}^k\lambda_j=1,\\
&\lambda_j\geq 0, j=1,\cdots,k,\\
&\mu_j\geq 0, j=1,\cdots,l.
\end{aligned}$$

代入标准形式：

$$\begin{aligned}
\min         \;\;\;\;&\sum_{j=1}^k\lambda_j\vec{c}^T\vec{x}_j+\sum_{j=1}^l\mu_j\vec{c}^T\vec{d}_j \\
\text{s. t.} \;\;\;\;&\sum_{j=1}^k\lambda_j=1, \\
             \;\;\;\;&\lambda_j\geq 0, j=1,\cdots,k,\\
             \;\;\;\;&\mu_j\geq 0, j=1,\cdots,l.
\end{aligned}$$

若某个$\vec{c}^T\vec{d}_j<0$，则$\mu_j$可以取很大，问题成为了无界。所以有界的充要条件是所有$\vec{c}^T\vec{d}_j\geq 0$。有界的最优解一定有$\mu_j=0$。所以对于有界的问题，简化成了：

$$\begin{aligned}
\min         \;\;\;\;&\sum_{j=1}^k\lambda_j\vec{c}^T\vec{x}_j \\
\text{s. t.} \;\;\;\;&\sum_{j=1}^k\lambda_j=1, \\
             \;\;\;\;&\lambda_j\geq 0, j=1,\cdots.
\end{aligned}$$

这时，令：

$$\vec{x}_p=\underset{\vec{x}_j,j=1,\cdots,k}{\operatorname{arg\,min}}\;\vec{c}^T\vec{x}_j$$

则：

$$\min\sum_{j=1}^k\lambda_j\vec{c}^T\vec{x}_j=\vec{c}^T\vec{x}_p\;\;\;\;\text{此时}\lambda _j=\begin{cases}
  1, &j=p \\
  0, &j\neq p
\end{cases}$$

**定理2.2.2** 设标准形式的线性规划可行域非空，则有下列结论：

1. 存在有限最优解的充要条件是$\vec{c}\vec{d}_j\geq 0$，其中$\vec{d}_j$为可行域极方向；
2. 若存在有限最优解，则最优解可在某个极点上达到。

### 2.3 最优基本可行解

对标准形式的线性规划，若$r(\mathbf{A})=m$，可将$\mathbf{A}$列调换后，得到矩阵$\mathbf{A}=[\mathbf{B},\mathbf{N}]$，其中$\mathbf{B}\in\mathbb{R}^{m\times m}$为满秩方阵。$\vec{x}$进行对应的行变换，可以得到$\vec{x}=\begin{bmatrix}\vec{x}_\mathbf{B}\\\vec{x}_\mathbf{N}\end{bmatrix}$，于是约束条件可以写为：

$$\begin{aligned}
& [\mathbf{B},\mathbf{N}]\begin{bmatrix}\vec{x}_\mathbf{B}\\\vec{x}_\mathbf{N}\end{bmatrix}=\vec{b} \\
\Rightarrow&\mathbf{B}\vec{x}_\mathbf{B}+\mathbf{N}\vec{x}_\mathbf{N}=\vec{b}\\
\Rightarrow&\vec{x}_\mathbf{B}=\mathbf{B}^{-1}\vec{b}-\mathbf{B}^{-1}\mathbf{N}\vec{x}_\mathbf{N}
\end{aligned}$$

其中$\vec{x}_\mathbf{N}$的分量是自由分量，令$\vec{x}_\mathbf{N}=\vec{0}$，可得到一个解：

$$\vec{x}=\begin{bmatrix}\vec{x}_\mathbf{B}\\\vec{x}_\mathbf{N}\end{bmatrix}=\begin{bmatrix}\mathbf{B}^{-1}\vec{b}\\\vec{0}\end{bmatrix}$$

**定义2.2.1** 对于：

$$\vec{x}=\begin{bmatrix}\vec{x}_\mathbf{B}\\\vec{x}_\mathbf{N}\end{bmatrix}=\begin{bmatrix}\mathbf{B}^{-1}\vec{b}\\\vec{0}\end{bmatrix}$$

称为方程$\mathbf{A}\vec{x}=\vec{b}$的一个**基本解**，$\mathbf{B}$称为**基矩阵**，简称为**基**。$\vec{x}_\mathbf{B}$的各分量称为**基变量**，基变量全体称为**一组基**，$\vec{x}_\mathbf{N}$的各分量称为**非基变量**。若$\mathbf{B}^{-1}\vec{b}\geq\vec{0}$，则$\vec{x}$称为**基本可行解**，$\mathbf{B}$称为**可行基矩阵**，基变量全体称为**一组可行基**。若$\mathbf{B}^{-1}\vec{b}>\vec{0}$称基本可行解是**非退化的**，否则称为**退化的**。

由于基矩阵只有有限个（$\leq\begin{pmatrix}n\\m\end{pmatrix}=\frac{n!}{m!(n-m)!}$），基本解也只有有限个，基本可行解也为有限个。

**定理2.2.3** 令$K=\{\vec{x}\mid\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}\}$的极点集与$\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}$基本可行解集等价。

注：其实线性规划的标准形式可以看作超平面与第一象限（闭集）的交，所有变量的个数$n$就是整个空间的维度，而非基变量的个数$n-m$是超平面的维度。与坐标轴、坐标平面之类的东西（这些东西的维度为$m$）交点就是那些非基变量为$0$的点，这些交点如果分量都大于$0$，那么就位于第一象限内，也就是极点。退化的基本可行解是指基本可行解本来交于类似坐标平面的高维事物，却交于类似于坐标轴的低维事物，即同时交于两个坐标平面，这种情况会出现重复的基本解。

### 2.4 基本可行解的存在问题

**定理2.2.4** 如果$\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}$有可行解，则一定存在基本可行解。
