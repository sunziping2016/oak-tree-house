---
title: 最优化理论与算法第3章：单纯形方法
author: 孙子平
date: 2020-09-26T22:00:46Z
category: 数学
tags: [最优化, 数学]
series: 最优化方法
sidebar:
  - /_posts/2020-09-18-optimization-methods1.html
  - /_posts/2020-09-20-optimization-methods2.html
  - /_posts/2020-09-27-optimization-methods3.html
---

本文的内容主要来自陈宝林的《最优化理论与算法（第2版）》第3章《单纯形方法》和老师的PPT。

<!-- more -->

## 1 单纯形方法原理

### 1.1 基本可行解的转换

考虑问题：

$$\begin{aligned}
\min         \;\;\;\;&f\stackrel{\text{def}}{=}\vec{c}^T\vec{x} \\
\text{s. t.} \;\;\;\;&\mathbf{A}\vec{x}=\vec{b} \\
             \;\;\;\;&\vec{x}\geq\vec{0}
\end{aligned}$$

同时记：

$$\begin{aligned}
  &\mathbf{A}=[\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_n]=[\mathbf{B}\mid\mathbf{N}]\\
  &\vec{x}^{(0)}=\begin{bmatrix}
    \mathbf{B}^{-1}\vec{b}\\
    \vec{0}
  \end{bmatrix}
\end{aligned}$$

其中$\mathbf{B}$和$\mathbf{N}$分别是基本可行解$\vec{x}^{(0)}$的基矩阵和非基矩阵。则$\vec{x}^{(0)}$处的目标函数值为：

$$f_0=\vec{c}^T\vec{x}^{(0)}=\vec{c}_B^T\mathbf{B}^{-1}\vec{b}$$

我们的目标是从这个基本可行解出发，得到另一个目标函数值更小的。考虑任意可行解：

$$\vec{x}=\begin{bmatrix}
  \vec{x}_B\\
  \vec{x}_N
\end{bmatrix}$$

注意，这里的$\vec{x}_B$和$\vec{x}_N$的基矩阵和非基矩阵是相对$\vec{x}^{(0)}$说的。这时候目标函数值为：

$$\begin{aligned}
  f&=\vec{c}_B^T(\mathbf{B}^{-1}\vec{b}-\mathbf{B}^{-1}\mathbf{N}\vec{x}_N)+\vec{c}_N^T\vec{x}_N\\
  &=f_0-(\vec{c}_B^T\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N^T)\vec{x}_N\\
  &=f_0-\sum_{j=m+1}^n(\vec{c}_B^T\mathbf{B}^{-1}\vec{p}_j-c_j)x_j\\
  &=f_0-\sum_{j=m+1}^n(z_j-c_j)x_j\;\;\;\;\text{其中}z_j=\vec{c}_B^T\mathbf{B}^{-1}\vec{p}_j
\end{aligned}$$

注意到$\vec{x}\geq 0$，所以此时若$z_j-c_j\leq 0, j=m+1,\cdots,n$，则达到最优解条件。若此时存在$z_j-c_j>0$，为了让$f$下降得更快，所以我们会添加一个基$x_k, m<k\leq n$，这个基对应的$z_j-c_j$应当是最最大的。所以有：

$$z_k-c_k=\max_{m<j\leq n} z_j-c_j$$

则此时：

$$\begin{aligned}
  \vec{x}_B&=\mathbf{B}^{-1}\vec{b}-\mathbf{B}^{-1}\vec{p}_kx_k\\
  &=\vec{x}_B^{(0)}-\vec{y}_kx_k\\
  &\text{其中}\vec{x}_B^{(0)}=\mathbf{B}^{-1}\vec{b},\vec{y}_k=\mathbf{B}^{-1}\vec{p}_k
\end{aligned}$$

为了保证新的解是可行解，我们需要确保$\vec{x}_B\geq 0$，即$\vec{x}_B^{(0)}-\vec{y}_kx_k\geq 0$，所以我们应当取：

$$x_k=\min\left\{\frac{x_{Bi}^{(0)}}{y_{ki}}\mid y_{ki}>0\right\}=\frac{x_{Br}^{(0)}}{y_{kr}}$$

若$\vec{y}_k\leq 0$，则问题无界。如果找到了，这时候$x_r=0$，得到了一个新的可行解，接下来我们证明这是基本可行解，方法是证明$\vec{p}_1,\cdots,\vec{p}_{r-1},\vec{p}_k,\vec{p}_{r+1},\vec{p}_m$线性无关。注意到$\vec{p}_1,\cdots,\vec{p}_{r-1},\vec{p}_r,\vec{p}_{r+1},\vec{p}_m$是线性无关的，而$\vec{p}_k=\mathbf{B}\vec{y}_k=\sum\limits_{i=1}^m y_{ki}\vec{p}_i$，而$y_{kr}\neq 0$，故$\vec{p}_r$可被$\vec{p}_1,\cdots,\vec{p}_{r-1},\vec{p}_k,\vec{p}_{r+1},\vec{p}_m$线性标出，故$\vec{p}_1,\cdots,\vec{p}_{r-1},\vec{p}_k,\vec{p}_{r+1},\vec{p}_m$线性无关。故：

