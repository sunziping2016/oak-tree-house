---
title: 全自动清华刷课脚本
author: 孙子平
date: 2020-09-12T05:28:27Z
category: 项目
tags: [大作业]
---

清华研究生的选课如今（2020年）还没有采用Waiting List机制，这就使得刷课脚本成为可能，然而验证码一直以来是困扰刷课脚本的最大难题。为了解决验证码，我独立提出了一个模型（我觉得肯定被提出过了，只是没有查阅文献），在朋友的帮助下完成了数据集的采集和标注，并达到了90%以上的准确率，实现了全自动清华刷课。项目在[这里](https://github.com/sunziping2016/THUCourseSpider)。

<!-- more -->

本人设计的刷课脚本仅供学习用途，对使用时造成的损失不负任何责任。项目以GNU GPLv3协议发布，这意味着基于此项目的项目**必须以同样的协议发布并开源**。项目真的很不容易，写了1k多行的代码，还标注了4000个样本，这占用了我一定的精力。希望大家能用star的方式支持我的项目。

## 1 如何使用

首先你需要安装Python3。然后依次执行下面的命令，准备仓库。项目没有在Windows上测试过，但应该可以运行，欢迎PR来补充Windows的文档，Windows用户请使用第二条`pip install`指令。

```bash
#### Clone Repo
git clone https://github.com/sunziping2016/THUCourseSpider.git
# git clone git@github.com:sunziping2016/THUCourseSpider.git
cd THUCourseSpider

#### Create venv (Optional)
# python -m venv venv
# source venv/bin/activate

#### Install dependecies
pip install -r requirements.txt
# pip install -r requirements-win.txt
```

接下来的步骤可以分为3步：

1. 搜集并标注数据（可使用repo里已标注好的`captcha.tgz`）；
2. 训练模型（可使用我训练好的模型，但目前为止有密码，暂不对外开放），在我的RTX 2070 Super上需要约20分钟；
3. 运行刷课脚本。

对于想使用训练好的模型用户，可以从看[1.2.1](#_1-2-1-使用训练好的模型)和[1.3](#_1-3-运行刷课脚本)。如果需要自己训练模型，可以看[1.1.1](#_1-1-1-使用已标注好数据)、[1.1.5](#_1-1-5-生成用于训练数据集)、[1.2](#_1-2-训练模型)和[1.3](#_1-3-运行刷课脚本)。对于实在是想知道标数据是什么样的体验的用户，通读整个第1章即可。

本项目的程序大多有命令行参数可供调整，加上`--help`参数即可查看帮助。

### 1.1 搜集并标注数据

原始数据集存放的目录是`captcha`。验证码被下下来并确认标记答案正确后，会存放到`captcha/<md5hash>.<code>.jpeg`。其中`<md5hash>`是图片的md5散列值，`<code>`是正确答案。

我们需要对一部分原始图片标记位置，以便更好地对分类网络进行预训练。没有预训练整个网络基本无法工作，所以标记位置是很重要的。位置信息会被存储在`segmentation.txt`。其内容大致如下：

```text
000a5b757fe41963b3a3d503d3de4640.W2FP.jpeg:70,101,121,142
0019fa074e8d50b0727a570407c9f411.4QFT9.jpeg:57,77,101,123,148
00253474dbe8159a9a05720654d4a6e3.XWF8.jpeg:67,92,119,139
00362bf4a054de99b4f4db7393ea33c1.GXXP8.jpeg:55,76,100,126,150
006b4ce5e73d0a9f506002d71a3a9d71.6EHG.jpeg:66,89,110,138
00912fe666cd2b31102aebd3f8f08041.MT2V9.jpeg:53,77,103,121,151
00bebc089ae21814743963b8d0ec3422.Q9X4J.jpeg:56,80,104,130,150
01231260ea359c43877f654e8ab0e955.KH8P6.jpeg:58,80,104,126,145
01349ce3182ab1d608d4776ed4b79ac1.WQGBM.jpeg:50,76,110,132,152
013bb3f01ad530494837b6bf1b8af957.YK6H.jpeg:66,92,115,137
```

每一行是`<filename>:<pos1>,<pos2>,...,<posN>`，其中`<filename>`是文件名，`<pos1>`都`<posN>`是字符中心位置的x坐标值。一般而言，文件的行是按照文件名排序，x坐标值也是排好序的。

#### 1.1.1 使用已标注好数据

解压`captcha.tgz`（`.tar.gz`格式）到当前目录就可以使用先前标注好的数据。

```bash
tar xzvf captcha.tgz
```

目前包含4000张已经标记了答案的验证码，其中2004张还标记了位置。

#### 1.1.2 搜集并标记验证码答案

首先，标记验证码需要登录选课系统，所以你可以将`config.example.json`拷贝为`config.json`。然后编辑`config.json`，修改其中的用户名和密码。

而后运行：

```bash
./label-captcha.py
```

就可以开始标记验证码，它会提示你需要输入验证码。验证码会被下载到`captcha.jpeg`文件中。输入的时候是不区分大小写的。

合并两个人标记的验证码是很简单的。只需要把`captcha/*.jpeg`文件拷贝一下就行。注意位置信息，即`segmentation.txt`不能这样合并，如果需要合并的包含位置信息，见下一节。

#### 1.1.3 标记验证码位置

运行：

```bash
./segment-captcha.py
```

会弹出一个窗口，如下：

![Segment Tool UI](/assets/blog/automatic-thu-course-crawler/segment-tool.png)
{.text-center}

鼠标点击图中可以标记一个位置，可以点住移动，再松开。单击已有的线会取消，拖拽已有的线会将它置于新的位置。`<<`表示寻找上一个没有完成标注的，`>>`同理，它们会循环，对应的快捷键是ctrl+方向键。`<`是上一张图，`>`是下一张图。所有的更改只有按了`Ok`（或者回车）才会保存，然后它会切到下一张图（相当于按了`>>`）。Prog表示现在共4000张图，2004张已标记，Idx是第几张图，Code是答案。正常的流程是打开软件，按`>>`切到第一未标记的张图，鼠标点击中心，然后回车，切到下张图，循环往复。

#### 1.1.4 深度学习辅助的标记验证码答案

当训练好神经网络之后，标图就更加方便了。运行：

```bash
./label-captcha-gui.py
# ./label-captcha-gui.py --generator_save_path ./save/generator-full
```

如果你使用的是训练好的模型，请执行第2行命令。它会弹出一个窗口，如下：

![Label Tool UI](/assets/blog/automatic-thu-course-crawler/label-tool.png)
{.text-center}

默认模式下会载入神经网络，然后只需要在输入框中修改错误的验证码即可。点击`Ok`（或者回车）切换下一张验证码。

#### 1.1.5 生成用于训练数据集

当数据集准备好了。即有大量的数据被标注好答案，并且大部分的数据都被标注好位置后，就可以生成用于训练数据集。它会切割图片并且切分数据集，运行：

```bash
./prepare-dataset.py
```

生成的用于训练的数据集位于`dataset`，大致内容如下：

```text
dataset
├── segmented     将字符切割出来的数据集，用于训练分类器，需要被标注位置信息
│   ├── all       既包含训练又包含测试的数据集，用于训练最终给用户的模型
│   │   ├── +     包含空白或者两个字符之间的图片
│   │   │   ├── 000a5b757fe41963b3a3d503d3de4640.W2FP.158.jpeg  文件名.答案.中心位置.jpeg
│   │   │   ...
│   │   ├── 2     包含字符2的图片，下同
│   │   ├── 3
│   │   ...
│   ├── test      测试集
│   │   ├── +
│   │   ...
│   └── train     训练集
│   │   ├── +
│   │   ...
└── whole          完整图片的数据集，只切去了预设定的图片留白边框，用于训练生成器
    ├── all
    │   ├── 000a5b757fe41963b3a3d503d3de4640.W2FP.jpeg  文件名.答案.jpeg
    │   ...
    ├── test
    └── train
```

### 1.2 训练模型

模型的训练分为两步：

1. 训练分类器：对单个字符的图片进行分类，用的是CNN；
2. 训练生成器：讲分类器从原图中滑过提取出的特征，输入到RNN decoder中，生成答案。

实验表明，省去步骤一，直接用步骤二是不太能训练出好的模型的，我个人觉得那需要很强大的算力。实验也表明，提高分类器的准确度能比改进生成器提升得更快。此外，实验还表明，步骤二中似乎不把梯度回传给分类器特征提取部分，效果会更好，但差别不显著。

#### 1.2.1 使用训练好的模型

预训练好的模型存放在[这里](https://file.szp15.com/f/e1d074055f0f48f9b267/)，文件大小为752.3MB。下载后建议放置于`save/generator-full/epoch.0050.pth`这里，路径如果没有的话请手动创建。而后运行刷课脚本的时候，需要加入额外的参数`--generator_save_path save/generator-full`。

#### 1.2.2 训练分类器

```bash
./classifier.py
# ./classifier.py --gpu 0,1
```

运行上面的命令即可。注意如果你有GPU，请务必加上`--gpu <id1>,<id2>,...`，以加速训练。运行完毕后，`save/classifier`目录下会多出`epoch.<epoch>.pth`文件，那是保存的模型，还会有`running-log.json`，里面是训练时长、参数之类的信息。

此外训练的数据，如loss、accuracy都保存进了TensorBoard。运行下面的命令即可查看：

```bash
tensorboard --logdir runs
```

#### 1.2.3 训练生成器

```bash
./generator.py
# ./classifier.py --gpu 0,1
```

运行上面的命令即可。需要注意的点同上。只是保存的目录默认是`save/generator`，此外目录里还会有`predicates.<epoch>.txt`文件，是模型在测试集上预测出来的验证码值，按文件名排序。

### 1.3 运行刷课脚本

首先，请确认你准备好了`config.json`文件，它包含了你的用户名和密码。你可以将`config.example.json`拷贝为`config.json`。然后编辑`config.json`，修改其中的用户名和密码。

然后，请你准备好`courses.csv`，它包含了你想要抢课的信息。你可以将`courses.example.csv`拷贝为`courses.csv`。然后编辑`courses.csv`。这里示例里给出的是2020年秋季学期学位课的两门英语课。一般情况下，你需要修改学年学期`Semester`、课程号`Course Number`和课序号`Course ID`。

```bash
./graduate-crawler.py
# ./graduate-crawler.py --generator_save_path ./save/generator-full
```

如果你使用的是预训练好的模型，请使用第2行。你也可以加入`--verbose`查看额外的信息，默认情况只有尝试申请课程的时候才会打印输出。

## 2 设计细节

### 2.1 神经网络结构

首先，我利用切割出来的图片训练一个**分类器**，这里切割出来的图片是从左到右滑动窗口取出来的。如果滑动窗口的中心距离某个字符位置中心很近，这个图片的标签就是这个字符；否则这个图片会被标记为不包含字符，我们用`+`这个标签表示。可以注意到，并不是所有的数字和大写英文字母都会出现在验证码中，最终分类器是25分类。

分类器由两部分组成：

1. 由卷积组成的特征提取部分；
2. 由全连层组成的分类部分。

对于我们而言，最重要的是特征提取部分。

接着我们构建一个**生成器**，生成器类似于一个Seq2Seq模型，只是差别在于它的Encoder不是一个处理变长序列的RNN（GRU），而是处理定长输入的全连层。全连层将一个分类器特征提取出的所有特征连接在一起，映射到RNN的初始隐藏状态。RNN的输入是上一次产生的Token，输入的第一个Token是一个特殊的SOS（Start-Of-Sentence）字符。最后训练生成器的时候，我不训练分类器特征提取部分，这样似乎更好。
