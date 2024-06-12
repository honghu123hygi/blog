---
title: sql实战一
author:
createTime: 2024/06/06 20:18:18
permalink: /article/jxkuoi7x/
---
## 1、查找最晚入职员工的所有信息

**题目描述**

查找最晚入职员工的所有信息

```sql
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select * from employees where hire_date = (select max(hire_date) from employees)；
```

**题解**

由于date数据类型只能精确到天，即可能在最晚的当天存在一个或多个数据，该题使用limit无法获取所有的最晚当天入职的员工信息。



## 2、查找入职员工时间排名倒数第三的员工所有信息

**题目描述**

查找入职员工时间排名倒数第三的员工的所有信息

```sql
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select * from employees where hire_date = (select distinct hire_date from employees order by hire_date desc limit 2,1)
```

**题解**

与第一题一样，区别在于需要进行去重和排序后获得排名信息。





## 3、查找当前薪水详情以及部门编号dept_no

**题目描述**

查找各个部门当前(to_date='9999-01-01')领导当前薪水详情以及对应部门编号dept_no

```sql
CREATE TABLE `dept_manager` (
`dept_no` char(4) NOT NULL,
`emp_no` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));

CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select salaries.emp_no,salary,salaries.from_date,salaries.to_date,dept_no from salaries,dept_manager where salaries.emp_no=dept_manager.emp_no and salaries.to_date='9999-01-01' and dept_manager.to_date='9999-01-01'
```

**题解**

简单的多表查询



## 4、查找所有已经分配部门的员工的last_name和first_name

**题目描述**

查找所有已经分配部门的员工的last_name 和 first_name

```sql
CREATE TABLE `dept_emp` (
`emp_no` int(11) NOT NULL,
`dept_no` char(4) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select last_name,first_name,dept_no from employees inner join dept_emp de on employees.emp_no = de.emp_no
```

**题解**

inner join的用法



## 5、查找所有员工的last_name和first_name以及对应部门编号dept_no

**题目描述**

查找所有员工的last_name和first_name以及对应部门编号dept_no，也包括展示没有分配具体部门的员工

```sql
CREATE TABLE `dept_emp` (
`emp_no` int(11) NOT NULL,
`dept_no` char(4) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select last_name,first_name,dept_no from employees e left join dept_emp d on e.emp_no=d.emp_no
```

**题解**

left join的用法



## 6、查找所有员工入职时候的薪水情况

**题目描述**

查找所有员工入职时候的薪水情况，给出emp_no以及salary， 并按照emp_no进行逆序

```sql
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select e.emp_no,s.salary from employees e left join salaries s on e.emp_no = s.emp_no where e.hire_date = s.from_date order by e.emp_no desc
```

**题解**

两表的简单连接，而后对数据进行排序



## 7、查找薪水涨幅超过15次的员工号emp_no以及其对应的涨幅次数t

**题目描述**

查找薪水涨幅超过15次的员工号emp_no以及其对应的涨幅次数t

```sql
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select emp_no,count(emp_no) t from salaries group by emp_no having count(emp_no) > 15
```

**题解**

分组后过滤



## 8、找出所有员工当前薪水salary情况

**题目描述**

找出所有员工当前(to_date='9999-01-01')具体的薪水salary情况，对于相同的薪水只显示一次,并按照逆序显示

```sql
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select distinct salary from salaries where to_date = '9999-01-01' order by salary desc
```

**题解**

distinct的作用



## 9、获取所有部门当前manager的当前薪水情况，给出dept_no, emp_no以及salary，当前表示to_date='9999-01-01'

**题目描述**

获取所有部门当前manager的当前薪水情况，给出dept_no, emp_no以及salary，当前表示to_date='9999-01-01'

```sql
CREATE TABLE `dept_manager` (
`dept_no` char(4) NOT NULL,
`emp_no` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select dm.dept_no,dm.emp_no,s.salary from dept_manager dm left join salaries s on dm.emp_no = s.emp_no where s.to_date = '9999-01-01' and dm.to_date = '9999-01-01'
```

**题解**

连接后过滤



## 10、获取所有非manager的员工emp_no

**题目描述**

获取所有非manager的员工emp_no

```sql
CREATE TABLE `dept_manager` (
`dept_no` char(4) NOT NULL,
`emp_no` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select e.emp_no from employees e where e.emp_no not in (select emp_no from dept_manager)
```

**题解**

将属于manager的所有员工过滤



## 11、获取所有员工当前的manager

**题目描述**

获取所有员工当前的manager，如果当前的manager是自己的话结果不显示，当前表示to_date='9999-01-01'。
结果第一列给出当前员工的emp_no,第二列给出其manager对应的manager_no。

```sql
CREATE TABLE `dept_emp` (
`emp_no` int(11) NOT NULL,
`dept_no` char(4) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `dept_manager` (
`dept_no` char(4) NOT NULL,
`emp_no` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
```

**答案**

```sql
select de.emp_no,dm.emp_no manager_no from dept_emp de left join dept_manager dm on de.dept_no = dm.dept_no where de.to_date= '9999-01-01' and dm.to_date = '9999-01-01' and de.emp_no != dm.emp_no
```



