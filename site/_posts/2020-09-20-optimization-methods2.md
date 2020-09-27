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
  - /_posts/2020-09-27-optimization-methods3.html
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

类似地，对于$\mathbf{A}\vec{x}\geq\vec{b}$，可以引入**剩余变量**。

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

1. 存在最优解（这里的存在是指有限的）的充要条件是$\vec{c}\vec{d}_j\geq 0$，其中$\vec{d}_j$为可行域极方向；
2. 若存在最优解，则最优解可在某个极点上达到。

### 2.3 最优基本可行解

对标准形式的线性规划，若$r(\mathbf{A})=m$，可将$\mathbf{A}$列调换后，得到矩阵$\mathbf{A}=[\mathbf{B},\mathbf{N}]$，其中$\mathbf{B}\in\mathbb{R}^{m\times m}$为满秩方阵。$\vec{x}$进行对应的行变换，可以得到$\vec{x}=\begin{bmatrix}\vec{x}_B\\\vec{x}_N\end{bmatrix}$，于是约束条件可以写为：

$$\begin{aligned}
& [\mathbf{B},\mathbf{N}]\begin{bmatrix}\vec{x}_B\\\vec{x}_N\end{bmatrix}=\vec{b} \\
\Rightarrow&\mathbf{B}\vec{x}_B+\mathbf{N}\vec{x}_N=\vec{b}\\
\Rightarrow&\vec{x}_B=\mathbf{B}^{-1}\vec{b}-\mathbf{B}^{-1}\mathbf{N}\vec{x}_N
\end{aligned}$$

其中$\vec{x}_N$的分量是自由分量，令$\vec{x}_N=\vec{0}$，可得到一个解：

$$\vec{x}=\begin{bmatrix}\vec{x}_B\\\vec{x}_N\end{bmatrix}=\begin{bmatrix}\mathbf{B}^{-1}\vec{b}\\\vec{0}\end{bmatrix}$$

**定义2.2.1** 对于：

$$\vec{x}=\begin{bmatrix}\vec{x}_B\\\vec{x}_N\end{bmatrix}=\begin{bmatrix}\mathbf{B}^{-1}\vec{b}\\\vec{0}\end{bmatrix}$$

称为方程$\mathbf{A}\vec{x}=\vec{b}$的一个**基本解**，$\mathbf{B}$称为**基矩阵**，简称为**基**。$\vec{x}_B$的各分量称为**基变量**，基变量全体称为**一组基**，$\vec{x}_N$的各分量称为**非基变量**。若$\mathbf{B}^{-1}\vec{b}\geq\vec{0}$，则$\vec{x}$称为**基本可行解**，$\mathbf{B}$称为**可行基矩阵**，基变量全体称为**一组可行基**。若$\mathbf{B}^{-1}\vec{b}>\vec{0}$称基本可行解是**非退化的**，否则称为**退化的**。

由于基矩阵只有有限个（$\leq\begin{pmatrix}n\\m\end{pmatrix}=\frac{n!}{m!(n-m)!}$），基本解也只有有限个，基本可行解也为有限个。

**定理2.2.3 极点的代数含义** 令$K=\{\vec{x}\mid\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}\}$的极点集与$\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}$基本可行解集等价。

注：其实线性规划的标准形式可以看作超平面与第一象限（闭集）的交，所有变量的个数$n$就是整个空间的维度，而非基变量的个数$n-m$是超平面的维度。与坐标轴、坐标平面之类的东西（这些东西的维度为$m$）交点就是那些非基变量为$0$的点，这些交点如果分量都大于$0$，那么就位于第一象限内，也就是极点。退化的基本可行解是指基本可行解本来交于类似坐标平面的高维事物，却交于类似于坐标轴的低维事物，即同时交于两个坐标平面，这种情况会出现重复的基本解。

**引理 基本可行解的代数含义** 对于可行解$\vec{x}^{(0)}$，$\vec{x}^{(0)}$是基本可行解$\Leftrightarrow$ $\vec{x}^{(0)}$的非零分量对应的$\mathbf{A}$的列向量线性无关。

