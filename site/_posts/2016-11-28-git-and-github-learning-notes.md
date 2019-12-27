---
title: Git & GitHub 学习笔记（放弃更新）
date: 2016-11-28 12:00:00
categories: Git
tags: [Git, GitHub]
summary: 这篇文章主要是对于man git的梳理。
---
这篇文章主要是对于`man git`的梳理。

<!--more-->

## 1 基本概念

### 1.1 仓库（Repository）

Git 仓库存储着一个项目整个生命周期的所有信息。仓库包含的配置文件是每一个仓库独有的，即不随 clone 等命令传递到其他的仓库。此外，仓库还包含两种基本的数据：对象存储（Object store）和索引（index）。

### 1.2 Git 对象类型（Object Type）

Git 的对象存储包含了源文件、日志信息、配置信息等等。对象有以下 4 种：

- **二进制对象（Blob）**：用于存储某一文件的数据，不包含任何元信息（日期、文件名等等）；
- **树（Tree）**：用于存储某一目录下的信息，记录了子二进制对象的 ID，路径名，以及目录下文件的元信息。同时树也能递归引用，从而完整地存储文件的目录层次；
- **提交（Commit）**：用于存储仓库更改的元信息，包括作者、提交者、日期和日志信息。同时每个提交会指向一个树，记录了文件系统的快照。最初的提交称为**根提交（Root commit）**，不存在父节点，其他的提交存在一个或多个父节点；
- **标签（Tag）**：向一个对象指派一个名字。
Git 在需要的时候会对这些对象进行压缩，构成包文件（Pack files）。这些对象的存储的文件名为其内容的 SHA1 值。

### 1.3 索引（Index）

索引是临时的用于描述整个仓库目整体结构的文件。它使得系统不断开发作出的微小改动（stage）和这些更改的提交分离（commit）。索引在分支合并（merge）的时候启到了关键作用：允许不同版本的文件被同时管理。

### 1.4 基于内容的

## (To be deleted) 1 Git

### 1.1 创建仓库

#### 1.1.1 `git config`命令

`git config <name> [<value>]`命令可用于设定一些配置，通过`--system`、`--global`、`--local`和`--file <filename>`指定配置作用的级别。默认情况下，配置从 system（`/etc/gitconfig`）、global（`~/.gitconfig`） 和 local（`.git/config`） 读入；配置写入至 local。通过`--int`和`--bool`设置 int 和 bool 类型的配置。

在使用 git 前，需要设置`user.name`和`user.email`。建议设置在 global 下。

#### 1.1.2 `git init`命令

`git init [<directory>]`命令创建一个空的仓库，即创建`.git`目录。`.git`目录会包含文件对象、HEAD 引用、各个分支头节点的引用、各个标签的引用和模板`.git`目录中的其他文件（一些样例脚本，样例描述等等）。

`--bare`参数用于指定仓库是否为裸仓库（bare repository）。裸仓库无工作区和暂缓区，也不存在`.git`子目录，而是相当于直接包含原先`.git`目录下的文件。一般情况下，裸仓库允许成为`git push`命令的接受方。所以，通常协同编程时，中心服务器上为裸仓库。

#### 1.1.3 `git clone`命令

`git clone <repository> [<directory>]`命令用于克隆一个仓库。对于远程仓库的每一个分支，都会创建一个本地的远程跟踪分支（remote-tracking branch）。

补充“远程跟踪分支”：

（放弃更新）