## 12、获取所有部门中当前员工薪水最高的相关信息

**题目描述**

获取所有部门中当前员工薪水最高的相关信息，给出dept_no, emp_no以及其对应的salary

```sql
CREATE TABLE `dept_emp` (
`emp_no` int(11) NOT NULL,
`dept_no` char(4) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select dept_no,s.emp_no,max(salary) salary from dept_emp de left join salaries s on de.emp_no = s.emp_no where de.to_date = '9999-01-01' and s.to_date = '9999-01-01' group by dept_no having s.salary = max(salary)
```



## 13、从titles表获取按照title进行分组

**题目描述**

从titles表获取按照title进行分组，每组个数大于等于2，给出title以及对应的数目t。

```sql
CREATE TABLE IF NOT EXISTS "titles" (
`emp_no` int(11) NOT NULL,
`title` varchar(50) NOT NULL,
`from_date` date NOT NULL,
`to_date` date DEFAULT NULL);
```

**答案**

```sql
select title,count(emp_no) t from titles group by title having count(emp_no) >= 2
```



## 14、从titles表获取按照title进行分组，注意对于重复的emp_no进行忽略。

**题目描述**

从titles表获取按照title进行分组，每组个数大于等于2，给出title以及对应的数目t。
注意对于重复的emp_no进行忽略。

```sql
CREATE TABLE IF NOT EXISTS `titles` (
`emp_no` int(11) NOT NULL,
`title` varchar(50) NOT NULL,
`from_date` date NOT NULL,
`to_date` date DEFAULT NULL);
```

**答案**

```sql
select title,count(distinct emp_no) t from titles group by title having t >= 2
```



## 15、查找employees表

**题目描述**

查找employees表所有emp_no为奇数，且last_name不为Mary的员工信息，并按照hire_date逆序排列

```sql
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select * from employees where last_name != 'Mary' and emp_no % 2 = 1 order by hire_date desc
```



## 16、统计出当前各个title类型对应的员工当前薪水对应的平均工资

**题目描述**

统计出当前各个title类型对应的员工当前（to_date='9999-01-01'）薪水对应的平均工资。结果给出title以及平均工资avg。

```sql
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
CREATE TABLE IF NOT EXISTS "titles" (
`emp_no` int(11) NOT NULL,
`title` varchar(50) NOT NULL,
`from_date` date NOT NULL,
`to_date` date DEFAULT NULL);
```

**答案**

```sql
select title,avg(salary) avg from titles t left join salaries s on t.emp_no = s.emp_no where t.to_date = '9999-01-01' and  s.to_date = '9999-01-01' group by title
```

**题解**

分组聚合



## 17、获取当前薪水第二多的员工的emp_no以及其对应的薪水salary

**题目描述**

获取当前（to_date='9999-01-01'）薪水第二多的员工的emp_no以及其对应的薪水salary

```sql
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select emp_no,salary from salaries where to_date = '9999-01-01' order by salary desc limit 1,1
```



## 18、获取当前薪水第二多的员工的emp_no以及其对应的薪水salary，不准使用order by

**题目描述**

查找当前薪水(to_date='9999-01-01')排名第二多的员工编号emp_no、薪水salary、last_name以及first_name，不准使用order by

```sql
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select s.emp_no,salary,last_name,first_name from salaries s left join employees e on e.emp_no = s.emp_no where s.salary = (select max(salary) from salaries where to_date = '9999-01-01' and salary != (select max(salary) from salaries))
```

**题解**

1、先获得去除了最大值得数据集t1

2、再获得t1中的最大值



## 19、查找所有员工的last_name和first_name以及对应的dept_name

**题目描述**

查找所有员工的last_name和first_name以及对应的dept_name，也包括暂时没有分配部门的员工

```sql
CREATE TABLE `departments` (
`dept_no` char(4) NOT NULL,
`dept_name` varchar(40) NOT NULL,
PRIMARY KEY (`dept_no`));
CREATE TABLE `dept_emp` (
`emp_no` int(11) NOT NULL,
`dept_no` char(4) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`dept_no`));
CREATE TABLE `employees` (
`emp_no` int(11) NOT NULL,
`birth_date` date NOT NULL,
`first_name` varchar(14) NOT NULL,
`last_name` varchar(16) NOT NULL,
`gender` char(1) NOT NULL,
`hire_date` date NOT NULL,
PRIMARY KEY (`emp_no`));
```

**答案**

```sql
select e.last_name,e.first_name,d.dept_name from employees e left join dept_emp de on e.emp_no = de.emp_no left join departments d on de.dept_no = d.dept_no
```

**题解**

三表连接



## 20、查找员工编号emp_no为10001其自入职以来的薪水salary涨幅值growth

**题目描述**

查找员工编号emp_no为10001其自入职以来的薪水salary涨幅值growth

```sql
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select max(salary) - min(salary) growth from salaries where emp_no = 10001
```

**题解**

简单的减法操作
