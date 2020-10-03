---
title: 欧几里得算法
author: 孙子平
date: 2020-09-22T05:22:02Z
category: 数学
tags: [数学, 数论]
---

这篇文章主要介绍了：

1. 最大公约数（GCD）与欧几里得算法；
2. 平衡欧几里得算法；
3. 扩展欧几里得算法。

<!-- more -->

## 1 GCD与欧几里得算法

### 1.1 整除和素数

**除法定理** $\forall a,b(a\in\mathbb{Z}\land b\in\mathbb{Z}^*\rightarrow\exists!q,r(q,r\in\mathbb{Z}\land 0\leq r<|b|\land a=bq+r))$。其中，$q$称为**商**，$r = (a \operatorname{mod} b)$称为**余**。如果$r=0$，那么我们说$b$**整除**$a$，$b$是$a$的约数，记作$b|a$。

**GCD的定义** 对$d\in\mathbf{Z}^*$，$a,b\in\mathbf{Z}$，若$d|a\land d|b$，则我们成$d$是$a$和$b$的**公约数**。如果$d$是所有公约数中最大的，就称为**最大公约数（GCD）**，记为$\mathrm{gcd}(a,b)=d$。

注：$\mathrm{gcd}(a,0)$一般定义为$a$。

**欧几里得定理** $\forall a,b,q,r(q,r\in\mathbb{Z}\land a,b\in\mathbb{Z}^*\land a=bq+r\rightarrow\mathrm{gcd}(a,b)=\mathrm{gcd}(b,r))$。

证明：

$$\begin{aligned}
&\mathrm{gcd}(a,b)|a-bq=r\Rightarrow\mathrm{gcd}(a,b)|\mathrm{gcd}(b,r) \\
&\mathrm{gcd}(b,r)|a=bq+r\Rightarrow\mathrm{gcd}(b,r)|\mathrm{gcd}(a,b)
\end{aligned}$$

### 1.2 欧几里得算法的实现

<java-script-editor-with-tests function-name="gcd" :function-parameters="['a', 'b']" :predefined="gcdPredefined" :initial-test-cases="gcdTestCases" :test-result-width="500" can-add-test>
<template v-slot:test-result="{ result, exception, success, correctness, time, results }">
<!-- 运行结果 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div v-if="correctness" class="overflow-auto green--text">正确，返回 {{ result }}</div>
<div v-else-if="success" class="overflow-auto orange--text">错误，返回 {{ result }}</div>
<div v-else class="overflow-auto red--text">异常，抛出 {{ exception }}</div>
</div>
<!-- 运行时间 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{ (Math.round(time * 1000) / 1000).toFixed(3) }} ms</div>
</div>
<!-- 调用栈 -->
<div class="subtitle-1 pr-4 primary--text text-no-wrap">调用栈：</div>
<v-simple-table v-if="results" dense class="stack-table"><template v-slot:default>
<thead><tr>
<th class="text-left">深度</th>
<th class="text-left">参数a</th>
<th class="text-left">参数b</th>
<th class="text-left">返回值d</th>
</tr></thead>
<tbody><tr v-for="(frame, index) in results" :key="index">
<td>{{ index + 1 }}</td>
<td>a = {{ frame[0][0] }}</td>
<td>b = {{ frame[0][1] }}</td>
<td>d = {{ frame[1] }}</td>
</tr></tbody>
</template></v-simple-table>
</template>
<template v-slot:test-more="{ add }">
<v-form v-model="gcdFormValid" v-on:submit.prevent="gcdTestSubmit(add)">
<div class="pb-4 px-4 d-flex align-center">
<v-text-field class="mr-2" v-model="gcdTestA" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数a" required></v-text-field>
<v-text-field class="mr-2" v-model="gcdTestB" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数b" required></v-text-field>
<v-btn :disabled="!gcdFormValid" color="primary" type="submit">添加</v-btn>
</div>
</v-form>
</template>
</java-script-editor-with-tests>

### 1.3 欧几里得算法的复杂性估计

