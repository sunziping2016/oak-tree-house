---
title: 数值分析基础第1章：引论
author: 孙子平
date: 2020-09-28T03:17:38Z
category: 数学
tags: [数值分析, 数学]
series: 数值分析
sidebar:
  - /_posts/2020-09-28-numerical-analysis1.html
---

本文的内容主要来自关治的《数值分析基础（第3版）》第1章《引论》和老师的PPT。

<!-- more -->

## 1 数值分析的研究对象

（略）

## 2 数值计算的误差

### 2.1 误差的来源与分类

误差大致分为4类：

1. 输入数据的误差；
2. 舍入误差：来源于计算机的数字是有限的；
3. 截断误差：用有限的过程代替无限的过程，或用简化的问题代替不易计算的原问题；
4. 误差在计算过程中的传播。

### 2.2 绝对误差和相对误差、有效数字

**定义2.1** 设$x$是精确值，$x_A$是一个近似值。$e(x)=|x-x_A|$称为$x_A$的**绝对误差**，而$e_r(x)=\frac{|x-x_A|}{x}$称为$x_A$的**相对误差**。

**定义2.2** 因为$x$通常是未知的，一般只能给出$|x-x_A|$的上界$\epsilon_A$。$|x-x_A|\leq\epsilon_A$称为$x_A$的**绝对误差界**，而$\epsilon_r(x)=\frac{\epsilon_A}{x}$称为$x_A$的**相对误差界**。

对于一个实数，取有限位数作为近似值，采用四舍五入的方法。这样得到的近似值，绝对误差界为最后数位的半个单位。因此引入了有效数字概念。

**定义2.3** 设$x_A$是$x$的一个近似值，$x_A=\pm0.a_1a_2\cdots a_i\cdots\times 10^k$，其中$k$为整数，$a_i\in\{0,1,2,\cdots,9\}$，$a_1\neq 0$。如果有$|x-x_A|\leq\frac{1}{2}\times 10^{k-n}$，则称$x_A$具有$n$位**有效数字**：$a_1,a_2,\cdots,a_n$。

有效数字就是寻找误差在$5$以内（包括$5$）的那位，计数之前数字的个数。

设$x$的近似值$x_A=\pm0.a_1a_2\cdots a_i\cdots\times 10^k$，则：

1. 如果$x_A$有$n$位有效数字，则：

    $$\frac{|x-x_A|}{x_A}\leq\frac{1}{2a_1}\times 10^{1-n}$$

2. 如果：

    $$\frac{|x-x_A|}{x_A}\leq\frac{1}{2(a_1+1)}\times 10^{1-n}$$

    则$x_A$至少有$n$位有效数字。

1的证明比较简单，这里证明2，由$|x_A|=0.a_1a_2\cdots\times 10^k\leq0.(a_1+1)\times 10^k=(a_1+1)\times 10^{k-1}$可以证明。

### 2.3 求函数值和算术运算的误差估计

**向前误差分析** 设$x$的浮点数表示为$x^*$。则：

$$\begin{aligned}
  x^*&=x(1+\delta)\\
  (x^*)^2&=x^2(1+2\delta)
\end{aligned}$$

因而，每次乘法相对误差加倍。这里，$\delta^2$由于超出浮点数表示能力而被忽略。

**向后误差分析** 把计算结果的误差归结为原始数据经扰动之后的精确的计算结果的误差分析叫做**后向误差分析**。

设$y=f(x_1,x_2,\cdots,x_n)$，如果参量$x_i,1\leq i\leq n$有误差，则$y$也会有误差。若$x_i,1\leq i\leq n$的近似值为$\tilde{x}_i,1\leq i\leq n$，相应的解为$\tilde{y}$，则$\tilde{y}$的绝对误差和相对误差分别为：

$$\begin{aligned}
  |y-\tilde{y}|&\leq\sum\limits_{i=1}^n\left|\frac{\partial f}{\partial x_i}\right||x_i-\tilde{x_i}|\\
  \frac{|y-\tilde{y}|}{|y|}&\leq\sum\limits_{i=1}^n\left|\frac{x_i}{y}\frac{\partial f}{\partial x_i}\right|\frac{|x_i-\tilde{x_i}|}{|x_i|}
\end{aligned}$$

把两个数$a,b$的$+,-,\times,\div$看成二元函数，则有：

$$\begin{aligned}
  e(a\pm b)&\leq e(a)+e(b)\\
  e(ab)&\leq|b|e(a)+|a|e(b)\\
  e_r(a\pm b)&\leq\frac{|a|e_r(a)+|b|e_r(b)}{|a\pm b|}\\
  e_r(ab)&\leq e_r(a)+e_r(b)\\
  e(\frac{a}{b})&\leq \frac{e(a)}{|b|}+\left|\frac{a}{b^2}\right|e(b)\\
  e_r(\frac{a}{b})&\leq e_r(a)+e_r(b)
\end{aligned}$$

### 2.4 计算机的浮点数表示和舍入误差

在计算机上，实数系统$\mathbb{R}$是用**浮点数系统**$\mathbb{F}$来近似的。实数$x$在$\beta$进制浮点数系统下的表示为：

