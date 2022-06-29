---
title: Java基础
date: 2022-06-23 20:43:18
tags:
- Java
- 基础
categories:
- JavaSE
---

JavaSE基础

<!--more-->

# 一：Java入门

## A.安装eclipse

目前市面上常用的集成开发环境(IDE)有：

> 1.eclipse 免费 官网推荐 解压版
>
> 2.myeclipse 插件版，可以生成很多功能，付费，现在用的几乎很少
>
> 3.IntelliJ IDEA 智能提示很强大，付费

目前市面上eclipse2020和intelliJ IDEA 市场占有率各占一半，前期学习用eclipse，后期框架用IntelliJ IDEA

![](day01/tu1.png)

![](day01/tu2.png)

![](day01/tu3.png)

![](day01/tu4.png)

![](day01/tu5.png)

![](day01/tu6.png)

安装完毕！！！

## B.安装jdk

### 1.jdk、jre、jvm的区别：

> jDK：Java Development kit java开发工具包，它提供了几千个类库的源码给我们，我们基于jdk提 供的开发环境去开发我们的代码，目前我们用的jdk1.8就是我们说的java8。
>
> JRE: java runtime Environment java运行环境，如果你需要将java程序运行你就必须安装加热， 如果你开发好了代码只需要运行那么只安装jre是可以的，但是通常jdk和jre都装
>
> JVM：java virtual Machine java虚拟机，负责解释运行字节码文件，是跨平台的核心。

### 2.去官网去下载JDK

![](day01/tu7.png)

![](day01/tu8.png)

![](day01/tu9.png)

![](day01/tu10.png)

![](day01/tu11.png)

![](day01/tu12.png)

如果没有登录，就登陆或者注册，就可以下载了！！

![](day01/tu13.png)

### 3.安装jdk

注意：安装jdk的路径不能有中文或空格，以免出现问题！

![](day01/tu14.png)

![](day01/tu15.png)

![](day01/tu16.png)

![](day01/tu17.png)

### 4.配置环境变量

为什么需要配置环境变量：

 我们需要通过D:\java8\jdk\bin目录下的javac.exe、java.exe的命令来编译执行java程序，但是我们不会 将源文件放到D:\java8\jdk\bin目录下去，我们一般是将项目放在其他位置，但是要在磁盘的别的位置运 行java.exe命令就找不到，就需需要配置path环境变量告诉windows，如果在该目录找不到java.exe就 去path目录去找java.exe

![](day01/tu18.png)

![](day01/tu19.png)

![](day01/tu20.png)

## C.开发项目

![](day01/tu21.png)

项目目录：

![](day01/tu22.png)

![](day01/tu23.png)

## D.更改字体大小

![](day01/tu24.png)

## E.开发程序的3个步骤

1.编写源文件，编写XXX.java源文件 

2.编译，将XXX.java源文件翻译成XXX.class字节码文件 

3.运行，在JVMjava虚拟机运行

## F.注释

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

## G.转义字符

\n用来换行，\t用来空格。

```JAVA
System.out.print("\n高新区是个\n美丽的地方")
```



# 二：变量

## A.定义

存储在内存中的值并且能够发生改变，数据需要放在内存中才可以进行计算。变量本质是计算机内存中代表一个”可操作的存储空间“，位置是确定的，但里面的值是不确定的可以改变。通过变量名来访问该对应的存储的内存空间里面的值（变量名存储的是这个数据存在内存的地址）从而操作这个内存存储的值。

存储在内存里面的数据是瞬时状态的（关机之后就没有了），保存在磁盘的是持久状态的。

由于计算机内存有限，一般为4G或8G，需要尽可能的节省内存空间，就需要通过变量来存储以达到节省内存空间的目的。

【字节】

```java
字节是内存中最小的存储单位，一个字节byte由8位组成，8个bit，比如6转换成二进制 0000 0110
```

## B.数据类型

java是一个强类型语言，每个变量必须声明数据类型，变量的数据类型决定了变量占据的存储空间的大小！通俗讲就是你要根据数据的大小依据数据类型为这个变量开辟合适大小的空间去存储，达到节约空间的目的

比如:int a=10;表示变量a存储空间的大小是4个字节，也就是说int在内存中开辟了4个字节的空间



​    			==数据类型分为基本类型和引用类型==

![](day02/tu1.png)

```java
/**
 * 
 * 变量，存储在内存中的数据，并且可以发生改变
 *
 */
public class Test1 {
	public static void main(String[] args) {
		//需求：需要将10存储在计算机内存中运算
		//1、声明变量：依据数据的大小，根据数据类型开辟合适大小的空间 int 是4个字节存储整数
		int a;		
		//2、赋值：把左边的10通过=赋给右边
		a=10;			
		//3、使用变量：使用变量里面的值进行计算
		a=a+5;
		System.out.println(a);
		
		//声明并赋值进行初始化
		int b=20;
		
		int c=a+b;
		System.out.println("a+b的和："+c);
	}
}
```



```java
public class Test2 {
	public static void main(String[] args) {
		//存储整数，byte short int long
		byte num1 = 127;//1个字节 -128~127之间
		short num2 = 126;//2个字节 
		int age = 27; //4个字节，java默认int类型
		long money = 23232323232L;// 8个字节存储空间 长整型
		
		char sex = 's';//字符类型 2个字节
		
		//浮点类型
		//浮点类型不是一个准确的数！float精确到第七位。double精确度是float的两倍所以叫双精度类型
		float fenshu1 = 98.7F;//单精度类型 4个字节
		double fenshu2 = 93.22;//双精度类型 8个字节 Java默认是double
		
		//布尔类型，只能存放true/false
		boolean hege = false;//1个bit(1个bit至少也要1byte存储)
		
		//字符串类型，注意：字符串不是基本类型！它是特殊的引用类型
		String sexs = "male";
		String name2 = ""; //它也是字符串！空字符串
	}
}
```

数据类型的存储范围：

| 数据类型 | 关键字  | 占用字节 |     取值范围     |  默认值  |
| :------: | :-----: | :------: | :--------------: | :------: |
|  布尔型  | boolean |    1     |   true，false    |  false   |
|  字节型  |  byte   |    1     |    -128 ~ 127    |    0     |
|  短整型  |  short  |    2     | -2^15^ ~ 2^15^-1 |    0     |
|   整型   |   int   |    4     | -2^31^ ~ 2^31^-1 |    0     |
|  长整型  |  long   |    8     | -2^63^ ~ 2^63^-1 |    0     |
|  字符型  |  char   |    2     |   0 ~ 2^16^-1    | ‘\u0000’ |



## C.变量命名规则

> 1.首字母可以以下划线、英文字母、$符号开头，其他部分可以是数字、字母、下划线、$符号；比如_name age age2 $name
>
> 2.如果以两个单词组成的，以驼峰命名法命名，比如myName
>
> 3.变量名最好有意义，不要写abc，方便别人看懂你的代码
>
> 4.不要有关键字，比如int  public等

## D.变量种类

### 1.局部变量

在方法或者语句块内部定义的变量，叫做局部变量，生命周期从声明的位置到方法或者语句块执行完毕就会被销毁。

局部变量必须先声明复制才能使用

### 2.全局变量

也叫成员变量或者叫实例变量，在类里面或者方法外面定义的变量叫全局变量，作用域整个类中，从属于对象，

生命周期伴随着对象始终，如果不自动初始化，它会自动初始化该变量

### 3.静态变量

也叫类变量，用static修饰，从属于类，在类加载的时候就会被初始化，生命周期从类加载到类卸载

```java
static int c ;
```

```java
/**
 * 
 * 全局变量和局部变量的区别
 *
 */
public class Test3 {
	int a=10;	//全局变量，作用于整个类中
	int b;
	static name;
	static int c ;
	
	public static void main(String[] args) {
		int b=10; //在方法内部或代码块定义的是局部变量。只作用于main方法里面
		int a=15;  //局部变量和全局变量可以重名
		
		System.out.println("局部变量b："+b);
		//当局部变量和全局变量重名的情况下，就近原则，使用局部变量
		System.out.println("局部变量a："+a);
		Test3 test = new Test3();
		System.out.println("全局变量a："+test.a);
		
		System.out.println("静态方法直接调用静态变量："+c);
		System.out.println("静态变量可以通过类名调用"+test.c);
		//由于全局变量是对象调用的引用类型，在堆内存中每月初始值
		System.out.println(test.name);
		System.out.println(test.d);
	}
	//@SuppressWarnings("unused")
	private void show() {
		//System.out.println("全局变量a："+a);
		//在这调用不到main方法的局部变量b
		//System.out.println("局部变量b："+b);
		System.out.println("静态变量可以通过类名调用"+test.c);	
	}
}
```

​	

​	 ==基本数据类型的数据都是在栈内存中存储，引用类型的数据都是在对内存中存储==

