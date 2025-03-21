import { definePlumeNotesConfig } from 'vuepress-theme-plume'

export const zhNotes = definePlumeNotesConfig({
    dir: 'notes',
    link: '/',
    notes: [
        {
            dir: 'interview',
            link: '/interview/',
            sidebar: [
                { text: 'Mysql', dir: 'Mysql', collapsed: true, items: ['MySQL.md', 'MySQL基础、锁、事务、分库分表、优化', 'MySQL索引连环18问！'] },
                { text: 'java基础', dir: 'JavaBase', collapsed: true, items: ['baseup', 'basedown'] },
                { text: 'Redis', dir: 'Redis', collapsed: true, items: ['Redis'] },
                { text: '操作系统', dir: 'OperationSystem',  collapsed: true, items: ['tcrooxrz'] },
                { text: '分布式', dir: 'Distributed', collapsed: true, items: ['5ujg0j97'] },
                { text: 'Spring', dir: 'Spring', collapsed: true, items: ['Spring'] },
                { text: 'MQ', dir: 'MQ', collapsed: true, items: ['Kafka面试题', 'MQ面试题'] },
                { text: 'Mybatis', dir: 'Mybatis', collapsed: true, items: ['Mybatis'] },
                { text: '计算机网络', dir: 'Internet', collapsed: true, items: ['计算机网络上', '计算机网络下'] },
                { text: 'java并发', dir: 'JavaConcurrent', collapsed: true, items: ['进程通信和线程通信的方式', '如何设计线程池', 'AQS', 'Java多线程面试-基础', 'Java多线程总结版'] },
                { text: '集合', dir: 'JavaCollection', collapsed: true, items: ['ConcurrentHashMap', 'HashMap', 'HashMap的线程安全问题', 'Java集合高频面试题'] },
                { text: 'Duubo', dir: 'Dubbo', collapsed: true, items: ['Dubbo面试题'] },
                { text: 'JVM', dir: 'JVM', collapsed: true, items: ['JVM'] },
            ]
        },
        {
            dir: 'myRpc',
            link: '/myRpc/',
            sidebar:[
                {
                    text: 'Rpc框架开发',
                    collapsed: false,
                    items: [
                        '1、简易版RPC实现','2、全局配置加载','3、接口Mock',
                        '4、序列化器与SPI机制','14、面试题解'
                    ]
                }
            ]
        },
        {
            dir: 'study',
            link: '/study/',
            sidebar:[
                {
                    text: '春招复习',
                    dir: 'recite',
                    collapsed: false,
                    items: [
                        '001、什么是不可变类','002、什么是 JAVA 的多态特性','003、一条 sql 语句在 MYSQL 的执行过程',
                        '004、MYSQL的存储引擎有哪些，有什么区别','005、MYSQL 的索引类型','006、数据库的脏读、不可重复读和幻读分别是什么？',
                        '007、数据库的三大范式','008、8 种 SQL 优化方式','009、什么是 Spring IOC',
                        '010、Spring 如何处理循环依赖？','011、MYSQL 的日志类型有哪些？','012、String、StringBuffer、StringBuilder的区别',
                        '013、常见排序算法及其时间、空间复杂度','014、java 中的垃圾回收算法','015、实现单例模式'
                    ]
                },
                {
                    text: '项目',
                    dir: 'project',
                    collapsed: false,
                    items: [
                        '01','02','03','04','05','06','07','08'
                    ]
                }
            ]
        }
    ],
})