$$x=(-1)^s\cdot(0.a_1a_2\cdots a_t)\cdot\beta^e=(-1)^s\cdot m\cdot \beta^{e-t}$$

其中：

- $s$：符号位，$1$为负数，$0$为正数；
- $m=a_1a_2\cdots a_t,0\leq a_i\leq\beta-1$：尾数，$t$称为字长；
- $e,L\leq e\leq U$：指数。

二进制浮点数系统$\mathbf{F}$为：

$$\mathbb{F}=\{\pm 0.d_1d_2\cdots d_t\times 2^k\}\cup\{0\}$$

其中$d_1=1$。

浮点数的近似$\mathrm{fl}(x)$，有两种：

- **截断**；
- **舍入**：IEEE属于这种。

定义$\epsilon_{mach}$为机器精度：

$$\begin{aligned}
  \left|\frac{x-\mathrm{fl}(x)}{x}\right|&=\left|\frac{0.1d_2\cdots d_td_{t+1}\cdots\times 2^k-0.1d_2\cdots d_t\times 2^k}{0.1d_2\cdots\times 2^k}\right|\\
  &\leq\left|\frac{0.d_{t+1}d_{t+2}\cdots\times 2^k}{0.1d_2\cdots\times 2^k}\right|\times 2^{-t} \leq 2^{-t}=\epsilon_{mach}
\end{aligned}$$

## 3 病态问题、数值稳定性与避免误差危害

### 3.1 病态问题与条件数

敏度分析是研究$x$有微小变化$\delta x$时，函数值$f$会发生多大的变化：

$$\frac{|f(x+\delta x)-f(x)|}{f(x)}\leq\kappa(x)\frac{|\delta x|}{|x|}$$

称$\kappa(x)$为$f$在$x$的条件数。

当$\kappa(x)$很大时，自变量的微小变化就可能引起函数值的巨大变化，则称$f$在$x$点是**病态**的；否则称$f$在$x$点是**良态**的。

一个计算问题是否病态是问题本身的固有属性。

