---
title: 画图测试
author: 孙子平
date: 2020-03-21T15:56:10Z
---

测试各种图。

<!-- more -->

## 1 Ditaa

```ditaa [render p-class="text-center"]
+-------+     +-------+
| hello +--+--+ world |
+-------+  |  +-------+
           v
       +--------+
       | Python |
       +--------+
```

## 2 Graphviz

```graphviz [render p-class="text-center"]
digraph {
a -> b -> c
}
```

## 3 Sequence Diagrams

```sequence [render p-class="svg-diagram" theme="simple"]
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```

## 4 Flowchart Diagrams

```flowchart [render p-class="svg-diagram"]
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
```

## 5 Mermaid Diagrams

### 5.1 Flowchart

```mermaid [render p-class="svg-diagram"]
graph LR
    A:::someclass --> B
    classDef someclass fill:#f96;
```

### 5.2 Sequence

```mermaid [render p-class="svg-diagram"]
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

### 5.3 Class

```mermaid [render p-class="svg-diagram"]
classDiagram
     Animal <|-- Duck
     Animal <|-- Fish
     Animal <|-- Zebra
     Animal : +int age
     Animal : +String gender
     Animal: +isMammal()
     Animal: +mate()
     class Duck{
         +String beakColor
         +swim()
         +quack()
     }
     class Fish{
         -int sizeInFeet
         -canEat()
     }
     class Zebra{
         +bool is_wild
         +run()
     }
```

### 5.4 State

```mermaid [render p-class="svg-diagram"]
stateDiagram
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

### 5.5 Gantt

```mermaid [render p-class="svg-diagram"]
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```

### 5.6 Pie

```mermaid [render p-class="svg-diagram"]
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

<style lang="scss">
p.svg-diagram {
  text-align: center;
  svg {
    max-width: 100%;
  }
}
</style>
