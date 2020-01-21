---
title: 深度学习导论Tiny Image Challenge报告
author: 孙子平
date: 2020-01-21T13:33:19Z
category: 大作业
tags: [大作业, 深度学习]
---

这篇文章是我深度学习导论课程的第一个大作业Tiny Image Challenge的报告。大作业的目标是搭建一个简单的图片分类器，输入图片大小是64x64，分类有100类。你可以在[Tiny Image Challenge | Kaggle](https://www.kaggle.com/c/thu-deep-learning/leaderboard)看到所有人的成绩。我和我的组员先后尝试了多种模型，并在最后取得了0.43350的准确率，排名3/20。

原文使用$\LaTeX$编写，你可以点击[此处](/assets/blog/tiny-image-challenge/report.pdf)下载原文。

<!-- more -->

## 1 提出的模型

我们使用了很多模型，以下按准确率由低到高排序，各个模型的最终表现见下表。

|模型名|预训练模型|测试集准确率|epoch|
|:-:|:-:|:-:|:-:|
|NaiveCNN|否|0.20470|90|
|DeeperCNN|否|0.21090|120|
|多输出Resnet网络结构|否|0.26910|15|
|se\_resnet网络结构|否|0.33090|23|
|多se网络结构|否|与se\_resnet差不多|17|
|resnet18|是|0.40090|50|
|efficientnet-b0|是|0.42120|34|
|se\_resnet50|是|0.43350|17|

1. **Naive CNN**：非预训练模型。最普通的CNN，由2层卷积层和2层全连层组成；
2. **Deeper CNN**：非预训练模型。相较于Naive CNN多了1层卷积层，卷积核的粒度更小，实际证明更深的模型可以有更好的表现；
3. **多输出Resnet网络结构**：非预训练模型。设计了多输出Resnet网络结构。网络结构共有4个block，在正常Resnet网络结构的基础上，在每个block后添加一个输出，网络共有5个输出（加上原始的最后输出），同时对每个输出设置gate对输出进行加权（权重亦可训练）。主要的想法是这样的网络结构在每个block后增加输出，增强的模型的泛化能力，比原始的模型拟合能力更强，同时在不同层设置多输出亦增强了模型的鲁棒性；
4. **se\_resnet网络结构**：非预训练模型。在resnet网络结构的基础上加入了SE模块，模型结构与se\_resnet系列类似，不过层数更少。主要的想法是SE模块在自然对抗样本上的表现较好，因此加入SE模块，同时使用Resnet网络结构；
5. **多se网络结构**：非预训练模型。在加入SE模块的基础上，进行了多SE连接的设计，即在不同的block之前也加入SE模块，增强模型的Attention机制。主要的想法是加入SE模块对自然对抗样本有较好的分辨效果，而现有的网络结构一般是在block内部加入SE模块，在不同block之间也加入SE模块，可以同时使得block受到来自之前网络的输出加权，从而增强模型的Attention机制；
6. **resnet18**：预训练模型。这是最早尝试的预训练模型，预训练模型在更大的数据集上训练，因而应该有更好的泛化能力。具体实现是在输入的地方将图片缩放到$224\times 224$的大小，输出的地方在原先的1000类输出之后加了一个到100类的全连层；
7. **efficientnet-b0**：预训练模型。考自ICML 2019的论文《EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks》。主要原理是通过寻找到CNN网络的深度、宽度和分辨率的比值的最优解，按照最优解来不断扩大网络规模，以达到优秀的性能表现；
8. **se\_resnet50**：通过阅读Natural adversal examples的论文，了解到Squeeze and Excitation模块可以在resnet等网络结构的基础下，可以有效提升自然对抗样本的准确率。基于Attention的机制，有利于自然对抗样本的分辨，因此使用SE模块+Resnet网络结构的设计。限于机器及训练时间的限制，选择使用se\_resnet50的预训练网络模型，便于加快收敛同时提升准确率。

## 2 模型训练

### 2.1 数据增强

对于Naive CNN和Deeper CNN两个模型，我们没有采用数据增强。而对于resnet18和se\_resnet50，我们采用了随机裁剪、随机翻转。而对于多输出Resnet网络结构、se\_resnet网络结构、多se网络结构和efficientnet-b0，除了随机裁剪和翻转外，我们还加入了随机修改亮度、对比度、饱和度的操作。

### 2.2 损失函数、优化器及超参

对所有的模型，我们都以CrossEntropy作为损失函数，并且以Adam作为优化算法。超参详见下表。

|模型名|BatchSize|学习率|WeightDecay|
|:-:|:-:|:-:|:-:|
|NaiveCNN|64|0.0003|0|
|DeeperCNN|64|0.0003|0|
|多输出Resnet网络结构|100|0.001，15个epoch后变为0.0001|1e-5|
|se\_resnet网络结构|100|0.001，15个epoch后变为0.0001|1e-5|
|多se网络结构|100|0.001，15个epoch后变为0.0001|1e-5|
|resnet18|64|0.001|0|
|efficientnet-b0|64|0.001，30个epoch后变为0.0001|0|
|se\_resnet50|100|0.001，15个epoch后变为0.0001|1e-5|

![train loss曲线，横坐标为iteration](/assets/blog/tiny-image-challenge/cnn-loss.png)

![validation accuracy曲线，横坐标为epoch](/assets/blog/tiny-image-challenge/cnn-accuracy.png)

上面两张图分别是Naive CNN和Deeper CNN的train loss和validation accuracy曲线，橘线是NaiveCNN，蓝线是Deeper CNN。第一张图的横坐标为iteration，第二张图的横坐标为epoch。

这两张图显示了Naive CNN和Deeper CNN训练时的loss和验证时的准确率。可以看出Naive CNN的准确率甚至随着训练下降。可能是模型出现了过拟合的情况。此外，我们注意到验证时的准确率比测试时的准确率高很多，这说明验证集的数据可能经过了筛选。

![train loss曲线，横坐标为iteration](/assets/blog/tiny-image-challenge/resnet18-loss.png)

![validation accuracy曲线，横坐标为epoch](/assets/blog/tiny-image-challenge/resnet18-accuracy.png)

上图两张图分别是Resnet18的train loss和validation accuracy曲线。第一张图的横坐标为iteration，第二张图的横坐标为epoch。

这两张图显示了resnet18训练时的loss和验证时的准确率。下图显示了efficientnet-b0验证的准确率。可以看出预训练模型在最开始就能有很高的准确率。

![efficientnet-b0的validation
  accuracy曲线](/assets/blog/tiny-image-challenge/efficientb0-accuracy.png)
