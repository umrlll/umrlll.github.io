---
title: 基本的SELECT语句
date: 2022-07-23 16:56:02
urlname: 基本的SELECT语句
tags:
  - database
  - MySQL8
  - 基础篇
categories:
- MySQL8
---

# 第03章_基本的SELECT语句

<!--more-->

## 1.SQL概述

### 1.1 SQL背景知识

- 1946年，世界上第一台电脑诞生，如今，借由这台电脑发展起来的互联网已经自成江湖。在这几十年里，无数的技术、产业在这片江湖里沉浮，有的方兴未艾，有的已经几幕兴衰。但在这片浩荡的波动里，有一门技术从未消失，甚至“老当益壮”，那就是SQL.
  - 45年前，也就是1974年，IBM研究员发布了一篇揭开数据库技术的论文《SEQUEL:一门结构化的英语查询语言》，直到今天这门结构化的查询语言并没有太大的变化，相比于其他语言，<font color=orange>SQL的半衰期可以说是非常长</font>了。
- 不论是前端工程师，还是后端算法工程师，都一定会和数据打交道，都需要了解如何又快又准确地提取自己想要的数据。更别提数据分析师了，他们的工作就是和数据打交道，整理不同的报告，以便指导业务决策。
- SQL(Structured Query Language,结构化查询语言)是使用关系模型的数据库应用语言，<font color=orange>与数据直接打交道</font>，由IBN上世纪70年代开发出来。后由美国国家标准局(ANSI)开始着手制定SQL标准，先后有<font color=orange>SQL-86,SQL-89,SQL-92,SQL-99</font>等标准。
  - SQL有两个重要的标准，分别是SQL92和SQL99，它们分别代表了92年和99年颁布的SQL标准，我们如今使用的SQL语言依然遵循这些标准。

- 不同的数据库生产厂商都支持SQL语句，但都有特有内容。

![](tu1.png)

### 1.2 SQL语言排行

自从SQL加入了TIOBE编程语言排行榜，就一直保持在Top10