$$\begin{aligned}
  \kappa(x)&=\lim_{x_A\to x}\frac{\left|\frac{f(x)-f(x_A)}{f(x)}\right|}{\left|\frac{x-x_A}{x}\right|}\\
  &=\left|\frac{x}{f(x)}\right|\lim_{x_A\to x}\left|\frac{f(x)-f(x_A)}{x-x_A}\right|\\
  &=\left|\frac{xf'(x)}{f(x)}\right|
\end{aligned}$$

例如：Wilkinson多项式$\prod\limits_{i=1}^n(x-i)$求根就属于病态问题，用特征值的定义求求解特征值同样是病态问题。

### 3.2 数值方法的稳定性

一个数值方法，如果初始数或计算过程某一不有微小的改变，由此引发的计算结果也只是微小的变化，则称该方法是**数值稳定**的，否则称为**数值不稳定**的。

一般来说，如果具有初始误差$\epsilon_0>0$，计算$n$步后的误差为$\epsilon_n$，若方法是数值稳定的，则存在与$n$无关的常数$C$使得$\epsilon_n\leq C\epsilon_0$。

- $|\epsilon|\approx Cn\epsilon_0$，线性型的误差增长；
- $|\epsilon|\approx C^n\epsilon_0$，指数型的误差增长。$|C|\leq 1$稳定，$|C|>1$不稳定。

TODO: 给个例子。

### 3.3 避免误差危害

- 避免相近的数相减；
- 避免和绝对值大的数相乘；
- 避免和绝对值小的除数相除。

数学上等价$\neq$计算上等价：例如对于$ax^2+2bx+c=0$，采用$x_1=\frac{-b-\mathrm{sgn}(b)\sqrt{b^2-ac}}{a}, x_2=\frac{c}{ax_1}$，可以解决$b^2\gg|ac|$情况下的问题；使用$\frac{x^2}{\sqrt{1+x^2}+1}$替代$\sqrt{1+x^2}-1$可以避免$|x|\ll 1$时精度的损失。同时对于求解$n$次多项式，可以利用分配律合并多项式，达到$n$次乘法和$n$次加法。

选用公式也很重要，对于无穷级数毕竟求解的情况，通常选用同号数列求和极限比交替数列求和极限收敛速度更快。

## 4 线性代数的一些基本概念

**矩阵乘法的定义** 定义$\mathbb{F}^{m\times p}\times\mathbb{F}^{p\times n}=\mathbb{F}^{m \times n}$的一个运算，称为**矩阵乘法**，$\mathbf{A}\mathbf{B}=\mathbf{C}$，其中$c_{ij}=\sum\limits_{k=1}^p a_{ik}b_{kj}$。

**矩阵迹的定义** 设$\mathbf{A}=(a_{ij})_{i,j=1}^n\in\mathbf{F}^{n\times n}$，矩阵$\mathbf{A}$的迹是其所有对角元素之和。$\mathrm{tr}(\mathbf{A})=\sum\limits_{i=1}^na_{ii}$。

**定理** 若$\mathbf{A}\in\mathbb{F}^{n\times m},\mathbf{B}\in\mathbb{F}^{m\times n}$，则$\mathrm{tr}(\mathbf{A}\mathbf{B})=\mathrm{tr}(\mathbf{B}\mathbf{A})$。

证明：

$$\mathrm{tr}(\mathbf{A}\mathbf{B})=\sum_{i=1}^n(\mathbf{A}\mathbf{B})_{ii}=\sum_{i=1}^n\sum_{j=1}^m\mathbf{A}_{ij}\mathbf{B}_{ji}=\sum_{j=1}^m\sum_{i=1}^n\mathbf{B}_{ji}\mathbf{A}_{ij}=\sum_{j=1}^m(\mathbf{A}\mathbf{B})_{jj}=\mathrm{tr}(\mathbf{B}\mathbf{A})$$

**非奇异矩阵的定义** 矩阵$\mathbf{A}\in\mathbb{R}^{n\times n}$称为**非奇异的**或**可逆的**，若存在一个矩阵$\mathbf{B}\in\mathbb{R}^{n\times n}$，使得$\mathbf{A}\mathbf{B}=\mathbf{B}\mathbf{A}=\mathbf{I}$。其中$\mathbf{B}$称为$\mathbf{A}$的逆矩阵，如果$\mathbf{A}$的逆矩阵不存在，则称其是**奇异的**。

注：对于有结合律且有左右逆的代数系统中，左逆一定等于右逆。此外，$(\mathbf{A}_1\mathbf{A}_2\cdots\mathbf{A}_m)^{-1}=\mathbf{A}_m^{-1}\cdots\mathbf{A}_2^{-1}\mathbf{A}_1^{-1}$。

**线性方程组的可解性定理** $\mathbf{A}\in\mathbb{R}^{n\times n}$可逆，则方程组$\mathbf{A}\vec{x}=\vec{b}$有唯一解$\vec{x}=\mathbf{A}^{-1}\vec{b}$。

$\mathbf{A}\in\mathbb{R}^{n\times n}$非奇异$\Leftrightarrow$齐次方程组$\mathbf{A}\vec{x}=\vec{0}$只有$\vec{0}$解（平凡解）$\Leftrightarrow$ $\det\mathbf{A}\neq 0$。

**矩阵转置的定义** 设$\mathbf{A}\in\mathbb{R}^{m\times n}$，它的转置$\mathbf{A}^T$可通过交换$\mathbf{A}$的行和列得到，即$(\mathbf{A})_{ij}=a_ij\Rightarrow(\mathbf{A}^T)_{ij}=a_{ji}$

注：$(\mathbf{A}^T)^T=\mathbf{A}$，$(\mathbf{A}\mathbf{B})^T=\mathbf{B}^T\mathbf{A}^T$，$(\mathbf{A}^T)^{-1}=(\mathbf{A}^{-1})^T$。

**对称矩阵的定义**，若$\mathbf{A}^T=\mathbf{A}$，则称$\mathbf{A}$为对称矩阵。

注：$\mathbf{A}^T\mathbf{A}$一定是对称矩阵。

### 4.1 矩阵的特征值问题、相似变换化标准形

**矩阵的特征值问题** 对于$\mathbf{A}\in\mathbb{C}^{n\times n}$，若有$\lambda\in\mathbb{C}$和非零向量$\vec{x}\in\mathbb{C}^n$，使得：

$$\mathbf{A}\vec{x}=\lambda\vec{x}$$

则称$\vec{x}$为特征值$\lambda$对应的特征向量。

**特征值的求解** $\mathbf{A}\in\mathbb{C}^{n\times n}$，多项式$p(\lambda)=\det(\lambda\mathbf{I}-\mathbf{A})$称为$\mathbf{A}$的特征多项式，方程$p(\lambda)=0$称为特征方程，若$\lambda$是$p$的根，则$\lambda$是$\mathbf{A}$的特征值。

注：由于实际上，特征多项式是一个高阶多项式，所以直接使用特征多项式求解特征值是个病态问题。

**谱的定义** 任意$\mathbf{A}\in\mathbb{C}^{n\times n}$，一定有$n$个特征值。全体特征值的集合称为$\mathbf{A}$的**谱**，记作$\sigma(\mathbf{A})$：

$$\sigma(\mathbf{A})\stackrel{\text{def}}{=}\{\lambda_1,\cdots,\lambda_n\}$$

还定义**谱半径**：

$$\rho(\mathbf{A})\stackrel{\text{def}}{=}\max_{\lambda\in\sigma(\mathbf{A})}|\lambda|$$

有：

- $\mathrm{tr}(\mathbf{A})=\sum\limits_{i\leq i\leq n}\lambda_i$；
- $\det\mathbf{A}=\prod\limits_{i\leq i\leq n}\lambda_i$。

注：展开特征多项式就能得到这个结论。

**可对角化的定义** 设$\mathbf{A}\in\mathbb{F}^{n\times n}$，若存在非奇异矩阵$\mathbf{P}\in\mathbb{F}^{n\times n}$，使得：

$$\mathbf{D}=\mathbf{P}^{-1}\mathbf{A}\mathbf{P}$$

为对角阵，则称$\mathbf{A}$可对角化。$\mathbf{A}$可对角化的充要条件是它有$n$个线性无关的特征向量。

**实对称矩阵的特征值问题** 若$\mathbf{A}$是实对称矩阵，则$\mathbf{A}$的特征值都是实数，可以对角化。且不同特征值的特征向量相互正交。

**可对角化的充分条件** 矩阵$\mathbf{A}\in\mathbb{R}^{n\times n}$的不同特征值对应的特征向量是线性无关的。若$\mathbf{A}$有$n$个不同的特征值，则$\mathbf{A}$可对角化。

**代数重数的定义** 若$\mathbf{A}$具有重特征值，即特征方程有重根，则：

$$\det(\lambda\mathbf{I}-\mathbf{A})=(\lambda-\lambda_1)^{n_1}(\lambda-\lambda_2)^{n_2}\cdots(\lambda-\lambda_s)^{n_s},\lambda_i\neq\lambda_j,\text{if}\;i\neq j$$

亦即$\lambda_i$是特征方程的$n_i$重根，$n_i$称为特征值$\lambda_i$的**代数重数**。

$$n_1+n_2+\cdots+n_s=n,n_i\geq 1,1\leq i\leq s$$

**几何重数的定义** 设$\lambda_i$对应的最大线性无关特征向量的个数为$m_i$，则$m_i$就是其次方程组$(\lambda_i\mathbf{I}-\mathbf{A})\vec{x}=\vec{0}$的基础解系所包含最大线性无关解的个数，亦即特征值对应的特征子空间的维数，$m_i$称为特征值$\lambda_i$的**几何重数**。

**几何重数小于代数重数** $m_i\leq n_i, i=1,2,\cdots,s$。

**可对角化的充要条件** 设$\mathbf{A}$具有重特征值，则$\mathbf{A}$可对角化的重要条件是每个特征值的几何重数和代数重数相等。

**Jordan标准型** 任意复方阵可以通过相似变换化为Jordan标准型J：

$$\mathbf{P}^{-1}\mathbf{A}\mathbf{P}=\mathbf{J}=\mathrm{diag}(\mathbf{J}_1,\mathbf{J}_2,\cdots,\mathbf{J}_p)$$

每个$\mathbf{J}_i$对应一个特征值$\lambda_i$，它是$r_i$个小块组成的块对角阵：

$$\mathbf{J}_i=\mathrm{diag}(\mathbf{J}_{i1},\mathbf{J}_{i2},\cdots,\mathbf{J}_{ir_1}),\mathbf{J}_{ik}=\begin{bmatrix}\lambda_i&1&&\\&\ddots&\ddots&\\&&\lambda_i&1\\&&&\lambda_i\end{bmatrix}$$

### 4.2 线性空间与内积空间

#### 4.2.1 线性空间

**线性空间的定义** 设$\mathbb{F}$是一个数域，$V$是一个非空集合，在$V$上定义两种运算：

- **加法**：$\forall u,v\in V$，有唯一$u+v\in V$（封闭性），且：
  - $u+v=v+u, \forall u,v\in V$（加法交换律）；
  - $u+(v+w)=(u+v)+w, \forall u,v\in V$（加法结合律）；
  - 有唯一**零元素**$\theta\in V$，使得$u+\theta=u, \forall u\in V$；
  - 对每个$u\in V$，有唯一的**负元素**$-u\in\theta$，使得$u+(-u)=\theta$。
- **数乘**：$\forall\alpha\in\mathbb{F},u\in V$，有唯一$\alpha u\in V$（封闭性），且：
  - $1u=u,\forall u\in V$（单位元）；
  - $\alpha(\beta u)=(\alpha\beta)u,\forall\alpha,\beta\in\mathbb{F}, u\in V$（数乘的交换律）；
  - $\alpha(u+v)=\alpha u+\alpha v,\forall\alpha\in\mathbb{F},u,v\in V$（数乘对数的结合律）；
  - $(\alpha+\beta)u=\alpha u+\beta u,\forall\alpha,\beta\in\mathbb{F},u\in V$（数乘对向量的结合律）。

称$V$为数域$\mathbb{F}$上的**线性空间**（或数域$F$上的**向量空间**）。

**线性子空间的定义** 若线性空间$V$的一个子集$W$按照$V$的加法和数乘也是一个线性空间，则称$W$是$V$的**线性子空间**。

例子：实向量$\mathbb{R}^n$、复向量$\mathbb{C}^n$、$[a,b]$闭区间上的连续函数$C[a,b]$、实矩阵$\mathbb{R}^{m\times n}$、复矩阵$\mathbb{C}^{m\times n}$和$[a,b]$闭区间上最高次数为$n$的多项式$\mathcal{P}_N[a,b]$都能组成线性空间。

**线性无关的定义** 设$(\mathbb{V},\mathbb{F})$是一个线性空间，$x_i\in V,i=1,2,\cdots,n$，若存在不是全零的$a_i\in\mathbb{F}, i=1,2,\cdots,n$，使得：

$$\sum_{i=1}^na_ix_i=0$$

则称$\{x_i\}_{i=1}^n$是**线性相关**的，反之，则称它是**线性无关**的。

例子：在$\mathcal{P}_N[a,b]$中，$\{1,x,\cdots,x^N\}$是线性无关的，在$C[-\pi,\pi]$中，$\{1,\cos x,\sin x,\cdots,\cos nx, \sin nx\}$是线性无关的。

**基和维数的定义** 若$\{x_i\}_{i=1}^n$，且$\forall x\in V$，有$x=\sum\limits_{i=1}^na_ix_i$，则$\{x_i\}_{i=1}^n$构成$V$的一组**基**，空间的维数为$n$。

例子：$\mathcal{P}_N$中$\{1,x,\cdots,x^N\}$是一组基，$\dim\mathcal{P}_N=N+1$；$C[a,b]$中$\forall N,\{1,x,\cdots,x^N\}$是线性无关的，$\dim C[a,b]=+\infty$。

#### 4.2.2 内积空间

**内积的定义** 设$V$是数域$\mathbb{F}$上的线性空间，内积$(\cdot,\cdot):V\times V\to\mathbb{F}$，且有：

1. $(u+v,w)=(u,w)+(v,w),\forall u,v,w\in V$；
2. $(\alpha u,v)=\alpha(u,v),\forall u,v\in V,\alpha\in\mathbb{F}$；
3. $(u,v)=\overline{(v,u)},\forall u,v\in V$；
4. $(u,u)\geq 0,\forall u\in V$，且$(u,u)=0\Leftrightarrow u=\theta$。

则称$(u,v)$是$u$和$v$的**内积**，定义了内积的空间称为**内积空间**。

**欧氏空间上的一种内积** $\vec{x},\vec{y}\in\mathbb{R}^n$，则内积定义为：

$$(\vec{x},\vec{y})=\vec{y}^T\vec{x}$$

**酉空间上的一种内积** $\vec{x},\vec{y}\in\mathbb{C}^n$，则内积定义为：

$$(\vec{x},\vec{y})=\overline{\vec{y}}^T\vec{x}$$

此外也可以定义一种带权内积：$(\vec{x},\vec{y})_\omega=\sum\limits_{i=1}^n\omega_ix_iy_i$。

**正交的定义** 若向量$\vec{x},\vec{y}\in\mathbb{R}^n$满足$(\vec{x},\vec{y})=0$，则称它们是**正交的**。两个向量的集合$X$和$Y$，如果每个$\vec{x}\in X$和每个$\vec{y}\in Y$正交，则称$X$与$Y$正交。

**正交集合的定义** $S$是非零向量的集合，若$\forall\vec{x},\vec{y}\in S(\vec{x}\neq\vec{y}\rightarrow(\vec{x},\vec{y})=0)$，则称其为**正交集合**。

**定理正交是线性无关的充分条件** 正交集合$S$中的向量是线性无关的。

证：假设$S=\{\vec{x}_1,\vec{x}_2,\cdots,\vec{x}_n\}$，假设有$\sum\limits_{i=1}^nk_i\vec{x}_i=\vec{0}$，两边同时点乘$x_j$，有$\sum\limits_{i=1}^nk_i\vec{x}_i^T\vec{x}_j=k_j\vec{x}_j^T\vec{x}_j=0$，由$\vec{x}_j\neq\vec{0}$和正定性，我们知道$\vec{x}_j^T\vec{x}_j\neq 0$，故$k_j=0$，同理$k_i,i=1,2,\cdots,n=0$，集合$S$中的向量线性无关。

**正交基的推论** 若正交集合$S\subseteq\mathbb{R}^n$有$n$个向量，则它是$\mathbb{R}^n$的一组基。

**连续函数内积的定义** 设$f(x),g(x)\in C[a,b]$，则它们的$L^2$内积为：

$$(f,g)=\int_a^bf(x)g(x)dx$$

**权函数的定义** 若定在$[a,b]$上的可积函数$\rho(x)$满足:

1. $\rho(x)\geq 0,\forall x\in[a,b]$；
2. 在$[a,b]$的任一子区间上$\rho(x)$不恒为零。

称$\rho(x)$为$[a,b]$上的一个**权函数**。

利用权函数可以定义带权$L^2$内积：

$$(f,g)_\rho=\int_a^b\rho(x)f(x)g(x)dx$$

**Cauchy-Schwarz不等式** 设$V$是一个内积空间，对任一的$u,v$有：

$$|(u,v)^2|\leq(u,u)(v,v)$$

等号成立当且仅当$u,v$线性相关。

证：这里仅给出实数域上的证明，对任意$u,v\in V,t\in\mathbb{R}$，考虑内积$(tu+v,tu+v)=(u,u)t^2+2(u,v)t+(v,v)\geq 0$，故判别式$\Delta=(2(u,v))^2-4(u,u)(v,v)<0$，得证。

**Gram-Schmidt正交化方法** 若$\{u_1,u_2,\cdots,u_n\}$是内积空间$V$中的一个线性无关元素系列，则：

$$\begin{cases}
  v_1=u_1\\
  v_i=u_i-\sum\limits_{k=1}^{i-1}\frac{(u_i,v_k)}{(v_k,v_k)}v_k,i=2,3,\cdots
\end{cases}$$

生成$V$中一个正交序列$\{v_1,v_2,\cdots,v_n\}$是$\mathrm{span}\{u_1,u_2,\cdots,u_n\}$的一组基。

若要求归一化，$q_i=\frac{1}{\sqrt{(v_i,v_i)}}v_i$。则可得到QR分解。

**经典的Gram-Schmidt正交化**：

1. $j=1,\cdots, n$：
   1. 计算$r_{ij}:=(\vec{u}_j,\vec{q}_i), i=1,2,\cdots,j-1$；
   2. 计算$\vec{q}'=\vec{u}_j-\sum\limits_{i=1}^{j-1}r_{ij}\vec{q}_i$；
   3. 计算$r_{jj}=\|\vec{q}'\|_2$，如果$r_{jj}=0$，停止，否则$\vec{q}_j:=\frac{\vec{q}'}{r_{jj}}$；

