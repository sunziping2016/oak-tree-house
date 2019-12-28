---
title: 线性代数复习笔记（上）
date: 2018-10-23T04:18:40Z
category: 数学
tags: [线性代数, 数学]
summary: 这篇文章是我数学复习计划的一部分，内容参考清华大学出版社的《线性代数与几何（第2版）》上册。
---

这篇文章是我数学复习计划的一部分，内容参考清华大学出版社的《线性代数与几何（第2版）》上册。

<!--more-->

## 1 预备知识

设$\mathbb{F}$是$\mathbb{C}$的子集，且满足：

1. 至少含有一个非零数；
2. 对加减乘除运算封闭。

则$\mathbb{F}$是**数域**。

所有的数域都含有$\mathbb{Q}$。

## 2 行列式

首先引入**$n$阶排列**、**逆序数**$\tau$、**奇排列**和**偶排列**的概念。

有如下的3个定理：

1. **对换**操作改变排列的奇偶性。
2. 所有的$n$阶排列中（$n\geq2$），奇偶各占一半。
3. $n$阶排列通可过对换操作转为自然排列，奇偶次数与排列的奇偶性一致。

然后引入**n阶行列式**的概念：

$$D =
\begin{vmatrix}
  a_{11} & a_{12} & \dots & a_{1n} \\\\
  a_{21} & a_{22} & \dots & a_{2n} \\\\
  \vdots & \vdots &       & \vdots \\\\
  a_{n1} & a_{n2} & \dots & a_{nn} \\\\
\end{vmatrix} = \sum_{j_1j_2 \dots j_n} (-1)^{\tau(j_1j_2 \dots j_n)}
a_{1j_1}a_{2j_2} \dots a_{nj_n}$$

行列式有如下的性质：

1. 转置值不变；
2. 数乘某行等于该数乘行列式；
    - 推论：某一行全为0的行列式为0；
3. 行列式对行的加法具有分配律；
4. 对换两行，行列式反号；
5. 两行成比例，行列式为0；
6. 把一行的倍数加到另一行，行列式不变。

引入**余子式**$M_{ij}$和**代数余子式**$A_{ij}=(-1)^{i+j}M_{ij}$的概念。则有：

$$\sum_{s=i}^n a_{is}A_{ks} =
\begin{cases}
D, i = k, \\\\
0, i \neq k
\end{cases} = \delta_{ik}D$$

因而行列式可以按行或按列展开。

**克莱姆法则**。对于线性方程组：
$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + &\dots + a_{1n}x_n = b_1, \\\\
a_{21}x_1 + a_{22}x_2 + &\dots + a_{2n}x_n = b_1, \\\\
&\vdots \\\\
a_{n1}x_1 + a_{n2}x_2 + &\dots + a_{nn}x_n = b_1, \\\\
\end{cases}$$

若其系数行列式不为0，则方程组有唯一解：
$$x_j = \frac{D_j}{D}$$
其中$D$为系数行列式，$D_j$为常数项替换$D$第$j$列得到的行列式。

对于齐次线性方程组系数行列式非0，则只有0解。

## 3 矩阵

### 3.1 高斯消元法

**线性方程组的初等变换**有：

1. 用非零数乘方程；
2. 将一个方程的$k$倍加到另一个方程；
3. 交换两方程。

与之对应的是对**增广矩阵**的变换，称为**矩阵的行初等变换**。

**高斯消元法**：通过初等变换使增广矩阵个变为如下的阶梯形矩阵：

$$\begin{bmatrix}
c_{11} & c_{12} & \dots  & c_{1r} & \dots & c_{1n} & d_1     \\\\
       & c_{22} & \dots  & c_{2r} & \dots & c_{2n} & d_2     \\\\
       &        & \ddots & \vdots &       & \vdots & \vdots  \\\\
       &        &        & c_{rr} & \dots & c_{rn} & d_r     \\\\
       &        &        &        &       &        & d_{r+1} \\\\
       &        &        &        &       &        & 0       \\\\
       &        &        &        &       &        & \vdots  \\\\
       &        &        &        &       &        & 0       \\\\
\end{bmatrix}$$

有如下情况：

1. $d_{r+1} \neq 0$，无解；
2. $d_{r+1} = 0$且$r = n$，有唯一解；
3. $d_{r+1} = 0$且$r < n$，有无穷多解，其中$x_{r+1},x_{r+2},\dots,x_n$称为自由变量。

对于齐次线性方程组：
$$\begin{cases}
a_{11}x_1 + a_{12}x_2 + &\dots + a_{1n}x_n = 0, \\\\
a_{21}x_1 + a_{22}x_2 + &\dots + a_{2n}x_n = 0, \\\\
&\vdots \\\\
a_{m1}x_1 + a_{m2}x_2 + &\dots + a_{mn}x_n = 0, \\\\
\end{cases}$$

如果$m<n$，则一定有非零解。当$m=n$时，方程组有非0解$\Leftrightarrow$系数行列式$D=0$。

### 3.2 矩阵的运算

引入了**矩阵**、**元素**、**零矩阵**、**单位矩阵**、**纯量矩阵**和**上（下）三角矩阵**的概念。

定义了矩阵的加法、数乘、乘法。并满足：

1. 有零元
2. 有单位元
3. 乘法结合律
4. 左分配律和右分配律

定义了矩阵的转置$\mathbf{A}^\mathrm{T}$。引入了**对称矩阵**，**反对称矩阵**的概念。转置满足：

1. $(\mathbf{A}^\mathrm{T})^\mathrm{T}=\mathbf{A}$
2. $(\mathbf{A}+\mathbf{B})^\mathrm{T}=\mathbf{A}^\mathrm{T}+\mathbf{B}^\mathrm{T}$
3. $(k\mathbf{A})^\mathrm{T}=k\mathbf{A}^\mathrm{T}$
4. $(\mathbf{A}\mathbf{B})^\mathrm{T}=\mathbf{B}^\mathrm{T}\mathbf{A}^\mathrm{T}$

矩阵的多项式满足交换律：$f(\mathbf{A})g(\mathbf{A})=g(\mathbf{A})f(\mathbf{A})$。

