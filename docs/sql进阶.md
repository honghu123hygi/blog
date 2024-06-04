---
title: sql进阶
author:
createTime: 2024/06/04 11:32:19
permalink: /article/9ytk6ejg/
---
# 进阶



## cross join

`CROSS JOIN` 是一种简单的关联查询，不需要任何条件来匹配行，它直接将左表的 **每一行** 与右表的 **每一行** 进行组合，返回的结果是两个表的笛卡尔积。

如：有一个学生表 `student` ，包含以下字段：id（学号）、name（姓名）、age（年龄）、class_id（班级编号）；还有一个班级表 `class` ，包含以下字段：id（班级编号）、name（班级名称）。

请你编写一个 SQL 查询，将学生表和班级表的所有行组合在一起，并返回学生姓名（student_name）、学生年龄（student_age）、班级编号（class_id）以及班级名称（class_name）。

```sql
select s.name student_name, s.age student_age, s.class_id class_id, c.name class_name from student s cross join class c;
```



## inner join

在 SQL 中，INNER JOIN 是一种常见的关联查询方式，它根据两个表之间的关联条件，将满足条件的行组合在一起。

注意，INNER JOIN 只返回两个表中满足关联条件的交集部分，即在两个表中都存在的匹配行。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）、`level`（班级级别）。

请你编写一个 SQL 查询，根据学生表和班级表之间的班级编号进行匹配，返回学生姓名（`student_name`）、学生年龄（`student_age`）、班级编号（`class_id`）、班级名称（`class_name`）、班级级别（`class_level`）。

```sql
select s.name student_name, s.age student_age, s.class_id class_id, c.name class_name, c.level class_level from student s join class c on s.class_id = c.id;
```



## outer join

OUTER JOIN 是一种关联查询方式，它根据指定的关联条件，将两个表中满足条件的行组合在一起，并 **包含没有匹配的行** 。

在 OUTER JOIN 中，包括 LEFT OUTER JOIN 和 RIGHT OUTER JOIN 两种类型，它们分别表示查询左表和右表的所有行（即使没有被匹配），再加上满足条件的交集部分。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）、`level`（班级级别）。

请你编写一个 SQL 查询，根据学生表和班级表之间的班级编号进行匹配，返回学生姓名（`student_name`）、学生年龄（`student_age`）、班级编号（`class_id`）、班级名称（`class_name`）、班级级别（`class_level`），要求必须返回所有学生的信息（即使对应的班级编号不存在）。

```sql
select s.name student_name, s.age student_age, s.class_id class_id, c.name class_name, c.level class_level from student s left join class c on s.class_id = c.id;
```



##  子查询

子查询是指在一个查询语句内部 **嵌套** 另一个完整的查询语句，内层查询被称为子查询。子查询可以用于获取更复杂的查询结果或者用于过滤数据。

当执行包含子查询的查询语句时，数据库引擎会首先执行子查询，然后将其结果作为条件或数据源来执行外层查询。

如：

有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）。

请你编写一个 SQL 查询，使用子查询的方式来获取存在对应班级的学生的所有数据，返回学生姓名（`name`）、分数（`score`）、班级编号（`class_id`）字段。

```sql
select name, score, class_id from student where class_id in (select distinct id from class);
```



## exists

子查询是一种强大的查询工具，它可以嵌套在主查询中，帮助我们进行更复杂的条件过滤和数据检索。

其中，子查询中的一种特殊类型是 "exists" 子查询，用于检查主查询的结果集是否存在满足条件的记录，它返回布尔值（True 或 False），而不返回实际的数据。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）。

请你编写一个 SQL 查询，使用 exists 子查询的方式来获取 **不存在对应班级的** 学生的所有数据，返回学生姓名（`name`）、年龄（`age`）、班级编号（`class_id`）字段。

```sql
select name, age, class_id from student where not exists (select class_id from class where class.id = student.class_id);
```



## 组合查询

在 SQL 中，组合查询是一种将多个 SELECT 查询结果合并在一起的查询操作。

包括两种常见的组合查询操作：UNION 和 UNION ALL。

