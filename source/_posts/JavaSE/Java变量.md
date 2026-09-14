---
title: Java变量
urlname: Java变量
date: 2022-07-02 20:02:56
tags:
  - Java
  - 变量
categories:
  - JavaSE
---

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



​    		<font color="red">数据类型分为基本类型和引用类型</font>

![](tu1.png)

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

​	 <font color="red">基本数据类型的数据都是在栈内存中存储，引用类型的数据都是在对内存中存储</font>

## E.数据转换

<font color="red">一定是数值之间才可以进行转换!</font>

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

<font color="red">是用于数值之间比较，比较的是内存地址是否相等。</font>当int 1=7;的时候，首先去内存中找是否有7这个常量，如果没有就根据int开辟一个4字节的空间内存7，地址赋给a；当int b=7，如果内存有7就没必要重新开辟新的空间，而是将7的地址赋给b变量，因此a==b是判断两个值的内存地址是否一致

<font color="red">基本数据类型是保存在堆（堆栈）内存，数据可共享，引用类型是保存在堆内存，数据不共享</font>

![](tu2.png)

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

## J.上机作业

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

# 