$$\vec{x}=[x_0^{(0)},\cdots,x_{r-1}^{(0)},0,x_{r+1}^{(0)},\cdots,x_m^{(0)},0,\cdots,0,x_k,0,\cdots,0]^T$$

是新的更优的基本可行解。

**定理 3.1.1** 若在极小化问题中，对于某个基本可行解，所有$z_j-c_j\leq 0$，则这个基本可行解是最优解，这里：

$$z_j-c_j=\vec{c}_B^T\mathbf{B}^{-1}\vec{p}_j-c_j, j=1,\cdots,n$$

称为**判别数**或**检验数**。注：如果$j$是基的下标，则判别数为$0$。

### 1.2 单纯形方法计算步骤

首先要给定一个初始的基本可行解，假设初始基矩阵为$\mathbf{B}$，执行以下步骤：

1. 求$\vec{x}_B=\mathbf{B}^{-1}\vec{b}$；
2. 求单纯形子$\vec{w}^T=\vec{c}_B\mathbf{B}^{-1}$，对于所有非基变量，计算判别数$z_j-c_j=\vec{w}^T\vec{p}_j-c_j$，令：

    $$z_k-c_k=\max_{j\in\text{非基变量下表集}} z_j-c_j$$

    若$z_k-c_k\leq 0$，则找到最优解，退出。否则进入下一步；

3. 求$\vec{y}_k=\mathbf{B}^{-1}\vec{p}_k$，若$\vec{y}_k\leq 0$，则不存在有限最优解，退出，否则进入下一步；
4. 确定下标$r$，使：

    $$\frac{\vec{x}_{Br}}{y_{kr}}=\min\left\{\frac{\vec{x}_{Bi}}{y_{ki}}\mid y_{ki}>0\right\}$$

    $x_r$为**离基变量**，$x_k$为**进基变量**，用$\vec{p}_k$替换$\vec{p}_r$得到新的基矩阵，返回步骤1。

对于最大化问题，步骤2的$\max$改$\min$即可。

### 1.3 收敛性

所有迭代会出现下列情况：

1. $z_k-c_k\leq 0$，当前解为最优解；
2. $z_k-c_k>0$且$\vec{y}_k\leq 0$，问题无界；
3. $z_k-c_k>0$且$\vec{y}_k\nleq 0$，找到新基本可行解，非退化情况下目标函数下降。

**定理 3.1.2** 对于非退化问题，单纯形方法经过有限次迭代要么达到最优基本可行解，要么无界。

### 1.4 使用表格形式的单纯形方法

首先，对标准形式作变换可以得到：

$$\begin{aligned}
\min         \;\;\;\;&f \\
\text{s. t.} \;\;\;\;&f-\vec{c}_B^T\vec{x}_B-\vec{c}_N^T\vec{x}_N=0 \\
             \;\;\;\;&\mathbf{B}\vec{x}_B+\mathbf{N}\vec{x}_N=\vec{b} \\
             \;\;\;\;&\vec{x}_B\geq\vec{0},\vec{x}_N\geq\vec{0}
\end{aligned}$$

消去第一个等式中的$\vec{x}_B$，得到：

$$\begin{aligned}
\min         \;\;\;\;&f \\
\text{s. t.} \;\;\;\;&\mathbf{B}\vec{x}_B+\mathbf{N}\vec{x}_N=\vec{b} \\
             \;\;\;\;&f+(\vec{c}_B^T\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N^T)\vec{x}_N=0 \\
             \;\;\;\;&\vec{x}_B\geq\vec{0},\vec{x}_N\geq\vec{0}
\end{aligned}$$

将上式写在表格中就有了**单纯形表**：

| |$f$|$\vec{x}_B$|$\vec{x}_N$|右端|
|:-:|:-:|:-:|:-:|:-:|
|$\vec{x}_B$|$\vec{0}$|$\mathbf{I}_m$|$\mathbf{B}^{-1}\mathbf{N}$|$\mathbf{B}^{-1}\vec{b}$|
|$f$|$1$|$0$|$\vec{c}_B\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N$|$\vec{c}_B\mathbf{B}^{-1}\vec{b}$|
{.simplex-table}

其中，$\vec{c}_B\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N$的每一个分量即为判别数$z_j-c_j$，$\mathbf{B}^{-1}\mathbf{N}$的列分量就是$\vec{y}_k$。第一列通常省略。

初始的时候。我们已经有了一个可行解$\vec{x}_N=\vec{0}$。

若$\vec{c}_B\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N\leq 0$，则找到了最优解。

若$\vec{c}_B\mathbf{B}^{-1}\mathbf{N}-\vec{c}_N\nleq 0$，则需要用主元消去法。在表的最后一行中，寻找除右端外的最大值，它所在的一行称**主列**，从而确定了离基变量。这时候寻找主列上除最后一列外大于0的元素，且右端除以该元素值最小的，找到的该元素称为**主元**，它所在的行称为**主行**，再用**主行**加上初等行变换，消去主元所在列，并使主元为$1$。循环此操作。

<style>
.simplex-table tr {
  border: none !important;
}
.simplex-table tr th {
  border: none !important;
}
.simplex-table tr:nth-child(2n) {
  background-color: transparent !important;
}
.simplex-table tr:nth-child(2n) td:not(:first-child) {
  background-color: #f6f8fa !important;
}
.simplex-table tr td:first-child {
  border: none !important;
}
</style>