1. UNION 操作：它用于将两个或多个查询的结果集合并， **并去除重复的行** 。即如果两个查询的结果有相同的行，则只保留一行。
2. UNION ALL 操作：它也用于将两个或多个查询的结果集合并， **但不去除重复的行** 。即如果两个查询的结果有相同的行，则全部保留。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个新学生表 `student_new`，包含的字段和学生表完全一致。

请编写一条 SQL 语句，获取所有学生表和新学生表的学生姓名（`name`）、年龄（`age`）、分数（`score`）、班级编号（`class_id`）字段，要求保留重复的学生记录。

```sql
select name, age, score, class_id from student union all select name, age, score, class_id from student_new;
```



## 开窗函数 - sum over

在 SQL 中，开窗函数是一种强大的查询工具，它允许我们在查询中进行对分组数据进行计算、 **同时保留原始行的详细信息** 。

开窗函数可以与聚合函数（如 SUM、AVG、COUNT 等）结合使用，但与普通聚合函数不同，开窗函数不会导致结果集的行数减少。

打个比方，可以将开窗函数想象成一种 "透视镜"，它能够将我们聚焦在某个特定的分组，同时还能看到整体的全景。

本节我们先讲第一个开窗函数：sum over。

该函数用法为：

```sql
SUM(计算字段名) OVER (PARTITION BY 分组字段名)
```

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并计算每个班级的学生平均分（class_avg_score）。

```sql
SELECT id, name, age, score, class_id, AVG(score) OVER (PARTITION BY class_id) AS class_avg_score FROM student;
```



## 开窗函数 - sum over order by

我们讲到了 sum over 开窗函数，并且用它实现了分组统计。

本节教程我们将学习 sum over 函数的另一种用法：sum over order by，可以实现同组内数据的 **累加求和** 。

示例用法如下：

```sql
SUM(计算字段名) OVER (PARTITION BY 分组字段名 ORDER BY 排序字段 排序规则)
```

举一个应用场景：老师在每个班级里依次点名，每点到一个学生，老师都会记录当前已点到的学生们的分数总和。

如：一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数升序的方式累加计算每个班级的学生总分（class_sum_score）。

```sql
SELECT id, name, age, score, class_id, SUM(score) OVER (PARTITION BY class_id ORDER BY score ASC) AS class_sum_score FROM student;
```



## 开窗函数 - rank

Rank 开窗函数是 SQL 中一种用于对查询结果集中的行进行 **排名** 的开窗函数。它可以根据指定的列或表达式对结果集中的行进行排序，并为每一行分配一个排名。在排名过程中，相同的值将被赋予相同的排名，而不同的值将被赋予不同的排名。

> 当存在并列（相同排序值）时，Rank 会跳过后续排名，并保留相同的排名。

Rank 开窗函数的常见用法是在查询结果中查找前几名（Top N）或排名最高的行。

Rank 开窗函数的语法如下：

```sql
RANK() OVER (
  PARTITION BY 列名1, 列名2, ... -- 可选，用于指定分组列
  ORDER BY 列名3 [ASC|DESC], 列名4 [ASC|DESC], ... -- 用于指定排序列及排序方式
) AS rank_column
```

其中，`PARTITION BY` 子句可选，用于指定分组列，将结果集按照指定列进行分组；`ORDER BY` 子句用于指定排序列及排序方式，决定了计算 Rank 时的排序规则。`AS rank_column` 用于指定生成的 Rank 排名列的别名。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式计算每个班级内的学生的分数排名（ranking）。

```sql
SELECT id, name, age, score, class_id, RANK() OVER (PARTITION BY class_id ORDER BY score DESC) AS ranking FROM student;
```



## 开窗函数 - row_number

Row_Number 开窗函数是 SQL 中的一种用于为查询结果集中的每一行 **分配唯一连续排名** 的开窗函数。

它与之前讲到的 Rank 函数，Row_Number 函数为每一行都分配一个唯一的整数值，不管是否存在并列（相同排序值）的情况。每一行都有一个唯一的行号，从 1 开始连续递增。

Row_Number 开窗函数的语法如下（几乎和 Rank 函数一模一样）：

