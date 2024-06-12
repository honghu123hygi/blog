---
title: sql实战二
author:
createTime: 2024/06/11 16:24:07
permalink: /article/nj60efhx/
---
## 1、查找所有员工自入职以来的薪水涨幅情况

**题目描述**

查找所有员工自入职以来的薪水涨幅情况，给出员工编号emp_no以及其对应的薪水涨幅growth，并按照growth进行升序

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
select end.emp_no,(end.salary - start.salary) growth from (select emp_no,salary from salaries where to_date = '9999-01-01') end left join (select s.emp_no,salary from salaries s inner join employees e on s.emp_no = e.emp_no where s.from_date = e.hire_date) start on start.emp_no = end.emp_no order by growth
```

**题解**

1、获得当前工资表，放入临时表end中

```sql
-- 目前的工资
(select emp_no,salary from salaries where to_date = '9999-01-01') end
```

2、获得第一次入职时的工资，放入临时表start中

```sql
-- 最开始的工资
(select s.emp_no,salary from salaries s left join employees e on s.emp_no = e.emp_no where s.from_date = e.hire_date) start
```

3、连接临时表，用end工资-start工资即可



## 2、统计各个部门对应员工涨幅的次数总和

**题目描述**

统计各个部门对应员工涨幅的次数总和，给出部门编码dept_no、部门名称dept_name以及次数sum

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
CREATE TABLE `salaries` (
`emp_no` int(11) NOT NULL,
`salary` int(11) NOT NULL,
`from_date` date NOT NULL,
`to_date` date NOT NULL,
PRIMARY KEY (`emp_no`,`from_date`));
```

**答案**

```sql
select dept_no,dept_name,sum(sum) sum from (select emp_no,d.dept_no,dept_name from dept_emp de left join departments d on de.dept_no = d.dept_no) info inner join (select emp_no,count(salary) sum from salaries s group by emp_no) s on info.emp_no = s.emp_no group by dept_no
```

**题解**

1、计算每个员工的涨幅次数总和 s

```sql
-- 涨幅次数总和
(select emp_no,count(salary) sum from salaries s group by emp_no) s
```

2、拼接员工和部门信息 info

```sql
-- 部门信息
(select emp_no,d.dept_no,dept_name from dept_emp de left join departments d on de.dept_no = d.dept_no) info
```

3、拼接info和s表，对dept_no进行分组，计算每个部门对应的sum总和







