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

<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>代码</v-toolbar-title><v-spacer /><v-select dense solo hide-details class="mr-2" style="max-width: 150px" :items="['自定义', '递归', '循环', '二进制', '平衡']" v-model="gcdMode"></v-select><v-btn color="primary" v-on:click="onGcdFuncBodyUpdated">提交</v-btn></v-toolbar>
<div id="euclidean-code" class="elevation-1"></div>
</v-card>

<v-card v-if="gcdFuncError !== null" class="mt-2">
<v-toolbar flat class="red--text"><v-toolbar-title>编译错误</v-toolbar-title></v-toolbar>
<v-card-text class="error-panel pt-0">{{ gcdFuncError }}</v-card-text>
</v-card>
<v-card v-else class="mt-2">
<v-toolbar flat><v-toolbar-title>测试结果</v-toolbar-title></v-toolbar>
<v-tabs show-arrows :vertical="$vuetify.breakpoint.lgAndUp">
<v-tabs-slider></v-tabs-slider>
<v-tab v-for="testResult, index in gcdTestResults" class="justify-space-between">
<div class="text-lowercase" :class="[testResult[5] ? 'green--text' : testResult[2] ? 'orange--text' : 'red--text']">gcd({{ testResult[0][0] }}, {{ testResult[0][1] }}) = {{ testResult[1] }}</div><div><v-btn icon color="gray" v-on:click.stop="gcdTestCases.splice(index, 1)"><v-icon>mdi-close</v-icon></v-btn></div>
</v-tab>
<v-tab-item v-for="testResult in gcdTestResults">
<v-card v-if="gcdChanged" flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="text-center text-h6">还未测试</div>
</v-card-text></v-card>
<v-card v-else flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div class="overflow-auto green--text" v-if="testResult[5]">正确，返回 {{testResult[1]}}</div>
<div class="overflow-auto orange--text" v-else-if="testResult[2]">错误，返回 {{testResult[3][0] && testResult[3][0][1]}}</div>
<div class="overflow-auto red--text" v-else>异常，抛出 {{testResult[3]}}</div>
</div>
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{(Math.round(testResult[4] * 1000) / 1000).toFixed(3)}} ms</div>
</div>
<div class="subtitle-1 pr-4 primary--text text-no-wrap">调用栈：</div>
<v-simple-table v-if="testResult[2]" dense class="stack-table">
<template v-slot:default>
<thead><tr>
<th class="text-left">深度</th>
<th class="text-left">参数a</th>
<th class="text-left">参数b</th>
<th class="text-left">返回值d</th>
</tr></thead>
<tbody><tr v-for="frame, index in testResult[3]" :key="index">
<td>{{ index + 1 }}</td>
<td>a = {{ frame[0][0] }}</td>
<td>b = {{ frame[0][1] }}</td>
<td>d = {{ frame[1] }}</td>
</tr></tbody>
</template>
</v-simple-table>
</v-card-text></v-card>
</v-tab-item>
</v-tabs>
</v-card>
<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>添加测试</v-toolbar-title></v-toolbar>
<v-form v-model="gcdFormValid" v-on:submit.prevent="gcdTestSubmit">
<div class="pb-4 px-4 d-flex align-center">
<v-text-field class="mr-2" v-model="gcdTestA" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数a" required></v-text-field>
<v-text-field class="mr-2" v-model="gcdTestB" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数b" required></v-text-field>
<v-btn :disabled="!gcdFormValid" color="primary" type="submit">添加</v-btn>
</div>
</v-form>
</v-card>

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

<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>代码</v-toolbar-title><v-spacer /><v-select dense solo hide-details class="mr-2" style="max-width: 150px" :items="['自定义', '递归', '循环']" v-model="extendedGcdMode"></v-select><v-btn color="primary" v-on:click="onExtendedGcdFuncBodyUpdated">提交</v-btn></v-toolbar>
<div id="extended-euclidean-code" class="elevation-1"></div>
</v-card>

