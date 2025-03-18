import{_ as e,c as i,a as o,o as n}from"./app-CHQIiBnY.js";const p={};function t(s,l){return n(),i("div",null,l[0]||(l[0]=[o('<h2 id="_1-进程和线程的区别" tabindex="-1"><a class="header-anchor" href="#_1-进程和线程的区别"><span>1. 进程和线程的区别？</span></a></h2><ul><li>调度：进程是资源管理的基本单位，线程是程序执行的基本单位。</li><li>切换：线程上下文切换比进程上下文切换要快得多。</li><li>拥有资源： 进程是拥有资源的一个独立单位，线程不拥有系统资源，但是可以访问隶属于进程的资源。</li><li>系统开销： 创建或撤销进程时，系统都要为之分配或回收系统资源，如内存空间，I/O设备等，OS所付出的开销显著大于在创建或撤销线程时的开销，进程切换的开销也远大于线程切换的开销。</li></ul><h2 id="_2-协程与线程的区别" tabindex="-1"><a class="header-anchor" href="#_2-协程与线程的区别"><span>2. 协程与线程的区别？</span></a></h2><ul><li>线程和进程都是同步机制，而协程是异步机制。</li><li>线程是抢占式，而协程是非抢占式的。需要用户释放使用权切换到其他协程，因此同一时间其实只有一个协程拥有运行权，相当于单线程的能力。</li><li>一个线程可以有多个协程，一个进程也可以有多个协程。</li><li>协程不被操作系统内核管理，而完全是由程序控制。线程是被分割的CPU资源，协程是组织好的代码流程，线程是协程的资源。但协程不会直接使用线程，协程直接利用的是执行器关联任意线程或线程池。</li><li>协程能保留上一次调用时的状态。</li></ul><h2 id="_3-并发和并行有什么区别" tabindex="-1"><a class="header-anchor" href="#_3-并发和并行有什么区别"><span>3. 并发和并行有什么区别？</span></a></h2><p>并发就是在一段时间内，多个任务都会被处理；但在某一时刻，只有一个任务在执行。单核处理器可以做到并发。比如有两个进程<code>A</code>和<code>B</code>，<code>A</code>运行一个时间片之后，切换到<code>B</code>，<code>B</code>运行一个时间片之后又切换到<code>A</code>。因为切换速度足够快，所以宏观上表现为在一段时间内能同时运行多个程序。</p><p>并行就是在同一时刻，有多个任务在执行。这个需要多核处理器才能完成，在微观上就能同时执行多条指令，不同的程序被放到不同的处理器上运行，这个是物理上的多个进程同时进行。</p><h2 id="_4-进程与线程的切换流程" tabindex="-1"><a class="header-anchor" href="#_4-进程与线程的切换流程"><span>4. 进程与线程的切换流程？</span></a></h2><p>进程切换分两步：</p><p>1、切换<strong>页表</strong>以使用新的地址空间，一旦去切换上下文，处理器中所有已经缓存的内存地址一瞬间都作废了。</p><p>2、切换内核栈和硬件上下文。</p><p>对于linux来说，线程和进程的最大区别就在于地址空间，对于线程切换，第1步是不需要做的，第2步是进程和线程切换都要做的。</p><p>因为每个进程都有自己的虚拟地址空间，而线程是共享所在进程的虚拟地址空间的，因此同一个进程中的线程进行线程切换时不涉及虚拟地址空间的转换。</p><h2 id="_5-为什么虚拟地址空间切换会比较耗时" tabindex="-1"><a class="header-anchor" href="#_5-为什么虚拟地址空间切换会比较耗时"><span>5. 为什么虚拟地址空间切换会比较耗时？</span></a></h2><p>进程都有自己的虚拟地址空间，把虚拟地址转换为物理地址需要查找页表，页表查找是一个很慢的过程，因此通常使用Cache来缓存常用的地址映射，这样可以加速页表查找，这个Cache就是TLB（translation Lookaside Buffer，TLB本质上就是一个Cache，是用来加速页表查找的）。</p><p>由于每个进程都有自己的虚拟地址空间，那么显然每个进程都有自己的页表，那么<strong>当进程切换后页表也要进行切换，页表切换后TLB就失效了</strong>，Cache失效导致命中率降低，那么虚拟地址转换为物理地址就会变慢，表现出来的就是程序运行会变慢，而线程切换则不会导致TLB失效，因为线程无需切换地址空间，因此我们通常说线程切换要比较进程切换块，原因就在这里。</p><h2 id="_6-进程间通信方式有哪些" tabindex="-1"><a class="header-anchor" href="#_6-进程间通信方式有哪些"><span>6. 进程间通信方式有哪些？</span></a></h2><ul><li><p>管道：管道这种通讯方式有两种限制，一是半双工的通信，数据只能单向流动，二是只能在具有亲缘关系的进程间使用。进程的亲缘关系通常是指父子进程关系。</p><p>管道可以分为两类：匿名管道和命名管道。匿名管道是单向的，只能在有亲缘关系的进程间通信；命名管道以磁盘文件的方式存在，可以实现本机任意两个进程通信。</p></li><li><p>信号 ： 信号是一种比较复杂的通信方式，信号可以在任何时候发给某一进程，而无需知道该进程的状态。</p><blockquote><p><strong>Linux系统中常用信号</strong>： （1）<strong>SIGHUP</strong>：用户从终端注销，所有已启动进程都将收到该进程。系统缺省状态下对该信号的处理是终止进程。</p><p>（2）<strong>SIGINT</strong>：程序终止信号。程序运行过程中，按<code>Ctrl+C</code>键将产生该信号。</p><p>（3）<strong>SIGQUIT</strong>：程序退出信号。程序运行过程中，按<code>Ctrl+\\\\</code>键将产生该信号。</p><p>（4）<strong>SIGBUS和SIGSEGV</strong>：进程访问非法地址。</p><p>（5）<strong>SIGFPE</strong>：运算中出现致命错误，如除零操作、数据溢出等。</p><p>（6）<strong>SIGKILL</strong>：用户终止进程执行信号。shell下执行<code>kill -9</code>发送该信号。</p><p>（7）<strong>SIGTERM</strong>：结束进程信号。shell下执行<code>kill 进程pid</code>发送该信号。</p><p>（8）<strong>SIGALRM</strong>：定时器信号。</p><p>（9）<strong>SIGCLD</strong>：子进程退出信号。如果其父进程没有忽略该信号也没有处理该信号，则子进程退出后将形成僵尸进程。</p></blockquote></li><li><p>信号量：信号量是一个<strong>计数器</strong>，可以用来控制多个进程对共享资源的访问。它常作为一种<strong>锁机制</strong>，防止某进程正在访问共享资源时，其他进程也访问该资源。因此，主要作为进程间以及同一进程内不同线程之间的同步手段。</p></li><li><p>消息队列：消息队列是消息的链接表，包括Posix消息队列和System V消息队列。有足够权限的进程可以向队列中添加消息，被赋予读权限的进程则可以读走队列中的消息。消息队列克服了信号承载信息量少，管道只能承载无格式字节流以及缓冲区大小受限等缺点。</p></li><li><p>共享内存：共享内存就是映射一段能被其他进程所访问的内存，这段共享内存由一个进程创建，但多个进程都可以访问。共享内存是最快的 IPC 方式，它是针对其他进程间通信方式运行效率低而专门设计的。它往往与其他通信机制，如信号量，配合使用，来实现进程间的同步和通信。</p></li><li><p>Socket：与其他通信机制不同的是，它可用于不同机器间的进程通信。</p></li></ul><p><strong>优缺点</strong>：</p><ul><li><p>管道：速度慢，容量有限；</p></li><li><p>Socket：任何进程间都能通讯，但速度慢；</p></li><li><p>消息队列：容量受到系统限制，且要注意第一次读的时候，要考虑上一次没有读完数据的问题；</p></li><li><p>信号量：不能传递复杂消息，只能用来同步；</p></li><li><p>共享内存区：能够很容易控制容量，速度快，但要保持同步，比如一个进程在写的时候，另一个进程要注意读写的问题，相当于线程中的线程安全，当然，共享内存区同样可以用作线程间通讯，不过没这个必要，线程间本来就已经共享了同一进程内的一块内存。</p></li></ul><h2 id="_7-进程间同步的方式有哪些" tabindex="-1"><a class="header-anchor" href="#_7-进程间同步的方式有哪些"><span>7. 进程间同步的方式有哪些？</span></a></h2><p>1、临界区：通过对多线程的串行化来访问公共资源或一段代码，速度快，适合控制数据访问。</p><p>优点：保证在某一时刻只有一个线程能访问数据的简便办法。</p><p>缺点：虽然临界区同步速度很快，但却只能用来同步本进程内的线程，而不可用来同步多个进程中的线程。</p><p>2、互斥量：为协调共同对一个共享资源的单独访问而设计的。互斥量跟临界区很相似，比临界区复杂，互斥对象只有一个，只有拥有互斥对象的线程才具有访问资源的权限。</p><p>优点：使用互斥不仅仅能够在同一应用程序不同线程中实现资源的安全共享，而且可以在不同应用程序的线程之间实现对资源的安全共享。</p><p>缺点：</p><ul><li><p>互斥量是可以命名的，也就是说它可以跨越进程使用，所以创建互斥量需要的资源更多，所以如果只为了在进程内部是用的话使用临界区会带来速度上的优势并能够减少资源占用量。</p></li><li><p>通过互斥量可以指定资源被独占的方式使用，但如果有下面一种情况通过互斥量就无法处理，比如现在一位用户购买了一份三个并发访问许可的数据库系统，可以根据用户购买的访问许可数量来决定有多少个线程/进程能同时进行数据库操作，这时候如果利用互斥量就没有办法完成这个要求，信号量对象可以说是一种资源计数器。</p></li></ul><p>3、信号量：为控制一个具有有限数量用户资源而设计。它允许多个线程在同一时刻访问同一资源，但是需要限制在同一时刻访问此资源的最大线程数目。互斥量是信号量的一种特殊情况，当信号量的最大资源数=1就是互斥量了。</p><p>优点：适用于对Socket（套接字）程序中线程的同步。</p><p>缺点:</p><ul><li><p>信号量机制必须有公共内存，不能用于分布式操作系统，这是它最大的弱点；</p></li><li><p>信号量机制功能强大，但使用时对信号量的操作分散， 而且难以控制，读写和维护都很困难，加重了程序员的编码负担；</p></li><li><p>核心操作P-V分散在各用户程序的代码中，不易控制和管理，一旦错误，后果严重，且不易发现和纠正。</p></li></ul><p>4、事件： 用来通知线程有一些事件已发生，从而启动后继任务的开始。</p><p>优点：事件对象通过通知操作的方式来保持线程的同步，并且可以实现不同进程中的线程同步操作。</p><h2 id="_8-线程同步的方式有哪些" tabindex="-1"><a class="header-anchor" href="#_8-线程同步的方式有哪些"><span>8. 线程同步的方式有哪些？</span></a></h2><p>1、临界区：当多个线程访问一个独占性共享资源时，可以使用临界区对象。拥有临界区的线程可以访问被保护起来的资源或代码段，其他线程若想访问，则被挂起，直到拥有临界区的线程放弃临界区为止，以此达到用原子方式操 作共享资源的目的。</p><p>2、事件：事件机制，则允许一个线程在处理完一个任务后，主动唤醒另外一个线程执行任务。</p><p>3、互斥量：互斥对象和临界区对象非常相似，只是其允许在进程间使用，而临界区只限制与同一进程的各个线程之间使用，但是更节省资源，更有效率。</p><p>4、信号量：当需要一个计数器来限制可以使用某共享资源的线程数目时，可以使用“信号量”对象。</p><p>区别：</p><ul><li><p>互斥量与临界区的作用非常相似，但互斥量是可以命名的，也就是说互斥量可以跨越进程使用，但创建互斥量需要的资源更多，所以如果只为了在进程内部是用的话使用临界区会带来速度上的优势并能够减少资源占用量 。因为互斥量是跨进程的互斥量一旦被创建，就可以通过名字打开它。</p></li><li><p>互斥量，信号量，事件都可以被跨越进程使用来进行同步数据操作。</p></li></ul><h2 id="_9-线程的分类" tabindex="-1"><a class="header-anchor" href="#_9-线程的分类"><span>9. 线程的分类？</span></a></h2><p>从线程的运行空间来说，分为用户级线程（user-level thread, ULT）和内核级线程（kernel-level, KLT）</p><p><strong>内核级线程</strong>：这类线程依赖于内核，又称为内核支持的线程或轻量级进程。无论是在用户程序中的线程还是系统进程中的线程，它们的创建、撤销和切换都由内核实现。比如英特尔i5-8250U是4核8线程，这里的线程就是内核级线程</p><p><strong>用户级线程</strong>：它仅存在于用户级中，这种线程是<strong>不依赖于操作系统核心</strong>的。应用进程利用<strong>线程库来完成其创建和管理</strong>，速度比较快，<strong>操作系统内核无法感知用户级线程的存在</strong>。</p><h2 id="_10-什么是临界区-如何解决冲突" tabindex="-1"><a class="header-anchor" href="#_10-什么是临界区-如何解决冲突"><span>10. 什么是临界区，如何解决冲突？</span></a></h2><p>每个进程中访问临界资源的那段程序称为临界区，<strong>一次仅允许一个进程使用的资源称为临界资源。</strong></p><p>解决冲突的办法：</p><ul><li>如果有若干进程要求进入空闲的临界区，<strong>一次仅允许一个进程进入</strong>，如已有进程进入自己的临界区，则其它所有试图进入临界区的进程必须等待；</li><li>进入临界区的进程要在<strong>有限时间内退出</strong>。</li><li>如果进程不能进入自己的临界区，则应<strong>让出CPU</strong>，避免进程出现“忙等”现象。</li></ul><h2 id="_11-什么是死锁-死锁产生的条件" tabindex="-1"><a class="header-anchor" href="#_11-什么是死锁-死锁产生的条件"><span>11. 什么是死锁？死锁产生的条件？</span></a></h2><p><strong>什么是死锁</strong>：</p><p>在两个或者多个并发进程中，如果每个进程持有某种资源而又等待其它进程释放它或它们现在保持着的资源，在未改变这种状态之前都不能向前推进，称这一组进程产生了死锁。通俗的讲就是两个或多个进程无限期的阻塞、相互等待的一种状态。</p><p><strong>死锁产生的四个必要条件</strong>：（有一个条件不成立，则不会产生死锁）</p><ul><li>互斥条件：一个资源一次只能被一个进程使用</li><li>请求与保持条件：一个进程因请求资源而阻塞时，对已获得资源保持不放</li><li>不剥夺条件：进程获得的资源，在未完全使用完之前，不能强行剥夺</li><li>循环等待条件：若干进程之间形成一种头尾相接的环形等待资源关系</li></ul><h3 id="如何处理死锁问题" tabindex="-1"><a class="header-anchor" href="#如何处理死锁问题"><span><strong>如何处理死锁问题</strong></span></a></h3><p>常用的处理死锁的方法有：死锁预防、死锁避免、死锁检测、死锁解除、鸵鸟策略。</p><p>**（1）死锁的预防：**基本思想就是确保死锁发生的四个必要条件中至少有一个不成立：</p><blockquote><ul><li>① 破除资源互斥条件</li><li>② 破除“请求与保持”条件：实行资源预分配策略，进程在运行之前，必须一次性获取所有的资源。缺点：在很多情况下，无法预知进程执行前所需的全部资源，因为进程是动态执行的，同时也会降低资源利用率，导致降低了进程的并发性。</li><li>③ 破除“不可剥夺”条件：允许进程强行从占有者那里夺取某些资源。当一个已经保持了某些不可被抢占资源的进程，提出新的资源请求而不能得到满足时，它必须释放已经保持的所有资源，待以后需要时再重新申请。这意味着进程已经占有的资源会被暂时被释放，或者说被抢占了。</li><li>④ 破除“循环等待”条件：实行资源有序分配策略，对所有资源排序编号，按照顺序获取资源，将紧缺的，稀少的采用较大的编号，在申请资源时必须按照编号的顺序进行，一个进程只有获得较小编号的进程才能申请较大编号的进程。</li></ul></blockquote><p><strong>（2）死锁避免：</strong></p><p>死锁预防通过约束资源请求，防止4个必要条件中至少一个的发生，可以通过直接或间接预防方法，但是都会导致低效的资源使用和低效的进程执行。而死锁避免则允许前三个必要条件，但是通过动态地检测资源分配状态，以确保循环等待条件不成立，从而确保系统处于安全状态。所谓安全状态是指：如果系统能按某个顺序为每个进程分配资源（不超过其最大值），那么系统状态是安全的，换句话说就是，如果存在一个安全序列，那么系统处于安全状态。银行家算法是经典的死锁避免的算法。</p><p><strong>（3）死锁检测：</strong></p><p>死锁预防策略是非常保守的，他们通过限制访问资源和在进程上强加约束来解决死锁的问题。死锁检测则是完全相反，它不限制资源访问或约束进程行为，只要有可能，被请求的资源就被授权给进程。但是操作系统会周期性地执行一个算法检测前面的循环等待的条件。死锁检测算法是通过资源分配图来检测是否存在环来实现，从一个节点出发进行深度优先搜索，对访问过的节点进行标记，如果访问了已经标记的节点，就表示有存在环，也就是检测到死锁的发生。</p><blockquote><ul><li>（1）如果进程-资源分配图中无环路，此时系统没有死锁。</li><li>（2）如果进程-资源分配图中有环路，且每个资源类中只有一个资源，则系统发生死锁。</li><li>（3）如果进程-资源分配图中有环路，且所涉及的资源类有多个资源，则不一定会发生死锁。</li></ul></blockquote><p><strong>（4）死锁解除：</strong></p><p>死锁解除的常用方法就是终止进程和资源抢占，回滚。所谓进程终止就是简单地终止一个或多个进程以打破循环等待，包括两种方式：终止所有死锁进程和一次只终止一个进程直到取消死锁循环为止；所谓资源抢占就是从一个或者多个死锁进程那里抢占一个或多个资源。</p><p><strong>（5）鸵鸟策略：</strong></p><p>把头埋在沙子里，假装根本没发生问题。因为解决死锁问题的代价很高，因此鸵鸟策略这种不采取任何措施的方案会获得更高的性能。当发生死锁时不会对用户造成多大影响，或发生死锁的概率很低，可以采用鸵鸟策略。大多数操作系统，包括 Unix，Linux 和 Windows，处理死锁问题的办法仅仅是忽略它。</p><h2 id="_12-进程调度策略有哪几种" tabindex="-1"><a class="header-anchor" href="#_12-进程调度策略有哪几种"><span>12. 进程调度策略有哪几种？</span></a></h2><ul><li><p><strong>先来先服务</strong>：非抢占式的调度算法，按照请求的顺序进行调度。有利于长作业，但不利于短作业，因为短作业必须一直等待前面的长作业执行完毕才能执行，而长作业又需要执行很长时间，造成了短作业等待时间过长。另外，对<code>I/O</code>密集型进程也不利，因为这种进程每次进行<code>I/O</code>操作之后又得重新排队。</p></li><li><p><strong>短作业优先</strong>：非抢占式的调度算法，按估计运行时间最短的顺序进行调度。长作业有可能会饿死，处于一直等待短作业执行完毕的状态。因为如果一直有短作业到来，那么长作业永远得不到调度。</p></li><li><p><strong>最短剩余时间优先</strong>：最短作业优先的抢占式版本，按剩余运行时间的顺序进行调度。 当一个新的作业到达时，其整个运行时间与当前进程的剩余时间作比较。如果新的进程需要的时间更少，则挂起当前进程，运行新的进程。否则新的进程等待。</p></li><li><p><strong>时间片轮转</strong>：将所有就绪进程按 <code>FCFS</code> 的原则排成一个队列，每次调度时，把 <code>CPU</code> 时间分配给队首进程，该进程可以执行一个时间片。当时间片用完时，由计时器发出时钟中断，调度程序便停止该进程的执行，并将它送往就绪队列的末尾，同时继续把 <code>CPU</code> 时间分配给队首的进程。</p><p>时间片轮转算法的效率和时间片的大小有很大关系：因为进程切换都要保存进程的信息并且载入新进程的信息，如果时间片太小，会导致进程切换得太频繁，在进程切换上就会花过多时间。 而如果时间片过长，那么实时性就不能得到保证。</p></li><li><p><strong>优先级调度</strong>：为每个进程分配一个优先级，按优先级进行调度。为了防止低优先级的进程永远等不到调度，可以随着时间的推移增加等待进程的优先级。</p></li></ul><h2 id="_13-进程有哪些状态" tabindex="-1"><a class="header-anchor" href="#_13-进程有哪些状态"><span>13. 进程有哪些状态？</span></a></h2><p>进程一共有<code>5</code>种状态，分别是创建、就绪、运行（执行）、终止、阻塞。</p><p><img src="http://blog-img.coolsen.cn/img/A61F5B5322ED49038C64BDD82D341987" alt="进程五种状态转换图"></p><ul><li>运行状态就是进程正在<code>CPU</code>上运行。在单处理机环境下，每一时刻最多只有一个进程处于运行状态。</li><li>就绪状态就是说进程已处于准备运行的状态，即进程获得了除<code>CPU</code>之外的一切所需资源，一旦得到<code>CPU</code>即可运行。</li><li>阻塞状态就是进程正在等待某一事件而暂停运行，比如等待某资源为可用或等待<code>I/O</code>完成。即使<code>CPU</code>空闲，该进程也不能运行。</li></ul><p><strong>运行态→阻塞态</strong>：往往是由于等待外设，等待主存等资源分配或等待人工干预而引起的。 <strong>阻塞态→就绪态</strong>：则是等待的条件已满足，只需分配到处理器后就能运行。 <strong>运行态→就绪态</strong>：不是由于自身原因，而是由外界原因使运行状态的进程让出处理器，这时候就变成就绪态。例如时间片用完，或有更高优先级的进程来抢占处理器等。 <strong>就绪态→运行态</strong>：系统按某种策略选中就绪队列中的一个进程占用处理器，此时就变成了运行态。</p><h2 id="_14-什么是分页" tabindex="-1"><a class="header-anchor" href="#_14-什么是分页"><span>14. 什么是分页？</span></a></h2><p>把内存空间划分为<strong>大小相等且固定的块</strong>，作为主存的基本单位。因为程序数据存储在不同的页面中，而页面又离散的分布在内存中，<strong>因此需要一个页表来记录映射关系，以实现从页号到物理块号的映射。</strong></p><p>访问分页系统中内存数据需要<strong>两次的内存访问</strong> (一次是从内存中访问页表，从中找到指定的物理块号，加上页内偏移得到实际物理地址；第二次就是根据第一次得到的物理地址访问内存取出数据)。</p><p><img src="http://blog-img.coolsen.cn/img/image-20210610173249387.png" alt=""></p><h2 id="_15-什么是分段" tabindex="-1"><a class="header-anchor" href="#_15-什么是分段"><span>15. 什么是分段？</span></a></h2><p><strong>分页是为了提高内存利用率，而分段是为了满足程序员在编写代码的时候的一些逻辑需求(比如数据共享，数据保护，动态链接等)。</strong></p><p>分段内存管理当中，<strong>地址是二维的，一维是段号，二维是段内地址；其中每个段的长度是不一样的，而且每个段内部都是从0开始编址的</strong>。由于分段管理中，每个段内部是连续内存分配，但是段和段之间是离散分配的，因此也存在一个逻辑地址到物理地址的映射关系，相应的就是段表机制。</p><p><img src="http://blog-img.coolsen.cn/img/image-20210610173410509.png" alt=""></p><h2 id="_16-分页和分段有什区别" tabindex="-1"><a class="header-anchor" href="#_16-分页和分段有什区别"><span>16. 分页和分段有什区别？</span></a></h2><ul><li>分页对程序员是透明的，但是分段需要程序员显式划分每个段。</li><li>分页的地址空间是一维地址空间，分段是二维的。</li><li>页的大小不可变，段的大小可以动态改变。</li><li>分页主要用于实现虚拟内存，从而获得更大的地址空间；分段主要是为了使程序和数据可以被划分为逻辑上独立的地址空间并且有助于共享和保护。</li></ul><h2 id="_17-什么是交换空间" tabindex="-1"><a class="header-anchor" href="#_17-什么是交换空间"><span>17. 什么是交换空间？</span></a></h2><p>操作系统把物理内存(physical RAM)分成一块一块的小内存，每一块内存被称为<strong>页(page)</strong>。当内存资源不足时，<strong>Linux把某些页的内容转移至硬盘上的一块空间上，以释放内存空间</strong>。硬盘上的那块空间叫做<strong>交换空间</strong>(swap space),而这一过程被称为交换(swapping)。<strong>物理内存和交换空间的总容量就是虚拟内存的可用容量。</strong></p><p>用途：</p><ul><li>物理内存不足时一些不常用的页可以被交换出去，腾给系统。</li><li>程序启动时很多内存页被用来初始化，之后便不再需要，可以交换出去。</li></ul><h2 id="_18-物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别" tabindex="-1"><a class="header-anchor" href="#_18-物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别"><span>18. 物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别?</span></a></h2><p>物理地址就是内存中真正的地址，它就相当于是你家的门牌号，你家就肯定有这个门牌号，具有唯一性。<strong>不管哪种地址，最终都会映射为物理地址</strong>。</p><p>在<code>实模式</code>下，段基址 + 段内偏移经过地址加法器的处理，经过地址总线传输，最终也会转换为<code>物理地址</code>。</p><p>但是在<code>保护模式</code>下，段基址 + 段内偏移被称为<code>线性地址</code>，不过此时的段基址不能称为真正的地址，而是会被称作为一个<code>选择子</code>的东西，选择子就是个索引，相当于数组的下标，通过这个索引能够在 GDT 中找到相应的段描述符，段描述符记录了<strong>段的起始、段的大小</strong>等信息，这样便得到了基地址。如果此时没有开启内存分页功能，那么这个线性地址可以直接当做物理地址来使用，直接访问内存。如果开启了分页功能，那么这个线性地址又多了一个名字，这个名字就是<code>虚拟地址</code>。</p><p>不论在实模式还是保护模式下，段内偏移地址都叫做<code>有效地址</code>。有效抵制也是逻辑地址。</p><p>线性地址可以看作是<code>虚拟地址</code>，虚拟地址不是真正的物理地址，但是虚拟地址会最终被映射为物理地址。下面是虚拟地址 -&gt; 物理地址的映射。</p><p><img src="http://blog-img.coolsen.cn/img/image-20210807152300643.png" alt="image-20210807152300643"></p><h2 id="_19-页面替换算法有哪些" tabindex="-1"><a class="header-anchor" href="#_19-页面替换算法有哪些"><span>19. 页面替换算法有哪些？</span></a></h2><p>在程序运行过程中，如果要访问的页面不在内存中，就发生缺页中断从而将该页调入内存中。此时如果内存已无空闲空间，系统必须从内存中调出一个页面到磁盘对换区中来腾出空间。</p><p><img src="http://blog-img.coolsen.cn/img/image-20210807152232136.png" alt="image-20210807152232136"></p><ul><li><code>最优算法</code>在当前页面中置换最后要访问的页面。不幸的是，没有办法来判定哪个页面是最后一个要访问的，<code>因此实际上该算法不能使用</code>。然而，它可以作为衡量其他算法的标准。</li><li><code>NRU</code> 算法根据 R 位和 M 位的状态将页面分为四类。从编号最小的类别中随机选择一个页面。NRU 算法易于实现，但是性能不是很好。存在更好的算法。</li><li><code>FIFO</code> 会跟踪页面加载进入内存中的顺序，并把页面放入一个链表中。有可能删除存在时间最长但是还在使用的页面，因此这个算法也不是一个很好的选择。</li><li><code>第二次机会</code>算法是对 FIFO 的一个修改，它会在删除页面之前检查这个页面是否仍在使用。如果页面正在使用，就会进行保留。这个改进大大提高了性能。</li><li><code>时钟</code> 算法是第二次机会算法的另外一种实现形式，时钟算法和第二次算法的性能差不多，但是会花费更少的时间来执行算法。</li><li><code>LRU</code> 算法是一个非常优秀的算法，但是没有<code>特殊的硬件(TLB)</code>很难实现。如果没有硬件，就不能使用 LRU 算法。</li><li><code>NFU</code> 算法是一种近似于 LRU 的算法，它的性能不是非常好。</li><li><code>老化</code> 算法是一种更接近 LRU 算法的实现，并且可以更好的实现，因此是一个很好的选择</li><li>最后两种算法都使用了工作集算法。工作集算法提供了合理的性能开销，但是它的实现比较复杂。<code>WSClock</code> 是另外一种变体，它不仅能够提供良好的性能，而且可以高效地实现。</li></ul><p><strong>最好的算法是老化算法和WSClock算法</strong>。他们分别是基于 LRU 和工作集算法。他们都具有良好的性能并且能够被有效的实现。还存在其他一些好的算法，但实际上这两个可能是最重要的。</p><h2 id="_20-什么是缓冲区溢出-有什么危害" tabindex="-1"><a class="header-anchor" href="#_20-什么是缓冲区溢出-有什么危害"><span>20. 什么是缓冲区溢出？有什么危害？</span></a></h2><p>缓冲区溢出是指当计算机向缓冲区填充数据时超出了缓冲区本身的容量，溢出的数据覆盖在合法数据上。</p><p>危害有以下两点：</p><ul><li>程序崩溃，导致拒绝额服务</li><li>跳转并且执行一段恶意代码</li></ul><p>造成缓冲区溢出的主要原因是程序中没有仔细检查用户输入。</p><h2 id="_21-什么是虚拟内存" tabindex="-1"><a class="header-anchor" href="#_21-什么是虚拟内存"><span>21. 什么是虚拟内存？</span></a></h2><p>虚拟内存就是说，让物理内存扩充成更大的逻辑内存，从而让程序获得更多的可用内存。虚拟内存使用部分加载的技术，让一个进程或者资源的某些页面加载进内存，从而能够加载更多的进程，甚至能加载比内存大的进程，这样看起来好像内存变大了，这部分内存其实包含了磁盘或者硬盘，并且就叫做虚拟内存。</p><h2 id="_22-虚拟内存的实现方式有哪些" tabindex="-1"><a class="header-anchor" href="#_22-虚拟内存的实现方式有哪些"><span>22. 虚拟内存的实现方式有哪些?</span></a></h2><p>虚拟内存中，允许将一个作业分多次调入内存。釆用连续分配方式时，会使相当一部分内存空间都处于暂时或<code>永久</code>的空闲状态，造成内存资源的严重浪费，而且也无法从逻辑上扩大内存容量。因此，虚拟内存的实需要建立在离散分配的内存管理方式的基础上。虚拟内存的实现有以下三种方式：</p><ul><li>请求分页存储管理。</li><li>请求分段存储管理。</li><li>请求段页式存储管理。</li></ul><h2 id="_23-讲一讲io多路复用" tabindex="-1"><a class="header-anchor" href="#_23-讲一讲io多路复用"><span>23. 讲一讲IO多路复用？</span></a></h2><p><strong>IO多路复用是指内核一旦发现进程指定的一个或者多个IO条件准备读取，它就通知该进程。IO多路复用适用如下场合</strong>：</p><ul><li>当客户处理多个描述字时（一般是交互式输入和网络套接口），必须使用I/O复用。</li><li>当一个客户同时处理多个套接口时，而这种情况是可能的，但很少出现。</li><li>如果一个TCP服务器既要处理监听套接口，又要处理已连接套接口，一般也要用到I/O复用。</li><li>如果一个服务器即要处理TCP，又要处理UDP，一般要使用I/O复用。</li><li>如果一个服务器要处理多个服务或多个协议，一般要使用I/O复用。</li><li>与多进程和多线程技术相比，I/O多路复用技术的最大优势是系统开销小，系统不必创建进程/线程，也不必维护这些进程/线程，从而大大减小了系统的开销。</li></ul><h2 id="_24-硬链接和软链接有什么区别" tabindex="-1"><a class="header-anchor" href="#_24-硬链接和软链接有什么区别"><span>24. 硬链接和软链接有什么区别？</span></a></h2><ul><li>硬链接就是在目录下创建一个条目，记录着文件名与 <code>inode</code> 编号，这个 <code>inode</code> 就是源文件的 <code>inode</code>。删除任意一个条目，文件还是存在，只要引用数量不为 <code>0</code>。但是硬链接有限制，它不能跨越文件系统，也不能对目录进行链接。</li><li>符号链接文件保存着源文件所在的绝对路径，在读取时会定位到源文件上，可以理解为 <code>Windows</code> 的快捷方式。当源文件被删除了，链接文件就打不开了。因为记录的是路径，所以可以为目录建立符号链接。</li></ul><h2 id="_25-中断的处理过程" tabindex="-1"><a class="header-anchor" href="#_25-中断的处理过程"><span>25. 中断的处理过程?</span></a></h2><ol><li>保护现场：将当前执行程序的相关数据保存在寄存器中，然后入栈。</li><li>开中断：以便执行中断时能响应较高级别的中断请求。</li><li>中断处理</li><li>关中断：保证恢复现场时不被新中断打扰</li><li>恢复现场：从堆栈中按序取出程序数据，恢复中断前的执行状态。</li></ol><h2 id="_26-中断和轮询有什么区别" tabindex="-1"><a class="header-anchor" href="#_26-中断和轮询有什么区别"><span>26. 中断和轮询有什么区别？</span></a></h2><ul><li>轮询：CPU对<strong>特定设备</strong>轮流询问。中断：通过<strong>特定事件</strong>提醒CPU。</li><li>轮询：效率低等待时间长，CPU利用率不高。中断：容易遗漏问题，CPU利用率不高。</li></ul><h2 id="_27-什么是用户态和内核态" tabindex="-1"><a class="header-anchor" href="#_27-什么是用户态和内核态"><span>27. 什么是用户态和内核态？</span></a></h2><p>用户态和系统态是操作系统的两种运行状态：</p><blockquote><ul><li>内核态：内核态运行的程序可以访问计算机的任何数据和资源，不受限制，包括外围设备，比如网卡、硬盘等。处于内核态的 CPU 可以从一个程序切换到另外一个程序，并且占用 CPU 不会发生抢占情况。</li><li>用户态：用户态运行的程序只能受限地访问内存，只能直接读取用户程序的数据，并且不允许访问外围设备，用户态下的 CPU 不允许独占，也就是说 CPU 能够被其他程序获取。</li></ul></blockquote><p>将操作系统的运行状态分为用户态和内核态，主要是为了对访问能力进行限制，防止随意进行一些比较危险的操作导致系统的崩溃，比如设置时钟、内存清理，这些都需要在内核态下完成 。</p><h2 id="_28-用户态和内核态是如何切换的" tabindex="-1"><a class="header-anchor" href="#_28-用户态和内核态是如何切换的"><span>28. 用户态和内核态是如何切换的?</span></a></h2><p>所有的用户进程都是运行在用户态的，但是我们上面也说了，用户程序的访问能力有限，一些比较重要的比如从硬盘读取数据，从键盘获取数据的操作则是内核态才能做的事情，而这些数据却又对用户程序来说非常重要。所以就涉及到两种模式下的转换，即<strong>用户态 -&gt; 内核态 -&gt; 用户态</strong>，而唯一能够做这些操作的只有 <code>系统调用</code>，而能够执行系统调用的就只有 <code>操作系统</code>。</p><p>一般用户态 -&gt; 内核态的转换我们都称之为 trap 进内核，也被称之为 <code>陷阱指令(trap instruction)</code>。</p><p>他们的工作流程如下：</p><p><img src="http://blog-img.coolsen.cn/img/image-20210807152619210.png" alt="image-20210807152619210"></p><ul><li>首先用户程序会调用 <code>glibc</code> 库，glibc 是一个标准库，同时也是一套核心库，库中定义了很多关键 API。</li><li>glibc 库知道针对不同体系结构调用<code>系统调用</code>的正确方法，它会根据体系结构应用程序的二进制接口设置用户进程传递的参数，来准备系统调用。</li><li>然后，glibc 库调用<code>软件中断指令(SWI)</code> ，这个指令通过更新 <code>CPSR</code> 寄存器将模式改为超级用户模式，然后跳转到地址 <code>0x08</code> 处。</li><li>到目前为止，整个过程仍处于用户态下，在执行 SWI 指令后，允许进程执行内核代码，MMU 现在允许内核虚拟内存访问</li><li>从地址 0x08 开始，进程执行加载并跳转到中断处理程序，这个程序就是 ARM 中的 <code>vector_swi()</code>。</li><li>在 vector_swi() 处，从 SWI 指令中提取系统调用号 SCNO，然后使用 SCNO 作为系统调用表 <code>sys_call_table</code> 的索引，调转到系统调用函数。</li><li>执行系统调用完成后，将还原用户模式寄存器，然后再以用户模式执行。</li></ul><h2 id="_29-unix-常见的io模型" tabindex="-1"><a class="header-anchor" href="#_29-unix-常见的io模型"><span>29. Unix 常见的IO模型：</span></a></h2><p>对于一次IO访问（以read举例），数据会先被拷贝到操作系统内核的缓冲区中，然后才会从操作系统内核的缓冲区拷贝到应用程序的地址空间。所以说，当一个read操作发生时，它会经历两个阶段：</p><blockquote><ul><li>等待数据准备就绪 (Waiting for the data to be ready)</li><li>将数据从内核拷贝到进程中 (Copying the data from the kernel to the process)</li></ul></blockquote><p>正式因为这两个阶段，linux系统产生了下面五种网络模式的方案：</p><blockquote><ul><li>阻塞式IO模型(blocking IO model)</li><li>非阻塞式IO模型(noblocking IO model)</li><li>IO复用式IO模型(IO multiplexing model)</li><li>信号驱动式IO模型(signal-driven IO model)</li><li>异步IO式IO模型(asynchronous IO model)</li></ul></blockquote><p>对于这几种 IO 模型的详细说明，可以参考这篇文章：https://juejin.cn/post/6942686874301857800#heading-13</p><p>其中，IO多路复用模型指的是：使用单个进程同时处理多个网络连接IO，他的原理就是select、poll、epoll 不断轮询所负责的所有 socket，当某个socket有数据到达了，就通知用户进程。该模型的优势并不是对于单个连接能处理得更快，而是在于能处理更多的连接。</p><h2 id="_30-select、poll-和-epoll-之间的区别" tabindex="-1"><a class="header-anchor" href="#_30-select、poll-和-epoll-之间的区别"><span>30. select、poll 和 epoll 之间的区别?</span></a></h2><p>（1）select：时间复杂度 O(n)</p><p>select 仅仅知道有 I/O 事件发生，但并不知道是哪几个流，所以只能无差别轮询所有流，找出能读出数据或者写入数据的流，并对其进行操作。所以 select 具有 O(n) 的无差别轮询复杂度，同时处理的流越多，无差别轮询时间就越长。</p><p>（2）poll：时间复杂度 O(n)</p><p>poll 本质上和 select 没有区别，它将用户传入的数组拷贝到内核空间，然后查询每个 fd 对应的设备状态， 但是它没有最大连接数的限制，原因是它是基于链表来存储的。</p><p>（3）epoll：时间复杂度 O(1)</p><p>epoll 可以理解为 event poll，不同于忙轮询和无差别轮询，epoll 会把哪个流发生了怎样的 I/O 事件通知我们。所以说 epoll 实际上是事件驱动（每个事件关联上 fd）的。</p><blockquote><p>select，poll，epoll 都是 IO 多路复用的机制。I/O 多路复用就是通过一种机制监视多个描述符，一旦某个描述符就绪（一般是读就绪或者写就绪），就通知程序进行相应的读写操作。但 select，poll，epoll 本质上都是同步 I/O，因为他们都需要在读写事件就绪后自己负责进行读写，也就是说这个读写过程是阻塞的，而异步 I/O 则无需自己负责进行读写，异步 I/O 的实现会负责把数据从内核拷贝到用户空间。</p></blockquote>',144)]))}const c=e(p,[["render",t],["__file","index.html.vue"]]),r=JSON.parse(`{"path":"/interview/OperationSystem/tcrooxrz/","title":"操作系统","lang":"zh-CN","frontmatter":{"title":"操作系统","author":null,"createTime":"2024/04/21 14:32:55","permalink":"/interview/OperationSystem/tcrooxrz/","head":[["script",{"id":"check-dark-mode"},";(function () {const um= localStorage.getItem('vuepress-theme-appearance') || 'auto';const sm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;if (um === 'dark' || (um !== 'light' && sm)) {document.documentElement.classList.add('dark');}})();"],["script",{"id":"check-mac-os"},"document.documentElement.classList.toggle('mac', /Mac|iPhone|iPod|iPad/i.test(navigator.platform))"]]},"headers":[{"level":2,"title":"1. 进程和线程的区别？","slug":"_1-进程和线程的区别","link":"#_1-进程和线程的区别","children":[]},{"level":2,"title":"2. 协程与线程的区别？","slug":"_2-协程与线程的区别","link":"#_2-协程与线程的区别","children":[]},{"level":2,"title":"3. 并发和并行有什么区别？","slug":"_3-并发和并行有什么区别","link":"#_3-并发和并行有什么区别","children":[]},{"level":2,"title":"4. 进程与线程的切换流程？","slug":"_4-进程与线程的切换流程","link":"#_4-进程与线程的切换流程","children":[]},{"level":2,"title":"5. 为什么虚拟地址空间切换会比较耗时？","slug":"_5-为什么虚拟地址空间切换会比较耗时","link":"#_5-为什么虚拟地址空间切换会比较耗时","children":[]},{"level":2,"title":"6. 进程间通信方式有哪些？","slug":"_6-进程间通信方式有哪些","link":"#_6-进程间通信方式有哪些","children":[]},{"level":2,"title":"7. 进程间同步的方式有哪些？","slug":"_7-进程间同步的方式有哪些","link":"#_7-进程间同步的方式有哪些","children":[]},{"level":2,"title":"8. 线程同步的方式有哪些？","slug":"_8-线程同步的方式有哪些","link":"#_8-线程同步的方式有哪些","children":[]},{"level":2,"title":"9. 线程的分类？","slug":"_9-线程的分类","link":"#_9-线程的分类","children":[]},{"level":2,"title":"10. 什么是临界区，如何解决冲突？","slug":"_10-什么是临界区-如何解决冲突","link":"#_10-什么是临界区-如何解决冲突","children":[]},{"level":2,"title":"11. 什么是死锁？死锁产生的条件？","slug":"_11-什么是死锁-死锁产生的条件","link":"#_11-什么是死锁-死锁产生的条件","children":[{"level":3,"title":"如何处理死锁问题","slug":"如何处理死锁问题","link":"#如何处理死锁问题","children":[]}]},{"level":2,"title":"12. 进程调度策略有哪几种？","slug":"_12-进程调度策略有哪几种","link":"#_12-进程调度策略有哪几种","children":[]},{"level":2,"title":"13. 进程有哪些状态？","slug":"_13-进程有哪些状态","link":"#_13-进程有哪些状态","children":[]},{"level":2,"title":"14. 什么是分页？","slug":"_14-什么是分页","link":"#_14-什么是分页","children":[]},{"level":2,"title":"15. 什么是分段？","slug":"_15-什么是分段","link":"#_15-什么是分段","children":[]},{"level":2,"title":"16. 分页和分段有什区别？","slug":"_16-分页和分段有什区别","link":"#_16-分页和分段有什区别","children":[]},{"level":2,"title":"17. 什么是交换空间？","slug":"_17-什么是交换空间","link":"#_17-什么是交换空间","children":[]},{"level":2,"title":"18. 物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别?","slug":"_18-物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别","link":"#_18-物理地址、逻辑地址、有效地址、线性地址、虚拟地址的区别","children":[]},{"level":2,"title":"19. 页面替换算法有哪些？","slug":"_19-页面替换算法有哪些","link":"#_19-页面替换算法有哪些","children":[]},{"level":2,"title":"20. 什么是缓冲区溢出？有什么危害？","slug":"_20-什么是缓冲区溢出-有什么危害","link":"#_20-什么是缓冲区溢出-有什么危害","children":[]},{"level":2,"title":"21. 什么是虚拟内存？","slug":"_21-什么是虚拟内存","link":"#_21-什么是虚拟内存","children":[]},{"level":2,"title":"22. 虚拟内存的实现方式有哪些?","slug":"_22-虚拟内存的实现方式有哪些","link":"#_22-虚拟内存的实现方式有哪些","children":[]},{"level":2,"title":"23. 讲一讲IO多路复用？","slug":"_23-讲一讲io多路复用","link":"#_23-讲一讲io多路复用","children":[]},{"level":2,"title":"24. 硬链接和软链接有什么区别？","slug":"_24-硬链接和软链接有什么区别","link":"#_24-硬链接和软链接有什么区别","children":[]},{"level":2,"title":"25. 中断的处理过程?","slug":"_25-中断的处理过程","link":"#_25-中断的处理过程","children":[]},{"level":2,"title":"26. 中断和轮询有什么区别？","slug":"_26-中断和轮询有什么区别","link":"#_26-中断和轮询有什么区别","children":[]},{"level":2,"title":"27. 什么是用户态和内核态？","slug":"_27-什么是用户态和内核态","link":"#_27-什么是用户态和内核态","children":[]},{"level":2,"title":"28. 用户态和内核态是如何切换的?","slug":"_28-用户态和内核态是如何切换的","link":"#_28-用户态和内核态是如何切换的","children":[]},{"level":2,"title":"29. Unix 常见的IO模型：","slug":"_29-unix-常见的io模型","link":"#_29-unix-常见的io模型","children":[]},{"level":2,"title":"30. select、poll 和 epoll 之间的区别?","slug":"_30-select、poll-和-epoll-之间的区别","link":"#_30-select、poll-和-epoll-之间的区别","children":[]}],"readingTime":{"minutes":33.49,"words":10046},"git":{"updatedTime":1717132990000,"contributors":[{"name":"hongzidan","email":"3027708213@qq.com","commits":1}]},"filePathRelative":"notes/interview/OperationSystem/tcrooxrz.md"}`);export{c as comp,r as data};