### 3.3 逆矩阵

$\det(\mathbf{A}\mathbf{B})=\det\mathbf{A}\det\mathbf{B}$。

对于$n$阶方阵$\mathbf{A}$，若$\mathbf{A}\mathbf{B}=\mathbf{B}\mathbf{A}=\mathbf{I}$，则$\mathbf{A}$是**可逆的**，$\mathbf{B}$是$\mathbf{A}$的**逆矩阵**。若不存在这样的$\mathbf{B}$，则$\mathbf{A}$是**不可逆的**。有左逆就有右逆。逆矩阵唯一且满足：

1. $(\mathbf{A}^{-1})^{-1}=\mathbf{A}$
2. $(\mathbf{A}\mathbf{B})^{-1}=\mathbf{B}^{-1}\mathbf{A}^{-1}$
3. $(\mathbf{A}^\mathrm{T})^{-1}=(\mathbf{A}^{-1})^\mathrm{T}$

定义伴随矩阵：
$$\mathbf{A}^*=\begin{bmatrix}
  A_{11} & A_{21} & \dots & A_{n1} \\\\
  A_{12} & A_{22} & \dots & A_{n2} \\\\
  \vdots & \vdots &       & \vdots \\\\
  A_{1n} & A_{2n} & \dots & A_{nn} \\\\
\end{bmatrix}$$

$\mathbf{A}$可逆$\Leftrightarrow \det\mathbf{A}\neq 0$。$\mathbf{A}$可逆时：
$$\mathbf{A}^{-1}=\frac{1}{\det\mathbf{A}}\mathbf{A}^*$$

设$\mathbf{A}\in M_n$：

1. 若$\mathbf{A}$可逆，则$\mathbf{A}\vec{x}=\vec{b}$有唯一解$\mathbf{A}^{-1}\vec{b}$；
2. $\mathbf{A}$不可逆$\Leftrightarrow \mathbf{A}\vec{x}=\vec{0}$有非0解。

### 3.4 分块矩阵

引入了**分块矩阵**的概念，并讨论了其加法、数乘、转置和乘法。对于乘法$\mathbf{A}\mathbf{B}$，$\mathbf{A}$的列划分需要与$\mathbf{B}$的行划分一致）。

### 3.5 矩阵的初等变换

矩阵的行初等变换和矩阵的列初等变换统称为**矩阵的初等变换**。

单位矩阵经过一次初等变换得到的矩阵称为**初等矩阵**。它们是：

1. $\mathbf{E}_i(\lambda)$：$\lambda$乘以第$i$行；
2. $\mathbf{E}_{i,j(\mu)}$：第$i$行的$\mu$倍加到第$j$行；
3. $\mathbf{E}_{i,j}$：交换第$i$行和第$j$行。

初等矩阵都是可逆的。

用初等矩阵左乘矩阵相当于做初等行变换，用初等矩阵右乘矩阵相当于做初等列变换。

若矩阵$\mathbf{B}$可以由矩阵$\mathbf{A}$经过一系列初等变换得到，则$\mathbf{A}$与$\mathbf{B}$相抵，记作$\mathbf{A}\simeq\mathbf{B}$。这是一种等价关系。

任何一个矩阵都与形如$\begin{bmatrix}
\mathbf{I}_r & \mathbf{0} \\\\
\mathbf{0}   & \mathbf{0} \\\\
\end{bmatrix}$的矩阵相抵，称为**相抵标准形**。有如下几条推论：

1. 对于$\mathbf{A}\in M_{m,n}$，存在一系列$m$阶初等矩阵$\mathbf{P}_1,\mathbf{P}_2,\dots,\mathbf{P}_s$和$n$阶初等矩阵$\mathbf{Q}_1,\mathbf{Q}_2,\dots,\mathbf{Q}_t$，使得：
  $$\mathbf{P}_s\dots\mathbf{P}_2\mathbf{P}_1\mathbf{A}\mathbf{Q}_1\mathbf{Q}_2\dots\mathbf{Q}_t=\begin{bmatrix}
  \mathbf{I}_r & \mathbf{0} \\\\
  \mathbf{0}   & \mathbf{0} \\\\
  \end{bmatrix}$$
2. 对于$\mathbf{A}\in M_{m,n}$，存在可逆矩阵$\mathbf{P}\in M_m$和可逆矩阵$\mathbf{Q}\in M_n$，使得：
  $$\mathbf{P}\mathbf{A}\mathbf{Q}=\begin{bmatrix}
  \mathbf{I}_r & \mathbf{0} \\\\
  \mathbf{0}   & \mathbf{0} \\\\
  \end{bmatrix}$$
3. 对于$\mathbf{A}\in M_{m}$，$\mathbf{A}$可逆$\Leftrightarrow \mathbf{A}\simeq\mathbf{I} \Leftrightarrow \mathbf{A}$可表示成有限个初等矩阵的乘积。

由于$\mathbf{A}^{-1}\begin{bmatrix}\mathbf{A}&\mathbf{I}\end{bmatrix}=\begin{bmatrix}\mathbf{I}&\mathbf{A}^{-1}\end{bmatrix}$，因此不断对$\begin{bmatrix}\mathbf{A}&\mathbf{I}\end{bmatrix}$进行初等行变换，使子块$\mathbf{A}$化作$\mathbf{I}$，则子块$\mathbf{I}$就化作了$\mathbf{A}^{-1}$，否则$\mathbf{A}$不可逆。

同样分块矩阵也有初等变换。

## 4 几何空间中的向量

### 4.1 向量及其运算

引入了**向量**（既有方向又有大小的几何解释）、向量的**相等**、**反向量**、**零向量**和**单位向量**的概念。

定义了向量的加法、减法和数乘。均满足线性空间的要求。

$\vec{\alpha},\vec{\beta}$共线$\Leftrightarrow$存在不全为0的数$\lambda,\mu$，使$\lambda\vec{\alpha}+\mu\vec{\beta}=0$。

