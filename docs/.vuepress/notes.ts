import { definePlumeNotesConfig } from 'vuepress-theme-plume'

export const zhNotes = definePlumeNotesConfig({
    dir: 'notes',
    link: '/',
    notes: [
        {
            dir: 'interview',
            link: '/interview/',
            sidebar: [
                { text: 'Mysql', dir: 'Mysql', collapsed: false, items: ['MySQL.md', 'MySQL基础、锁、事务、分库分表、优化', 'MySQL索引连环18问！'] },
                { text: 'java基础', dir: 'JavaBase', collapsed: false, items: ['baseup', 'basedown'] },
                { text: 'Redis', dir: 'Redis', collapsed: false, items: ['Redis'] },
                { text: '操作系统', dir: 'OperationSystem',  collapsed: false, items: ['tcrooxrz'] },
                { text: '分布式', dir: 'Distributed', collapsed: false, items: ['5ujg0j97'] },
                { text: 'Spring', dir: 'Spring', collapsed: false, items: ['Spring'] },
                { text: 'MQ', dir: 'MQ', collapsed: false, items: ['Kafka面试题', 'MQ面试题'] },
                { text: 'Mybatis', dir: 'Mybatis', collapsed: false, items: ['Mybatis'] },
                { text: '计算机网络', dir: 'Internet', collapsed: false, items: ['计算机网络上', '计算机网络下'] },
                { text: 'java并发', dir: 'JavaConcurrent', collapsed: false, items: ['进程通信和线程通信的方式', '如何设计线程池', 'AQS', 'Java多线程面试-基础', 'Java多线程总结版'] },
                { text: '集合', dir: 'JavaCollection', collapsed: false, items: ['ConcurrentHashMap', 'HashMap', 'HashMap的线程安全问题', 'Java集合高频面试题'] },
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
        }
    ],
})