引理：$\forall a,b(a,b\in\mathbb{Z}\land0<b\leq a\rightarrow a\operatorname{mod}b\leq \frac{a-1}{2})$。分$b\leq\frac{a}{2}$和$b>\frac{a}{2}$两种情况讨论即可证明。

**定理 欧几里得算法复杂度上界**：

$$\forall a,b(a,b\in\mathbb{Z}^+\rightarrow\mathrm{gcd}(a,b)\text{的带余除法运算次数}\leq\lfloor 2\log_2\max\{a,b\}\rfloor+1)$$

证明方法是构造数列$r_i (i=-1,0,\cdots)$，其中：

$$\begin{cases}
r_{-1} = a \\
r_0 = b \\
r_{i+1} = r_{i-1}\operatorname{mod}r_i &(i \geq 0)
\end{cases}$$

由此$r_{j+1}\leq\frac{r_{j-1}-1}{2}$。注意它是隔一个元素减半，这就到之类复杂度上界多了系数$2$。

### 1.4 二进制欧几里得算法

1. $\mathrm{gcd}(0,v)=v$；
2. 如果$u,v$都是偶数，$\mathrm{gcd}(u,v)=2\mathrm{gcd}(u/2,v/2)$；
3. 如果$u$是偶数，$v$是奇数，$\mathrm{gcd}(u,v)=\mathrm{gcd}(u/2,v)$；
4. 如果$u$是奇数，$v$是偶数，$\mathrm{gcd}(u,v)=\mathrm{gcd}(v/2,u)$；
5. 如果$u,v$都是奇数且$u\geq v$，$\mathrm{gcd}(u,v)=\mathrm{gcd}((u-v)/2, v)$。

## 2 平衡的欧几里得算法

**第1泛化除法定理** $\forall a,b,d(a,d\in\mathbb{Z}\land b\in\mathbb{Z}^*\rightarrow\exists!Q,R(Q,R\in\mathbb{Z}\land d\leq R<|b|+d\land a=bQ+R))$。特别地，令$d=-|\frac{m}{2}|$，则$-|\frac{m}{2}|\leq R<|\frac{m}{2}|$

**第1泛化欧几里得定理** $\forall a,b,q,r(q,r\in\mathbb{Z}\land a,b\in\mathbb{Z}^*\land a=bq+r\rightarrow\mathrm{gcd}(a,b)=\mathrm{gcd}(b,r)=\mathrm{gcd}(b,-r)=\mathrm{gcd}(b,b-r))$。

**定理 第1泛化欧几里得算法复杂度上界**：

$$\forall a,b(a,b\in\mathbb{Z}^+\rightarrow\mathrm{gcd}(a,b)\text{的带余除法运算次数}\leq\lfloor\log_2\max\{a,b\}\rfloor+1)$$

注：系数2不见了，时间复杂度在常数上有了进步。主要来源于构造的数列不再是隔一个减半，而是相邻减半：$r_{j}\leq\frac{r_{j-1}-1}{2}$。

## 3 扩展欧几里得算法

### 3.1 Bézout等式

**Bézout等式**：

$$\forall a,b(a,b\in\mathbb{Z}\rightarrow\exists u,v(u,v\in\mathbb{Z}\land\mathrm{gcd}(a,b)=ua+vb))$$

证：定义$S=\{au+bv\mid u,v\in\mathbb{Z}\}$，我们要证明$\forall n(n\in S\leftrightarrow\mathrm{gcd}(a,b)|n)$。“$\rightarrow$”比较简单，我们要证明“$\leftarrow$”。

1. 引理1：$\forall x,y(x,y\in S\rightarrow x\pm y\in S)$。易证。
2. 引理2：$\forall x,c(x\in S\land c\in\mathbb{Z}\rightarrow cx\in S)$。易证。由两引理知$S$元素的整数线性组合仍属于$S$。
3. 引理3：$S = \{kd|d=\min S\cap\mathbb{Z}^+, k\in\mathbb{Z}\}$

    $$\begin{aligned}
      &\text{左$\supseteq$右：由引理2易知}\\
      &\text{左$\subseteq$右：}\begin{aligned}[t]
        &x\in S,\text{令}x=qd+r (0\leq r<d)\text{为除法定律分解}\\
      \Rightarrow&r = x - qd \in S\land r<d\\
      \Rightarrow&r=0\\
      \Rightarrow&d|x
      \end{aligned}
    \end{aligned}$$