$\vec{\alpha},\vec{\beta},\vec{\gamma}$共线$\Leftrightarrow$存在不全为0的数$k_1,k_2,k_3$，使$k_1\vec{\alpha}+k_2\vec{\beta}+k_3\vec{\gamma}=0$。

### 4.2 仿射坐标系

引入了**仿射坐标系**（三维）、**坐标向量**（又称**基础向量**，**基**）、**坐标轴**、**坐标平面**和**坐标轴**的概念。

根据坐标向量的位置关系，可分为**右手仿射坐标系**和**左手仿射坐标系**。

三个向量$\vec{\alpha_1}=(x_1,x_2,x_3),\vec{\alpha_2}=(y_1,y_2,y_3),\vec{\alpha_3}=(z_1,z_2,z_3)$共面$\Leftrightarrow \begin{vmatrix}
x_1 & x_2 & x_3 \\\\
y_1 & y_2 & y_3 \\\\
z_1 & z_2 & z_3 \\\\
\end{vmatrix}=0$

**直角坐标系**是坐标向量两两垂直且是单位向量的仿射坐标系。引入了方向角和方向余弦的概念。三个方向角不独立，满足：
$$\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$$

### 4.3 数量积、向量积与混合积

定义**数量积**$\vec{\alpha}\cdot\vec{\beta}=|\vec{\alpha}| |\vec{\beta}| \cos\langle\vec{\alpha},\vec{\beta}\rangle$。满足：

1. 交换律
2. 对加法的分配律
3. 可提出因子
4. 正定性

在仿射坐标系$\\{O;\vec{e_1},\vec{e_2},\vec{e_3}\\}$下，$\vec{\alpha}=x_1\vec{e_1}+x_2\vec{e_2}+x_3\vec{e_3},\vec{\beta}=y_1\vec{e_1}+y_2\vec{e_2}+y_3\vec{e_3}$，其数量积：
$$\vec{\alpha}\cdot\vec{\beta}=(x_1,x_2,x_3)\begin{bmatrix}a&k&h\\\\k&b&g\\\\h&g&c\end{bmatrix}\begin{bmatrix}y_1\\\\y_2\\\\y_3\end{bmatrix}$$

其中的矩阵如下表，被称为**度量矩阵**：
$$\begin{array}{c:ccc}
\cdot     & \vec{e_1} & \vec{e_2} & \vec{e_3} \\\\ \hdashline
\vec{e_1} & a         & k         & h         \\\\
\vec{e_2} & k         & b         & g         \\\\
\vec{e_3} & h         & g         & c         \\\\
\end{array}$$

$\vec{\alpha}\bot\vec{\beta}\Leftrightarrow\vec{\alpha}\vec{\beta}=0$。

定义**向量积**$\vec{\alpha}\times\vec{\beta}$的方向为与它们垂直的右手系方向，模为$|\vec{\alpha}| |\vec{\beta}| \sin\langle\vec{\alpha},\vec{\beta}\rangle$。满足

1. 反交换律：$\vec{\alpha}\times\vec{\beta}=-\vec{\beta}\times\vec{\alpha}$
2. 可提出因子
3. 对加法的分配律

在右手直角坐标系$\\{O;\vec{i},\vec{j},\vec{k}\\}$中，向量积可表示为：
$$\vec{\alpha}\times\vec{\beta}=\begin{vmatrix}
\vec{i} & \vec{j} & \vec{k} \\\\
x_1     & x_2     & x_3     \\\\
y_1     & y_2     & y_3     \\\\
\end{vmatrix}$$

$\vec{\alpha}\parallel\vec{\beta}\Leftrightarrow\vec{\alpha}\times\vec{\beta}=0$。

定义**混合积**$(\vec{\alpha},\vec{\beta},\vec{\gamma})=(\vec{\alpha}\times\vec{\beta})\cdot\vec{\gamma}$。满足：

1. $(\vec{\alpha},\vec{\beta},\vec{\gamma}) = (\vec{\beta},\vec{\gamma},\vec{\alpha}) = (\vec{\gamma},\vec{\alpha},\vec{\beta})$
2. $(\vec{\alpha},\vec{\beta},\vec{\gamma}) = -(\vec{\beta},\vec{\alpha},\vec{\gamma})$

其几何意义是平行六面体体积。在右手直角坐标系中，混合积可表示为。
$$(\vec{\alpha},\vec{\beta},\vec{\gamma})=\begin{vmatrix}
x_1 & x_2 & x_3 \\\\
y_1 & y_2 & y_3 \\\\
z_1 & z_2 & z_3 \\\\
\end{vmatrix}$$

### 4.4 平面与直线

略

### 4.5 距离

略

## 5 向量空间

### 5.1 数域$\mathbb{F}$上的$n$维向量空间

引入了**向量**（有序数组的抽象解释）、**分量**、**行向量**、**列向量**和**零向量的概念**。

定义了向量的**相等**、**加法**和**数乘**，均满足线性空间的要求。

### 5.2 向量组的线性相关性

定义了**线性组合**、**线性表出**、**线性相关**和**线性无关**。

有如下的定理：

1. $n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关$\Leftrightarrow$有向量可被其余向量线性表出；
2. $n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性无关而$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s},\vec{\beta}$线性相关$\Rightarrow \vec{\beta}$可由$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性表出，且表示法唯一；
3. $n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关$\Leftrightarrow \mathbf{A}\vec{x}=\vec{0}$有非零解，其中$\mathbf{A}=(\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s})$；
4. $n$个$n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_n}$线性相关$\Leftrightarrow |\mathbf{A}|=0$；
5. $\mathbb{F}^n$中任意$n+1$个向量必定线性相关；
6. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}\in\mathbb{F}^m,\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_s}\in\mathbb{F}^n$，构造$s$个$m+n$维向量$\vec{\gamma_1}=\begin{bmatrix}\vec{\alpha_1}\\\\ \vec{\beta_1}\end{bmatrix},\vec{\gamma_2}=\begin{bmatrix}\vec{\alpha_2}\\\\ \vec{\beta_2}\end{bmatrix},\dots,\vec{\gamma_s}=\begin{bmatrix}\vec{\alpha_s}\\\\ \vec{\beta_s}\end{bmatrix}$则：

