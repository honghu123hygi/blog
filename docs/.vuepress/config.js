// import * as path from 'node:path'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { theme } from './theme.js'
export default defineUserConfig({
    // 请不要忘记设置默认语言
    base: '/',
    lang: 'zh-CN',
    title: '博客',
    description: '欢迎来到博客',
    
    bundler: viteBundler(),
    theme,
})