## E.数据转换

==一定是数值之间才可以进行转换!==

```java
		int a=10;
		double b=9.8;
		int c=(int) b; //由于大的空间的值不能放到小的空间，需要强制类型转换，但会丢失精度
		System.out.println(c);//9
		double d=a;//把小的空间的值放到更大的空间，能放下，叫自动转换
		System.out.println(d);//10.0
		
		//扩展：任何数据+""都变成字符串类型，不能再运算
		String str=123+"";
```

## F.控制台输入

```java
import java.util.Scanner;

public class Test5 {
	public static void main(String[] args) {
		try (//创建input对象
		Scanner input = new Scanner(System.in)) {
			System.out.print("请输入姓名：");
			String name=input.next();//next()输入字符串
			System.out.print("请输入年龄：");
			int age=input.nextInt();//nextInt()输入整数
			
			System.out.println("我的名字是"+name+"，我的年龄是"+age+"岁！");
		}
	}
}
```

## G.运算符

### a.算术运算符

```java
+ - * / %
```

```java
		int a=7;
		int b=3;
		
		int r1=a+b;//10
		int r2=a-b;//4
		int r3=a*b;//21
		int r4=7/3;//2
		double r5=7/3.0;//2.3333333333333335
		System.out.println(r4);
		System.out.println(r5);
		//取余
		int r6=7%3;//1
```



### b.条件运算符

```java
    a>b
    a<b
    a>=b
    a<=b
    a==b	两个值比较
    a!=b	不等于
    得到的结果是Boolean类型，结果为true/false
        int a=3;
		int b=7;
		
		boolean r1=a==b;//false
		boolean r2=a!=b;//true
		boolean r3=a>b;//true
		System.out.println(r1);
		System.out.println(r2);
        
```



### c.逻辑运算符

与或非

> &&   	并且：条件A&&条件B   条件A和条件B都满足为true，才会返回true
>
> ||  	  或者：条件A||条件B	条件A和条件B其中一个满足为true，返回结果为true
>
> ！         非：取反      ！=不等于  ！true返回false

#### 面试题：&和&&的区别？

​				&&具有短路功能，效率更高。

### d.赋值运算符

```java
	=
    int a=10;
```

#### 面试题：==和=的区别？

==为比较，=为赋值

### e.三目运算符（三元运算符）

```java
/**
* 算术运算符
* 三目运算符
*/
public class Test9 {
	public static void main(String[] args) {
	//比较条件?满足true赋的值:满足false赋的值
		int r1=8>5?1:0;
		System.out.println(r1);
		String r2=8>5?"男":"女";
		System.out.println(r2);
	}
}
```



### f.位运算符

很少用

```java
System.out.println(1>>2);
System.out.println(1<<2);
```

## H.值比较

1.数值之间比较

```java
boolean r1=7==8; //==用于数值之间比较
```

==是用于数值之间比较，比较的是内存地址是否相等。==当int 1=7;的时候，首先去内存中找是否有7这个常量，如果没有就根据int开辟一个4字节的空间内存7，地址赋给a；当int b=7，如果内存有7就没必要重新开辟新的空间，而是将7的地址赋给b变量，因此a==b是判断两个值的内存地址是否一致

==基本数据类型是保存在堆（堆栈）内存，数据可共享，引用类型是保存在堆内存，数据不共享==

![](day02/tu2.png)

2.equals

字符串比较

```java
String name="";
String name1="";

System.out.println(name.equals(name1));//比较字符串的值是否相等
System.out.println(!name.equals(name1));
```

## I.常量

```java
	//用final修饰的变量叫常量，用于经常使用固定的值而并不会经常发送改变的值，比如一周7天
	final int WEEKDAY=7;
	System.out.println("一周"+WEEKDAY+"天");
```

## J.Bigdecimal精密计算

```java
	//由于double和float不是一个精确的数，不合适去做金融类的计算
	//在java.math包下提供了一个BigInteger和Bigdecimal去做计算
	double a=1.0-0.1-0.1-0.1-0.1-0.1;//0.5000000000000001 
	System.out.println(a);
```

### a.概述

Java在java.math包中提供的API类BigDecimal，用来对超过16位有效位的数进行精确的运算。双精度浮点型变量double可以处理16位有效数，但在实际应用中，可能需要对更大或者更小的数进行运算和处理。一般情况下，对于那些不需要准确计算精度的数字，我们可以直接使用Float和Double处理，但是Double.valueOf(String) 和Float.valueOf(String)会丢失精度。所以开发中，如果我们需要精确计算的结果，则必须使用BigDecimal类来操作。

 BigDecimal所创建的是对象，故我们不能使用传统的+、-、*、/等算术运算符直接对其对象进行数学运算，而必须调用其相对应的方法。方法中的参数也必须是BigDecimal的对象。构造器是类的特殊方法，专门用来创建对象，特别是带有参数的对象。

### b.常用构造函数

#### 1.常用构造函数

1. BigDecimal(int)							

   创建一个具有参数所指定整数值的对象

2. BigDecimal(double)

   创建一个具有参数所指定双精度值的对象

3. BigDecimal(long)

   创建一个具有参数所指定长整数值的对象

4. BigDecimal(String)

   创建一个具有参数所指定以字符串表示的数值的对象

#### 2.使用问题分析

使用示例：

```java
BigDecimal a =new BigDecimal(0.1);
        System.out.println("a values is:"+a);
        System.out.println("=====================");
        BigDecimal b =new BigDecimal("0.1");
        System.out.println("b values is:"+b);
```

结果示例：

```java
a values is:0.1000000000000000055511151231257827021181583404541015625
=====================
b values is:0.1
```

原因分析：

1）参数类型为double的构造方法的结果有一定的不可预知性。有人可能认为在Java中写入newBigDecimal(0.1)所创建的BigDecimal正好等于 0.1（非标度值 1，其标度为 1），但是它实际上等于0.1000000000000000055511151231257827021181583404541015625。这是因为0.1无法准确地表示为 double（或者说对于该情况，不能表示为任何有限长度的二进制小数）。这样，传入到构造方法的值不会正好等于 0.1（虽然表面上等于该值）。

2）String 构造方法是完全可预知的：写入 newBigDecimal(“0.1”) 将创建一个 BigDecimal，它正好等于预期的 0.1。因此，比较而言， 通常建议优先使用String构造方法。

3）当double必须用作BigDecimal的源时，请注意，此构造方法提供了一个准确转换；它不提供与以下操作相同的结果：先使用Double.toString(double)方法，然后使用BigDecimal(String)构造方法，将double转换为String。要获取该结果，请使用static valueOf(double)方法。

### c.常用方法详解

#### 1.常用方法

1. add(BigDecimal)																					

   BigDecimal对象中的值相加，返回BigDecimal对象

2. subtract(BigDecimal)

   BigDecimal对象中的值相减，返回BigDecimal对象

3. multiply(BigDecimal)

   BigDecimal对象中的值相乘，返回BigDecimal对象

4. divide(BigDecimal)

   BigDecimal对象中的值相除，返回BigDecimal对象

5. toString()

   将BigDecimal对象中的值转换成字符串

6. doubleValue()

   将BigDecimal对象中的值转换成双精度数

7. floatValue()

   将BigDecimal对象中的值转换成单精度数

8. longValue()

   将BigDecimal对象中的值转换成长整数

9. intValue()

   将BigDecimal对象中的值转换成整数

10. BigDecimal remainder(BigDecimal divisor)

    求余数，求BigDecimal类型数据除以divisor的余数。

11. BigDecimal max(BigDecimal value)

    最大数，求两个BigDecimal类型数据的最大值。

12. BigDecimal min(BigDecimal value)

    最小数，求两个BigDecimal类型数据的最小值。

13. BigDecimal abs()

    绝对值，求BigDecimal类型数据的绝对值。

14. BigDecimal negate()

    相反数，求BigDecimal类型数据的相反数。

#### 2.大小比较

java中对BigDecimal比较大小一般用的是bigdemical的compareTo方法

```java
int a = bigdemical.compareTo(bigdemical2)
```

返回结果分析：

```java
a = -1,表示bigdemical小于bigdemical2；
a = 0,表示bigdemical等于bigdemical2；
a = 1,表示bigdemical大于bigdemical2；
```

举例：a大于等于b

```java
new bigdemica(a).compareTo(new bigdemical(b)) >= 0
```

### d.BigDecimal格式化

由于NumberFormat类的format()方法可以使用BigDecimal对象作为其参数，可以利用BigDecimal对超出16位有效数字的货币值，百分值，以及一般数值进行格式化控制。

以利用BigDecimal对货币和百分比格式化为例。首先，创建BigDecimal对象，进行BigDecimal的算术运算后，分别建立对货币和百分比格式化的引用，最后利用BigDecimal对象作为format()方法的参数，输出其格式化的货币值和百分比。