证：“$\Rightarrow$”，由于$\vec{x}^{(0)}$是基本可行解，它取正值的分量必为基变量，对应的列向量是基矩阵的一部分，基矩阵可逆，所以对应的列向量必线性无关。“$\Leftarrow$”，这里只需要证明它是基变量，由于$\mathbf{A}\in\mathbb{R}^{m\times n}$行满秩，$\vec{x}^{(0)}$非零分量对应的列向量，一定可以扩充成$m$个线性无关的列向量，由定义知$\vec{x}^{(0)}$为基本解。

复述定理：令$S=\{\vec{x}\mid\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}\}\land \vec{x}^{(0)}\in S$，$\vec{x}^{(0)}$是极点$\Leftrightarrow$ $\vec{x}^{(0)}$是基本可行解。

定理2.2.3 证：不妨假设$\vec{x}^{(0)}$的前$k$个分量大于$0$，余下的$n-k$个分量为$0$，即$\vec{x}^{(0)}=[x_1^{(0)},\cdots,x_k^{(0)},0,\cdots,0]^T$

“$\Rightarrow$”。由反证法，接下来证明，若$\vec{x}^{(0)}$是极点，且$\vec{x}^{(0)}$不是基本可行解，即$\vec{x}^{(0)}$前$k$个正分量$\vec{x}_j^{(0)}$对应的$\mathbf{A}$的列向量$\vec{p}_j$线性相关，会推导出矛盾。

存在不全为零的$y_1,y_2,\cdots,y_k\in\mathbb{R}$，满足$\sum\limits_{j=1}^k y_j\vec{p}_j=\vec{0}$，取$\lambda$满足$0<\lambda<\min\{|\frac{\vec{x}_i^{(0)}}{y_i}|\mid y_i\neq 0,0\leq i\leq k\}$，令：

$$\vec{x}_j^{(1)}=\begin{cases}
  x_j^{(0)}+\lambda y_j,&1\leq j\leq k\\
  0,&k+1\leq j\leq n
\end{cases}
\;\;\;\;
\vec{x}_j^{(2)}=\begin{cases}
  x_j^{(0)}-\lambda y_j,&1\leq j\leq k\\
  0,&k+1\leq j\leq n
\end{cases}$$

则我们有$\vec{x}^{(1)},\vec{x}^{(2)}\geq 0$，且由$\vec{x}^{(0)}\in S$有$\vec{x}^{(1)},\vec{x}^{(2)}\in S$。但$\vec{x}^{(0)}=\frac{1}{2}\vec{x}^{(1)}+\frac{1}{2}\vec{x}^{(2)}$，且$\vec{x}^{(1)}\neq\vec{x}^{(2)}$与极点定义矛盾。

“$\Leftarrow$”。已知$\vec{x}^{(0)}=\begin{bmatrix}\mathbf{B}^{-1}\vec{b}\\\vec{0}\end{bmatrix}$，其中$\mathbf{B}$为$\vec{x}^{(0)}$对应的基矩阵。假设存在$\vec{x}^{(1)},\vec{x}^{(2)}\in S\land\lambda\in(0, 1)$，满足$\vec{x}^{(0)}=\lambda\vec{x}^{(1)}+(1-\lambda)\vec{x}^{(2)}$。我们将$\vec{x}^{(1)},\vec{x}^{(2)}$也按前$k$个分量和后$n-k$个分量拆分，即$\vec{x}^{(1)}=\begin{bmatrix}\vec{x}_B^{(1)}\\\vec{x}_N^{(1)}\end{bmatrix},\vec{x}^{(2)}=\begin{bmatrix}\vec{x}_B^{(2)}\\\vec{x}_N^{(2)}\end{bmatrix}$。

$$\begin{bmatrix}
  \mathbf{B}^{-1}\vec{b}\\
  \vec{0}
