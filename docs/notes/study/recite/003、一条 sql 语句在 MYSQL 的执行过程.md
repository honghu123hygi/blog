---
title: 003、一条 sql 语句在 MYSQL 的执行过程
author:
createTime: 2025/02/08 22:04:25
permalink: /study/029ix21u/
---

1、通过连接器检验权限（验证账号密码，获取账号权限），连接成功后如果没有后续操作，到达一定小时后自动断开连接，一般是8小时；

2、通过分析器进行语法分析和语法分析，确保字段名或表名不会出现错误；

3、使用优化器选择合适的索引和表连接顺序，选择执行一个最佳的执行方案；

4、最后到达执行器，执行器会先判断用户是否具有查询该表的权限，无则返回错误信息，有则根据表的存储引擎提供的接口进行数据查询，如重复遍历表的行数据，直到遍历完整个表将符合条件的数据返回给客户端。