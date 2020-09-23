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

<div id="euclidean-code"></div>

<div v-if="gcdFuncError !== null" class="error-panel">{{ gcdFuncError }}</div>

<script>
export function loadScript (src, id) {
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

export function loadStyle (src, id) {
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

export default {
  data: () => ({
    gcdFuncBody: 'function gcd(a, b) {\n\treturn b == 0 ? a : gcd(b, a % b);\n}',
    gcdFunc: null,
    gcdFuncError: null,
  }),
  mounted () {
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.js', 'script-codemirror'),
      loadStyle('//cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/codemirror.min.css', 'style-codemirror')
    ])
      .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.58.1/mode/javascript/javascript.min.js', 'script-codemirror-mode-javascript'))
      .then(() => {
        const element = document.getElementById('euclidean-code')
        const code = CodeMirror((elt) => {
          element.appendChild(elt, element)
        }, {
          value: this.gcdFuncBody,
          mode: 'javascript',
          lineNumbers: true,
          viewportMargin: Infinity
        })
        const doc = code.getDoc()
        doc.markText(
          { line: doc.firstLine(), ch: 0 },
          { line: doc.firstLine() + 1, ch: 0 },
          { readOnly: true, atomic: true, selectLeft: false, css: 'opacity: 0.5' })
        doc.markText(
          { line: doc.lastLine() - 1, ch: doc.getLine(doc.lastLine() - 1).length },
          { line: doc.lastLine(), ch: 1 },
          { readOnly: true, atomic: true, selectRight: false, css: 'opacity: 0.5' })
        code.on('change', () => {
          this.gcdFuncBody = code.getValue()
        })
      })
    this.onGcdFuncBodyUpdated()
  },
  watch: {
    gcdFuncBody: 'onGcdFuncBodyUpdated',
    gcdFuncError () {
      const element = document.getElementById('euclidean-code').firstChild
      element.classList[this.gcdFuncError === null ? 'remove' : 'add']('CodeMirror-error')
    }
  },
  methods: {
    onGcdFuncBodyUpdated () { // TODO: debounce
      try {
        this.gcdFunc = new Function('a', 'b', `const gcd = (\n${this.gcdFuncBody}\n); return gcd(a, b)`)
        this.gcdFuncError = null
      } catch (e) {
        console.log(e.lineNumber, e.columnNumber)
        this.gcdFunc = null
        this.gcdFuncError = e.stack
      }
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
  border-radius: 5px;
  margin-top: 1em;
  margin-bottom: 1em;
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
  margin-top: 1em;
  margin-bottom: 1em;
  white-space: pre-wrap;
  font-family: monospace;
  color: red;
  font-size: 14px;
}
</style>
