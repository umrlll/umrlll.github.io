---
title: Java入门
urlname: Java入门
date: 2022-06-23 20:43:18
tags:
- Java
- 入门
categories:
- JavaSE
---

Java入门

<!--more-->

# Java入门

## A.安装IntelliJ IDEA

目前市面上常用的集成开发环境(IDE)有：

> 1.eclipse 免费 官网推荐 解压版
>
> 2.myeclipse 插件版，可以生成很多功能，付费，现在用的几乎很少
>
> 3.IntelliJ IDEA 智能提示很强大，付费

目前市面上eclipse2020和intelliJ IDEA 市场占有率各占一半，前期学习用eclipse，后期框架用IntelliJ IDEA

{% post_link 'Jetbrains-Intellij-IDEA-安装' %}

## B.安装jdk

{% post_link 'JDK安装' %}

## C.开发项目

![](tu7.png)

项目目录：

![](tu8.png)

![](tu9.png)



## D.开发程序的3个步骤

1.编写源文件，编写XXX.java源文件 

2.编译，将XXX.java源文件翻译成XXX.class字节码文件 

3.运行，在JVMjava虚拟机运行

## E.注释

### 1.注释的作用

通常我们的项目在后期代码量越来越多，为了方便自己或者同事能够看懂你的代码，就需要添加注释对 代码进行说明解释，减少沟通成本。 

注释后的代码不会被编译运行，因此还可以将作废但是需要保留的代码注释掉保留在文本中。

### 2.注释分类

a.单行注释 

b.多行注释 

c.文档注释

```JAVA
package day01;
/**
 * 
 * @author 南鸢离梦
 *
 */
public class Test1 {
	public static void main(String[] args) {
		System.out.println("Hello world!!");
		System.out.println("我是谁？");
	}
}
```

## F.转义字符

\n用来换行，\t用来空格。

```JAVA
System.out.print("\n高新区是个\n美丽的地方")
```



{% post_link 'Java变量' %}

