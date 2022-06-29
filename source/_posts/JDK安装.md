---
title: JDK安装
date: 2022-06-27 18:19:58
tags:
  - Java
  - 环境安装
categories:
  - JavaSE

---



<!--more-->

### 1.jdk、jre、jvm的区别：

> jDK：Java Development kit java开发工具包，它提供了几千个类库的源码给我们，我们基于jdk提 供的开发环境去开发我们的代码，目前我们用的jdk1.8就是我们说的java8。
>
> JRE: java runtime Environment java运行环境，如果你需要将java程序运行你就必须安装加热， 如果你开发好了代码只需要运行那么只安装jre是可以的，但是通常jdk和jre都装
>
> JVM：java virtual Machine java虚拟机，负责解释运行字节码文件，是跨平台的核心。

### 2.去官网去下载JDK

![](tu1.png)

![](tu2.png)

![](tu3.png)

![](tu4.png)

![](tu5.png)

![](tu6.png)

如果没有登录，就登陆或者注册，就可以下载了！！

![](tu7.png)

### 3.安装jdk

注意：安装jdk的路径不能有中文或空格，以免出现问题！

![](tu8.png)

![](tu9.png)

![](tu10.png)

![](tu11.png)

### 4.配置环境变量

为什么需要配置环境变量：

 我们需要通过D:\java8\jdk\bin目录下的javac.exe、java.exe的命令来编译执行java程序，但是我们不会 将源文件放到D:\java8\jdk\bin目录下去，我们一般是将项目放在其他位置，但是要在磁盘的别的位置运 行java.exe命令就找不到，就需需要配置path环境变量告诉windows，如果在该目录找不到java.exe就 去path目录去找java.exe

![](tu12.png)

![](tu13.png)

![](tu14.png)



{% post_link '多版本JDK安装环境配置' %}
