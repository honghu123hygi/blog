import{_ as t,o as e,c as i,a as r}from"./app-CagWOOGS.js";const n={};function o(s,l){return e(),i("div",null,l[0]||(l[0]=[r('<h1 id="常见排序算法的复杂度" tabindex="-1"><a class="header-anchor" href="#常见排序算法的复杂度"><span>常见排序算法的复杂度</span></a></h1><p>常见的排序算法包括冒泡排序（Bubble Sort）、选择排序（Selection Sort）、插入排序（Insertion Sort）、希尔排序（Shell Sort）、归并排序（Merge Sort）、快速排序（Quick Sort）、堆排序（Heap Sort）和计数排序（Counting Sort）、桶排序（Bucket Sort）、基数排序（Radix Sort）等。下面列出了这些排序算法的时间复杂度和空间复杂度（平均/最好/最坏情况）：</p><h3 id="_1-冒泡排序-bubble-sort" tabindex="-1"><a class="header-anchor" href="#_1-冒泡排序-bubble-sort"><span>1. 冒泡排序（Bubble Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均/最坏情况：O(n^2)</li><li>最好情况：O(n)（当输入序列已经是排序好的）</li></ul></li><li><strong>空间复杂度</strong>：O(1)（原地排序）</li></ul><h3 id="_2-选择排序-selection-sort" tabindex="-1"><a class="header-anchor" href="#_2-选择排序-selection-sort"><span>2. 选择排序（Selection Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均/最好/最坏情况：O(n^2)</li></ul></li><li><strong>空间复杂度</strong>：O(1)（原地排序）</li></ul><h3 id="_3-插入排序-insertion-sort" tabindex="-1"><a class="header-anchor" href="#_3-插入排序-insertion-sort"><span>3. 插入排序（Insertion Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均/最好情况：O(n^2)</li><li>最坏情况：O(n^2)</li><li>对于部分已排序的数据集，时间复杂度可以优化到O(n)</li></ul></li><li><strong>空间复杂度</strong>：O(1)（原地排序）</li></ul><h3 id="_4-希尔排序-shell-sort" tabindex="-1"><a class="header-anchor" href="#_4-希尔排序-shell-sort"><span>4. 希尔排序（Shell Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均情况：依赖于增量序列，难以准确计算，但通常比O(n^2)好</li><li>最好情况：O(nlogn)</li><li>最坏情况：O(n^s)对于某个s &gt; 1，取决于增量序列</li></ul></li><li><strong>空间复杂度</strong>：O(1)（原地排序）</li></ul><h3 id="_5-归并排序-merge-sort" tabindex="-1"><a class="header-anchor" href="#_5-归并排序-merge-sort"><span>5. 归并排序（Merge Sort）</span></a></h3><ul><li><strong>时间复杂度：</strong><ul><li>平均/最好/最坏情况：O(nlogn)</li></ul></li><li><strong>空间复杂度</strong>：O(n)（需要额外的存储空间用于合并）</li></ul><h3 id="_6-快速排序-quick-sort" tabindex="-1"><a class="header-anchor" href="#_6-快速排序-quick-sort"><span>6. 快速排序（Quick Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均情况：O(nlogn)</li><li>最好情况：O(nlogn)</li><li>最坏情况：O(n^2)（当分区总是发生在最小或最大元素时）</li></ul></li><li><strong>空间复杂度</strong>： <ul><li>平均情况：O(logn)（递归栈空间）</li><li>最坏情况：O(n)（递归栈空间）</li></ul></li></ul><h3 id="_7-堆排序-heap-sort" tabindex="-1"><a class="header-anchor" href="#_7-堆排序-heap-sort"><span>7. 堆排序（Heap Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均/最好/最坏情况：O(nlogn)</li></ul></li><li><strong>空间复杂度</strong>：O(1)（原地排序，除了几个临时变量外）</li></ul><h3 id="_8-计数排序-counting-sort" tabindex="-1"><a class="header-anchor" href="#_8-计数排序-counting-sort"><span>8. 计数排序（Counting Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>：O(n+k)（k是输入的最大值）</li><li><strong>空间复杂度</strong>：O(k)</li></ul><h3 id="_9-桶排序-bucket-sort" tabindex="-1"><a class="header-anchor" href="#_9-桶排序-bucket-sort"><span>9. 桶排序（Bucket Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>： <ul><li>平均情况：O(n+k)（k是桶的数量）</li><li>最坏情况：O(n^2)（如果桶内的排序非常低效）</li></ul></li><li><strong>空间复杂度</strong>：O(n+k)</li></ul><h3 id="_10-基数排序-radix-sort" tabindex="-1"><a class="header-anchor" href="#_10-基数排序-radix-sort"><span>10. 基数排序（Radix Sort）</span></a></h3><ul><li><strong>时间复杂度</strong>：O(d*(n+k))，其中d是位数，k是基数</li><li><strong>空间复杂度</strong>：O(n+k)</li></ul><p>这些排序算法各有优缺点，适用于不同的数据场景和需求。在实际应用中，需要根据具体情况选择合适的排序算法。</p>',23)]))}const c=t(n,[["render",o],["__file","index.html.vue"]]),u=JSON.parse(`{"path":"/article/tfs15kgd/","title":"常见排序算法的复杂度","lang":"zh-CN","frontmatter":{"title":"常见排序算法的复杂度","author":null,"createTime":"2024/07/12 21:09:53","permalink":"/article/tfs15kgd/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[{"level":3,"title":"1. 冒泡排序（Bubble Sort）","slug":"_1-冒泡排序-bubble-sort","link":"#_1-冒泡排序-bubble-sort","children":[]},{"level":3,"title":"2. 选择排序（Selection Sort）","slug":"_2-选择排序-selection-sort","link":"#_2-选择排序-selection-sort","children":[]},{"level":3,"title":"3. 插入排序（Insertion Sort）","slug":"_3-插入排序-insertion-sort","link":"#_3-插入排序-insertion-sort","children":[]},{"level":3,"title":"4. 希尔排序（Shell Sort）","slug":"_4-希尔排序-shell-sort","link":"#_4-希尔排序-shell-sort","children":[]},{"level":3,"title":"5. 归并排序（Merge Sort）","slug":"_5-归并排序-merge-sort","link":"#_5-归并排序-merge-sort","children":[]},{"level":3,"title":"6. 快速排序（Quick Sort）","slug":"_6-快速排序-quick-sort","link":"#_6-快速排序-quick-sort","children":[]},{"level":3,"title":"7. 堆排序（Heap Sort）","slug":"_7-堆排序-heap-sort","link":"#_7-堆排序-heap-sort","children":[]},{"level":3,"title":"8. 计数排序（Counting Sort）","slug":"_8-计数排序-counting-sort","link":"#_8-计数排序-counting-sort","children":[]},{"level":3,"title":"9. 桶排序（Bucket Sort）","slug":"_9-桶排序-bucket-sort","link":"#_9-桶排序-bucket-sort","children":[]},{"level":3,"title":"10. 基数排序（Radix Sort）","slug":"_10-基数排序-radix-sort","link":"#_10-基数排序-radix-sort","children":[]}],"isBlogPost":true,"readingTime":{"minutes":2.26,"words":677},"git":{"updatedTime":1720790359000,"contributors":[{"name":"hongzidan","email":"3027708213@qq.com","commits":3}]},"filePathRelative":"常见排序算法的复杂度.md","categoryList":[]}`);export{c as comp,u as data};