```java
	NumberFormat currency = NumberFormat.getCurrencyInstance(); //建立货币格式化引用 
    NumberFormat percent = NumberFormat.getPercentInstance();  //建立百分比格式化引用 
    percent.setMaximumFractionDigits(3); //百分比小数点最多3位 
    
    BigDecimal loanAmount = new BigDecimal("15000.48"); //贷款金额
    BigDecimal interestRate = new BigDecimal("0.008"); //利率   
    BigDecimal interest = loanAmount.multiply(interestRate); //相乘
 
    System.out.println("贷款金额:\t" + currency.format(loanAmount)); 
    System.out.println("利率:\t" + percent.format(interestRate)); 
    System.out.println("利息:\t" + currency.format(interest)); 
```

结果：

```java
贷款金额: ￥15,000.48 利率: 0.8% 利息: ￥120.00
```

BigDecimal格式化保留2为小数，不足则补0：

```java
public class NumberFormat {
	
	public static void main(String[] s){
		System.out.println(formatToNumber(new BigDecimal("3.435")));
		System.out.println(formatToNumber(new BigDecimal(0)));
		System.out.println(formatToNumber(new BigDecimal("0.00")));
		System.out.println(formatToNumber(new BigDecimal("0.001")));
		System.out.println(formatToNumber(new BigDecimal("0.006")));
		System.out.println(formatToNumber(new BigDecimal("0.206")));
    }
	/**
	 * @desc 1.0~1之间的BigDecimal小数，格式化后失去前面的0,则前面直接加上0。
	 * 2.传入的参数等于0，则直接返回字符串"0.00"
	 * 3.大于1的小数，直接格式化返回字符串
	 * @param obj传入的小数
	 * @return
	 */
	public static String formatToNumber(BigDecimal obj) {
		DecimalFormat df = new DecimalFormat("#.00");
		if(obj.compareTo(BigDecimal.ZERO)==0) {
			return "0.00";
		}else if(obj.compareTo(BigDecimal.ZERO)>0&&obj.compareTo(new BigDecimal(1))<0){
			return "0"+df.format(obj).toString();
		}else {
			return df.format(obj).toString();
		}
	}
}
```

结果为：

```java
3.44
0.00
0.00
0.00
0.01
0.21
```

### e.BigDecimal常见异常

#### 除法的时候出现异常

```java
java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result
```

**原因分析：**

 通过BigDecimal的divide方法进行除法时当不整除，出现无限循环小数时，就会抛异常：java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.

**解决方法：**

 divide方法设置精确的小数点，如：divide(xxxxx,2)

### f.BigDecimal总结

#### 1.总结

1. 在需要精确的小数计算时再使用BigDecimal，BigDecimal的性能比double和float差，在处理庞大，复杂的运算时尤为明显。故一般精度的计算没必要使用BigDecimal。
2. 尽量使用参数类型为String的构造函数。
3. BigDecimal都是不可变的（immutable）的， 在进行每一次四则运算时，都会产生一个新的对象 ，所以在做加减乘除运算时要记得要保存操作后的值。

#### 2.工具类推荐

```java
package com.vivo.ars.util;
import java.math.BigDecimal;

/**
 * 用于高精确处理常用的数学运算
 */
public class ArithmeticUtils {
    //默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */

    public static double add(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }

    /**
     * 提供精确的加法运算
     *
     * @param v1 被加数
     * @param v2 加数
     * @return 两个参数的和
     */
    public static BigDecimal add(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2);
    }

    /**
     * 提供精确的加法运算
     *
     * @param v1    被加数
     * @param v2    加数
     * @param scale 保留scale 位小数
     * @return 两个参数的和
     */
    public static String add(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.add(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static double sub(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    /**
     * 提供精确的减法运算。
     *
     * @param v1 被减数
     * @param v2 减数
     * @return 两个参数的差
     */
    public static BigDecimal sub(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2);
    }

    /**
     * 提供精确的减法运算
     *
     * @param v1    被减数
     * @param v2    减数
     * @param scale 保留scale 位小数
     * @return 两个参数的差
     */
    public static String sub(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.subtract(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1 被乘数
     * @param v2 乘数
     * @return 两个参数的积
     */
    public static BigDecimal mul(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static double mul(double v1, double v2, int scale) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return round(b1.multiply(b2).doubleValue(), scale);
    }

    /**
     * 提供精确的乘法运算
     *
     * @param v1    被乘数
     * @param v2    乘数
     * @param scale 保留scale 位小数
     * @return 两个参数的积
     */
    public static String mul(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.multiply(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
     * 小数点以后10位，以后的数字四舍五入
     *
     * @param v1 被除数
     * @param v2 除数
     * @return 两个参数的商
     */

    public static double div(double v1, double v2) {
        return div(v1, v2, DEF_DIV_SCALE);
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示表示需要精确到小数点以后几位。
     * @return 两个参数的商
     */
    public static double div(double v1, double v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
     * 定精度，以后的数字四舍五入
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 表示需要精确到小数点以后几位
     * @return 两个参数的商
     */
    public static String div(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v1);
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(double v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * 提供精确的小数位四舍五入处理
     *
     * @param v     需要四舍五入的数字
     * @param scale 小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static String round(String v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(v);
        return b.setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static String remainder(String v1, String v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        return b1.remainder(b2).setScale(scale, BigDecimal.ROUND_HALF_UP).toString();
    }

    /**
     * 取余数  BigDecimal
     *
     * @param v1    被除数
     * @param v2    除数
     * @param scale 小数点后保留几位
     * @return 余数
     */
    public static BigDecimal remainder(BigDecimal v1, BigDecimal v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException(
                    "The scale must be a positive integer or zero");
        }
        return v1.remainder(v2).setScale(scale, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * 比较大小
     *
     * @param v1 被比较数
     * @param v2 比较数
     * @return 如果v1 大于v2 则 返回true 否则false
     */
    public static boolean compare(String v1, String v2) {
        BigDecimal b1 = new BigDecimal(v1);
        BigDecimal b2 = new BigDecimal(v2);
        int bj = b1.compareTo(b2);
        boolean res;
        if (bj > 0)
            res = true;
        else
            res = false;
        return res;
    }
}
```



## K.上机作业

```java
控制台输入语文、数学、英语三门课程的成绩，得到总分和平均分
```

```java
public class Test11 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
        
		System.out.println("请输入语文成绩:");
		int yuwen=input.nextInt();
		System.out.println("请输入数学成绩:");
		int shuxue=input.nextInt();
		System.out.println("请输入英语成绩:");
		int yingyu=input.nextInt();
        
		//统计总分
		int total=yuwen+shuxue+yingyu;
        System.out.println("3门课程的总分是:"+total);
		//平均分
		double avgScore=total/3.0;
		System.out.println("3门课程的平均分是:"+avgScore);
	}
}
```

作业：

```java
public class Test12 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.println("请输入一个4位长度的整数:");
		int num=input.nextInt();
		//分别统计出各位、十位、百位、千位的数
		// 1234
	}
}
```

```java
import java.util.Scanner;

public class Test7 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.println("请输入一个4位长度的整数：");
		int num= input.nextInt();
		
		int geWei =num%10;
		int shiWei=num/10%10;
		int baiWei=num/100%10;
		int qianWei=num/1000;
		
		int num1=qianWei+baiWei*10+shiWei*100+geWei*1000;
		System.out.println("个位"+geWei+"十位"+shiWei+"百位"+baiWei+"千位"+qianWei);
		System.out.println(num1);
		
        int total=geWei+shiWei+baiWei+qianWei;
		String message=total>20?"幸运顾客":"谢谢惠顾";
		System.out.println(message);
        
		input.close();
	}
}
```

# 三：选择结构

用于选择和判断

## A.if结构

### a.简单if

```java
	int money=10;
	if(money>100){
		System.out.println("买兰博基尼");
	}
```

```java
	int money=10;
	if(money>100){
		System.out.println("买兰博基尼");
	}else {
		System.out.println("没有钱，坐公交车");
	}
```

```java
	Scanner input=new Scanner(System.in);
	double zhekou;//折扣
	System.out.print("请输入您的性别:");
	String sex=input.next();
	if("男".equals(sex)){
	//根据性别来判断折扣
		zhekou=0.8;
	}else {
		zhekou=0.5;
	}
	System.out.println("您的折扣是:"+zhekou+"折!");
	}
```

```java
	Scanner input=new Scanner(System.in);
	double zhekou;//折扣
	System.out.print("请输入您的性别:");
	char sex=input.next().charAt(0);//charAt是根据索引取到字符串第几个字符
	if(sex=='男'){
	//根据性别来判断折扣
		zhekou=0.8;
	}else {
		zhekou=0.5;
	}
	System.out.println("您的折扣是:"+zhekou+"折!");

```