```sql
ROW_NUMBER() OVER (
  PARTITION BY column1, column2, ... -- 可选，用于指定分组列
  ORDER BY column3 [ASC|DESC], column4 [ASC|DESC], ... -- 用于指定排序列及排序方式
) AS row_number_column
```

其中，`PARTITION BY`子句可选，用于指定分组列，将结果集按照指定列进行分组。`ORDER BY` 子句用于指定排序列及排序方式，决定了计算 Row_Number 时的排序规则。`AS row_number_column` 用于指定生成的行号列的别名。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式给每个班级内的学生分配一个编号（row_number）。

```sql
SELECT id, name, age, score, class_id, ROW_NUMBER() OVER (PARTITION BY class_id ORDER BY score DESC) AS row_number FROM student;
```



## 开窗函数 - lag / lead

开窗函数 Lag 和 Lead 的作用是获取在当前行之前或之后的行的值，这两个函数通常在需要比较相邻行数据或进行时间序列分析时非常有用。

1）Lag 函数

Lag 函数用于获取 **当前行之前** 的某一列的值。它可以帮助我们查看上一行的数据。

Lag 函数的语法如下：

```sql
LAG(column_name, offset, default_value) OVER (PARTITION BY partition_column ORDER BY sort_column)
```

参数解释：

- `column_name`：要获取值的列名。
- `offset`：表示要向上偏移的行数。例如，offset为1表示获取上一行的值，offset为2表示获取上两行的值，以此类推。
- `default_value`：可选参数，用于指定当没有前一行时的默认值。
- `PARTITION BY`和`ORDER BY`子句可选，用于分组和排序数据。

2）Lead 函数

Lead 函数用于获取 **当前行之后** 的某一列的值。它可以帮助我们查看下一行的数据。

Lead 函数的语法如下：

```sql
LEAD(column_name, offset, default_value) OVER (PARTITION BY partition_column ORDER BY sort_column)
```

参数解释：

- `column_name`：要获取值的列名。
- `offset`：表示要向下偏移的行数。例如，offset为1表示获取下一行的值，offset为2表示获取下两行的值，以此类推。
- `default_value`：可选参数，用于指定当没有后一行时的默认值。
- `PARTITION BY`和`ORDER BY`子句可选，用于分组和排序数据。

**示例**

以下是一个示例，假设我们有一个学生成绩表`scores`，其中包含学生的成绩和考试日期：

| student_id | exam_date  | score |
| ---------- | ---------- | ----- |
| 101        | 2023-01-01 | 85    |
| 101        | 2023-01-05 | 78    |
| 101        | 2023-01-10 | 92    |
| 101        | 2023-01-15 | 80    |

现在我们想要查询每个学生的考试日期和上一次考试的成绩，以及下一次考试的成绩，示例 SQL 如下：

```sql
SELECT 
    student_id,
    exam_date,
    score,
    LAG(score, 1, NULL) OVER (PARTITION BY student_id ORDER BY exam_date) AS previous_score,
    LEAD(score, 1, NULL) OVER (PARTITION BY student_id ORDER BY exam_date) AS next_score
FROM
    scores;
```

结果将是：

| student_id | exam_date  | score | previous_score | next_score |
| ---------- | ---------- | ----- | -------------- | ---------- |
| 101        | 2023-01-01 | 85    | NULL           | 78         |
| 101        | 2023-01-05 | 78    | 85             | 92         |
| 101        | 2023-01-10 | 92    | 78             | 80         |
| 101        | 2023-01-15 | 80    | 92             | NULL       |

在上面的示例中，我们使用 Lag 函数获取每个学生的上一次考试成绩（previous_score），使用 Lead 函数获取每个学生的下一次考试成绩（next_score）。如果没有上一次或下一次考试，对应的列将显示为 NULL。

如：有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式获取每个班级内的学生的前一名学生姓名（prev_name）、后一名学生姓名（next_name）。

```sql
SELECT id, name, age, score, class_id, LAG(name) over (PARTITION BY class_id ORDER BY score DESC) as prev_name, LEAD(name) OVER (PARTITION BY class_id ORDER BY score DESC) AS next_name FROM student;
```