**改进的Gram-Schmidt正交化**：

1. $j=1,\cdots, n$：
   1. 令$\vec{q}':=\vec{u}_j$；
   2. $i=1,\cdots, j-1$：
      1. 计算$r_{ij}:=(\vec{q}',q_i), i=1,2,\cdots,j-1$；
      2. 计算$\vec{q}'=\vec{q}'-r_{ij}\vec{q}_i$；
   3. 计算$r_{jj}=\|\vec{q}'\|_2$，如果$r_{jj}=0$，停止，否则$\vec{q}_j:=\frac{\vec{q}'}{r_{jj}}$；

<java-script-editor-with-tests function-name="qrDecomposition" :function-parameters="['u']" :predefined="qrDecompositionPredefined" :initial-test-cases="qrDecompositionTestCases" :test-result-width="500" :correct=qrDecompositionCorrect>
<template v-slot:test-name="{ index }">
测试 {{ index + 1 }}
</template>
<template v-slot:test-result="{ test, result, exception, success, correctness, time, evaluation }">
<!-- 运行结果 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div v-if="correctness" class="overflow-auto green--text">正确</div>
<div v-else-if="success" class="overflow-auto orange--text">错误，{{ evaluation && evaluation[1] }}</div>
<div v-else class="overflow-auto red--text">异常，抛出 {{ exception }}</div>
</div>
<!-- 运行时间 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{ (Math.round(time * 1000) / 1000).toFixed(3) }} ms</div>
</div>
<!-- 输入 -->
<div class="subtitle-1 pr-4 primary--text text-no-wrap">输入：</div>
<mathjax :formula="`U=${convertMartix(test[0][0])}`" display />
<!-- 返回值 -->
<div class="subtitle-1 pr-4 primary--text text-no-wrap">返回值：</div>
<mathjax v-if="evaluation && evaluation[2]" :formula="`Q=${convertMartix(result[0])}`" display />
<mathjax v-if="evaluation && evaluation[3]" :formula="`R=${convertMartix(result[1])}`" display />
<!-- 检验 -->
<div class="subtitle-1 pr-4 primary--text text-no-wrap">检验：</div>
<mathjax v-if="evaluation && evaluation[4]" :formula="`QR=${convertMartix(evaluation[4])},MSE=${convertNumber(evaluation[5])}`" display />
<mathjax v-if="evaluation && evaluation[6]" :formula="`Q^TQ=${convertMartix(evaluation[6])},MSE=${convertNumber(evaluation[7])}`" display />
</template>
</java-script-editor-with-tests>

