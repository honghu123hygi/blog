---
title: SQL基础
author:
createTime: 2024/06/04 10:36:36
permalink: /article/ot2h5kr6/
---
# 基础



## 别名

使用别名语法 `{原始字段名} as {别名}` 来为查询结果的列名取一个便于理解的名称。通过使用别名，我们可以更直观地知道查询结果中每一列的含义，方便阅读和使用。 as 也可以省略，比如 `name 员工姓名` 也是 ok 的。

如：从名为 `student` 的数据表中选择出所有学生的姓名（name）和年龄（age）信息，并为它们取别名为 `学生姓名` 和 `学生年龄`。

```sql
select name as 学生姓名, age 学生年龄 from student
```



## 常量和运算

在查询语句中对数据进行加减乘除、取平均值、连接文本等操作，从而得到我们想要的查询结果。

如：从名为`student`的数据表中选择出所有学生的姓名（name）和分数（score），并且额外计算出分数的 2 倍（double_score）。

```sql
select name, score, score * 2 as double_score from student;
```



## 运算符

运算符是 SQL 中用于在条件查询中进行条件判断的特殊符号，比如 `=`、 `!=`、`<`、`>` 等。通过使用不同的运算符，我们可以在查询语句中设定多样化的条件，从而根据数据的不同属性进行灵活的筛选和过滤。

如：从名为 `student` 的数据表中选择出所有学生的姓名（name）和年龄（age），要求学生姓名不等于 '热dog' 。

```sql
select name, age from student where name != '热dog'
```

​		筛选出年龄在 15 到 17 之间的学生。

```sql
select name, age from student where age between 15 and 70;
```



## 空值

在数据库中，有时候数据表的某些字段可能没有值，即为空值（NULL）。

空值表示该字段的值是未知的、不存在的或者没有被填写的。在SQL查询中，我们可以使用 "IS NULL" 和 "IS NOT NULL" 来判断字段是否为空值或非空值。

如：从名为 `student` 的数据表中选择出所有学生的姓名（name）、年龄（age）和成绩（score），要求学生年龄不为空值。

```sql
select name, age, score from student where age is not null
```



## 模糊查询

模糊查询是一种特殊的条件查询，它允许我们根据模式匹配来查找符合特定条件的数据，可以使用 LIKE 关键字实现模糊查询。

在 LIKE 模糊查询中，我们使用通配符来代表零个或多个字符，从而能够快速地找到匹配的数据。

有如下 2 种通配符：

- 百分号（%）：表示任意长度的任意字符序列。
- 下划线（_）：表示任意单个字符。

如：从名为 `student` 的数据表中选择出所有学生的姓名（name）和成绩（score），要求姓名（name）不包含 "李" 这个字。

```sql
select name, score from student where name not like '%李%'
```



## 逻辑运算

逻辑运算是一种在条件查询中使用的运算符，它允许我们结合多个条件来过滤出符合特定条件的数据。

在逻辑运算中，常用的运算符有：

- AND：表示逻辑与，要求同时满足多个条件，才返回 true。
- OR：表示逻辑或，要求满足其中任意一个条件，就返回 true。
- NOT：表示逻辑非，用于否定一个条件（本来是 true，用了 not 后转为 false）

如：从名为 `student` 的数据表中选择出所有学生的姓名（name）、成绩（score），要求学生的姓名包含 "李"，或者成绩（score）大于 500。

```sql
select name, score from student where name like '%李%' or score > 500;
```



## 去重

在数据表中，可能存在重复的数据记录，但如果我们想要过滤掉重复的记录，只保留不同的记录，就要使用 SQL 的去重功能。

在 SQL 中，我们可以使用 `DISTINCT` 关键字来实现去重操作。

如：从名为 `student` 的数据表中选择出所有不重复的班级 ID（class_id）和考试编号（exam_num）的组合。

```sql
select distinct class_id, exam_num from student;
```



## 排序

在查询数据时，我们有时希望对结果按照某个字段的值进行排序，以便更好地查看数据。

在 SQL 中，我们可以使用 `ORDER BY` 关键字来实现排序操作。`ORDER BY` 后面跟上需要排序的字段，可以选择升序（ASC）或降序（DESC）排列。

在排序的基础上，我们还可以根据多个字段的值进行排序。当第一个字段的值相同时，再按照第二个字段的值进行排序，以此类推。

示例语法如下：

```sql
order by 字段1 [升序/降序], 字段2 [升序/降序], ...
```

如：从名为 `student` 的数据表中选择出学生姓名（name）、年龄（age）和成绩（score），首先按照成绩从大到小排序，如果成绩相同，则按照年龄从小到大排序。

```sql
select name, age, score from student order by score desc, age asc;
```