<v-card v-if="extendedGcdFuncError !== null" class="mt-2">
<v-toolbar flat class="red--text"><v-toolbar-title>编译错误</v-toolbar-title></v-toolbar>
<v-card-text class="error-panel pt-0">{{ extendedGcdFuncError }}</v-card-text>
</v-card>
<v-card v-else class="mt-2">
<v-toolbar flat><v-toolbar-title>测试结果</v-toolbar-title></v-toolbar>
<v-tabs show-arrows :vertical="$vuetify.breakpoint.lgAndUp">
<v-tabs-slider></v-tabs-slider>
<v-tab v-for="testResult, index in extendedGcdTestResults" class="justify-space-between">
<div class="text-lowercase" :class="[testResult[5] ? 'green--text' : testResult[2] ? 'orange--text' : 'red--text']">gcd({{ testResult[0][0] }}, {{ testResult[0][1] }}) = {{ testResult[1] }}</div><div><v-btn icon color="gray" v-on:click.stop="extendedGcdTestCases.splice(index, 1)"><v-icon>mdi-close</v-icon></v-btn></div>
</v-tab>
<v-tab-item v-for="testResult in extendedGcdTestResults">
<v-card v-if="extendedGcdChanged" flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="text-center text-h6">还未测试</div>
</v-card-text></v-card>
<v-card v-else flat style="max-width: 500px" class="mx-auto"><v-card-text class="pt-0">
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行结果：</div>
<div class="overflow-auto green--text" v-if="testResult[5]">正确，返回 {{testResult[1]}}</div>
<div class="overflow-auto orange--text" v-else-if="testResult[2]">错误，返回 {{testResult[3][0] && testResult[3][0][1]}}</div>
<div class="overflow-auto red--text" v-else>异常，抛出 {{testResult[3]}}</div>
</div>
<div class="d-flex justify-space-between align-center">
<div class="subtitle-1 pr-4 primary--text text-no-wrap">运行时间：</div>
<div class="overflow-auto">{{(Math.round(testResult[4] * 1000) / 1000).toFixed(3)}} ms</div>
</div>
<div class="subtitle-1 pr-4 primary--text text-no-wrap">调用栈：</div>
<v-simple-table v-if="testResult[2]" dense class="stack-table">
<template v-slot:default>
<thead><tr>
<th class="text-left">深度</th>
<th class="text-left">参数a</th>
<th class="text-left">参数b</th>
<th class="text-left">返回值d</th>
<th class="text-left">返回值u</th>
<th class="text-left">返回值v</th>
</tr></thead>
<tbody><tr v-for="frame, index in testResult[3]" :key="index">
<td>{{ index + 1 }}</td>
<td>a = {{ frame[0][0] }}</td>
<td>b = {{ frame[0][1] }}</td>
<td>d = {{ frame[1] && frame[1][0] }}</td>
<td>u = {{ frame[1] && frame[1][1] }}</td>
<td>v = {{ frame[1] && frame[1][2] }}</td>
</tr></tbody>
</template>
</v-simple-table>
</v-card-text></v-card>
</v-tab-item>
</v-tabs>
</v-card>
<v-card class="mt-2">
<v-toolbar flat><v-toolbar-title>添加测试</v-toolbar-title></v-toolbar>
<v-form v-model="extendedGcdFormValid" v-on:submit.prevent="extendedGcdTestSubmit">
<div class="pb-4 px-4 d-flex align-center">
<v-text-field class="mr-2" v-model="extendedGcdTestA" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数a" required></v-text-field>
<v-text-field class="mr-2" v-model="extendedGcdTestB" :rules="[val => !isNaN(parseInt(val, 10)) || '必须是合法的数字']" color="primary" label="参数b" required></v-text-field>
<v-btn :disabled="!extendedGcdFormValid" color="primary" type="submit">添加</v-btn>
</div>
</v-form>
</v-card>

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
function loadScript (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      script.addEventListener('load', resolve)
      document.body.appendChild(script)
    }
  })
}

function loadStyle (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = src
      style.id = id
      style.addEventListener('load', resolve)
      document.body.appendChild(style)
    }
  })
}