\end{bmatrix}=\begin{bmatrix}
  \lambda\vec{x}_B^{(1)}+(1-\lambda)\vec{x}_N^{(1)}\\
  \lambda\vec{x}_B^{(2)}+(1-\lambda)\vec{x}_N^{(2)}
\end{bmatrix}$$

由于$\lambda,1-\lambda>0$同时$\vec{x}_N^{(1)},\vec{x}_N^{(2)}\geq\vec{0}$，所以$\vec{x}_N^{(1)}=\vec{x}_N^{(2)}=\vec{0}$。又由于$\mathbf{B}\vec{x}_B^{(1)}+\mathbf{N}\vec{x}_N^{(1)}=\vec{b}$且$\mathbf{B}\vec{x}_B^{(2)}+\mathbf{N}\vec{x}_N^{(2)}=\vec{b}$，所以我们有$\vec{x}_B^{(1)}=\vec{x}_B^{(2)}=\mathbf{B}^{-1}\vec{b}$。故$\vec{x}^{(1)}=\vec{x}^{(2)}=\vec{x}^{(0)}$，$\vec{x}^{(0)}$为极点。

**定理 极方向的代数含义** 设$S=\{\vec{x}\mid\mathbf{A}\vec{x}=\vec{b},\vec{x}\geq 0\}$的极方向$\vec{d}$有$k$个非零分量, $\vec{d}$是$S$的极方向$\Leftrightarrow$ $\vec{d}$的非零分量对应的$\mathbf{A}$的列向量组的秩为$k-1$。

证：

“$\Leftarrow$”。$\mathbf{A}$为行满秩矩阵，故$k\leq m+1$。不妨假设$\vec{d}$的$k$个非零分量分别是$d_1,d_2,\cdots,d_{k-1}$和$d_{m+1}$，并且$\vec{d}$对应的列向量的一个极大线性无关组是$\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_{k-1}$。这$k-1$个线性无关向量可以在$A$的列向量中扩充成$m$个线性无关的向量，$\mathbf{B}=[\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_{m}]$。

假设存在$\vec{d}^{(1)}$和$\vec{d}^{(2)}$是$S$的方向（即$\mathbf{A}\vec{d}^{(1)}=\vec{0}$且$\mathbf{A}\vec{d}^{(2)}=\vec{0}$且$\vec{d}^{(1)},\vec{d}^{(2)}\geq\vec{0}$）且存在$\lambda_1,\lambda_2>0$，满足$\vec{d}=\lambda_1\vec{d}^{(1)}+\lambda_2\vec{d}^{(2)}$。则$d_{m+2}^{(1)},\cdots,d_n^{(1)}$与$d_{m+2}^{(2)},\cdots,d_n^{(2)}$均为$0$。因而$\vec{d}^{(1)},\vec{d}^{(2)}$可以记为：

$$\vec{d}^{(1)}=\begin{bmatrix}
  \vec{d}_B^{(1)}\\
  d^{(1)}_{m+1}\\
  \vec{0}
\end{bmatrix}
\;\;\;\;
\vec{d}^{(2)}=\begin{bmatrix}
  \vec{d}_B^{(2)}\\
  d^{(2)}_{m+1}\\
  \vec{0}
\end{bmatrix}
$$

故：

$$\begin{cases}
  \vec{d}_B^{(1)}=-d_{m+1}^{(1)}\mathbf{B}^{-1}\vec{p}_{m+1}\\
  \vec{d}_B^{(2)}=-d_{m+1}^{(2)}\mathbf{B}^{-1}\vec{p}_{m+1}
\end{cases}$$

若$d_{m+1}^{(1)}$为$0$，则$\vec{d}_B^{(1)}=\vec{0}$不是方向，故$d_{m+1}^{(1)}\neq 0$，同理$d_{m+1}^{(2)}\neq 0$，所以有$\vec{d}^{(1)}=\frac{d_{m+1}^{(1)}}{d_{m+1}^{(2)}}\vec{d}^{(2)}$，故$\vec{d}$是极方向。