- $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关$\Rightarrow \vec{\gamma_1},\vec{\gamma_2},\dots,\vec{\gamma_s}$线性相关；
- $\vec{\gamma_1},\vec{\gamma_2},\dots,\vec{\gamma_s}$线性无关$\Rightarrow \vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性无关

### 5.3 向量组的秩

引入了向量组的线性表处、**向量组的等价**的概念。

有如下的定理：

1. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$可由$\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t}$线性表出，且$s>t$，则$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关；
2. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$可由$\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t}$线性表出，且$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性无关，则$s\leq t$。

向量组的等价是一种等价关系。引入了**极大线性无关组**（向量组的线性无关的部分，如再添加元素，都会使之线性相关）的概念。有如下的定理：

- 向量组的极大线性无关组的元素个数都相等。

因而引入了**向量组的秩**的概念。有如下的定理：

1. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$可由$\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t}$线性表出$\Rightarrow \operatorname{r}(\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s})\leq\operatorname{r}(\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t})$；
2. 等价的向量组的秩相等。

### 5.4 矩阵的秩

引入了矩阵的**行秩**和**列秩**的概念。有如下的定理：

1. 初等变换不改变矩阵的行秩和列秩；
2. 矩阵的行秩等于列秩。

进而引入了**矩阵的秩**的概念。

1. $\mathbf{A}\in M_{m,n}(\mathbb{F})$，而$\mathbf{P}\in M_m(\mathbb{F}),\mathbf{Q}\in M_n(\mathbb{F})$均为可逆矩阵，则$\operatorname{r}(\mathbf{P}\mathbf{A}\mathbf{Q})=\operatorname{r}(\mathbf{A})$；
2. 相抵标准型唯一；
3. $\mathbf{A},\mathbf{B}$相抵$\Leftrightarrow \operatorname{r}(\mathbf{A})=\operatorname{r}(\mathbf{B})$；
4. 矩阵的秩等于该矩阵的非零子式的最高阶数。

秩有如下的性质：

1. $\operatorname{r}(\mathbf{A}+\mathbf{B})\leq\operatorname{r}(\mathbf{A})+\operatorname{r}(\mathbf{B})$；
2. $\operatorname{r}(\mathbf{A})+\operatorname{r}(\mathbf{B})-n\leq\operatorname{r}(\mathbf{A}\mathbf{B})\leq\min\\{\operatorname{r}(\mathbf{A}),\operatorname{r}(\mathbf{B})\\}$；
3. $\operatorname{r}\left(\begin{bmatrix}\mathbf{A}&\mathbf{0}\\\\ \mathbf{0}&\mathbf{B}\end{bmatrix}\right)=\operatorname{r}(\mathbf{A})+\operatorname{r}(\mathbf{B})$；
4. $\operatorname{r}\left(\begin{bmatrix}\mathbf{A}&\mathbf{0}\\\\ \mathbf{C}&\mathbf{B}\end{bmatrix}\right)\geq\operatorname{r}(\mathbf{A})+\operatorname{r}(\mathbf{B})$；
5. $\max\\{\operatorname{r}(\mathbf{A}),\operatorname{r}(\mathbf{B})\\}\leq\operatorname{r}\left(\begin{bmatrix}\mathbf{A}&\mathbf{B}\end{bmatrix}\right)\leq\operatorname{r}(\mathbf{A})+\operatorname{r}(\mathbf{B})$；
6. 如$\operatorname{r}(\mathbf{A})=r$，则存在列满秩矩阵$\mathbf{G}\_{m\times r}$和行满秩矩阵$\mathbf{H}\_{r\times n}$，使$\mathbf{A}=\mathbf{G}\mathbf{H}$（**满秩分解**）。

### 5.5 齐次线性方程组

对于$n$个未知量的齐次线性方程组：

1. $\mathbf{A}\vec{x}=\vec{0}$有非零解$\Leftrightarrow\operatorname{r}(\mathbf{A})\leq n$；
2. $\mathbf{A}\vec{x}=\vec{0}$只有零解$\Leftrightarrow\operatorname{r}(\mathbf{A})=n$。

对于齐次线性方程组，其解的线性组合也是解。其解集的极大线性无关组称为**基础解系**。

$\mathbf{A}\vec{x}=\vec{0}$的基础解系含有$n-\operatorname{r}(\mathbf{A})$个向量。

### 5.6 非齐次线性方程组

$\mathbf{A}\vec{x}=\vec{b}$有解$\Leftrightarrow \operatorname{r}(\mathbf{A})=\operatorname{r}(\begin{bmatrix}\mathbf{A}&\vec{b}\end{bmatrix})$。

非齐次线性方程组的通解为特解加上对应的齐次线性方程组基础解系的线性组合。

## 6 线性空间

### 6.1 数域$\mathbb{F}$上的线性空间

引入了**线性空间**、**线性相关**、**线性无关**、**线性组合**、**线性表出**和**向量组的等价**的概念。有如下定理（自4.2和4.3复制过来）：

1. $n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关$\Leftrightarrow$有向量可被其余向量线性表出；
2. $n$维向量$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性无关而$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s},\vec{\beta}$线性相关$\Rightarrow \vec{\beta}$可由$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性表出，且表示法唯一；
3. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$可由$\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t}$线性表出，且$s>t$，则$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性相关；
4. $\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$可由$\vec{\beta_1},\vec{\beta_2},\dots,\vec{\beta_t}$线性表出，且$\vec{\alpha_1},\vec{\alpha_2},\dots,\vec{\alpha_s}$线性无关，则$s\leq t$。

还引入了**维度**$\operatorname{dim}$和**基**的概念。有如下定理：

- 如果线性空间$V$中有$n$个线性无关的向量，且$V$中任何向量可被其线性表出，那么$\operatorname{dim}V=n$且它们是$V$的一组基。

因而引入了**坐标**，**自然基**的概念。