### 4.3 范数、赋范线性空间

**范数的定义** 设$V$是数域$\mathbb{F}$上的线性空间，定义$\|\cdot\|:V\to\mathbb{R}$，满足：

1. 正定性：$\|u\|\geq 0,\forall u\in V$，且$\|u\|=0\Leftrightarrow u=\theta$；
2. 齐次性：$\|\alpha u\|=|\alpha|\|u\|,\forall u\in V,\alpha\in\mathbb{R}$；
3. 三角不等式：$\|u+v\|\leq\|u\|+\|v\|,\forall u,v\in V$。

称$\|\cdot\|$为$V$的**范数（模）**，定义了范数的线性空间称为**赋范线性空间**。

**常见的范数** 对于$\vec{x}=[x_1,x_2,\cdots,x_n]^T$可定义范数结构：

- $\infty$-范数：$\|\vec{x}\|_{\infty}=\max_{1\leq i\leq n}|x_i|$；
- $1$-范数：$\|\vec{x}\|_1=\sum\limits_{i=1}^n|x_i|$；
- $2$-范数：$\|\vec{x}\|_2=(\sum\limits_{i=1}^n|x_i|^2)^{1/2}$；
- $p$-范数：$\|\vec{x}\|_p=(\sum\limits_{i=1}^n|x_i|^p)^{1/p}$。