```java
/**
* 简单if结构
* 输入语文和数学的成绩
* 如果语文大于95并且数学大于90分，奖励劳斯莱斯一辆
* 或者语文100分并且数学大于80分，也奖励劳斯莱斯一辆
*
*/
public class Test5 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.print("请输入语文成绩:");
		int yuwen=input.nextInt();
		System.out.print("请输入数学成绩:");
		int shuxue=input.nextInt();
        
		if((yuwen>=95&&shuxue>=90)||(yuwen==100&&shuxue>=80)){
			System.out.println("奖励劳斯莱斯一辆！");
		}else {
		System.out.println("抱歉，不奖励！");
		}
	}
}
```

### b.多重if

```java
/**
* 多重if结构，有多种选择但是选择一种
* 输入语文成绩
* 如果大于90分，奖励兰博基尼一台
* 如果大于80分，奖励奔驰S一台
* 如果大于60分，奖励宝马5系一台
* 如果不及格，不奖励
*
*/
public class Test6 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.print("请输入语文成绩:");
		int yuwen=input.nextInt();
        
		if(yuwen>=90) {
			System.out.println("奖励兰博基尼一台！");
		} else if(yuwen>=80) {
			System.out.println("奖励奔驰S一台一台！");
		}else if(yuwen>=60) {
			System.out.println("奖励宝马5系一台！");
		}else {
			System.out.println("不及格，不奖励");
		}
	}
}
```

```java
/**
* 多重if结构，用于多种选择
* 多重if结构可用于区间判断，也可以用于等值判断
*/
public class Test7 {
	public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		String foodName;//食物
		System.out.print("请输入星期:");
		int week=input.nextInt();
        
		if(week==1){
			foodName="肯德基";
		}else if (week==2||week==3) {
			foodName="必胜客";
		}else if (week==4) {
			foodName="德克士";
		}else if (week==5) {
			foodName="华莱士";
		}else {
			foodName="泡面";
		}
		System.out.println("吃:"+foodName);
	}
}
```

### c.嵌套if

```java
/**
*
* 嵌套if结构
*
*/
public class Test8 {
	public static void main(String[] args) {
		Scanner input = new Scanner(System.in);
		String foodName = "";// 食物
		System.out.print("请输入星期:");
		int week = input.nextInt();
        
		if (week >= 1 && week <= 7) {
			if (week == 1) {
				foodName = "肯德基";
			} else if (week == 2 || week == 3) {
				foodName = "必胜客";
			} else if (week == 4) {
				foodName = "德克士";
			} else if (week == 5) {
				foodName = "华莱士";
			} else {
				foodName = "泡面";
			}
			System.out.println("吃:" + foodName);
		} else {
		System.out.println("抱歉，只能输入1-7之间的整数！");
		}
	}
}
```



## B.switch结构

==switch也能用于多重选择，但是switch只能用于等值判断，不能用于区间判断==

```java
public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.println("输入星期：");
		int days=input.nextInt();
		String food = null;
		
		switch (days) {
			case 1:
				food="KFC";
				break;	
			case 2:
			case 3:
				food="BSK";
				break;
			case 4:
				food="DKS";
				break;
			case 5:
				food="饺子";
				break;
			case 6:
			case 7:
				food="泡面";
				break;
			default:
				break;
		}
		System.out.println("吃："+food);
		input.close();
	}
```



```java
public static void main(String[] args) {
		Scanner input=new Scanner(System.in);
		System.out.println("输入星期：");
		int days=input.nextInt();
		String food = null;
		
		if(days>7||days<1) {
			System.out.println("error");
		}else {
			switch (days) {
			case 1:
				food="KFC";
				break;
				
			case 2:
			case 3:
				food="BSK";
				break;
			
			case 4:
				food="DKS";
				break;
			
			case 5:
				food="饺子";
				break;
				
			case 6:
			case 7:
				food="泡面";
				break;
			
			default:
				break;
			}
			System.out.println("吃："+food);
		}
		
		input.close();
	}
```

## C.上机作业

```java
*************中兴爱买不买购物超市系统***********
1.帽子 2.T恤 3.裤衩
10￥ 15￥ 30￥
请输入编号选择商品:2
请选择购买的数量:5
您购买的商品:T恤,金额是:75
请输入支付的金额:100
找零:25
```

```java
import java.util.Scanner;

public class Test8 {
	public static void main(String[] args) {
		Scanner input =new Scanner(System.in);
		System.out.println("********超市********");
		System.out.println("1.帽子\t2.T恤\t3.羽绒服");
		System.out.println("10￥\t15￥\t40￥");
		System.out.println("请输入要购买的的商品编码：");
		int bianMa=input.nextInt();
		String shangPin=null;
		int price=0;
		
		if(bianMa>=1&&bianMa<=3) {
			if (bianMa==1) {
				shangPin="帽子";
				price=10;
			} else if (bianMa==2) {
				shangPin="T恤";
				price=15;
			} else {
				shangPin="羽绒服";
				price=40;
			}
			System.out.println("您选中的的商品为："+shangPin+"此商品的单价为："+price);
			System.out.println("请输入你要购买的数量：");
			int count=input.nextInt();
			int total=0;
			total=count*price;
			System.out.println("您需要支付的金额："+total);
			System.out.println("您支付的金额：");
			int money=input.nextInt();
			int retuenMoney=money-total;
			if (retuenMoney>0) {
				System.out.println(retuenMoney);
			}else {
				System.out.println("金额不足");
			}
			if(total>1000) {
				int lucknum=(int) (Math.random()*10)+1;
				System.out.println(lucknum);
				if (lucknum>5&&lucknum<=8) {
					System.out.println("恭喜获得三等奖：垃圾桶10个");
				} else if(lucknum>8&&lucknum<=9){
					System.out.println("恭喜获得二等奖：冰箱一台");
				}else if(lucknum==10){
					System.out.println("恭喜获得一等奖：洗衣机一台");
				}else {
					System.out.println("恭喜获得安慰奖：抽纸10包");
				}
			}else {
				System.out.println("无法参与抽奖");
			}
		}else {
			System.out.println("请输入正确的商品编码：");
		}
		input.close();
	}
}
```

## D.代码调试

```java
我们可以通过调试模式让原本自动执行的代码按原本的执行轨迹不变，变成手动一行一行的去执行，就可以看到代码执行，也能看到程序的漏洞。
    1.可以看到代码一步步的执行
    2.
```

# 四：循环结构

## A.定义

循环：在特定的条件下重复做一件事

## B.循环分类

### 1.while循环

```java
先判断，后执行；先判断条件是否满足，如果满足为true，就继续执行
```

```java
while(布尔表达式){
    //循环内容
}
```

只要布尔表达式为true，循环体会一直执行下去。

```java
   public class Test {
       public static void main(String args[]) {
       int x = 10;
           while( x < 20 ) {          
             System.out.print("value of x : " + x );          	           x++;
             System.out.print("\n");       
           }    
       } 
   } 
```



### 2.do-while循环

```java
对于while语句而言，如果不满足条件，则不能进入循环。但有时候我们需要即使不满足条件，也至少执行一次。

do…while循环和while循环相似，不同的是，do…while循环至少会执行一次。
```

```java
do {
       //代码语句
}while(布尔表达式);
```

**注意：**布尔表达式在循环体的后面，所以语句块在检测布尔表达式之前已经执行了。 如果布尔表达式的值为true，则语句块一直执行，直到布尔表达式的值为false。

```java
public class Test {

   public static void main(String args[]){
      int x = 10;

      do{
         System.out.print("value of x : " + x );
         x++;
         System.out.print("\n");
      }while( x < 20 );    } } 
```



### 3.for循环

```java
虽然所有循环结构都可以用while或者do...while表示，但Java提供了另一种语句 —— for循环，使一些循环结构变得更加简单。

for循环执行的次数是在执行前就确定的。语法格式如下：
```

```java
for(初始化; 布尔表达式; 更新) {
    //代码语句
}
```

关于for循环有以下几点说明：

- 最先执行初始化步骤。可以声明一种类型，但可初始化一个或多个循环控制变量，也可以是空语句。
- 然后，检测布尔表达式的值。如果为true，循环体被执行。如果为false，循环终止，开始执行循环体后面的语句。
- 执行一次循环后，更新循环控制变量。
- 再次检测布尔表达式。循环执行上面的过程。

### 4.加强for循环

```java
Java5引入了一种主要用于数组的增强型for循环。

Java增强for循环语法格式如下:
```

```java
for(声明语句 : 表达式)
{
   //代码句子
}
```

```java
声明语句：声明新的局部变量，该变量的类型必须和数组元素的类型匹配。其作用域限定在循环语句块，其值与此时数组元素的值相等。

表达式：表达式是要访问的数组名，或者是返回值为数组的方法。
```

## C.关键字

### 1.break关键字