设$\epsilon_1,\epsilon_2,\cdots,\epsilon_n$和$\eta_1,\eta_2,\cdots,\eta_n$是$V$的两组基，若：
$$\begin{cases}
\eta_1 = c_{11}\epsilon_1 + c_{21}\epsilon_2 + &\dots + c_{n1}\epsilon_n \\\\
\eta_2 = c_{12}\epsilon_1 + c_{22}\epsilon_2 + &\dots + c_{n2}\epsilon_n \\\\
                                               &\vdots            \\\\
\eta_n = c_{1n}\epsilon_1 + c_{2n}\epsilon_2 + &\dots + c_{nn}\epsilon_n \\\\
\end{cases}$$

可写成：

$$(\eta_1,\eta_2,\cdots,\eta_n)=(\epsilon_1,\epsilon_2,\cdots,\epsilon_n)\begin{bmatrix}
c_{11} & c_{12} & \cdots & c_{1n} \\\\
c_{21} & c_{22} & \cdots & c_{2n} \\\\
\vdots & \vdots &        & \vdots \\\\
c_{n1} & c_{n2} & \cdots & c_{nn} \\\\
\end{bmatrix}$$

上述矩阵称为由基$\epsilon_1,\epsilon_2,\cdots,\epsilon_n$到基$\eta_1,\eta_2,\cdots,\eta_n$的**过渡矩阵**。有如下定理：

- 设由基$\epsilon_1,\epsilon_2,\cdots,\epsilon_n$到基$\eta_1,\eta_2,\cdots,\eta_n$的过渡矩阵为$\mathbf{C}$，则$\mathbf{C}$可逆。如果一向量在两组基的坐标分别是$\vec{x},\vec{y}$，则$\vec{x}=\mathbf{C}\vec{y}$。

### 6.2 线性子空间

引入了**子空间**、**平凡子空间**（**零子空间**和本身）、**解空间**（**化零空间**）$N$、**列空间**$R$、向量组**生成的子空间**的概念。有如下定理：

1. 设$W$是线性空间$V$的非空子集，$W$是$V$的子空间$\Leftrightarrow$W对加法和数乘封闭；
2. $\mathbf{A}\in M_{m,n},\operatorname{r}(\mathbf{A})=r$，则$\operatorname{dim}N(\mathbf{A})=n-r$，基础解系构成一组基；
3. $\mathbf{A}\in M_{m,n},\operatorname{r}(\mathbf{A})=r$，则$\operatorname{dim}R(\mathbf{A})=r$，化为阶梯形矩阵主元对应的列构成一组基；
4. $\mathbf{A}\in M_{m,n},\mathbf{B}\in M_{n,s}$：
    1. $R(\mathbf{A}\mathbf{B})\subseteq R(\mathbf{A})$；
    1. $N(\mathbf{A}\mathbf{B})\supseteq N(\mathbf{B})$。

引入了子空间的**交**与**和**的概念。有如下的定理：

1. 子空间的交与和也是子空间；
2. $W$是有限维线性空间$V$的子空间，则$W$的任何一组基可以扩充为$V$的一组基；
3. $W_1,W_2$是有限维线性空间$V$的子空间，则$\operatorname{dim}W_1+\operatorname{dim}W_2=\operatorname{dim}(W_1+W_2)+\operatorname{dim}(W_1\cap W_2)$。

如果$W_1+W_2$任一向量在子空间的分解形式唯一，则$W_1+W_2$为$W_1$和$W_2$的**直和**$W_1\oplus W_2$。

1. $W_1+W_2$是直和$\Leftrightarrow$零向量表示方法唯一$\Leftrightarrow W_1\cap W_2=\\{\theta\\}\Leftrightarrow\operatorname{dim}W_1+\operatorname{dim}W_2=\operatorname{dim}(W_1+W_2)$（可推广到$n$个子空间的直和）；
2. $W_1$是$V$的子空间，则必存在$V$的子空间$W_2$，使$V=W_1\oplus W_2$。

### 6.3 线性空间的同构

保持线性关系的从一个线性空间到另一个线性空间的双射叫做**同构映射**，两个线性空间**同构**。同构映射有如下的性质：

1. 把零元素映射为零元素，负元素映射为负元素；
2. 保持线性组合不变；
3. 保持线性相关性不变；
4. 将基映射为基；
5. 复合映射仍为同构映射（同构是一种等价关系）。

有如下定理：

1. $n$维线性空间必同构于$\mathbb{F}$上的$n$维向量空间；
2. 两个有限维线性空间同构$\Leftrightarrow$其维数相等。

### 6.4 欧几里得空间

满足对称性、线性性和正定性的从两个向量到实数的映射称为**内积**$(\vec{\alpha},\vec{\beta})$，定义了内积的实线性空间称为**欧几里得空间**。

由此可以定义**长度**$|\alpha|=\sqrt{(\vec{\alpha},\vec{\alpha})}$、**单位向量**和**单位化**。

**柯西-施瓦茨不等式**：$(\vec{\alpha},\vec{\beta})^2\leq|\vec{\alpha}|^2|\vec{\beta}|^2$。

由此可以定义**夹角**$\cos\theta=\frac{(\vec{\alpha},\vec{\beta})}{|\vec{\alpha}||\vec{\beta}|}$、正交和正交向量组。有如下定理：

1. 正交向量组线性无关；
2. 正交向量组个数不会超过维度。

由此引入了**正交基**和**标准正交基**的概念。有如下的定理：

1. $\vec{\epsilon_1},\vec{\epsilon_2},\cdots,\vec{\epsilon_n}$是$n$维欧氏空间$V$中的一组标准正交基，设$\vec{\alpha}\in V$的坐标为$\vec{x}=(x_1,x_2,\cdots,x_n)^\mathrm{T}$，则$x_i=(\vec{\alpha},\vec{\epsilon_i})$；
2. $\vec{\epsilon_1},\vec{\epsilon_2},\cdots,\vec{\epsilon_n}$是$n$维欧氏空间$V$中的一组标准正交基，对$\alpha=(\vec{\epsilon_1},\vec{\epsilon_2},\cdots,\vec{\epsilon_n})\vec{x},\beta=(\vec{\epsilon_1},\vec{\epsilon_2},\cdots,\vec{\epsilon_n})\vec{y}$，有$(\vec{\alpha},\vec{\beta})=\vec{x}^\mathrm{T}\vec{y}=\sum_{i=1}^n x_iy_i$。

