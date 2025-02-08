import type { NavItem } from 'vuepress-theme-plume'

export const zhNavbar = [
    { text: '首页', link: '/', icon: 'material-symbols:home-outline' },
    { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline' },
    {
        text: 'RPC框架',
        icon: 'material-symbols:event-note-outline-sharp',
        link: '/myRpc/README.md',
        activeMatch: '^/myRpc/'
    },
    
    {
        text: '八股文',
        icon: 'material-symbols:event-note-outline',
        link: '/interview/README.md',
        activeMatch: '^/interview/',
    },
    {
        text: '春招',
        icon: 'material-symbols:event-note-outline',
        link: '/study/README.md',
        activeMatch: '^/study/',
    }
] as NavItem[]