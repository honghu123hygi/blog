import themePlume from 'vuepress-theme-plume'
import type { Theme } from 'vuepress'
import { zhNotes } from './notes.js'
import { zhNavbar } from './navbar.js'
export const theme: Theme = themePlume({
    locales: {
        '/': {
          notes: zhNotes,
          navbar: zhNavbar,
        },
    },
})