**施密特正交化**：对任意$s$个线性无关的向量$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_s}$，先将其转换为一个正交向量组$\vec{\beta_1},\vec{\beta_2},\vec{\beta_s}$，其中，
$$\begin{align}
\vec{\beta_1}&=\vec{\alpha_1}, \vec{\beta_2}=\vec{\alpha_2}-\frac{(\vec{\alpha_2},\vec{\beta_1})}{(\vec{\beta_1},\vec{\beta_1})}\vec{\beta_1}, \\\\
&\vdots \\\\
\vec{\beta_s}&=\vec{\alpha_s}-\frac{(\vec{\alpha_s},\vec{\beta_1})}{(\vec{\beta_1},\vec{\beta_1})}\vec{\beta_1}-\frac{(\vec{\alpha_s},\vec{\beta_2})}{(\vec{\beta_2},\vec{\beta_2})}\vec{\beta_2}-\cdots-\frac{(\vec{\alpha_s},\vec{\beta_{s-1}})}{(\vec{\beta_{s-1}},\vec{\beta_{s-1}})}\vec{\beta_{s-1}}
\end{align}$$
然后将其单位化$\vec{\gamma_i}=\frac{\vec{\beta_i}}{|\vec{\beta_i}|}$，可得到标准正交向量组$\vec{\gamma_1},\vec{\gamma_2},\cdots,\vec{\gamma_s}$。

设$\mathbf{Q}\in M_n(\mathbb{R})$，如$\mathbf{Q}^\mathrm{T}\mathbf{Q}=\mathbf{I}$，则称$\mathbf{Q}$是**正交矩阵**。有如下定理：

1. 由标准正交基到标准正交基的过渡矩阵是正交矩阵；若过渡矩阵是正交矩阵且一组基是标准正交基，则另一组基也是标准正交基；
2. 正交矩阵的性质是：
    1. 其行（列）向量组成正交向量组，且每个向量都是单位向量；
    2. 其行列式值为$+1$或$-1$；
    3. 其逆矩阵还是正交矩阵；
    4. 其乘积还是正交矩阵。

对任意$n$阶可逆实矩阵$\mathbf{A}$，存在一个$n$阶正交矩阵$\mathbf{Q}$和一个$n$阶主对角元素为正数的上三角阵$\mathbf{R}$，使$\mathbf{A}=\mathbf{Q}\mathbf{R}$，称为**QR分解**，这个分解唯一。存在性由施密特正交化可得。

引入了向量与子空间的**正交**、子空间与子空间的**正交**和**正交补**$W^\perp$的概念。有如下定理：

- 设$W$是$n$维欧几里得空间$V$的子空间，则$V=W\oplus W^\perp$。

## 7 线性变换

### 7.1 线性变换的定义和基本性质

线性空间上保持线性关系的变换称为**线性变换**或**线性算子**，其集合记为$L(V)$。有如下的性质：

1. 将零向量映射为零向量；
2. 将负向量映射为负向量；
3. 保持线性组合不变；
4. 将线性相关的向量组映射为线性相关的向量组。

引入了线性变换的**和**和**数乘**的概念。满足线性空间的要求，即$L(V)$构成线性空间。

又引入了线性变换的**乘积**、**可逆**、**逆变换**和**多项式**的概念。

### 7.2 线性变换的矩阵

有如下定理：

- 设$\sigma$是$n$维线性空间$V$的线性变换，$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n}$是$V$的一组基，则$V$中任意向量$\vec{\alpha}$的像$\sigma(\vec{\alpha})$由基的像$\sigma(\vec{\alpha_1}),\sigma(\vec{\alpha_2}),\cdots,\sigma(\vec{\alpha_n})$完全确定。

$$\sigma(\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n})=(\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n})\mathbf{A}$$

$n$阶矩阵$\mathbf{A}$叫做线性变换$\sigma$在基$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n}$下的矩阵。有如下的定理：

1. 设线性变换$\sigma$在基$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n}$下的矩阵是$\mathbf{A}$，$\vec{\alpha}$和$\sigma(\vec{\alpha})$的坐标分别为$\vec{x},\vec{y}$，则$\vec{y}=\mathbf{A}\vec{x}$；
2. 设$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n}$是$n$维线性空间$V$的一组基，对给定的$n$个向量$\vec{\beta_1},\vec{\beta_2},\cdots,\vec{\beta_n}$都存在线性变换$\sigma$，使得$\sigma(\alpha_i)=\beta_i(i=1,2,\cdots,n)$；
3. 设$\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n}$是$n$维线性空间$V$的一组基，$\mathbf{A}$是任一$n$阶方阵，则有唯一的线性变换$\sigma$满足：$$\sigma(\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n})=(\vec{\alpha_1},\vec{\alpha_2},\cdots,\vec{\alpha_n})\mathbf{A}$$
4. 设$V$是$\mathbb{F}$上$n$维线性空间，则$L(V)$与$M_n(\mathbb{F})$同构。

这种一一对应关系除了保持了线性运算，也保持了乘法运算。有如下定理：

1. 设$\varphi:L(V)\rightarrow M_n(\mathbb{F})$为上述同构映射，则对$\sigma,\tau\in L(V)$，有$\varphi(\sigma\tau)=\varphi(\sigma)\varphi(\tau)$；
2. 设$\sigma\in L(V),\varphi(\sigma)=\mathbf{A}$，$\sigma$可逆$\Leftrightarrow \mathbf{A}$可逆，且$\varphi(\sigma^{-1})=\mathbf{A}^{-1}$。

### 7.3 线性变换的核与值域

全体像的集合称为**值域**，记作$\operatorname{Im}\sigma$。被映射成零向量的向量的集合称为**核**，记作$\operatorname{ker}\sigma$。它们都是子空间。$\operatorname{dim}\operatorname{Im}\sigma$称为**秩**，$\operatorname{dim}\operatorname{ker}\sigma$称为**零度**。

