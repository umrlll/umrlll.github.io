---
title: 多版本JDK安装环境配置
date: 2022-06-27 18:45:04
tags:
  - Java
  - 环境安装
categories:
  - JavaSE
---

多版本jdk安装 环境配置

<!--more-->

# A.LTS版本JDK

LTS：long-term support

LTS版本的JDK有3个：分别是jdk8，jdk11，jdk17。

| 版本  |  LTS时间   |
| :---: | :--------: |
| JDK8  | 2030年12月 |
| JDK11 | 2026年9月  |
| JDK17 | 2024年9月  |

目前在使用jdk8的版本在做学习开发，但是若是想达成了解jdk14或jdk17的新特性或者使用的他们的新特性的目的，就需要可以随时切换版本

## JDK8

https://www.oracle.com/java/technologies/downloads/#java8

![](tu1.png)

## JDK11

https://www.oracle.com/java/technologies/downloads/#java11

![](tu2.png)

## JDK17

https://www.oracle.com/java/technologies/downloads/#java17

![](tu3.png)

# B.安装

尽量将jdk文件安装到D盘下的同一个文件夹中，方便整理

我的路径是：

![](tu4.png)

# C.配置环境变量

## 1.设置总的JAVA_HOME

![](tu5.png)

根据需要更改总的JAVA_HOME的值即可切换jdk版本

## 2.path配置

![](tu6.png)

<font color=red>注意：若将以%开头的路径放到第一位，编辑时，无法显示图形化交互编辑界面</font>

# D.查看版本切换是否成功

java -version

![](tu7.png)

<font color=red>注意：切换版本后需要重新启动CMD命令窗口，才会获取到切换后的版本号</font>

![](tu8.png)