## 截断和偏移

先用一个比喻来引出截断和偏移的概念。

假设你有一张待办事项清单，上面有很多任务。当你每次只想查看其中的几个任务时，会怎么办呢？

1）你可以使用手指挡住不需要看的部分（即截断）

2）根据任务的编号，直接翻到需要查看的位置（即偏移）

在 SQL 中，我们使用 `LIMIT` 关键字来实现数据的截断和偏移。

截断和偏移的一个典型的应用场景是分页，即网站内容很多时，用户可以根据页号每次只看部分数据。

**示例：**

假设有一张名为 `tasks` 的数据表，它存储了待办事项信息，包括任务名称（task_name）和截止日期（due_date）等。

数据表`tasks`：

| task_name | due_date   |
| --------- | ---------- |
| 完成报告  | 2023-08-05 |
| 预约医生  | 2023-08-08 |
| 购买礼物  | 2023-08-10 |
| 安排旅行  | 2023-08-15 |

现在，我们使用`LIMIT`关键字来进行分页查询：

```sql
-- LIMIT 后只跟一个整数，表示要截断的数据条数（一次获取几条）
select task_name, due_date from tasks limit 2;

-- LIMIT 后跟 2 个整数，依次表示从第几条数据开始、一次获取几条
select task_name, due_date from tasks limit 2, 2;
```

查询语句 1 结果，只获取了 2 条数据：

| task_name | due_date   |
| --------- | ---------- |
| 完成报告  | 2023-08-05 |
| 预约医生  | 2023-08-08 |

查询语句 2 结果，从下标为 2（第 3 条）数据的位置开始获取 2 条数据：

| task_name | due_date   |
| --------- | ---------- |
| 购买礼物  | 2023-08-10 |
| 安排旅行  | 2023-08-15 |

通过上述 SQL 查询语句，我们分别选取了待办事项表中的前两个任务和从第三个任务开始的两个任务，实现了数据的截断和偏移。

如：从名为 `student` 的数据表中选择学生姓名（name）和年龄（age），按照年龄从小到大排序，从第 2 条数据开始、截取 3 个学生的信息。

```sql
select name, age from student order by age asc limit 1, 3;
```



## 条件分支

条件分支 `case when` 是 SQL 中用于根据条件进行分支处理的语法。它类似于其他编程语言中的 if else 条件判断语句，允许我们根据不同的条件选择不同的结果返回。

使用 `case when` 可以在查询结果中根据特定的条件动态生成新的列或对现有的列进行转换。

**示例**

假设有一个学生表 `student`，包含以下字段：`name`（姓名）、`age`（年龄）。数据如下：

| name | age  |
| ---- | ---- |
| 小明 | 18   |
| 鸡哥 | 25   |
| 李华 | 30   |
| 王五 | 40   |

使用条件分支 `case when` ，根据 name 来判断学生是否会说 RAP，并起别名为 can_rap。

示例 SQL 如下：

```sql
SELECT
  name,
  CASE WHEN (name = '鸡哥') THEN '会' ELSE '不会' END AS can_rap
FROM
  student;
```

查询结果：

| name | can_rap |
| ---- | ------- |
| 小明 | 不会    |
| 鸡哥 | 会      |
| 李华 | 不会    |
| 王五 | 不会    |

`case when` 支持同时指定多个分支，示例语法如下：

```sql
CASE WHEN (条件1) THEN 结果1
	   WHEN (条件2) THEN 结果2
	   ...
	   ELSE 其他结果 END
```

如：有一个学生表 `student`，包含以下字段：`name`（姓名）、`age`（年龄）。请你编写一个 SQL 查询，将学生按照年龄划分为三个年龄等级（age_level）：60 岁以上为 "老同学"，20 岁以上（不包括 60 岁以上）为 "年轻"，20 岁以下为 "小同学"。

返回结果应包含学生的姓名（name）和年龄等级（age_level），并按姓名升序排序。

```sql
select name,CASE WHEN (age>60) THEN '老同学' WHEN (age>20) THEN '年轻' ELSE '小同学' END as age_level from student order by name asc
```



# 函数



## 时间函数

在 SQL 中，时间函数是用于处理日期和时间的特殊函数。它们允许我们在查询中操作和处理日期、时间、日期时间数据，从而使得在数据库中进行时间相关的操作变得更加方便和灵活。

常用的时间函数有：

- DATE：获取当前日期
- DATETIME：获取当前日期时间
- TIME：获取当前时间

另外使用时间函数获取当前日期、当前日期时间和当前时间：

```sql
-- 获取当前日期
SELECT DATE() AS current_date;

-- 获取当前日期时间
SELECT DATETIME() AS current_datetime;

-- 获取当前时间
SELECT TIME() AS current_time;
```