有如下定理：

1. 设$\sigma\in L(V),\vec{\epsilon_1},\vec{\epsilon_2},\cdots,\vec{\epsilon_n}$是$V$的一组基，$\mathbf{A}$是$\sigma$在这组基下的矩阵，则：
    1. $\operatorname{Im}\sigma=L(\sigma\vec{\epsilon_1},\sigma\vec{\epsilon_2},\cdots,\sigma\vec{\epsilon_n})$；
    2. $\sigma$的秩$= \mathbf{A}$的秩。
2. 设$\sigma\in L(V)$，则$\operatorname{dim}V=\operatorname{dim}\operatorname{ker}\sigma+\operatorname{dim}\operatorname{Im}\sigma$；
3. 对于有限维线性空间的线性变换$\sigma$，$\sigma$是单射$\Leftrightarrow \sigma$是满射。

引入了**不变子空间**的概念。将$\sigma$的作用限制到$W$上记作$\sigma\Bigg|\_W$。不变子空间对于化简矩阵有着很重要的作用。

### 7.4 特征值与特征向量

设$\sigma\in L(V)$，对于$\mathbb{F}$中的数$\lambda$，存在非零向量$\vec{\xi}$，使得$\sigma\vec{\xi}=\lambda\vec{\xi}$，则$\lambda$是$\sigma$的**特征值**，$\vec{\xi}$是$\sigma$属于特征值$\lambda$的**特征向量**。

属于$\lambda$的特征向量的线性组合仍是属于$\lambda$的特征向量。它们构成**特征子空间**，其维数称为特征值$\lambda$的**几何重数**。多项式$f_A(\lambda)=\det(\lambda\mathbf{I}-\mathbf{A})$称为线性变换$\sigma$的**特征多项式**，它的根称为$\sigma$的**特征根**。特征根的重数称为**代数重数**。

类似地，还定义了矩阵的特征值、特征向量和特征多项式。求特征值和特征向量的步骤如下：

1. 求出特征多项式$f_A(\lambda)=\det(\lambda\mathbf{I}-\mathbf{A})=0$的解，得到全部特征值；
2. 分别把特征值代入到齐次线性方程组$(\lambda_i\mathbf{I}-\mathbf{A})\vec{x}=\vec{0}$，其基础解系就是属于$\lambda_i$的特征向量。

有如下定理：

1. 设$\mathbf{A}\in M_n(\mathbb{C})$,
    1. $\sum_{i=1}^n\lambda_i=\sum_{i=1}^n a_{ii}=\operatorname{tr}\mathbf{A}$；
    2. $\prod_{i=1}^n\lambda_i=|\mathbf{A}|$。
2. $n$阶方阵可逆$\Leftrightarrow$其$n$个特征值全不为零；
3. Hamilton-Cayley定理：设$\mathbf{A}\in M_n(\mathbb{F}),f_A(\lambda)=|\lambda\mathbf{I}-\mathbf{A}|$是$\mathbf{A}$的特征多项式，则$f_A(\mathbf{A})=0$，对于线性变换也有类似的结论。

### 7.5 相似矩阵

$\mathbf{A},\mathbf{B}$是两个$n$阶方阵，如果存在$n$阶可逆矩阵$\mathbf{P}$，使得$\mathbf{P}^{-1}\mathbf{A}\mathbf{P}=\mathbf{B}$，则称$\mathbf{B}$**相似**于$\mathbf{A}$，记作$\mathbf{B}\sim\mathbf{A}$。

相似关系是一种等价关系。线性变换在不同基下的矩阵是相似矩阵。有如下性质：

1. 相似矩阵的多项式相似；
2. 若$\mathbf{A}_i\sim\mathbf{B}_i,i=1,2,\cdots,s$，则$\operatorname{diag}(\mathbf{A}_1,\mathbf{A}_2,\cdots,\mathbf{A}_s)\sim\operatorname{diag}(\mathbf{B}_1,\mathbf{B}_2,\cdots,\mathbf{B}_s)$；
3. 相似矩阵，一个可逆，则另一个也可逆，且逆相似；
4. 相似矩阵有相同的特征值和特征多项式；
5. 相似矩阵有相同的迹和行列式。

接下来研究矩阵的相似对角化，有如下定理：

1. $n$阶方阵可对角化$\Leftrightarrow$有$n$个线性无关的特征向量；
2. 不同特征值的特征向量线性无关；
3. 若$n$阶方阵$\mathbf{A}$有$n$个互异的特征值$\lambda_1,\lambda_2,\cdots,\lambda_n$，则$\mathbf{A}$可对角化，$\mathbf{A}\sim\operatorname{diag}(\lambda_1,\lambda_2,\cdots,\lambda_n)$且可逆矩阵是由相应的特征向量作列向量构成的；
4. 设$\lambda_1,\lambda_2,\cdots,\lambda_s$是$\mathbf{A}$的$s$个互异的特征值，$\vec{x_{i1}},\vec{x_{i2}},\cdots,\vec{x_{im_i}}$是$\mathbf{A}$的属于$\lambda_i$的$m_i$个线性无关的特征向量，$i=1,2,\cdots,s$，则$\vec{x_{11}},\vec{x_{12}},\cdots,\vec{x_{1m_1}},\vec{x_{21}},\vec{x_{22}},\cdots,\vec{x_{2m_2}},\cdots,\vec{x_{s1}},\vec{x_{s2}},\cdots,\vec{x_{sm_s}}$也线性无关；
5. 设$\lambda_i$是$n$阶复方阵$\mathbf{A}$的特征值，则它的几何重数总不大于它的代数重数，即$m_i\leq n_i$；
6. $\mathbf{A}$是$n$阶复方阵，$\mathbf{A}$可对角化$\Leftrightarrow m_i=n_i, i=1,2,\cdots,s\Leftrightarrow\sum_{i=1}^s m_i=n\Leftrightarrow\operatorname{r}(\lambda_i\mathbf{I}-\mathbf{A})=n-n_i,i=1,2,\cdots,s$。

接下来研究实对称矩阵的对角化。有如下定理：