“$\Rightarrow$”。不妨设$d_{m+1}>0$。若$k=1$，则$d_{m+1}\vec{p}_{m+1}=0$，$\vec{p}_{m+1}=\vec{0}$，结论成立。若$k>1$，设$d_1,d_2,\cdots,d_{k-1},d_{m+1}>0$，可以知道$\vec{p}_1,\vec{p}_2,\dots,\vec{p}_{k-1},\vec{p}_{m+1}$线性相关，故对应的列向量组秩$<k$。假设$\vec{p}_1,\vec{p}_2,\dots,\vec{p}_{k-1}$线性相关，则存在不全为零的$y_1,y_2,\cdots,y_{k-1}\in\mathbb{R}$，满足$\sum\limits_{j=1}^{k-1}y_j\vec{p}_j=\vec{0}$，取$\lambda$满足$0<\lambda<\min\{|\frac{\vec{x}_i^{(0)}}{y_i}|\mid y_i\neq 0,0\leq i\leq k-1\}$，令：

$$\vec{d}_j^{(1)}=\begin{cases}
  d_j^{(0)}+\lambda y_j,&1\leq j\leq k-1\\
  d_{m+1},&j=m+1\\
  0,&k\leq j\leq m\lor j\geq m+2
\end{cases}
\;\;\;\;
\vec{d}_j^{(2)}=\begin{cases}
  d_j^{(0)}-\lambda y_j,&1\leq j\leq k-1\\
  d_{m+1},&j=m+1\\
  0,&k\leq j\leq m\lor j\geq m+2
\end{cases}$$

则我们有$\mathbf{A}\vec{d}^{(1)}=\mathbf{A}\vec{d}^{(2)}=\vec{0}$，且$\vec{d}^{(1)},\vec{d}^{(2)}\geq \vec{0}$，且$\vec{d}^{(1)}\neq\vec{0}\land\vec{d}^{(2)}\neq\vec{0}$。由于$\vec{d}^{(1)}\neq\vec{d}^{(2)}$，且$\vec{d}=\frac{1}{2}\vec{d}^{(1)}+\frac{1}{2}\vec{d}^{(2)}$，所以$\vec{d}$不是极方向，故对应的列向量组秩$=k-1$。

### 2.4 基本可行解的存在问题

**定理2.2.4** 如果$\mathbf{A}\vec{x}=\vec{b}, \vec{x}\geq\vec{0}$有可行解，则一定存在基本可行解。

证：证明思路是不断构造更多$0$分量的可行解，直到可行解对应的向量组线性无关。设$A=[\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_n]$，$\vec{x}=[x_1,\cdots,x_s,0,\cdots,0]^T$是一个可行解，且$x_j>0,j=1,\cdots,s$。若$\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_s$线性无关，则由引理，$\vec{x}$为基本可行解。若$\vec{p}_1,\vec{p}_2,\cdots,\vec{p}_s$线性相关，则存在不全为$0$，且至少有一个正数的$y_1,\cdots,y_s$（如果都是负的，等式同时取相反数即可），满足：

$$\sum_{j=1}^sy_j\vec{p}_j=\vec{0}$$

取$\lambda=\min\{\frac{x_j}{y_j}\mid y_j>0\}=\frac{x_k}{y_k}$，定义$x_j'=\begin{cases}x_j-\lambda y_j,&j=1,2,\cdots,s\\0,&j=1,\cdots,n\end{cases}$。则我们有$x_j'\geq 0, (j=1,\cdots,n)$且$x_k' = 0$。$\mathbf{A}\vec{x}'=\vec{b}$，故$\vec{x}'$是可行解，且正分量减少了，不断重复这个步骤，就可以获得基本可行解。

**定理** 若LP有最优解，则存在一个基本可行解是最优解。定理2.2.2与定理2.2.4的推论。

**定理** 若LP问题有最优解，则要么最优解唯一，要么有无
穷多最优解。

证明思路是如果存在两个不同的最优解，它们的正线性组合也是最优解。