4. 令$d=\min S\cap\mathbb{Z},D=\mathrm{gcd}(a,b)$，则$d=D$。证，可以知道$D|a\land D|b\Rightarrow D|d$。又有引理3，$a\in S\land b\in S\Rightarrow d|a\land d|b\Rightarrow d|D$。得证。

### 3.2 扩展欧几里得算法的实现

<java-script-editor-with-tests function-name="gcd" :function-parameters="['a', 'b']" :predefined="extendedGcdPredefined" :initial-test-cases="gcdTestCases" :test-result-width="500" can-add-test :correct="extendedGcdCorrect">
<template v-slot:test-result="{ result, exception, success, correctness, time, results }">
<!-- 运行结果 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div v-if="correctness" class="overflow-auto green--text">正确，返回 {{ result }}</div>
<div v-else-if="success" class="overflow-auto orange--text">错误，返回 {{ result }}</div>
<div v-else class="overflow-auto red--text">异常，抛出 {{ exception }}</div>
</div>
<!-- 运行时间 -->
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{ (Math.round(time * 1000) / 1000).toFixed(3) }} ms</div>
</div>
<!-- 调用栈 -->
<div class="subtitle-1 pr-4 primary--text text-no-wrap">调用栈：</div>
<v-simple-table v-if="results" dense class="stack-table"><template v-slot:default>
<thead><tr>
<th class="text-left">深度</th>
<th class="text-left">参数a</th>
<th class="text-left">参数b</th>
<th class="text-left">返回值d</th>
<th class="text-left">返回值u</th>
<th class="text-left">返回值v</th>
</tr></thead>
<tbody><tr v-for="(frame, index) in results" :key="index">
<td>{{ index + 1 }}</td>
<td>a = {{ frame[0][0] }}</td>
<td>b = {{ frame[0][1] }}</td>
<td>d = {{ frame[1] && frame[1][0] }}</td>
<td>u = {{ frame[1] && frame[1][1] }}</td>
<td>v = {{ frame[1] && frame[1][2] }}</td>
</tr></tbody>
</template></v-simple-table>
</template>
<template v-slot:test-more="{ add }">
<v-form v-model="extendedGcdFormValid" v-on:submit.prevent="gcdTestSubmit(add)">
<div class="pb-4 px-4 d-flex align-center">
<v-text-field class="mr-2" v-model="extendedGcdTestA" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数a" required></v-text-field>
<v-text-field class="mr-2" v-model="extendedGcdTestB" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数b" required></v-text-field>
<v-btn :disabled="!extendedGcdFormValid" color="primary" type="submit">添加</v-btn>
</div>
</v-form>
</template>
</java-script-editor-with-tests>

### 3.3 欧几里得算法的矩阵诠释

对于普通的欧几里得算法，给定初始$a_0,b_0$，我们可以递推：

$$[a_i, b_i]=[a_{i-1},b_{i-1}]\begin{bmatrix}
  0 & 1 \\
  1 & -\lfloor\frac{a_{i-1}}{b_{i-1}}\rfloor
\end{bmatrix},(i\geq 1)$$

当$b_i = 0$，$a_i=\mathrm{gcd}(a_0, b_0)$。

对于扩展欧几里得算法，我们可以采用如下的递推：

$$\begin{cases}
  \begin{bmatrix}
    u_0 & e_0 \\
    v_0 & f_0
  \end{bmatrix} = \begin{bmatrix}
    1 & 0 \\
    0 & 1
  \end{bmatrix}\\
  \begin{bmatrix}
    u_i & e_i \\
    v_i & f_i \\
    a_i & b_i
  \end{bmatrix} = \begin{bmatrix}
    u_{i-1} & e_{i-1} \\
    v_{i-1} & f_{i-1} \\
    a_{i-1} & b_{i-1}
  \end{bmatrix}
  \begin{bmatrix}
    0 & 1 \\
    1 & -\lfloor\frac{a_{i-1}}{b_{i-1}}\rfloor
  \end{bmatrix}, &(i\geq 1)