1. 实对称矩阵的特征值都是实数；
2. $n$阶实对称阵$\mathbf{A}$，总存在正交阵$\mathbf{Q}$，使得$\mathbf{Q}^{-1}\mathbf{A}\mathbf{Q}$是对角阵；
3. 实对称矩阵属于不同特征值的特征向量正交。

## 8 二次型

### 8.1 二次型

$$Q(x_1,x_2,\cdots,x_n)=\sum_{i=1}^n\sum_{j=1}^na_{ij}x_ix_j, a_{ij}=a_{ji}=\vec{x}^\mathrm{T}\mathbf{A}\vec{x}$$
如上形式称为$n$元**二次型**。$\mathbf{A}$是**二次型的矩阵**，它是对称矩阵。还引入了**实二次型**和**复二次型**的概念。

$\mathbf{A},\mathbf{B}$是两个$n$阶方阵，如果存在$n$阶可逆矩阵$\mathbf{P}$，使得$\mathbf{B}=\mathbf{P}^\mathrm{T}\mathbf{A}\mathbf{P}$，则称$\mathbf{B}$与$\mathbf{A}$**相合**或**合同**。这是个等价关系。

### 8.2 二次型的标准形

有下面3个方法化二次型为标准形：

1. **主轴定理**：任一实二次型$Q(\vec{\alpha})=\vec{x}^\mathrm{T}\mathbf{A}\vec{x}$，其中$\mathbf{A}^\mathrm{T}=\mathbf{A}$，存在正交线性替换$\vec{x}=\mathbf{P}\vec{y}$，其中$\mathbf{P}$是正交矩阵，使得$Q(\vec{\alpha})$化为标准形，即$Q(\vec{\alpha})=\lambda_1y_1^2+\lambda_2y_2^2+\cdots+\lambda_ny_n^2$，其中$\lambda_1,\lambda_2,\cdots,\lambda_n$是$\mathbf{A}$的$n$个特征值；
2. 任何一个二次型都可通过可逆线性替换（配方法）化成标准形；
3. 对每个实对称矩阵$\mathbf{A}$，存在初等矩阵$\mathbf{P}_1\mathbf{P}_2\cdots\mathbf{P}_s$，使得$\mathbf{P}_s^\mathrm{T}\cdots\mathbf{P}_2^\mathrm{T}\mathbf{P}_1^\mathrm{T}\mathbf{A}\mathbf{P}_1\mathbf{P}_2\cdots\mathbf{P}_s=\operatorname{diag}(d_1,d_2,\cdots,d_n)$。

对于方法3，构造一个$2n\times n$的矩阵$\begin{bmatrix}\mathbf{A}\\\\\mathbf{I}\end{bmatrix}$，对$\begin{bmatrix}\mathbf{A}\\\\\mathbf{I}\end{bmatrix}$作一次列变换的同时，对$\mathbf{A}$作一次对应的行变换，当$\mathbf{A}$化作$\mathbf{P}^\mathrm{T}\mathbf{A}\mathbf{P}$时，$\mathbf{I}$就化作$\mathbf{P}$。

### 8.3 惯性定理和二次型的规范形

形如$z_1^2+z_2^2+\cdots+z_r^2$的二次型称为复系数的二次型的**规范形**；形如$z_1^2+z_2^2+\cdots+z_p^2-z_{p+1}^2-\cdots-z_r^2$的二次型称为实二次型的**规范形**。$p$称为**正惯性指数**，$r-p$称为**负惯性指数**，差$p-(r-p)$称为**符号差**。

有如下定理：

1. 任意一个复系数的二次型，总可以经过一个适当的可逆线性替换，化为规范形，且规范形唯一；
2. 任意一个复数的对称矩阵相合于$\begin{bmatrix}\mathbf{I}_r&\mathbf{0}\\\\\mathbf{0}&\mathbf{0}\end{bmatrix}$，其中$r$是对称阵的秩；
3. **惯性定理**：任意一个实二次型，总可以经过一个适当的可逆线性替换，化为规范形，且规范形唯一；
4. 任意实对称矩阵相合于对角阵$\begin{bmatrix}\mathbf{I}\_p&&\\\\&-\mathbf{I}\_{r-p}&\\\\&&\mathbf{0}\end{bmatrix}$，其中$r$是对称阵的秩。

### 8.4 实二次型的正定性

设$Q(\vec{\alpha})$是实二次型，对非零向量$\vec{\alpha}$，恒有$Q(\vec{\alpha})\gt0$，则称实二次型**正定**，其矩阵称为**正定矩阵**。

有如下性质：

1. 二次型经过可逆线性替换，其正定性不变；
2. 实对称矩阵正定$\Leftrightarrow$所有特征值都是正的；
3. 实二次型正定$\Leftrightarrow$正惯性指数$p=n$；
4. 实对称矩阵$\mathbf{A}$正定$\Leftrightarrow\mathbf{A}$与$\mathbf{I}$相合；
5. 实对称矩阵$\mathbf{A}$正定$\Leftrightarrow$存在可逆矩阵$\mathbf{C}$，使得$\mathbf{A}=\mathbf{C}^\mathrm{T}\mathbf{C}$；
6. 实对称矩阵$\mathbf{A}$正定$\Leftrightarrow$各阶顺序主子式大于零$\Leftrightarrow$各阶主子式大于零。

类似地，可以引入**半正定**、**负定**、**半负定**、**不定**的概念。

设$Q(\vec{\alpha})=\vec{x}^\mathrm{T}\mathbf{A}\vec{x}$是半正定实二次型，等价于下列命题：

1. 正惯性指数$p=r<n$，$r$是$\mathbf{A}$的秩；
2. $\mathbf{A}$相合于$\operatorname{diag}(\mathbf{I}_r,\mathbf{0}), r<n$；
3. 存在非满秩$n$阶方阵$\mathbf{C}$，使得$\mathbf{A}=\mathbf{C}^\mathrm{T}\mathbf{C}$；
4. 所有特征值非负，且有零特征值；
5. 所有主子式大于等于零，且有主子式等于零。