**内积与2-范数的关系** 通过内积可定义$2$-范数：

$$\|x\|_2=\sqrt{(x, x)}$$

设$\vec{x},\vec{y}\in\mathbb{R}^n$，其**夹角**$\alpha$被定义为：

$$\cos\alpha=\frac{(\vec{x},\vec{y})}{\|\vec{x}\|_2\|\vec{y}\|_2}$$

平行时，即$\alpha=0$或$\alpha=\pi$时，Cauchy-Schwarz不等式取等号。

**距离的定义** 设$X$是任一非空集合，$X$中的任意两点$x,y$有$d(x,y)\in\mathbb{R}$与之一一对应，且满足：

1. 非负性：$d(x,y)\geq 0$，且$d(x,y)=0\Leftrightarrow x=y$；
2. 对称性：$d(x,y)=d(y,x)$；
3. 三角不等式：$d(x,y)\leq d(x,z)+d(z,y)$。

称$d(x,y)$是$X$上的一个**距离**，定义了距离的集合$X$称为一个**距离空间**。

**范数与距离的关系** 设$V$是赋范空间，则$u,v\in V$的距离可定义为：

$$d(u,v)=\|u-v\|$$

**常见距离相似度**：

1. Hamming距离：序列最小替换以相同的树木；
2. 欧氏距离：$\|\vec{x}-\vec{y}\|_2$；
3. 曼哈顿距离：$\|\vec{x}-\vec{y}\|_1$；
4. 切比雪夫距离：$\|\vec{x}-\vec{y}\|_\infty$；
5. 余弦距离（实际上是相似度）：$\cos\theta=\frac{(\vec{x},\vec{y})}{\|\vec{x}\|_2\|\vec{y}\|_2}$；
6. Jaccard相似系数：$J(A,B)=\frac{|A\cap B|}{|A\cup B|}$；
7. 相关系数$\rho_{XY}=\frac{\mathrm{Cov}(X,Y)}{\sigma_X\sigma_Y}=\frac{E((X-E(X))(Y-E(Y)))}{\sigma_X\sigma_Y}$。

