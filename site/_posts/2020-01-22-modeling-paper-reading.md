---
title: 软件系统建模与验证论文阅读
author: 孙子平
date: 2020-01-22T13:03:41Z
category: 大作业
tags: [大作业]
---

这篇文章是软件系统建模与验证论文阅读的笔记。我被分配的论文是[On-the-fly Translation and Execution of OCL-like Queries on Simulink Models](http://eprints.whiterose.ac.uk/151034/1/home/sun/Projects/oak-tree-house/site/.vuepress/public/MODELS_2019_Simulink.pdf)。原文用$\LaTeX$编写，点击[此处](/assets/blog/modeling-paper-reading/notes.pdf)下载原始的笔记。点击[此处](/assets/blog/modeling-paper-reading/slides.pdf)下载幻灯片。

<!-- more -->

## 0 摘要

模型管理语言诸如OCL、ATL还有Epsilon平台上一些语言主要适用于Eclipse建模框架（EMF）。而Simulink模型是建立在另一套技术栈上的。因而目前操作它们的方式是把它们转换到EMF兼容的模型。这种方法成本很高，因为：

1. 大模型的转换成本很高昂；
2. 这需要Simulink和EMF模型之间的同步；
3. EMF模型可能是不完整的，这会影响操作。

这篇论文使用MATLAB API建立了Simulink模型与现有模型管理语言的联系，使得它们能即时地操控Simulink模型。

然后我们使用了GitHub上最大的Simulink模型进行测试，发现这种即时的翻译可以减少80%的模型验证时间。

## 1 介绍

模型驱动开发中，模型需要被查询、转换、修改和验证。许多最新的模型管理框架都是建立在EMF之上，比如Papyrus和Capella。而Simulink模型是建立在另一套技术栈上的。

一些对操纵Simulink模型的尝试都只是对某一特定使用情况下的解决方案。一个更加可复用性高的方案是Massif项目提供的。然而这个项目中Simulink大模型到EMF的转换代价是非常高昂的。显而易见，如果想要持续地维持Simulink模型的EMF版本，就From Simulink to EMF and vice-versa不得不一有更改就重复地执行转换。不仅如此，目前的这种转换是不完整的，比如并没有考虑到Stateflowblock。

我们提出了新方法，解决了从OCL类似的语言即时生成并执行MATLAB命令。这不仅消除了同步的成本，而且还使我们能操纵完整的Simulink模型。

我们比较了我们的方法和Massif的前期转换，主要是测量了不同阶段的验证执行时间。数据集来自GitHub上所能得到的最大Simulink模型。这些评估表明，我们的方法更适用于连续变化的模型，对这些模型，验证时间可以减少80%。

我们使用Epsilon模型管理框架实现了我们的方法。

## 2 背景

### 2.1 MATLAB/Simulink

MATLAB是由MathWorks开发的专有软件。它的Simulink包是一个图形界面，基于block的建模框架，可以用来建模、仿真和分析动态系统。而其Stateflow包则给Simulink包添加了状态机和流程图。

#### 2.1.1 Simulink模型

下图就是一个简单的Simulink模型示例，可以看出Simulink模型有几种元素，`Block`、`Line`和`Port`，也有一些子类型，如`Port`有`input`和`output`两种子类型，而图中素有高亮的元素都是`Block`的子类型，自左向右有`DiscretePulseGenerator`、`Gain`、`SecondOrderIntegrator`和`Outport`。

![Simulink模型示例](/assets/blog/modeling-paper-reading/example-simulink-model.png)

#### 2.1.2 MATLAB/Simulink命令

除了通过图形界面操控Simulink模型，也可以通过命令来操控。下面的代码展示了如何修改模型。`find_system`可以用于寻找制定类型的对象。如`Block`、`Line`和`Port`，也可以查找某一类型的block、线或端口，如`BlockType`、`LineType`和`PortType`。第4行演示了如何添加元素，`add_block`的第一个参数是库中block的路径，第二个参数是将要创造的元素的路径，第5、6行演示了getter和setter函数。

```matlab
load_system carModel
blocks=find_system('carModel','FindAll','on','Type','Block')
gainBlocks=find_system('carModel','FindAll','on','BlockType','Gain')
gain=add_block('simulink/Math Operations/Gain','carModel/SubSystem/Gain')
chartBlockType=get_param(gain,'BlockType')
set_param(gain,'Name','newName')
```

#### 2.1.3 MATLAB Java API

MATLAB还对C++、Python、C、Fortran和Java提供了接口。示例代码如下。

```java
MATLABEngine eng = MATLABEngine.startMATLAB();
eng.eval("load_system model;");
eng.eval("m = getSimulinkBlockHandle('model')");
Object m = eng.getVariable("m");
eng.close()
```

### 2.2 Epsilon

Epsilon是个模型管理框架，它提供了一系列互相协作的语言和工具。其中Epsilon对象语言（EOL）是了类似OCL的模型查询和转换语言，其他Epsilon语言都建立在这之上。其中值得注意的是用于评估模型性质的Epsilon验证语言（EVL）和用于模型之间转换的Epsilon转换语言（ETL）。

![Epsilon架构](/assets/blog/modeling-paper-reading/epsilon-architecture.png)

上图的Epsilon Model Connectivity（EMC）层为不同的模型技术提供一个抽象层，使它们可以统一地被Epsilon语言操作。而模型技术的具体EMC实现被称为EMC driver。它们可以在上图的底部找到。

```text
var element = M!Block.all.first();
var name = element.name;
element.evaluate();
var newElement = new M!Block;
newElement.name = "My Block";
```

上面的代码展示了一个EOL程序。代码第1行，`all`是关键字，返回一个collection，所有的collection有`first()`方法获取第1个元素。

EOL创建删除元素、获取修改属性或者调用方法都不依赖于EMC driver。

### 2.3 Eclipse Modelling Framework和Massif

EMF本来是希望基于领域特定模型构建Java应用。用于描述EMF模型的元模型语言是Ecore。EMF提供了若干中代表Ecore模型的表示方式，如Java、XML和UML，但它最标准的表示是XML Metadata Interchange（XMI）。

#### 2.3.1 Massif

Massif项目原来是用于将Simulink模型转换成EMF兼容的模型或者反之。这种转换是部分的，因为它们只考虑到Simulink元素，没有考虑到Stateflow元素。

#### 2.3.2 Massif’s Simulink Ecore元模型

在Massif元模型中，所有的Simulink元素都是`SimulinkElement`的子类。就像图3中的那样。`SimulinkModel`类存储根元素，且会保持到文件的引用和版本。它包含了所有的`Block`、`Port`和`Connection`元素。

![Massif元模型提供的Simulink元素类型](/assets/blog/modeling-paper-reading/simulink-elements.png)

在Massif中，`Port`要么是`InPort`要么是`OutPort`，而且它们也可以用虚拟的block `PortBlock`。类似地`Connection`要么是`SingleConnection`要么是`MultiConnection`。所有的在Massif中找不到Simulink对应的block，都会被认为是`Block`。它们有一个`parameters`属性，保存着`Property`的数组用以记录属性。

Massif元模型和Simulink模型有一些差别。比如Simulink有140个`Block`类型，而Massif只有11个实际`Block`类型。类似地，Simulink有6个`Port`子类，而Massif有5个。尤其是我们还不清楚`State`是如何映射到`Reset`和`ifaction`端口类型的。另外Massif的`Connection`类对应的Simulink中的`Line`和子类型`signal`。而`MultiConnection`和`SingleConnection`对应MATLAB中的`SegmentType`，它可以取`trunc`或`branch`两种值。而且在MATLAB中，大小写很重要，比如`input`就是指一种端口子类，而`Input`是指一种block子类。除此之外，MATLAB还提供了Cell Arrays和Structure Arrays结构，而Massif都存成了普通String。

#### 2.3.3 From Simulink to EMF and vice-versa

Massif提供了4种转换方式。我们称这个过程为import。import模式在处理`ModelReference` block上有所不同：

- **Shallow** 不处理引用模块；
- **Deep** 对每个新的`ModelReference`创建`SimulinkModel`；
- **Flattening** 创建`SubSystem`；
- **Referencing** 创建新的EMF资源，并且在模型中引用。

## 3 MATLAB/Simulink即时转换

我们选用Epsilon模型管理框架来实现并且评估我们的即时转换。我们称我们的工作为Simulink EMC driver。

![Simulink EMC driver架构](/assets/blog/modeling-paper-reading/driver-architecture.png)

我们的driver能够即时操控模型，我们通过下面的示例来展示。考虑下面的EOL程序。

```text
Block.all.select(b|b.Name == 'MyBlock');
```

`Block`类型和`Name`属性通过即时地翻译成MATLAB命令从而对脚本可用。具体而言，为了获得所有的`模型`，以下命令会被送到MATLAB那里，其中`?`占位符会分别替换成模型名和`Block`。

```text
find_system(?, 'type', '?',...)
```

返回的block标识符集合会由driver作为`SimulinkBlock`实例来管理。当获取`Name`属性的时候，下面的语句会被执行，其中占位符被替换成block标识符。

```text
get_param(?, 'Name)
```

### 3.1 模型

driver把一个Simulink文件作为一个模型。模型通过`SimulinkModel`这个类的一个实例管理。它实现了从EMC层继承自`CachedModel`和`Model`的方法，这些方法描述了如何进行CRUD操作。此外它也决定了如何载入和丢弃Simulink模型，当载入的时候，driver会创建到MATLAB引擎的连接。

### 3.2 模型元素

`SimulinkModel`管理了从`SimulinkModelElement`继承的元素，它们要么是`SimulinkElement`，要么是`StateflowBlock`。

`SimulinkElement`可以进一步拆分成`SimulinkBlock`、`SimulinkPort`和`SimulinkLine`，它们对应于Simulink的`Block`、`Port`和`Line`。

Simulink采用不同的方式标识元素，有路径、ID和句柄。在driver中，我们采用句柄标识元素，因为路径和位置相关，而ID是最新的MATLAB才有的。

#### 3.2.1 创建

`SimulinkModel`管理了模型元素的创建，当EOL中调用`new`关键字时，`SimulinkModel`中的`createInstance(type:String)`方法（继承自`Model`）会被调用。为了创建block，这个方法会调用MATLAB的`add_block`函数。下面的代码展示了如何创建元素，由于类型名有空格所以要用反引号。这些block是顶层的，但可以通过修改父节点放到其他地方。

```text
var sum = new `simulink/Math Operations/Sum`;
var subsystem = new `simulink/Ports & Subsystems/Subsystem`;
```

然而MATLAB中并没有`add_port`函数。而`add_line`函数需要指定源和目标端口。因而driver并不是使用`new Line();`或者`new Signal();`创建线，而是通过连接的方法。对于第一张图中的所有线可以通过下方的几条语句创建。

```text
pulse.link(gain);
gain.linkTo(integrator, 1);
integrator.linkFrom(outport1, 1);
integrator.linkFrom(outport2, 2);
```

#### 3.2.2 删除

 当EOL语句使用`delete`关键字的时候，就像下面的代码中的那样。`SimulinkModel`的`deleteElementInModel(element:SimulinkModelElement)`方法（继承自`Model`）会被调用。它会进一步调用MATLAB的`delete_block`或`delete_line`。

```text
delete sum;
delete subsystem;
```

#### 3.2.3 读取

下方的代码展示了在给定模型`M`之后用EOL语句获取不同的模型元素。`allContents`和`all`关键字会调用`SimulinkModel`的相关方法，这些方法进一步调用MATLAB的`find_system`函数。

```text
var blocks = M!Block.all();
var lines = M!Line.all();
var ports = M!Port.all();
var sums = M!Sum.all();
var subsystems = M!SubSystem.all();
M.allContents();
```

其中1到3行的`all`关键字会触发`getAllOfKindFromModel(kind:String)`的执行，其中`kind`参数要么是`Block`，要么是`Line`，要么是`Port`。如果`kind`不是这些值，就像4到5行那样，它就会查询MATLAB子类型。而`allContents()`方法会调用`allContentsFromModel()`方法，它只是简单地将所有类型汇总。

#### 3.2.4 更新

`SimulinkModel`将对模型属性的获取和修改传递到`SimulinkPropertyGetter`和`SimulinkPropertySetter`的实例上。然后这两个方法会调用`get_param`和`set_param`。下方代码中的1和3行展示了setter，而2、4和5展示了getter。

```text
captionpos=b]
subsystem.name = "Controller";
var subsystemName = subsystem.name;
sum.description = "Sum block";
var sumDescription = sum.description;
var inportHandles = subsystem.LineHandles.Inport;
```

第5行，`LineHandles`返回了结构数组，这是MATLAB特有的类型存储着键值对，通过MATLAB的`getfield(element,property)`函数获取，我们的driver能处理这种情况。

#### 3.2.5 方法

除了上面提到的连接方法之外，driver还提供了一些方法如`getType()`、`getParent()`和`getChildren()`等等。但MATLAB提供的函数比这些方法多很多，因而当出现未知的方法调用时，以下的策略会被使用。

许多Simulink API会以模型元素作为第一个参数，就像下面这样：

```text
method_name(element, arg0, ..., argN)
```

而EOL像下面这样执行方法：

```text
element.methodName(arg0, ..., argN);
```

因而我们会动态地将EOL方法调用转换成MATLAB的格式。举个例子，像下面的EOL语句：

```text
subsystem.find_mdlrefs();
subsystem.find_mdlrefs("AllLevels",true);
```

会被转换为如下的MATLAB命令：

```text
find_mdlrefs(subsystem)
find_mdlrefs(subsystem,'AllLevels',true)
```

### 3.3 Stateflow

我们的Simulink EMC driver能够处理Stateflow模型。MATLAB对这些模型的处理不同于Simulink模型。下图显示了Simulink `Chart` block包含的Stateflow模型，它有两个状态ON和OFF以及一条转移E1。

![Stateflow模型示例](/assets/blog/modeling-paper-reading/stateflow-example.png)

在MATLAB中，所有的Stateflow类型都是以`Stateflow.`为前缀的，我们保留了这种约定。

Stateflow的所有模型元素都需要一个父亲才能实例化。比如创建`Stateflow.State`，需要用这条语句`Stateflow.State(chart)`，其中`chart`是一个`Stateflow.Chart`元素。而在EOL里我们这么创建``new `Stateflow.State`(chart)``。然而不仅如此，我们的driver能够延迟对模型元素的初始化，实际上可以执行``new `Stateflow.State` ``，这时一个状态占位符被创建，你可以修改它的属性，但是直到它的`parent`属性被指定的时候，这个模型元素才会被真正地创建。

我们通过`StateflowBlock`管理Stateflow元素，而MATLAB获取或修改属性的语法和EOL的语法很像，使用下面的EOL语句可以创建上图中的Stateflow模型：

```text
var on = new `Stateflow.State`;
on.Name = "ON";
on.parent = chart;
var off = new `Stateflow.State`(chart);
off.Name = "OFF";
var tOnOff = new `Stateflow.Transition`(chart);
tOnOff.Source = on;
tOnOff.Destination = off;
tOnOff.LabelString = "E1";
```

## 4 评测

我们有两种方式将Simulink模型转换为某种模型管理框架。第一种是我们提出的用Simulink EMC driver转成Epsilon模型管理框架，第二种是用Massif转成EMF兼容的表示。Epsilon提供了EMF EMC driver，能够读写Massif生成的基于EMF的模型。前一种我们称为live，后一种我们称为Massif/EMF。我们比较两者执行时间上的性能。

Epsilon可以通过`CachedModel`缓存模型元素，我们还会比较这个设施启用和禁用下的性能。

### 4.1 实验配置

为了比较性能，我们选取模型验证的时间作为参考标准。模型验证需要用到EVL语言。

#### 4.1.1 验证步骤

EVL有个专属的引擎，它会输入EVL脚本和任意多个模型，去验证不变的属性。下方的代码就是一个示例。这个示例脚本中包含了一个类型为`critique`，名字为`BlockNameIsLowerCase`的不变属性，它在由`context`关键字指定的`Block`类型上验证。一个不变属性可以是`constraint`或者`critique`类型，前者是个错误，后者只是警告。第3行是要执行的EOL语句，关键字`self`指向当前的模型元素。如果模型的`check`部分失败了，那么如果有，就会进入`fix`部分，第7行将模型的名字改回了小写。

```text
context Block {
  critique BlockNameIsLowerCase {
    check: self.Name == self.Name.toLowerCase()
    fix {
      title: "Name to lower case"
      do {
        self.Name = self.Name.toLowerCase();
      }
    }
  }
}
```

![验证的配置](/assets/blog/modeling-paper-reading/validation-setup.png)

EMC driver和元模型的实现会影响对应的EOL。如访问一个`block`的`PortDimension`属性，在Simulink EMC driver下是这样的：

```text
block.PortDimension;
```

而在Massif/EMF下，我们通过`parameters`访问，如下：

```text
block.parameters.selectOne(p | p.name == "
    PortDimension").value;
```

我们测量3个阶段的耗时：(0) Simulink到EMF的转换，(1) 模型加载和(2) 模型验证。第0阶段只对Massif/EMF有效，而阶段2有缓存开启不开启两种选项。

每一阶段会执行5次预热和20次真正的运行。这里有一些测试环境的数据省略了。

#### 4.1.2 验证脚本

我们尽量使两个方案的测试脚本等价。每个测试脚本包含了9个不变的性质，见下表。live的测试脚本有96行，而Massif/EMF的测试脚本有110行。

| # | Kind | Context | 描述 |
|:-:|:-:|:-:|:-:|
| 1 | PropertyCheck | Goto | TagVisibility属性是local的 |
| 2 | NavigationAndFilter | From | 范围内有Goto block，其名字为GotoTag的属性 |
| 3 | PropertyCheck | Inport/InPortBlock | PortDimensions属性不应该被继承 |
| 4 | PropertyCheck | Outport/OutPortBlock | Description属性不是null或空 |
| 5 | NavigationAndFilter | SubSystem | ForegroundColor属性对所有连接着的Input block应该是绿色的 |
| 6 | TransitiveClosure | SubSystem | SubSystem深度不应该超过3 |
| 7 | VertexConnectivity | SubSystem | 所有的输出端口都应该连接了 |
| 8 | LoopAbsence | SubSystem | 没有反馈，即Outport不应该连上同样的SubSystem |
| 9 | PropertyCheck | Block | Block的名字是小写 |

#### 4.1.3 模型选择

我们使用BigQuery在GitHub上寻找大于1MB的Simulink文件，我们找到了70个模型，然后挑选出7个能在2小时内用Massif转换到EMF的。下表展现了各个模型的大小及其中元素的个数。

| Size | Block | Inport | Outport | Goto | From | SubSystem |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1.112 | 8785 | 1373 | 1177 | 69 | 103 | 717 |
| 1.131 | 8628 | 1372 | 1167 | 62 | 93 | 740 |
| 1.133 | 8645 | 1372 | 1167 | 62 | 93 | 740 |
| 1.134 | 9536 | 1489 | 1269 | 38 | 57 | 861 |
| 1.135 | 8645 | 1372 | 1167 | 62 | 93 | 740 |
| 1.138 | 8651 | 1376 | 1177 | 62 | 93 | 745 |
| 1.141 | 8634 | 1374 | 1156 | 67 | 99 | 714 |

### 4.2 结果

由Massif/EMF方式导入文件的最终大小见下图。

![导入的EMF文件大小相较于原始MATLAB文件大小](/assets/blog/modeling-paper-reading/import-size.png)

下图显示了总的执行时间，每一阶段的时间被平均了。

![总的执行时间相较于原始MATLAB文件大小](/assets/blog/modeling-paper-reading/total-time.png)

下图显示了各个阶段下执行的时间（单位秒且是对数坐标）。

![各阶段的执行时间（对数坐标）相对于原始MATLAB文件大小](/assets/blog/modeling-paper-reading/stage-time.png)

从上图可以看出，Massif/EMF主要的时间都花在了导入模型的阶段。总体时间上来看，live方法比Massif/EMF在启用缓存的时候快了70.7-80.0%，没启用缓存的时候快了32.6-53.2%。

## 5 观察到的经验教训

### 5.1 性能

对于大型文件live方式更有优势，但如果验证的文件有很繁重的查询的时候，Massif/EMF可能更好。live的性能受限于MJ-API。

### 5.2 元模型保真

live方法极大地保留了MATLAB原始的API。此外live方法还保留了Stateflow元素。还有MATLAB特定的数据类型可以通过live方法获取，而在EMF中，它们是字符串。

### 5.3 模型大小和模型元素

从图中可以看出Massif/EMF方法产生的文件比原始文件大多了。
