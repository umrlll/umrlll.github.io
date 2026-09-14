---
title: Jetbrains Intellij IDEA 安装
urlname: Jetbrains Intellij IDEA 安装
date: 2022-07-02 10:36:07
tags:
  - 开发工具
  - 环境
categories:
  - Java
---

IDEA安装

IDEA 全称 IntelliJ IDEA，是Java编程语言开发的集成环境(IDE)。IntelliJ在业界被公认为最好的Java开发工具，尤其在智能代码助手、代码自动提示、重构、J2EE支持、各类版本工具(git、svn等)、JUnit、CVS整合、代码分析、 创新的GUI设计等方面的功能可以说是超常的。IDEA是JetBrains公司的产品，这家公司总部位于捷克，著名的JetBrains全家桶有：PHPStorm、PyCharm、RubyMine、WebStorm、AppCode等，本文介绍的激活IDEA教程适用于大部分的JetBrains全家桶。



<!--more-->

# A.前言

目前市面上常用的集成开发环境(IDE)有：

> 1.eclipse 免费 官网推荐 解压版
>
> 2.myeclipse 插件版，可以生成很多功能，付费，现在用的几乎很少
>
> 3.IntelliJ IDEA 智能提示很强大，付费

目前市面上eclipse2020和intelliJ IDEA 市场占有率各占一半，前期学习用eclipse，后期框架用IntelliJ IDEA

# B.安装ToolBox

​		技术和软件的更新速度日益加快，通过 Toolbox 可以轻松完成工具更新迭代：同时维护同一个工具的不同版本，在需要的情况下还可以完成软件的回退

​		Toolbox 可以轻松维护工具版本，可以轻松完成安装和卸载操作。Toolbox同时支持 EAP 版本（ Early Access Program，公测版 ），如果你想尝试一下新的功能，可以试试。 

​		Toolbox 集中显示你编辑过的项目，并且按照你的喜好进行了排序。如果安装了多个 IDE 版本，可以选择用哪个版本 IDE 打开项目。即使，你仅仅安装了一个版本的 IDE，Toolbox打开项目的操作也很方便。

![](tu1.png)

[JetBrains ToolBox 安装地址]: https://www.jetbrains.com/zh-cn/toolbox-app/

使用 ToolBox App 更新 IntelliJ Idea ，当然不仅仅可以更新 Idea ，所有 Jet Brains 旗下的软件都可以通过 ToolBox 进行安装和更新。

![](tu2.png)

![](tu3.png)

![](tu4.png)

默认安装位置是c盘

切换存放地址方法：修改设置中的安装地址即可更改

![](tu5.png)

![](tu6.png)

# C.安装IDEA

在ToolBox中点击安装即可，如图可更换其他版本

![](tu7.png)

# D.破解

<font color="red" size=20px>破解版仅供学习使用</font>

## 1.下载

下载原生的文件

https://gitee.com/ja-netfilter/ja-netfilter

![](tu8.png)

![](tu9.png)

解压后放到想放的位置，我的位置为`C:\Users\Spz2519\Documents`

![](tu12.png)

## 2.激活码获取

https://3.jetbra.in/

![](tu10.png)

下载修改好的文件

![](tu11.png)

替换文件

![](tu13.png)

## 3.修改vmoptions文件

![](tu14.png)

![](tu15.png)

![](tu16.png)

`-javaagent:\path\ja-netfilter\ja-netfilter.jar`

`--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED`
`--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED`

## 4.激活

获取激活码

![](tu17.png)

![](tu18.png)

至此，idea破解完成

# E.关于正版

有几种方法可以获取免费的正版IntelliJ IDEA license

官方提供了6种免费申请授权的方式

## 1.学生和教师免费

学生和教师（高中、大学）可以免费使用所有 JetBrains IDEs，仅限在学校或者在家中，个人非商业使用。

申请入口：www.jetbrains.com/shop/eform/students

![](tu19.png)

这个是教育身份，通过教育邮箱认证非常方便，还可以使用学生证、官方证明文件、Github 认证申请

使用时间：一年，如果还是学生身份，还可以续期。

## 2.教育机构免费

大学、学院、学校和非商业教育机构可以有资格获得免费许可，只限于在教室和计算机实验室中安装所有 JetBrains 工具并使用，仅限用于教育目的。

说白了，就是只能在教室使用，不能个人和商业使用。