**K近邻（KNN）算法** 监督学习，选取最近的$K$个训练数据点，预测数据分类为这$K$个数据点的多数类别。

**k-means聚类算法** 无监督学习，确定有$k$个分类后，选择$k$个距离较远的初始数据点作为质心，而后每个数据点离哪个质心近，就归类为质心所属的集合，再重新计算每个集合的质心，循环往复直到质心位置变化量小。

**范数等价** 设$\|\cdot\|_\alpha$和$\|\cdot\|_\beta$是线性空间$V$的两个范数，若存在正的常数$C_1$和$C_2$，使得：

$$C_1\|u\|_\alpha\leq\|u\|_\beta\leq C_2\|u\|_\alpha,\forall u\in V$$

则称范数$\|\cdot\|_\alpha$和范数$\|\cdot\|_\beta$等价。

有限维空间中的任意两个范数等价。

## 5 几种常见矩阵的性质

### 5.1 正交矩阵和酉矩阵

**正交矩阵的定义** 设$\mathbf{Q}\in\mathbb{R}^{n\times n}$，若满足：

$$\mathbf{Q}^T\mathbf{Q}=\mathbf{I}$$

则称$\mathbf{Q}$为**正交矩阵**。

**正交矩阵的性质** 正交矩阵有如下的性质：

1. $\mathbf{Q}$不同的列向量相互正交，且各列向量的2-范数为1；
2. $\mathbf{Q}^{-1}=\mathbf{Q}^T$，且$\mathbf{Q}^T$也是正交矩阵；
3. $|\det\mathbf{Q}|=1$；
4. 若$\mathbf{A}$和$\mathbf{B}$是同阶的正交矩阵，则$\mathbf{A}\mathbf{B}$和$\mathbf{B}\mathbf{A}$都是正交矩阵。

### 5.2 对称矩阵和对称正定矩阵

**对称阵的定义** 如果$\mathbf{A}\in\mathbb{R}^{n\times n}$，有$A^T=A$，则称$\mathbf{A}$为对称阵。

**对称阵的性质**：

1. $\mathbf{A}$的特征值均为实数，且有$n$个线性无关的特征向量；
2. $\mathbf{A}$对应于不同特征值的特征向量必正交；
3. 存在正交阵$\mathbf{Q}$使得$\mathbf{Q}^{-1}\mathbf{A}\mathbf{Q}$为对角阵。

性质1的证明：

$$\begin{aligned}
&\mathbf{A}\vec{x}=\lambda\vec{x}\\
\Rightarrow&\overline{\mathbf{A}\vec{x}}=\overline{\lambda\vec{x}}\\
\Rightarrow&\mathbf{A}\overline{\vec{x}}=\overline{\lambda}\overline{\vec{x}}\\
\Rightarrow&\vec{x}^T\mathbf{A}\overline{\vec{x}}=\vec{x}^T\overline{\lambda\vec{x}}\\
\Rightarrow&(\mathbf{A}\vec{x})^T\overline{\vec{x}}=\overline{\lambda}\vec{x}^T\overline{\vec{x}}\\
\Rightarrow&\lambda\vec{x}^T\overline{\vec{x}}=\overline{\lambda}\vec{x}^T\overline{\vec{x}}\\
\Rightarrow&\lambda-\overline{\lambda}=0
\end{aligned}$$

### 5.3 初等矩阵

### 5.4 可约矩阵

### 5.5 对角占优矩阵

<!-- markdownlint-disable -->
<script>
const qrDecompositionOrigin = `\
  const q = u.map(x => x.slice());
  const r = Array(u[0].length).fill().map(x => Array(u[0].length).fill(0));
  for (let j = 0; j < q[0].length; ++j) {
    for (let i = 0; i < j; ++i) {
      for (let k = 0; k < q.length; ++k) {
        r[i][j] += q[k][j] * q[k][i];
      }
    }
    for (let i = 0; i < j; ++i) {
      for (let k = 0; k < q.length; ++k) {
        q[k][j] -= r[i][j] * q[k][i];
      }
    }
    for (let k = 0; k < q.length; ++k) {
      r[j][j] += q[k][j] * q[k][j];
    }
    if (r[j][j] === 0) {
      break;
    }
    r[j][j] = Math.sqrt(r[j][j]);
    for (let k = 0; k < q.length; ++k) {
      q[k][j] /= r[j][j];
    }
  }
  return [q, r];`