```java
reak主要用在循环语句或者switch语句中，用来跳出整个语句块。

break跳出最里层的循环，并且继续执行该循环下面的语句。
```

```java
public class Test {

   public static void main(String args[]) {
      int [] numbers = {10, 20, 30, 40, 50};

      for(int x : numbers ) {
         if( x == 30 ) {
	      break;
         }
         System.out.print( x );
         System.out.print("\n");
      }
   }
}
```



### 2.continue关键字

```java
continue适用于任何循环控制结构中。作用是让程序立刻跳转到下一次循环的迭代。

在for循环中，continue语句使程序立即跳转到更新语句。

在while或者do…while循环中，程序立即跳转到布尔表达式的判断语句。
```

```java
public class Test {

   public static void main(String args[]) {
      int [] numbers = {10, 20, 30, 40, 50};

      for(int x : numbers ) {
         if( x == 30 ) {
	      continue;
         }
         System.out.print( x );
         System.out.print("\n");
      }
   }
}
```

### 3.return

return作为方法的返回值

```java
public String getName() { return name; }
```

## D.i++和++i的区别

```java
int a=5; 
int b=a+++1;//先运算再自增，b结果是6 
int c=++a+1;//先自增再运算,c结果是7 
System.out.println("b:"+b+",c:"+c);
```



# 五：数组

## A.声明数组

首先必须声明数组变量，才能在程序中使用数组。

```java
dataType[] arrayRefVar;   // 首选的方法

或

dataType arrayRefVar[];  // 效果相同，但不是首选方法
```

## B.创建数组

Java 语言使用 new操作符来创建数组

```java
arrayRefVar = new dataType[arraySize];
```

上面的语法语句做了两件事：

- 一、使用 dataType[arraySize] 创建了一个数组。
- 二、把新创建的数组的引用赋值给变量 arrayRefVar。

数组变量的声明，和创建数组可以用一条语句完成，如下所示：

```java
dataType[] arrayRefVar = new dataType[arraySize];
```

另外，还可以使用如下的方式创建数组。

```jav
dataType[] arrayRefVar = {value0, value1, ..., valuek};
```

数组的元素是通过索引访问的。数组索引从0开始，所以索引值从 0 到 arrayRefVar.length-1。

那么当数组开辟空间之后，就可以采用如下的方式的操作：

- 数组的访问通过索引完成，即：“数组名称[索引]”，但是需要注意的是，数组的索引从0开始，所以索引的范围就是0 ~ 数组长度-1，例如开辟了3个空间的数组，所以可以使用的索引是：0,1,2，如果此时访问的时候超过了数组的索引范围，会产生 java.lang.ArrayIndexOutOfBoundsException 异常信息；
- 当我们数组采用动态初始化开辟空间后，数组里面的每一个元素都是该数组对应数据类型的默认值；
- 数组本身是一个有序的集合操作，所以对于数组的内容操作往往会采用循环的模式完成，数组是一个有限的数据集合，所以应该使用 for 循环。
- 在 Java 中提供有一种动态取得数组长度的方式：数组名称.length；

```jav
数组属于引用数据类型，所以在数组使用之前一定要开辟空间（实例化），如果使用了没有开辟空间的数组，则一定会出现 NullPointerException 异常信息：
```

![](day01/tu01.png)

## C.Arrays类

java.util.Arrays 类能方便地操作数组，它提供的所有方法都是静态的。具有以下功能：

- 给数组赋值：通过 fill 方法。
- 对数组排序：通过 sort 方法,按升序。
- 比较数组：通过 equals 方法比较数组中元素值是否相等。
- 查找数组元素：通过 binarySearch 方法能对排序好的数组进行二分查找法操作。

| 序号 |                          方法和说明                          |
| :--: | :----------------------------------------------------------: |
|  1   | **public static int binarySearch(Object[] a, Object key)**<br/>用二分查找算法在给定数组中搜索给定值的对象(Byte,Int,double等)。数组在调用前必须排序好的。如果查找值包含在数组中，则返回搜索键的索引；否则返回 (-(*插入点*) - 1)。 |
|  2   | **public static boolean equals(long[] a, long[] a2)**<br/>如果两个指定的 long 型数组彼此*相等*，则返回 true。如果两个数组包含相同数量的元素，并且两个数组中的所有相应元素对都是相等的，则认为这两个数组是相等的。换句话说，如果两个数组以相同顺序包含相同的元素，则两个数组是相等的。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |
|  3   | **public static void fill(int[] a, int val)**<br/>将指定的 int 值分配给指定 int 型数组指定范围中的每个元素。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |
|  4   | **public static void sort(Object[] a)** 对指定对象数组根据其元素的自然顺序进行升序排列。同样的方法适用于所有的其他基本数据类型（Byte，short，Int等）。 |



# 六：面向对象

## A.基本概念

> 面向对象思想将客观世界中的事物描述为对象，并通过抽象思维方法将需要解决的实际问题分解成人们易于理解的对象模型，然后通过这些对象模型来构建应用程序的功能
>
> 面向对象的一些概念
>
> 类、对象、继承、封装、多态等

==Object Oriented Programming 面向对象编程，是java编程思想中最重要的编程思想！==

在OOP之前我们是面向过程的：

面向过程编程：把一个项目在一个类中从上到下去编写代码，把一个事件分成每一步去执行，比如C语言

面向过程的弊端：

```jav
1.代码都在一个类文件中，自上而下执行，代码的耦合度非常高，后期的扩展功能和维护的成本很高 
2.代码自上而下执行，代码的复用性不高，不能提高开发效率
```

## B.对象的概念

​        所谓对象就是真实世界中的实体，对象与实体是一一对应的，也就是说现实世界中每一个实体都是一个对象，它是一种具体的概念。

对象有以下特点：

- 对象具有属性和行为。
- 对象具有变化的状态。
- 对象具有唯一性。
- 对象都是某个类别的实例。
- 一切皆为对象，真实世界中的所有事物都可以视为对象。

### a.类和对象

​		在面向对象中，类和对象是最基本、最重要的组成单元。类实际上是表示一个客观世界某类群体的一些基本特征抽象。对象就是表示一个个具体的东西。所以说类是对象的抽象，对象是类的具体。

==类是概念模型，定义对象的所有特性和所需的操作，对象是真实的模型，是一个具体的实体。==

类是描述了一组有相同特性（属性）和相同行为（方法）的一组对象的集合。

对象或实体所拥有的特征在类中表示时称为类的属性。例如，每个人都具有姓名、年龄和体重，这是所有人共有的特征。但是每一个对象的属性值又各不相同，例如，小明和小红都具有体重这个属性，但是他们的体重值是不同的。

对象执行的操作称为类的方法。比如，“人”这个对象都具有的行为是“吃饭”，因此，吃饭就是“人”类的一个方法。

类是实体对象的概念模型，因此通常是笼统的、不具体的。

类是构造面向对象程序的基本单位，是抽取了同类对象的共同属性和方法所形成的对象或实体的“模板”。而对象是现实世界中实体的描述，对象要创建才存在，有了对象才能对对象进行操作。类是对象的模板，对象是类的实例。

​		==类：类是一种分类，一个类别，一个模板，它描述一类对象的行为和状态，是一组具有相同特性（属性）与行为（方法）的事物集合==
​		==对象：是一个个性的产物，是一个个体的特征，是类的一个实例，有状态和行为==

**类和对象的关系？**

> 类里面有属性和方法，如果你要去调用该类的属性和方法，首相需要创建对象，通过对象可以重复的调用该类中的属性和方法，私有的除外。
>
> 对象能调用到什么属性和方法取决于这个对象属于哪个类(取决于该对象的类型)
>
> 优势：代码重用，提高开发效率

### b.类的定义