www.jetbrains.com/shop/eform/classroom/faculty

![](tu20.png)

这个申请下来是一年的，可以续期。

## 3.培训机构免费

在申请限制中说的很明白，只能申请一款并且使用时间是 6 个月，过期后会有 25%折扣，这个限制条件相对来说就有点严格了

申请入口：www.jetbrains.com/shop/eform/classroom/faculty

## 4.通过开源项目免费申请

在 https://www.jetbrains.com/community/opensource/ ，IDEA有一个开源免费协议。简单翻译一下

### 申请条款

- 您必须是项目负责人或常规提交者。
- 您的OS项目符合 开源定义[1] 。
- 您的操作系统项目可能不提供付费赞助，或从商业公司或组织（非政府组织，教育，研究或政府）获得资金。您不得为您的操作系统项目提供任何付费支持，咨询或培训服务，也不得分发您的操作系统软件的付费版本。获得该项目工作报酬的贡献者不符合资格。
- 您的OS项目正在积极开发至少3个月。
- 您的OS项目社区处于活动状态。
- 您定期发布更新的版本。

### 许可条款

- 许可证提供1年，并允许在1年内免费升级软件的所有新版本。
- 如果您的项目仍满足要求，可根据要求提供许可证续订。
- 一个许可证可以安装在任意数量的计算机上，但不能在两个或更多计算机上同时使用。
- 许可证仅提供给核心团队开发人员。

### 许可限制

- 许可证仅可用于非商业OS开发。请考虑购买单独的许可证以处理商业项目。
- 该软件的使用仅限于许可用户，无权将软件转让给任何第三方。

有关完整的详细信息，请查看开源项目[2]的许可协议[3]

申请免费使用

### 申请门槛

从协议不难看出，你只需在GitHub上准备一个维护超过3个月的项目开源项目，就可以免费使用IDEA 1年了，1年到期后，可以按照此步骤再申请一次。

这是一个良好的闭环：

- 有开源项目，所以能申请免费使用IDEA；
- 有了IDEA神器，又可以更好地维护开源项目……

到 https://www.jetbrains.com/shop/eform/opensource?product=ALL 提交申请即可。

## 5.大神免费

![](tu21.png)

出现在上面的名单种的人可以免费使用

申请入口：www.jetbrains.com/shop/eform/devrecognition

## 6.社区/组织免费

活跃社区/组织的组织者可以获得 JetBrains 产品的免费许可证，根据活动举办的频次，每 1~3 个月发放一次许可证，个数也是有限制的。

- 30-50 人参加/每次活动：1 个免费许可证；
- 50-100 人参加/每次活动：2 个免费许可证；
- 100+ 人参加/每次活动：3 个免费许可证；

申请入口：www.jetbrains.com/shop/eform/community/

# F.关于付费

**IntelliJ IDEA只要订阅满一年，就能获取在订阅结束日期12个月前版本的永久授权**

## 规则

- 连续订阅不满12个月，无法获取永久授权

![](tu22.png)

- 连续订阅刚好12个月，获得**订阅开始时的版本**的永久授权

![](tu23.png)

- 订阅了 12 个月，但想获得比订阅时更新的软件版本，可通过月订阅增加时长，获得更新的软件版本的永久授权

  比如你订阅时软件版本是 v1，订阅一年到期了，但这时 v2 已经发布了，你想获得 v2 的永久授权，你可以使用月订阅，再订阅几个月，使 订阅结束日期减 12 个月 的时间刚好在 v2 发布的时间。那月订阅取消后，就可以获得 v2 的永久授权了

![](tu24.png)

- 订阅超过12个月，获得订阅结束日期减12个月的时间所发布版本的永久授权

![](tu25.png)

## IntelliJ IDEA的订阅选项

如果你们公司没买，作为开发者一般使用“个人订阅”。（**个人订阅是可以用作“一般商业用途”的**，也就是说可以在公司里开发商业软件）

![](tu26.png)

## 价格

可以选择只订阅单个软件（如IntelliJ IDEA、PyCharm），也可以订阅全套15个软件（如果要用到至少2个软件，全套比较划算）。

订阅价格每年价格都不一样，第一年是原价（如IDEA，按现在汇率折合人民币¥990+），第二年是8折（¥790+）、第三年起是6折（¥590+）

![](tu27.png)