const qrDecompositionModified = `\
  const q = u.map(x => x.slice());
  const r = Array(u[0].length).fill().map(x => Array(u[0].length).fill(0));
  for (let j = 0; j < q[0].length; ++j) {
    for (let i = 0; i < j; ++i) {
      for (let k = 0; k < q.length; ++k) {
        r[i][j] += q[k][j] * q[k][i];
      }
      for (let k = 0; k < q.length; ++k) {
        q[k][j] -= r[i][j] * q[k][i];
      }
    }
    for (let k = 0; k < q.length; ++k) {
      r[j][j] += q[k][j] * q[k][j];
    }
    if (r[j][j] === 0) {
      break;
    }
    r[j][j] = Math.sqrt(r[j][j]);
    for (let k = 0; k < q.length; ++k) {
      q[k][j] /= r[j][j];
    }
  }
  return [q, r];`

const epsilon = 1e-8;

const qrDecompositionTestCases = [
  [[[
    [1, 1, 1],
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 0]
  ]]],
  [[[
    [1, 1, 1],
    [epsilon, 0, 0],
    [0, epsilon, 0],
    [0, 0, epsilon]
  ]]]
]

function isMatrix (matrix, m, n) {
  if (!Array.isArray(matrix) || matrix.length !== m) {
    return false
  }
  for (const row of matrix) {
    if (!Array.isArray(row) || row.length !== n ||
        !row.every(x => typeof x === 'number')) {
      return false
    }
  }
  return true
}

function matrixMultiply (a, b) {
  const result = Array(a.length).fill().map(() => Array(b[0].length).fill(0))
  for (let i = 0; i < a.length; ++i) {
    for (let j = 0; j < b[0].length; ++j) {
      for (let k = 0; k < a[0].length; ++k) {
        result[i][j] += a[i][k] * b[k][j]
      }
    }
  }
  return result
}

function matrixMSE (a, b) {
  let result = 0
  for (let i = 0; i < a.length; ++i) {
    for (let j = 0; j < a[0].length; ++j) {
      result += (a[i][j] - b[i][j]) * (a[i][j] - b[i][j])
    }
  }
  result /= a.length * a[0].length
  return result
}

function matrixEye (n) {
  const result = Array(n).fill().map(() => Array(n).fill(0))
  for (let i = 0; i < n; ++i) {
    result[i][i] = 1
  }
  return result
}

function matrixTranspose (a) {
  const result = Array(a[0].length).fill().map(() => Array(a.length))
  for (let i = 0; i < a.length; ++i) {
    for (let j = 0; j < a[0].length; ++j) {
      result[j][i] = a[i][j]
    }
  }
  return result
}

export default {
  data: () => ({
    qrDecompositionPredefined: [
      { name: '经典', code: qrDecompositionOrigin },
      { name: '改进', code: qrDecompositionModified }
    ],
    qrDecompositionTestCases
  }),
  methods: {
    qrDecompositionCorrect (test, result) {
      if (!Array.isArray(result)) {
        return [false, '应返回Q，R组成的元组']
      }
      const u = test[0][0]
      const [q, r] = result
      if (!isMatrix(q, u.length, u[0].length)) {
        return [false, 'Q不是合法的矩阵']
      }
      if (!isMatrix(r, u[0].length, u[0].length)) {
        return [false, 'R不是合法的矩阵', true]
      }
      const qr = matrixMultiply(q, r)
      const qr_mse = matrixMSE(u, qr)
      const qq = matrixMultiply(matrixTranspose(q), q)
      const qq_mse = matrixMSE(matrixEye(u[0].length), qq)
      if (isNaN(qr_mse) || qr_mse > epsilon) {
        return [false, `QR!=U, MSE=${qr_mse}`, true, true, qr, qr_mse, qq, qq_mse]
      }
      if (isNaN(qq_mse) || qq_mse > epsilon) {
        return [false, `Q^TQ!=I, MSE=${qq_mse}`, true, true, qr, qr_mse, qq, qq_mse]
      }
      return [true, '', true, true, qr, qr_mse, qq, qq_mse]
    },
    convertNumber (number) {
      if (Math.abs(number) < epsilon) {
        return '0'
      }
      const string = number.toString()
      const index = string.indexOf('e')
      if (index < 0) {
        const dotIndex = string.indexOf('.')
        if (dotIndex < 0) {
          return string
        } else {
          return `${string.slice(0, dotIndex)}.${string.slice(dotIndex + 1, dotIndex + 7)}`
        }
      } else {
        return `${string.slice(0, Math.min(index, 6))}\\times 10^{${string.slice(index + 1)}}`
      }
    },
    convertMartix (matrix) {
      return `\\begin{bmatrix}${matrix.map(row => row.map(this.convertNumber).join('&')).join('\\\\')}\\end{bmatrix}`
    }
  }
}
</script>
<!-- markdownlint-restore -->
