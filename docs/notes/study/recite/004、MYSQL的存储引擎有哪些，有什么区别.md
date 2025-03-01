---
title: 004、MYSQL的存储引擎有哪些，有什么区别
author:
createTime: 2025/02/08 22:04:25
permalink: /study/w5wklsvd/
---

MYSQL 的主要存储引擎包括：

**（1）InnoDB：**

- 支持事务、行级锁和外键；
- 提供高并发性能，适用高负载的 OLTD 应用；
- 数据以聚簇索引的方式存储，提高检索效率。

**（2）MyISAM**

- 不支持事务和外键，使用表级锁；
- 适合读取多、更新少的场景，如数据仓库；
- 具有较高的读性能和较快的表级锁定。

**（3）MEMORY**

- 数据存储在内存中，速度快，但重启服务器后数据会丢失；
- 使用于临时数据存储和缓存存储。