如：有一个学生表 `student`，包含以下字段：`name`（姓名）、`age`（年龄）。

请你编写一个 SQL 查询，展示所有学生的姓名（name）和当前日期（列名为 "当前日期"）。

```sql
select name, date() as 当前日期 from student
```



## 字符串处理

在 SQL 中，字符串处理是一类用于处理文本数据的函数。它们允许我们对字符串进行各种操作，如转换大小写、计算字符串长度以及搜索和替换子字符串等。字符串处理函数可以帮助我们在数据库中对字符串进行加工和转换，从而满足不同的需求。

1）使用字符串处理函数 `UPPER` 将姓名转换为大写：

```sql
-- 将姓名转换为大写
SELECT name, UPPER(name) AS upper_name
FROM employees;
```

2）使用字符串处理函数 `LENGTH` 计算姓名长度：

```sql
-- 计算姓名长度
SELECT name, LENGTH(name) AS name_length
FROM employees;
```

3）使用字符串处理函数 `LOWER` 将姓名转换为小写：

```sql
-- 将姓名转换为小写并进行条件筛选
SELECT name, LOWER(name) AS lower_name
FROM employees;
```

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）。请你编写一个 SQL 查询，筛选出姓名为 '热dog' 的学生，展示其学号（id）、姓名（name）及其大写姓名（upper_name）。

```sql
SELECT id, name, UPPER(name) AS upper_name FROM student WHERE name = '热dog';
```



## 聚合函数

在 SQL 中，聚合函数是一类用于对数据集进行 **汇总计算** 的特殊函数。它们可以对一组数据执行诸如计数、求和、平均值、最大值和最小值等操作。聚合函数通常在 SELECT 语句中配合 GROUP BY 子句使用，用于对分组后的数据进行汇总分析。

常见的聚合函数包括：

- COUNT：计算指定列的行数或非空值的数量。
- SUM：计算指定列的数值之和。
- AVG：计算指定列的数值平均值。
- MAX：找出指定列的最大值。
- MIN：找出指定列的最小值。

1）使用聚合函数 `COUNT` 计算订单表中的总订单数：

```sql
SELECT COUNT(*) AS order_num FROM orders;
```

2）使用聚合函数 `COUNT(DISTINCT 列名)` 计算订单表中不同客户的数量：

```sql
SELECT COUNT(DISTINCT customer_id) AS customer_num FROM orders;
```

3）使用聚合函数 `SUM` 计算总订单金额：

```sql
SELECT SUM(amount) AS total_amount FROM orders;
```

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，汇总学生表中所有学生的总成绩（total_score）、平均成绩（avg_score）、最高成绩（max_score）和最低成绩（min_score）。

```sql
SELECT SUM(score) AS total_score, AVG(score) AS avg_score, MAX(score) AS max_score, MIN(score) AS min_score FROM student;
```



# 分组聚合



## 单字段分组

在 SQL 中，分组聚合是一种对数据进行分类并对每个分类进行聚合计算的操作。它允许我们按照指定的列或字段对数据进行分组，然后对每个分组应用聚合函数，如 COUNT、SUM、AVG 等，以获得分组后的汇总结果。

举个例子：某个学校可以按照班级将学生分组，并对每个班级进行统计。查看每个班级有多少学生、每个班级的平均成绩。这样我们就能够对学校各班的学生情况有一个整体的了解，而不是单纯看个别学生的信息。

在 SQL 中，通常使用 `GROUP BY` 关键字对数据进行分组。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中每个班级的平均成绩（avg_score）。

```sql
SELECT class_id, AVG(score) AS avg_score FROM student GROUP BY class_id;
```



## 多字段分组

有时，单字段分组并不能满足我们的需求，比如想统计学校里每个班级每次考试的学生情况，这时就可以使用多字段分组。

多字段分组和单字段分组的实现方式几乎一致，使用 `GROUP BY` 语法即可。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`exam_num`（考试次数）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中每个班级每次考试的总学生人数（total_num）。

```sql
SELECT class_id, exam_num, COUNT(*) AS total_num FROM student GROUP BY class_id, exam_num;
```



## having 子句

在 SQL 中，HAVING 子句用于在分组聚合后对分组进行过滤。它允许我们对分组后的结果进行条件筛选，只保留满足特定条件的分组。

HAVING 子句与条件查询 WHERE 子句的区别在于，WHERE 子句用于在 **分组之前** 进行过滤，而 HAVING 子句用于在 **分组之后** 进行过滤。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中班级的总成绩超过 150 分的班级编号（class_id）和总成绩（total_score）。

```sql
SELECT class_id, SUM(score) AS total_score FROM student GROUP BY class_id HAVING SUM(score) > 150;
```