==类是 [Java](http://c.biancheng.net/java/) 中的一种重要的引用数据类型，也是组成 Java 程序的基本要素，因为所有的 Java 程序都是基于类的。==

在 Java 中定义一个类，需要使用 class 关键字、一个自定义的类名和一对表示程序体的大括号。

```java
[public][abstract|final]class<class_name>[extends<class_name>][implements<interface_name>] {
    // 定义属性部分
    <property_type><property1>;
    <property_type><property2>;
    <property_type><property3>;
    …
    // 定义方法部分
    function1();
    function2();
    function3();
    …
}
```

提示：上述语法中，中括号“[]”中的部分表示可以省略，竖线“|”表示“或关系”，例如 abstract|final，说明可以使用 abstract 或 final 关键字，但是两个关键字不能同时出现。

上述语法中各关键字的描述如下。

- `public`：表示“共有”的意思。如果使用 public 修饰，则可以被其他类和程序访问。每个 Java 程序的主类都必须是 public 类，作为公共工具供其他类和程序使用的类应定义为 public 类。
- `abstract`：如果类被 abstract 修饰，则该类为抽象类，抽象类不能被实例化，但抽象类中可以有抽象方法（使用 abstract 修饰的方法）和具体方法（没有使用 abstract 修饰的方法）。继承该抽象类的所有子类都必须实现该抽象类中的所有抽象方法（除非子类也是抽象类）。
- `final`：如果类被 final 修饰，则不允许被继承。
- `class`：声明类的关键字。
- `class_name`：类的名称。
- `extends`：表示继承其他类。
- `implements`：表示实现某些接口。
- `property_type`：表示成员变量的类型。
- `property`：表示成员变量名称。
- `function()`：表示成员方法名称。

Java 类名的命名规则：

1. 类名应该以下划线（_）或字母开头，最好以字母开头。
2. 第一个字母最好大写，如果类名由多个单词组成，则每个单词的首字母最好都大写。
3. 类名不能为 Java 中的关键字，例如 boolean、this、int 等。
4. 类名不能包含任何嵌入的空格或点号以及除了下划线（_）和美元符号（$）字符之外的特殊字符。

创建一个新的类，就是创建一个新的数据类型。实例化一个类，就是得到类的一个对象。因此，对象就是一组变量和相关方法的集合，其中变量表明对象的状态和属性，方法表明对象所具有的行为。定义一个类的步骤如下所述。

(1) 声明类。编写类的最外层框架，声明一个名称为 Person 的类。

```java
public class Person {
    // 类的主体
}
```

(2) 编写类的属性。类中的数据和方法统称为类成员。其中，类的属性就是类的数据成员。通过在类的主体中定义变量来描述类所具有的特征（属性），这里声明的变量称为类的成员变量。

(3) 编写类的方法。类的方法描述了类所具有的行为，是类的方法成员。可以简单地把方法理解为独立完成某个功能的单元模块。

下面来定义一个简单的 Person 类。

```java
public class Person {
    private String name;    // 姓名
    private int age;    // 年龄
    public void tell() {   
        // 定义说话的方法
        System.out.println(name+"今年"+age+"岁！");
    }
}
```

### c.类的属性

在 [Java](http://c.biancheng.net/java/) 中类的成员变量定义了类的属性。例如，一个学生类中一般需要有姓名、性别和年龄等属性，这时就需要定义姓名、性别和年龄 3 个属性。声明成员变量的语法如下：

```java
[public|protected|private][static][final]<type><variable_name>
```

各参数的含义如下。

- public、protected、private：用于表示成员变量的访问权限。
- static：表示该成员变量为类变量，也称为静态变量。
- final：表示将该成员变量声明为常量，其值无法更改。
- type：表示变量的类型。
- variable_name：表示变量名称。

==可以在声明成员变量的同时对其进行初始化，如果声明成员变量时没有对其初始化，则系统会使用默认值初始化成员变量。==

初始化的默认值如下：

- 整数型（byte、short、int 和 long）的基本类型变量的默认值为 0。
- 单精度浮点型（float）的基本类型变量的默认值为 0.0f。
- 双精度浮点型（double）的基本类型变量的默认值为 0.0d。
- 字符型（char）的基本类型变量的默认值为 “\u0000”。
- 布尔型的基本类型变量的默认值为 false。
- 数组引用类型的变量的默认值为 null。如果创建了数组变量的实例，但没有显式地为每个元素赋值，则数组中的元素初始化值采用数组数据类型对应的默认值。

定义类的成员变量的示例如下：

```java
public class Student {
    public String name;    // 姓名
    final int sex = 0;    // 性别：0表示女孩，1表示男孩
    private int age;    // 年龄
}
```

### d.成员方法

声明成员方法可以定义类的行为，行为表示一个对象能够做的事情或者能够从一个对象取得的信息。类的各种功能操作都是用方法来实现的，属性只不过提供了相应的数据。一个完整的方法通常包括方法名称、方法主体、方法参数和方法返回值类型，成员方法一旦被定义，便可以在程序中多次调用，提高了编程效率。声明成员方法的语法格式如下：

```jav
public class Test {
    [public|private|protected][static]<void|return_type><method_name>([paramList]) {
        // 方法体
    }
}
```

注意：上述语法中，中括号“[]”中的部分表示可以省略，竖线“|”表示“或”，例如 public|private，说明可以使用 public 或 private 关键字，但是两个关键字不能同时出现。

上述代码中一个方法包含 4 部分：方法的返回值、方法名称、方法的参数和方法体。其中 retum_type 是方法返回值的数据类型，数据类型可以是原始的数据类型，即常用的 8 种数据类型，也可以是一个引用数据类型，如一个类、接口和数组等。

除了这些，一个方法还可以没有返回值，即返回类型为 void，像 main() 方法。method_name 表示自定义的方法名称，方法的名称首先要遵循标识符的命名约定，除此之外，方法的名称第一个单词的第一个字母是小写，第二单词的第一个字母是大写，依此类推。

paramList 表示参数列表，这些变量都要有自己的数据类型，可以是原始数据类型，也可以是复杂数据类型，一个方法主要依靠参数来传递消息。方法主体是方法中执行功能操作的语句。其他各修饰符的含义如下。

- public、private、protected：表示成员方法的访问权限。
- static：表示限定该成员方法为静态方法。
- final：表示限定该成员方法不能被重写或重载。
- abstract：表示限定该成员方法为抽象方法。抽象方法不提供具体的实现，并且所属类型必须为抽象类。

#### 1.成员方法的返回值

若方法有返回值，则在方法体中用 return 语句指明要返回的值，其格式如下所示。

```java
	return 表达式
    或
    return (表达式)
```

其中，表达式可以是常量、变量、对象等。表达式的数据类型必须与声明成员方法时给出的返回值类型一致。

#### 2.形参、实参及成员方法的调用

```java
methodName({paramList})
```

```java
public int returnMin(int m,int n) {
    return Math.min(m,n);    // m和n是形参
}
public static void main(String[] args) {
    int x = 50;
    int y = 100;
    Test t = new Test();
    int i = t.returnMin(x,y);    // x和y是实参
    System.out.println(i);
}
```

方法的形参和实参具有以下特点：

- 形参变量只有在被调用时才分配内存单元，在调用结束时，即刻释放所分配的内存单元。因此，形参只有在方法内部有效，方法调用结束返回主调方法后则不能再使用该形参变量。
- 实参可以是常量、变量、表达式、方法等，无论实参是何种类型的量，在进行方法调用时，它们都必须具有确定的值，以便把这些值传送给形参。因此应预先用赋值、输入等办法使实参获得确定值。
- 实参和形参在数量、类型和顺序上应严格一致，否则会发生“类型不匹配” 的错误。
- 方法调用中发生的数据传送是单向的，即只能把实参的值传送绐形参，而不能把形参的值反向地传送给实参。因此在方法调用过程中，形参的值发生改变，而实参中的值不会变化。

在调用成员方法时应注意以下 4 点：

1. 对无参成员方法来说，是没有实际参数列表的（即没有 paramList），但方法名后的括号不能省略。
2. 对带参数的成员方法来说，实参的个数、顺序以及它们的数据类型必须与形式参数的个数、顺序以及它们的数据类型保持一致，各个实参间用逗号分隔。实参名与形参名可以相同，也可以不同。
3. 实参也可以是表达式，此时一定要注意使表达式的数据类型与形参的数据类型相同，或者使表达式的类型按 [Java](http://c.biancheng.net/java/) 类型转换规则达到形参指明的数据类型。
4. 实参变量对形参变量的数据传递是“值传递”，即只能由实参传递给形参，而不能由形参传递给实参。程序中执行到调用成员方法时，Java 把实参值复制到一个临时的存储区（栈）中，形参的任何修改都在栈中进行，当退出该成员方法时，Java 自动清除栈中的内容。

#### 3.方法中的局部变量

在方法体内可以定义本方法所使用的变量，这种变量是局部变量。它的生存期与作用域是在本方法内，也就是说，局部变量只能在本方法内有效或可见，离开本方法则这些变量将被自动释放。

在方法体内定义变量时，变量前不能加修饰符。局部变量在使用前必须明确赋值，否则编译时会出错。另外，在一个方法内部，可以在复合语句（把多个语句用括号`{}`括起来组成的一个语句称复合语句）中定义变量，这些变量只在复合语句中有效。

### e.this关键字

​		this 关键字是 [Java](http://c.biancheng.net/java/) 常用的关键字，可用于任何实例方法内指向当前对象，也可指向对其调用当前方法的对象，或者在需要当前类型对象引用时使用。

this的两种使用方法

1.如果发生局部变量可以成员变量命名冲突时，可以通过this.成员变量名的方式区分实例变量和局部变量

2.一个构造方法中需要调用同一个类的另一个构造方法，可以通过this()的方式调用，但this()必须要书写在第一行

#### this.属性名

通过this.成员变量名调用隐藏的成员变量

```java
public class Teacher {
    private String name;    // 教师名称
    private double salary;    // 工资
    private int age;    // 年龄
    public Teacher(String name,double salary,int age) {
    this.name = name;    // 设置教师名称
    this.salary = salary;    // 设置教师工资
    this.age = age;    // 设置教师年龄
    }
}
```

this([参数列表])调用本一个类的另外一个构造方法

#### this.方法名

### f.构造方法

构造方法是类的一种特殊方法，用来初始化类的一个新的对象，在创建对象（new 运算符）之后自动调用。[Java](http://c.biancheng.net/java/) 中的每个类都有一个默认的构造方法，并且可以有一个以上的构造方法。

Java 构造方法有以下特点：

- 方法名必须与类名相同
- 可以有 0 个、1 个或多个参数
- 没有任何返回值，包括 void
- 默认返回类型就是对象类型本身
- 只能与 new 运算符结合使用

构造方法主要有无参构造方法和有参构造方法两种

```java
public class MyClass {
    private int m;    // 定义私有变量
    MyClass() {
        // 定义无参的构造方法
        m = 0;
    }
    MyClass(int m) {
        // 定义有参的构造方法
        this.m = m;
    }
}
```

该示例定义了两个构造方法，分别是无参构造方法和有参构造方法。在一个类中定义多个具有不同参数的同名方法，这就是方法的重载。这两个构造方法的名称都与类名相同，均为 MyClass。在实例化该类时可以调用不同的构造方法进行初始化。

```java
注意：类的构造方法不是要求必须定义的。如果在类中没有定义任何一个构造方法，则 Java 会自动为该类生成一个默认的构造方法。默认的构造方法不包含任何参数，并且方法体为空。如果类中显式地定义了一个或多个构造方法，则 Java 不再提供默认构造方法。
```

要在不同的条件下使用不同的初始化行为创建类的对象，这时候就需要在一个类中创建多个构造方法。下面通过一个示例来演示构造方法的使用。

### g.对象的创建

####  **1.**直接通过对象操作属性赋值

```java
Car car1=new Car(); 
car1.brand="大众CC"; 
car1.color="黑色"; 
car1.money=-30;//直接赋值，数据不安全 
car1.carNumber="赣Asv999";
car1.carGo();
```

#### 2.通过将属性封装，提高数据的安全性

封装的定义：

```JAVA
将类中的某些信息(属性或方法)封装在类的内部，不允许外部程序直接访问，而是通过该类提供的方法来实现 对隐藏信息的操作
```

步骤：1.将成员变量private私有化，将成员变量封装get、set方法分别来获取值和设置值

```java
private String brand;
    private String color;
    private int price;
    private String numberPlate;

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        //将业务处理隐藏在方法内部，对象调用的时候无需知道内部具体实现的细节，这就是封装的概念 
        //如果是负数就取用绝对值
        this.price = price;
    }

    public String getNumberPlate() {
        return numberPlate;
    }

    public void setNumberPlate(String numberPlate) {
        this.numberPlate = numberPlate;
    }

    public void showCarInfo(){
        System.out.println("汽车品牌:"+brand+",汽车颜色"+this.color+",汽车价格"+this.price+",车牌号"+this.numberPlate);
    }

    public Car() {
    }

    public Car(String brand, String color, int price, String numberPlate) {
        this.brand = brand;
        this.color = color;
        this.price = price;
        this.numberPlate = numberPlate;
    }
```

#### 3.构造方法初始化对象赋值

```JAVA
//通过构造方法创建对象并且初始化对象，而且还可以对业务进行封装，数据更安全！ 
public Car(String brand, String color, int money, String carNumber) 
{ 
    this.brand = brand; 
    this.color = color; 
    if (money<0) { 
        this.money= Math.abs(money); 
    }else { 
        this.money = money; 
    }this.carNumber = carNumber; 
}
```

### h.static关键字

在类中，使用 static 修饰符修饰的属性（成员变量）称为静态变量，也可以称为类变量，常量称为静态常量，方法称为静态方法或类方法，它们统称为静态成员，归整个类所有。

#### 静态变量

类的成员变量可以分为以下两种：

1. 静态变量（或称为类变量），指被 static 修饰的成员变量。
2. 实例变量，指没有被 static 修饰的成员变量

静态变量与实例变量的区别如下：

1）静态变量

- 运行时，Java 虚拟机只为静态变量分配一次内存，在加载类的过程中完成静态变量的内存分配。
- 在类的内部，可以在任何方法内直接访问静态变量。
- 在其他类中，可以通过类名访问该类中的静态变量。


2）实例变量

- 每创建一个实例，Java 虚拟机就会为实例变量分配一次内存。
- 在类的内部，可以在非静态方法中直接访问实例变量。
- 在本类的静态方法或其他类中则需要通过类的实例对象进行访问。

静态变量在类中的作用如下：

- 静态变量可以被类的所有实例共享，因此静态变量可以作为实例之间的共享数据，增加实例之间的交互性。
- 如果类的所有实例都包含一个相同的常量属性，则可以把这个属性定义为静态常量类型，从而节省内存空间。例如，在类中定义一个静态常量 PI。

```java
public static double PI = 3.14159256;
```

#### 静态方法

与成员变量类似，成员方法也可以分为以下两种：

1. 静态方法（或称为类方法），指被 static 修饰的成员方法。
2. 实例方法，指没有被 static 修饰的成员方法。


静态方法与实例方法的区别如下：

- 静态方法不需要通过它所属的类的任何实例就可以被调用，因此在静态方法中不能使用 this 关键字，也不能直接访问所属类的实例变量和实例方法，但是可以直接访问所属类的静态变量和静态方法。另外，和 this 关键字一样，super 关键字也与类的特定实例相关，所以在静态方法中也不能使用 super 关键字。
- 在实例方法中可以直接访问所属类的静态变量、静态方法、实例变量和实例方法。

### i.权限修饰符

访问修饰符可以用于修饰属性和方法，用于定义属性和方法的访问权限

|                     | 本类 | 本包 | 子类                           | 其他包 |
| ------------------- | ---- | ---- | ------------------------------ | ------ |
| private(私有的)     | OK   | NO   | NO                             | NO     |
| default(默认不写)   | OK   | OK   | NO                             | NO     |
| protected(受保护的) | OK   | OK   | OK(有继承关系的其他包也可以用) | NO     |
| public(公有的)      | OK   | OK   | OK                             | OK     |

==权限从小到大: private<默认不写<protected<public公有的==

## C.特性

### a.继承性

程序中的继承性是指子类拥有父类的全部特征和行为，这是类之间的一种关系。Java 只支持单继承。即只能有一个父类，但 Java 可以实现多个接口（接口类似于类，但接口的成员没有执行体。可以防止多继承所引起的冲突问题。

使用这种层次形的分类方式，是为了将多个类的通用属性和方法提取出来，放在它们的父类中，然后只需要在子类中各自定义自己独有的属性和方法，并以继承的形式在父类中获取它们的通用属性和方法即可。

### b.封装性

封装是将代码及其处理的数据绑定在一起的一种编程机制，该机制保证了程序和数据都不受外部干扰且不被误用。封装的目的在于保护信息，使用它的主要优点如下。

- 保护类中的信息，它可以阻止在外部定义的代码随意访问内部代码和数据。
- 隐藏细节信息，一些不需要程序员修改和使用的信息，比如取款机中的键盘，用户只需要知道按哪个键实现什么操作就可以，至于它内部是如何运行的，用户不需要知道。
- 有助于建立各个系统之间的松耦合关系，提高系统的独立性。当一个系统的实现方式发生变化时，只要它的接口不变，就不会影响其他系统的使用。例如 U 盘，不管里面的存储方式怎么改变，只要 U 盘上的 USB 接口不变，就不会影响用户的正常操作。
- 提高软件的复用率，降低成本。每个系统都是一个相对独立的整体，可以在不同的环境中得到使用。例如，一个 U 盘可以在多台电脑上使用。


Java 语言的基本封装单位是类。由于类的用途是封装复杂性，所以类的内部有隐藏实现复杂性的机制。Java 提供了私有和公有的访问模式，类的公有接口代表外部的用户应该知道或可以知道的每件东西，私有的方法数据只能通过该类的成员代码来访问，这就可以确保不会发生不希望的事情。

### c.多态性

面向对象的多态性，即“一个接口，多个方法”。多态性体现在父类中定义的属性和方法被子类继承后，可以具有不同的属性或表现方式。多态性允许一个接口被多个同类使用，弥补了单继承的不足。



# 七：方法

## A.定义

```JAVA
把代码逻辑细节用方法封装起来，通过对象能够重复调用方法，实现代码复用，提高工作效率
```

## B.方法种类

返回值： 有返回值的、无返回值的

参数：有参的、无参数的

```JAVA
	1.无返回值无参方法 
    2.无返回值有参方法 
    3.有返回值无参方法 
    4.有返回值有参方法
```

### 案例1：

```JAVA
public void jisuan() { 
    Scanner input=new Scanner(System.in);
    System.out.print("请输入语文成绩:");
    int yuwen=input.nextInt(); 
    System.out.print("请输入数学成绩:"); 
    int shuxue=input.nextInt(); 
    System.out.print("请输入英语成绩:"); 
    int yingyu=input.nextInt(); 
    //平均分 
    int avg=(yuwen+shuxue+yingyu)/3; 
    System.out.println("三门课程的平均分是:"+avg); }
```

```JAVA
/**
*需求： 
*在测试类调用计算的方法，得到语文、数学、英语的三门课程的平均分 
*
*/ 
public class Test { 
    public static void main(String[] args) { 
        Admin admin=new Admin(); 
        //调用无返回值无参数方法 
        admin.jisuan(); 
    } 
}
```

### 案例2：

```JAVA
public class Admin { 
    /**
    * 有返回值无参数的方法 
    * @return 
    */ 
    public int jisuan() { 
        Scanner input=new Scanner(System.in); 	System.out.print("请输入语文成绩:"); int yuwen=input.nextInt(); System.out.print("请输入数学成绩:"); int shuxue=input.nextInt(); System.out.print("请输入英语成绩:"); int yingyu=input.nextInt(); 
        //平均分 
        int avg=(yuwen+shuxue+yingyu)/3; 
        return avg; 
    } 
}
public class Test { 
    static void main(String[] args) { 
        Admin admin=new Admin(); 
        //调用有返回值无参方法 
        int avgScore= admin.jisuan(); 
        System.out.println("三门课程的平均分是:"+avgScore); 
    } 
}
```

### 案例3：

```JAVA
public class Admin { 
    /**
    *
    * 无返回值有参数方法 
    * 接受参数的这方叫形式参数(形参) 
    */ 
    public void jisuan(int yuwen, int shuxue, int yingyu) {
        int avg=(yuwen+shuxue+yingyu)/3; 
        System.out.println("三门课程的平均分是:"+avg); 
    } 
}
/**
* 需求： 在测试类调用计算的方法，得到语文、数学、英语的三门课程的平均分 *
*/ 
public class Test {
    public static void main(String[] args) { 
    	Scanner input = new Scanner(System.in); 
    	System.out.print("请输入语文成绩:"); 
    	int yuwen = input.nextInt(); 
   	 	System.out.print("请输入数学成绩:"); 
    	int shuxue = input.nextInt(); 
    	System.out.print("请输入英语成绩:"); 
    	int yingyu = input.nextInt(); 
    	Admin admin = new Admin(); 
    	//调用无返回值有参方法 
    	//具体传递值的叫实际参数(实参) 
   		admin.jisuan(yuwen,shuxue,yingyu);
        } 
}
```

## C.值传递和引用类型传递【重要】

### 1.值类型案例

```JAVA
public class Admin { 
    //两值交换 
    public void change(int a, int b) { 
        int c=a; a=b; b=c; 
        System.out.println("交换：a:"+a+",b:"+b);
    } 
}
```

```JAVA
/**
*值传递 
* @author Administrator 
*
*/ 
public class Test { 
    public static void main(String[] args) { 
    int a=5; 
    int b=10; 
    Admin admin=new Admin(); 
    //基本数据类型为参数，是值传递，是将值赋值一份给形参，当形参的值发生了改变，实参的值不变 
    admin.change(a,b);// 
    System.out.println("a:"+a+",b:"+b);//结果5,10 
}}
```

### 2.引用类型传递

```JAVA
public class Arrays { 
    /**
    * static修饰的方法叫类方法或者叫静态方法 
    * 类方法属于类，可以通过类名直接调用，一般工具方法都是这样用比较方便 
    * @param score 
    */ 
    public static void sortByDesc(int[] score) { 
        for (int i = 0; i < score.length-1; i++) { 
            for (int j = 0; j < score.length-i-1; j++) {
                if (score[j]<score[j+1]) { 
                    int temp=score[j]; 
                    score[j]=score[j+1]; 
                    score[j+1]=temp; 
                } 
            } 
        } 
    } 
}
```

```JAVA
/**
* 引用类型传递值 
*
*/ 
public class Test { 
    public static void main(String[] args) { 
        int score[]= {3,45,6,67,1};
        // Arrays.sort(score); 
        //数组、对象、集合、接口、类都是引用类型！ 
        //以数组为实参，是引用类型传递，是将score数组的地址复制了一份给形参 
        //当形参指引到的数组的值发生了改变，因为实参和形参的地址是同一个，所以实参的值也会改变！ 
        Arrays.sortByDesc(score); 
        for (int i : score) { 
            System.out.print(" "+i); 
        }
    } 
}
```

# 八：方法重写和方法重载

## A.方法重载Overload【重要】

```JAVA
在同一个类中，多个方法名相同，但是参数的个数、类型、顺序不同，叫方法重载，与返回类型无关 方法重载各个重名的方法之间没有任何联系，只是叫同一个方法名而已，像构造方法必须和类名一致有时候需 要多个构造方法，所以叫构造方法重载。
```

```java
public class Student { 
    String name;//姓名 
    int age;//年龄 
    char sex;//性别 
    String studentNo;//学号 
    double price;//学费 
    public Student() {} 
    public Student(String name, int age, char sex) { 
        super(); 
        this.name = name; 
        this.age = age; 
        this.sex = sex; 
    }
    //构造方法的常见体现：构造方法重载 
    public Student(String name, int age, char sex, String studentNo, double price) {
        this.name = name; 
        this.age = age; 
        this.sex = sex; 
        this.studentNo = studentNo;
        this.price = price; 
    }
    public void study(){ 
        System.out.println("学生学习！"); 
    }
    //在一个类中，多个方法名相同，参数的个数、顺序、类型不同，叫方法重载，与返回类型无关 
    public void study(String name){ 
        System.out.println(name+"学生学习！"); 
    }
    public static void main(String[] args) { 
        //具体调用本类中哪个方法具体看方法的参数！
        new Student().study(); 
        new Student().study("狗剩");
        String str="我是江西老表"; //字符串截取 
        String str2=str.substring(2); 
        System.out.println(str2); 
        String str3=str.substring(2,4); 
        System.out.println(str3);
    }
}
```

## B.方法重写Override【重要】

==注意：我们所有的类都是继承于Object父类，==父类也可以叫基类或者超类。子类继承于父类，当子类和父类的方法一致并且内容做了覆盖，叫做方法重写！

### 1.重写object类的toString方法

```JAVA
public class Student { 
    String name;//姓名 
    int age;//年龄 
    char sex;//性别 
    String studentNo;//学号 
    double price;//学费 
    //构造方法的常见体现：构造方法重载 
    public Student(String name, int age, char sex, String studentNo, double price) {
        this.name = name; 
        this.age = age; 
        this.sex = sex; 
        this.studentNo = studentNo; 
        this.price = price; 
    }
    //重写了Object类的toString方法 
    //子类如果和父类方法一致，只是具体实现内容不一样，叫方法重写或者叫方法覆盖 
    //优势：扩展性更强！ 
    @Override 
    public String toString() { 
        return "Student属性:[name=" + name + ", age=" + age + ", sex=" + sex + ", studentNo=" + studentNo + ", price=" + price + "]"; 
    } 
}
```

```JAVA
public class Test { 
    public static void main(String[] args) { 
        Student stu2=new Student("张三",21,'男',"S0001",1000); 
        System.out.println(stu2.toString()); 
    } 
}
```

### 2.重写Object类的equals方法

```JAVA
public class Teacher { 
    String name;//称呼 
    int code;//身份证号码
    public Teacher(String name, int code) { 
        super(); 
        this.name = name; 
        this.code = code; 
    }
    /**
    * 重写Object父类的equals方法，如果编号一致就返回true 
    */ 
    @Override 
    public boolean equals(Object obj) { 
        //如果两个对象地址一致，返回true 
        if (this==obj) { return true; }
        //将父类类型用子类类型接收，需要向下转型 
        Teacher t=(Teacher) obj; 
        if (this.code==t.code) 
        { 
            //判断两个对象的属性code员工编号一致，那么就返回true 
            return true; 
        }else { return false; } 
    } 
}
```

```JAVA
public class Test { 
    public static void main(String[] args) { 
        Teacher teacher1=new Teacher("棋哥",10001); 
        Teacher teacher2=new Teacher("老彭",10001);
 //System.out.println(teacher1.equals(teacher2));//false 
        //需求：根据身份证编号来判断这两个对象是同一个人！ 
        //Object类的equals方法底层是比较地址，显然不能满足我们的需求，如何解决？->重写Object的 equals方法 
        System.out.println(teacher1.equals(teacher2));//true 
    } 
   
}
```