[TIOBE Index - TIOBE](https://www.tiobe.com/tiobe-index/)

![](tu2.png)

### 1.3 SQL分类

SQL语言在功能上主要分为如下3大类

- **DDL(Data Definition Languages、数据定义语言)**，这些语句定义了不同的数据库、表、视图、索引等数据库对象，还可以用来创建、删除、修改数据库和数据表的结构。

  - 主要的语句关键字包括<font color=orange>CREATE、DROP、ALTER</font>等

    > CREATE \ ALTER \ DROP \ RENAME \ TRUNCATE

- **DML(Data Manipulation Languages、数据操作语言)**，用于添加、删除、更新和查询数据库记录，并检查数据完整性。

  - 主要的语句关键字包括<font color=orange>INSERT、DELETE、UPDATE、SELECT</font>等。
  - **SELECT是SQL语言的基础，最为重要**

- **DCL(Data Control Languages、数据控制语言)**，用于定义数据库、表、字段、用户的访问权限和安全级别。

  - 主要的语句关键字包括<font color=orange>GRANT、REVIKE、COMMIT、ROLLBACK、SAVEPOINT</font>等。

> 因为查询语句使用的非常频繁，所以很多人把查询语句单独列为一类：DQL（数据查询语句）。
>
> 还有单独将<font color=orange>COMMIT、ROLLBACK</font>取出来称为TCL（Transation Control Languages，事务控制语言）

## 2.SQL语言的规则和规范

### 2.1 基本规则

- SQL可以写在一行或者多行。为了提高可读性，各子句分行写，必要时使用缩进
- 每条命令以；或者\g或\G结束
- 关键字不能被缩写也不能分行
- 关于标点符号
  - 必须保证所有的()、单引号、双引号是成对结束的
  - 必须使用英文状态下的半角输入方式
  - 字符串型和日期时间类型的数据可以使用单引号（''）表示
  - 列的别名，尽量使用双引号("")，而且不建议省略as

### 2.2 SQL大小写规范

- **MySQL在Windows环境下是大小写不敏感的**
- **MySQL在Linux环境下是大小写敏感的**
  - 数据库名、表名、表的别名、变量名是严格区分大小写的
  - 关键字、函数名、列名（或字段名）、列的别名（字段的别名）是忽略大小写的
- **推荐采用统一的书写规范**
  - 数据库名、表名、表的别名、字段名、字段的别名等都小写
  - SQL关键字、函数名、绑定变量等都大写

### 2.3注释

格式如下

```
单行注释： #注释文字（MySQL特有的方式）
单行注释： -- 注释文字（--后面必须包含一个空格）
多行注释： /* 注释文字 */
```

### 2.4 命名规则

- 数据库、表名不得超过30个字符，变量名限制为29个
- 必须只能包含A-Z,a-z，0-9，_共63个字符
- 数据库名、表名、字段名等对象名中间不要包含空格
- 同一个MySQ软件中，数据库不能同名：同一个库中，表不能重名；同一个表中，字段不能重名
- 必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在SQL语句中使用`（着重号）引起来
- 保持字段名和类型的一致性，在命名字段并为其指定数据类型的时候一定要保证一致性。假如数据类型在一个表里是整数，那在另一个表里可就别变成字符型了

举例：

```sql
#以下两句是一样的，不区分大小写
show databases
SHOW DATABASES

#创建表格
#create table student info(...);#表名错误，因为表名有空格
create table student_info(...);

#其中order使用``符号，因为order和系统关键字或系统函数名等预定义标识符重名了
CREATE TABLE `order`(
	id INT,
    Iname VARCHAR(20)
);


# as:全称： alias
select id as "编号",`name` as "姓名" from t_stu; #起别名时，as都可以省略
select id as 编号,`name` as 姓名 from t_stu; #如果字段别名中没有空格，那么可以省略""
select id as 编 号,`name` as 姓 名 from t_stu; #错误，如果字段别名中有空格，那么不能省略""
```

### 2.5 数据导入指令

方式1：在命令行客户端登录mysql，使用source指令导入

```shell
mysql> source d:\xxx.sql
```

通过FOREIGN_KEY_CHECKS解决，用法如下：

```sql
set FOREIGN_KEY_CHECKS=0;  #在导入前设置为不检查外键约束
set FOREIGN_KEY_CHECKS=1;  #在导入后恢复检查外键约束
```

## 3.基本的SELECT语句

### 3.1 SELECT

```sql
SELECT 1; #没有任何子句
SELECT 9/2; #没有任何子句
```

### 3.2 SELECT…FROM

- 语法：


```sql
SELECT 标识选择哪些列
FROM 标识从哪个表中选择
```

- 选择全部列：

```sql
SELECT *
FROM departments;
```

![](tu3.png)

> 一般情况下，除非需要使用表中所有的字段数据，最好不要使用通配符‘*’。使用通配符虽然可以节省输入查询语句的时间，但是获取不需要的列数据通常会降低查询和所使用的应用程序的效率。通配符的优势是，当不知道所需要的列的名称时，可以通过它获取它们。
>
> 在生产环境下，不推荐你直接使用SELECT  * 进行查询。

- 选择特定的列

```sql
SELECT department_id, location_id
FROM departments;
```

![](tu4.png)

> MySQL中的SQL语句是不区分大小写的，因此SELECT和select的作用是相同的，但是，许多开发人员习惯将关键字大写、数据列和表名小写，读者也应该养成一个良好的编程习惯，这样写出来的代码更容易阅读和维护。

### 3.3 列的别名

- 重命名一个列
- 便于计算
- 紧跟列名，也可以在列名和别名之间加入关键字AS，别名使用双引号，以便在别名中包含空格或特 殊的字符并区分大小写。
- AS 可以省略
- 建议别名简短，见名知意
- 举例：

```sql
SELECT last_name AS name, commission_pct comm
FROM employees;
```

![](tu5.png)

```sql
SELECT last_name "Name", salary* 12 "Annual Salary"
FROM employees;
```

![](tu6.png)

### 3.4 去除重复行

默认情况下，查询会返回全部行，包括重复行。

```sql
SELECT department_id
FROM employees;
```

![](tu7.png)

**在SELECT语句中使用关键字DISTINCT去除重复行**

```sql
SELECT DISTINCT department_id
FROM employees;
```

![](tu8.png)

而对于

```sql
SELECT DISTINCT department_id,salary
FROM employees;
```

1. DISTINCT 需要放到所有列名的前面，如果写成`SELECT salary, DISTINCT department_id FROM employees`会报错。
2. DISTINCT 其实是对后面所有列名的组合进行去重，你能看到最后的结果是 74 条，因为这 74 个部门id不同，都有 salary 这个属性值。如果你想要看都有哪些不同的部门（department_id），只需要写`DISTINCT department_id`即可，后面不需要再加其他的列名了。

### 3.5 空值参与运算

空值：null

null不等同于0，''，'null'

```sql
SELECT * FROM employees;
```

空值参与运算：结果也一定为空

```sql
SELECT employee_id,salary,commission_pct,
12 * salary * ( 1 + commission_pct) "annual_sal"
FROM employees;
```

![](tu9.png)

实际问题的解决方案：引入IFNULL

```sql
SELECT employee_id, salary "月工资", 
salary * (1 + IFNULL(commission_pct, 0)) * 12 "年工资"
FROM employees;
```

<font color=red>注意：在 MySQL 里面， 空值不等于空字符串。一个空字符串的长度是 0 ，而一个空值的长度是空。而且，在 MySQL 里面，空值是占用空间的。</font>

![](tu10.png)

### 3.6 着重号 ``

需要保证表中的字段、表名等没有和保留字、数据库系统或常用方法冲突。如果真的相同，请在SQL语句中使用一对``（着重号）引起来。

错误：

```sql
SELECT * FROM ORDER;
```

![](tu11.png)

正确：

```sql
SELECT * FROM `ORDER`;
```

![](tu12.png)

### 3.7 查询常数

SELECT 查询还可以对常数进行查询。对的，就是在 SELECT 查询结果中增加一列固定的常数列。这列的取值是我们指定的，而不是从数据表中动态取出的。

你可能会问为什么我们还要对常数进行查询呢？

SQL 中的 SELECT 语法的确提供了这个功能，一般来说我们只从一个表中查询数据，通常不需要增加一个固定的常数列，但如果我们想整合不同的数据源，用常数列作为这个表的标记，就需要查询常数。

比如说，我们想对 employees 数据表中的员工姓名进行查询，同时增加一列字段corporation，这个字段固定值为“尚硅谷”，可以这样写：

```sql
SELECT '尚硅谷' as corporation, last_name FROM employees;
```

![](tu13.png)

## 4.显示表结构

使用DESCRIBE 或 DESC 命令，表示表结构。

```sql
DESCRIBE employees;
或
DESC employees;
```

![](TU14.png)

其中，各个字段的含义分别解释如下：

- Field：表示字段名称。
- Type：表示字段类型，这里 barcode、goodsname 是文本型的，price 是整数类型的。
- Null：表示该列是否可以存储NULL值。
- Key：表示该列是否已编制索引。PRI表示该列是表主键的一部分；UNI表示该列是UNIQUE索引的一部分；MUL表示在列中某个给定值允许出现多次。
- Default：表示该列是否有默认值，如果有，那么值是多少。
- Extra：表示可以获取的与给定列有关的附加信息，例如AUTO_INCREMENT等。

## 5.过滤数据

- 语法：

  ```sql
  SELECT 字段1,字段 2
  FROM 表名
  WHERE 过滤条件
  ```

  - 使用WHERE 子句，将不满足条件的行过滤掉
  - **WHERE子句紧随 FROM子句**

- 举例

```sql
SELECT employee_id, last_name, job_id, department_id
FROM employees
WHERE department_id = 90;
```

![](tu15.png)

## 练习

```sql
1.查询员工12个月的工资总和，并起别名为ANNUAL SALARY
2.查询employees表中去除重复的job_1d以后的数据
3.查询工资大于12888的员工姓名和工资
4.查询员工号为176的员工的姓名和部门号
5.最示表departments的结构，并查询其中的全部数据
```

### 1.查询员工12个月的工资总和，并起别名为ANNUAL SALARY

```sql
SELECT employee_id,last_name,salary*12 "ANNUAL SALARY" FROM employees;
```

![](tu16.png)

### 2.查询employees表中去除重复的job_1d以后的数据

```sql
SELECT DISTINCT job_1d FROM employees
```

![](tu17.png)

### 3.查询工资大于12888的员工姓名和工资



### 4.查询员工号为176的员工的姓名和部门号

### 5.最示表departments的结构，并查询其中的全部数据