function frozenFirstAndLastLine(doc) {
  doc.markText(
    { line: doc.firstLine(), ch: 0 },
    { line: doc.firstLine() + 1, ch: 0 },
    { readOnly: true, atomic: true, selectLeft: false, css: 'opacity: 0.5' })
  doc.markText(
    { line: doc.lastLine() - 1, ch: doc.getLine(doc.lastLine() - 1).length },
    { line: doc.lastLine(), ch: 1 },
    { readOnly: true, atomic: true, selectRight: false, css: 'opacity: 0.5' })
}

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
    /* GCD */
    gcdFunc: null,
    gcdFuncError: null,
    gcdTestCases: [
      [[6, 0], 6],
      [[6, 4], 2],
      [[4, 6], 2],
      [[101, 31], 1],
      [[11, 121], 11]
    ],
    gcdMode: '',
    gcdChanged: false,
    gcdTestA: '',
    gcdTestB: '',
    gcdFormValid: false,
    /* Extended GCD */
    extendedGcdFunc: null,
    extendedGcdFuncError: null,
    extendedGcdTestCases: [
      [[6, 0], 6],
      [[6, 4], 2],
      [[4, 6], 2],
      [[101, 31], 1],
      [[11, 121], 11]
    ],
    extendedGcdMode: '',
    extendedGcdChanged: false,
    extendedGcdTestA: '',
    extendedGcdTestB: '',
    extendedGcdFormValid: false
  }),
  mounted () {
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js', 'script-codemirror'),
      loadStyle('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.css', 'style-codemirror')
    ])
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js', 'script-codemirror-mode-javascript'))
      .then(() => {
        const element = document.getElementById('euclidean-code')
        this.$options.gcdCode = CodeMirror((elt) => {
          element.appendChild(elt, element)
        }, {
          mode: 'javascript',
          lineNumbers: true,
          viewportMargin: Infinity
        })
        this.$options.gcdCode.on('change', this.onGcdValueChanged)
        this.gcdMode = '递归'

        const element2 = document.getElementById('extended-euclidean-code')
        this.$options.extendedGcdCode = CodeMirror((elt) => {
          element2.appendChild(elt, element)
        }, {
          mode: 'javascript',
          lineNumbers: true,
          viewportMargin: Infinity
        })
        this.$options.extendedGcdCode.on('change', this.onExtendedGcdValueChanged)
        this.extendedGcdMode = '递归'
      })
  },
  computed: {
    gcdTestResults () {
      return this.gcdTestCases.map(test => {
        // [input, answer, status, call stack/exception, time]
        if (this.gcdFunc === null || this.gcdChanged) {
          return [...test, true, [], 0, false]
        }
        const start = performance.now()
        try {
          const result = this.gcdFunc(...test[0]).reverse()
          const end = performance.now()
          return [...test, true, result, end - start, result[0] && test[1] === result[0][1]]
        } catch (e) {
          const end = performance.now()
          return [...test, false, e, end - start, false]
        }
      })
    },
    extendedGcdTestResults () {
      return this.extendedGcdTestCases.map(test => {
        // [input, answer, status, call stack/exception, time]
        if (this.extendedGcdFunc === null || this.extendedGcdChanged) {
          return [...test, true, [], 0, false]
        }
        const start = performance.now()
        try {
          const result = this.extendedGcdFunc(...test[0]).reverse()
          const end = performance.now()
          return [...test, true, result, end - start, result[0] && Array.isArray(result[0][1]) && test[1] === result[0][1][0]
            && test[1] === result[0][0][0] * result[0][1][1] + result[0][0][1] * result[0][1][2]]
        } catch (e) {
          const end = performance.now()
          return [...test, false, e, end - start, false]
        }
      })
    }
  },
  watch: {
    gcdFuncError () {
      const element = document.getElementById('euclidean-code').firstChild
      element.classList[this.gcdFuncError === null ? 'remove' : 'add']('CodeMirror-error')
    },
    extendedGcdFuncError () {
      const element = document.getElementById('extended-euclidean-code').firstChild
      element.classList[this.extendedGcdFuncError === null ? 'remove' : 'add']('CodeMirror-error')
    },
    gcdMode () {
      let code = ''
      switch (this.gcdMode) {
        case '递归':
          code = gcdRecursiveImpl
          break
        case '循环':
          code = gcdLoopImpl
          break
        case '二进制':
          code = gcdBinaryImpl
          break
        case '平衡':
          code = gcdBalancedImpl
          break
        default:
          return
      }

      this.$options.gcdCode.off('change', this.onGcdValueChanged)
      const doc = this.$options.gcdCode.getDoc()
      doc.setValue(gcdImplHeader + code + gcdImplFooter)
      frozenFirstAndLastLine(this.$options.gcdCode)
      this.onGcdFuncBodyUpdated()
      this.$options.gcdCode.on('change', this.onGcdValueChanged)
    },
    extendedGcdMode () {
      let code = ''
      switch (this.extendedGcdMode) {
        case '递归':
          code = extendedGcdRecursiveImpl
          break
        case '循环':
          code = extendedGcdLoopImpl
          break
        default:
          return
      }
      this.$options.extendedGcdCode.off('change', this.onExtendedGcdValueChanged)
      const doc = this.$options.extendedGcdCode.getDoc()
      doc.setValue(gcdImplHeader + code + gcdImplFooter)
      frozenFirstAndLastLine(this.$options.extendedGcdCode)
      this.onExtendedGcdFuncBodyUpdated()
      this.$options.extendedGcdCode.on('change', this.onExtendedGcdValueChanged)
    }
  },
  methods: {
    onGcdValueChanged () {
      this.gcdMode = '自定义'
      this.gcdChanged = true
    },
    onExtendedGcdValueChanged () {
      this.extendedGcdMode = '自定义'
      this.extendedGcdChanged = true
    },
    onGcdFuncBodyUpdated () {
      const gcdFuncBody = this.$options.gcdCode.getDoc().getValue()
      let first = gcdFuncBody.indexOf('\n')
      first = first < 0 ? 0 : first + 1
      let last = gcdFuncBody.lastIndexOf('\n') || 0
      last = last < 0 ? gcdFuncBody.length : last
      const funcBody = `\
function __gcdInner(a, b) {${gcdFuncBody.slice(first, last)}}
const __calls = []
function gcd() {
  const __call = [arguments, __gcdInner(...arguments)];
  __calls.push(__call);
  return __call[1];
}
gcd(a, b);
return __calls;`
      try {
        this.gcdFunc = new Function('a', 'b', funcBody)
        this.gcdFuncError = null
      } catch (e) {
        this.gcdFunc = null
        this.gcdFuncError = e.stack
      } finally {
        this.gcdChanged = false
      }
    },
    onExtendedGcdFuncBodyUpdated () {
      const extendedGcdFuncBody = this.$options.extendedGcdCode.getDoc().getValue()
      let first = extendedGcdFuncBody.indexOf('\n')
      first = first < 0 ? 0 : first + 1
      let last = extendedGcdFuncBody.lastIndexOf('\n') || 0
      last = last < 0 ? extendedGcdFuncBody.length : last
      const funcBody = `\
function __gcdInner(a, b) {${extendedGcdFuncBody.slice(first, last)}}
const __calls = []
function gcd() {
  const __call = [arguments, __gcdInner(...arguments)];
  __calls.push(__call);
  return __call[1];
}
gcd(a, b);
return __calls;`
      try {
        this.extendedGcdFunc = new Function('a', 'b', funcBody)
        this.extendedGcdFuncError = null
      } catch (e) {
        this.extendedGcdFunc = null
        this.extendedGcdFuncError = e.stack
      } finally {
        this.extendedGcdChanged = false
      }
    },
    gcdTestSubmit () {
      if (!this.gcdFormValid) {
        return
      }
      const a = parseInt(this.gcdTestA, 10)
      const b = parseInt(this.gcdTestB, 10)
      this.gcdTestCases.push([[a, b], gcd(a, b)])
    },
    extendedGcdTestSubmit () {
      if (!this.extendedGcdFormValid) {
        return
      }
      const a = parseInt(this.extendedGcdTestA, 10)
      const b = parseInt(this.extendedGcdTestB, 10)
      this.extendedGcdTestCases.push([[a, b], gcd(a, b)])
    }
  }
}
</script>

<style>
.CodeMirror {
  font-size: 16px;
  height: auto !important;
  font-family: monospace;
  border: 1px solid #eee;
  transition: all 0.3s ease-in-out;
}
.CodeMirror.CodeMirror-error {
  border: 1px solid rgba(255,0,0,0.5);
}
.CodeMirror.CodeMirror-focused {
  border: 1px solid rgba(0,0,255,0.5);
  box-shadow: 0 0 5px rgba(0,0,255,0.5);
}
.CodeMirror.CodeMirror-focused.CodeMirror-error {
  border: 1px solid rgba(255,0,0,0.5);
  box-shadow: 0 0 5px rgba(255,0,0,0.5);
}

.error-panel {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  overflow: auto;
}
.v-application .content .stack-table table {
    margin: 0;
    display: table;
}
</style>
<!-- markdownlint-restore -->