\end{cases}$$

当$b_i = 0$，$a_i=\mathrm{gcd}(a_0, b_0)=u_ia_0+v_ib_0$。

<!-- markdownlint-disable -->
<script>
const gcdImplHeader = 'function gcd(a, b) {\n'
const gcdImplFooter = '\n}'

const gcdRecursiveImpl = `\
  return b <= 0 ? a : gcd(b, a % b);`

const gcdLoopImpl = `\
  while (b > 0) {
    const temp = a % b;
    a = b;
    b = temp;
  }
  return a;`

const gcdBinaryImpl = `\
  // Note: bit operation in JavaScript is slow
  if (a === 0) {
    return b;
  }
  if (b === 0) {
    return a;
  }
  const aIsOdd = a & 1;
  const bIsOdd = b & 1;
  if (aIsOdd && bIsOdd) {
    return gcd(Math.abs(a - b) >> 1, Math.min(a, b));
  } else if (aIsOdd) {
    return gcd(b >> 1, a);
  } else if (bIsOdd) {
    return gcd(a >> 1, b);
  } else {
    return gcd(a >> 1, b >> 1) << 1;
  }`

const gcdBalancedImpl = `\
  if (b <= 0) {
    return a;
  } else {
    let r = a % b;
    if (2 * r > b) {
      r = b - r;
    }
    return gcd(b, r);
  }`

const extendedGcdRecursiveImpl = `\
  if (b <= 0) {
    return [a, 1, 0];
  }
  const [d, u, v] = gcd(b, a % b);
  // let a = q * b + r
  // d = u * b + v * r = v * a + (u - q * v) * b
  return [d, v, u - Math.floor(a / b) * v];`

const extendedGcdLoopImpl = `\
  let u = 1, e = 0;
  let v = 0, f = 1;
  while (b > 0) {
    let q = Math.floor(a / b);
    [a, b] = [b, a - q * b];
    [u, e] = [e, u - q * e];
    [v, f] = [f, v - q * f];
  }
  return [a, u, v];`

function gcd(a, b) {
  while (b > 0) {
    const temp = a % b;
    a = b;
    b = temp;
  }
  return a;
}

export default {
  data: () => ({
    /* Constants */
    gcdPredefined: [
      { name: '递归', code: gcdRecursiveImpl },
      { name: '循环', code: gcdLoopImpl },
      { name: '二进制', code: gcdBinaryImpl },
      { name: '平衡', code: gcdBalancedImpl }
    ],
    extendedGcdPredefined: [
      { name: '递归', code: extendedGcdRecursiveImpl },
      { name: '循环', code: extendedGcdLoopImpl }
    ],
    gcdImplHeader,
    gcdImplFooter,
    gcdTestCases: [
      [[6, 0], 6],
      [[6, 4], 2],
      [[4, 6], 2],
      [[101, 31], 1],
      [[11, 121], 11]
    ],
    /* GCD */
    gcdTestA: '',
    gcdTestB: '',
    gcdFormValid: false,
    /* Extended GCD */
    extendedGcdTestA: '',
    extendedGcdTestB: '',
    extendedGcdFormValid: false
  }),
  methods: {
    gcdTestSubmit (add) {
      if (!this.gcdFormValid) {
        return
      }
      const a = parseInt(this.gcdTestA, 10)
      const b = parseInt(this.gcdTestB, 10)
      add([[a, b], gcd(a, b)])
    },
    extendedGcdTestSubmit (add) {
      if (!this.extendedGcdFormValid) {
        return
      }
      const a = parseInt(this.extendedGcdTestA, 10)
      const b = parseInt(this.extendedGcdTestB, 10)
      add([[a, b], gcd(a, b)])
    },
    extendedGcdCorrect (test, result) {
      return [Array.isArray(result) && test[1] === result[0]
        && test[1] === test[0][0] * result[1] + test[0][1] * result[2]]
    }
  }
}
</script>

<style>
.v-application .content .stack-table table {
    margin: 0;
    display: table;
}
</style>
<!-- markdownlint-restore -->
