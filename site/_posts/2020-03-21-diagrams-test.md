---
title: 画图测试
author: 孙子平
date: 2020-03-21T15:56:10Z
---

测试各种图。

<!-- more -->

```ditaa [render]
+-------+     +-------+
| hello |--+--| world |
+-------+  |  +-------+
           v
       +--------+
       | Python |
       +--------+
```

```graphviz [render]
digraph {
a -> b -> c
}
```

```sequence [render]
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```
