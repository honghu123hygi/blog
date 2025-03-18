import{_ as r,c as e,a as i,o as n}from"./app-CHQIiBnY.js";const o={};function s(l,t){return n(),e("div",null,t[0]||(t[0]=[i("<p>三者都是 Java 中处理字符串中的类，区别主要如下：</p><ol><li><p><strong>String</strong></p><ul><li><strong>不可变</strong>：String 是一个不可变类，一经创建就不能再发生改变，因此每次对 String 对象进行修改（如拼接、裁切等），都会创建新的对象；</li><li><strong>适合场景</strong>：字符串内容不会频繁改变的场景，如少量字符串拼接或字符串常量。</li></ul></li><li><p><strong>StringBuffer</strong></p><ul><li><p><strong>可变</strong>：可以进行字符串的追加、修改、插入等操作；</p></li><li><p><strong>线程安全</strong>：内部使用了 synchronized 关键字来保证多线程环境下的安全性；</p></li><li><p><strong>适合场景</strong>：多线程环境中需要频繁修改字符串的场景。</p></li></ul></li><li><p><strong>StringBuilder</strong></p><ul><li><p><strong>可变</strong>：可以进行字符串的追加、修改、插入等操作；</p></li><li><p><strong>线程不安全</strong>：线程不安全，但是性能比 <strong>StringBuffer</strong> 高；</p></li><li><p><strong>适合场景</strong>：单线程环境中需要频繁修改字符串的场景。</p></li></ul></li></ol>",2)]))}const g=r(o,[["render",s],["__file","index.html.vue"]]),c=JSON.parse(`{"path":"/study/pyte15fj/","title":"012、String、StringBuffer、StringBuilder的区别","lang":"zh-CN","frontmatter":{"title":"012、String、StringBuffer、StringBuilder的区别","author":null,"createTime":"2025/03/05 22:40:26","permalink":"/study/pyte15fj/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[],"readingTime":{"minutes":0.83,"words":248},"git":{"updatedTime":1741185885000,"contributors":[{"name":"洪子丹","email":"302778213@qq.com","commits":1}]},"filePathRelative":"notes/study/recite/012、String、StringBuffer、StringBuilder的区别.md"}`);export{g as comp,c as data};
