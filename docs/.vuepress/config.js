// import * as path from 'node:path'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
// import { theme } from './theme.ts'
import themePlume from 'vuepress-theme-plume'
export default defineUserConfig({
    // 请不要忘记设置默认语言
    base: './blog/',
    lang: 'zh-CN',
    title: '博客',
    description: '欢迎来到博客',
    theme: themePlume({
        navbar: [
            { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
            { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline' },
            {
                text: 'RPC框架',
                icon: 'material-symbols:event-note-outline-sharp',
                items: [
                    {
                        text: "初始",
                        link: '/myRpc/EasyRpc/'
                    },
                    {
                        text: "配置",
                        link: '/myRpc/Properties/'
                    },
                ]
            },

            {
                text: '八股文',
                icon: 'material-symbols:event-note-outline',
                items: [
                    {
                        text: 'mysql',
                        link: '/interview/Mysql/MySQL/'
                    }
                ]
            }
        ],
        notes: {
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
                        { text: '操作系统', dir: 'OperationSystem', collapsed: false, items: ['tcrooxrz'] },
                        { text: 'Distributed', dir: 'Distributed', collapsed: false, items: ['5ujg0j97'] },
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
                    sidebar: [
                        {
                            text: 'Rpc框架开发',
                            collapsed: false,
                            items: [
                                '1、简易版RPC实现', '2、全局配置加载', '3、接口Mock',
                                '4、序列化器与SPI机制', '14、面试题解'
                            ]
                        }
                    ]
                }
            ],
        },
    }),
    // source: path.resolve(__dirname, '../'),
    bundler: viteBundler(),
    // theme,
})