// 固定的第一句话
const firstQuote = "世界越来越糟，但至少还有Git可以回退";

// Ahz Hong 个人博客打字机效果句子库（随机显示）
const backendQuotes = [
  "代码是写给人看的，只是偶尔在机器上运行",
  "优秀的代码是自解释的，注释只是锦上添花 ✨",
  "简洁是复杂的最终形式",
  "好的代码应该像好的散文一样优雅",
  "可读性 > 性能 > 简洁性",
  "代码质量比代码速度更重要",
  "世界在加速崩塌，而我还在写代码 (╯︵╰)",
  "未来是一片灰暗，但代码里还有光 ✧",
  "我在代码里寻找救赎，却只找到bug (╥﹏╥)",
  "人类的未来充满不确定性，就像未捕获的异常",
  "我在深夜敲代码，思考这个世界的意义",
  "世界在哭泣，而我在写注释",
  "未来会好吗？我不知道，但代码会一直运行 ♡",
  "这个世界的痛苦，只有变量能承载",
  "我在代码里逃避现实，却发现现实也在代码里 (╯_╰)",
  "世界变得太快，只有代码是永恒的",
  "人类的未来像未测试的代码，充满未知",
  "我在深夜思考，这个世界还有希望吗",
  "世界在燃烧，而我在写函数",
  "未来是一片迷雾，但代码是清晰的 ✧",
  "我在代码里寻找答案，却只找到更多问题",
  "世界越来越冷漠，但代码还有温度 ♡",
  "人类的未来充满变数，就像动态类型",
  "我在深夜调试，也在调试自己的人生",
  "世界在改变，但代码的逻辑不会变",
  "我在代码里寻找意义，却发现意义在代码之外",
  "世界变得复杂，但代码可以简化一切",
  "人类的未来像异步操作，不知道何时完成",
  "我在深夜思考，代码能改变世界吗 (◕‿◕)",
  "世界在崩溃，但至少还有版本控制 ✧",
  "这个世界的悲伤，只有异常处理能捕获",
  "我在代码里寻找真相，却发现真相很残酷 (╥﹏╥)",
  "重构代码就像重构人生，都需要勇气",
  "这个世界的混乱，只有数据结构能整理",
  "我在代码里寻找完美，却只找到妥协",
  "世界在变化，但算法的时间复杂度不会变",
  "这个世界的复杂性，只有抽象能简化",
  "我在深夜写代码，也在写自己的故事",
  "世界在加速，但我的代码还在优化中",
  "这个世界的错误，只有单元测试能发现",
  "我在代码里寻找优雅，却只找到实用",
  "世界在分裂，但我的代码还在合并",
  "这个世界的矛盾，只有设计模式能解决",
  "我在代码里寻找答案，却发现问题更多",
  "世界在崩溃，但至少还有日志能记录",
  "这个世界的无序，只有排序算法能整理",
  "我在代码里寻找真理，却只找到经验",
  "世界在变化，但代码的注释不会过时",
  "这个世界的混乱，只有Git能管理",
  "我在代码里寻找意义，却发现意义在过程",
  "世界在加速，但我的代码还在调试",
  "这个世界的复杂性，只有模块化能解决",
  "我在代码里寻找完美，却只找到可维护性",
  "世界在变化，但代码的原则不会变",
  "时间在流逝，而我在定义常量",
  "存在的本质是什么？也许只是内存中的地址",
  "虚无与存在之间，只隔着一个布尔值",
  "我在思考，思考本身是否也是一种递归",
  "意义的边界在哪里？也许在无限循环的尽头",
  "真实与虚拟的界限，在代码里变得模糊",
  "我在寻找本质，却发现一切都是抽象",
  "时间是一条单向链表，无法回退",
  "存在的意义，也许只是函数的一次调用",
  "我在追问，追问本身是否也是一种循环",
  "虚无中诞生了代码，代码中诞生了意义",
  "真实是什么？也许只是状态机的一个状态",
  "我在思考存在，存在本身是否也需要证明",
  "意义的重量，也许只是一个变量的值",
  "时间在代码里凝固，又在执行中流动",
  "我在寻找答案，却发现答案在问题之外",
  "存在的证明，也许只需要一个返回值",
  "虚无与存在，在代码里达成了和解",
  "我在思考本质，却发现本质是相对的",
  "意义的生成，也许只是算法的一次迭代",
  "时间在循环中重复，又在递归中深入",
  "我在追问意义，却发现意义在追问中消失",
  "存在的形式，也许只是数据结构的一种",
  "虚无中有了结构，结构中有了意义",
  "我在思考边界，却发现边界是无限的",
  "意义的载体，也许只是内存中的字节",
  "时间在异步中跳跃，又在同步中等待",
  "我在寻找本质，却发现本质是抽象的",
  "存在的状态，也许只是状态机的一个节点",
  "虚无与存在之间，只隔着一个条件判断",
  "我在思考意义，却发现意义在思考之外",
  "意义的生成，也许只是函数的一次执行",
  "时间在代码里被定义，又在执行中被消耗",
  "我在追问存在，却发现存在在追问中显现",
  "存在的证明，也许只需要一个真值",
  "虚无中有了逻辑，逻辑中有了世界",
  "我在思考边界，却发现边界是模糊的",
  "意义的本质，也许只是算法的一次计算"
];

// 打字机效果类
class TypingEffect {
  constructor(element, firstQuote, quotes) {
    this.element = element;
    this.firstQuote = firstQuote; // 固定的第一句话
    this.quotes = quotes; // 随机显示的句子数组
    this.currentQuote = firstQuote; // 当前显示的句子
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.hasShownFirstQuote = false; // 是否已经显示过第一句话
    this.typingSpeed = 100; // 打字速度（毫秒）
    this.deletingSpeed = 50; // 删除速度（毫秒）
    this.pauseTime = 2000; // 显示完整句子后的暂停时间（毫秒）
    this.pauseAfterDelete = 500; // 删除完成后的暂停时间（毫秒）
    this.timeoutId = null; // 存储当前定时器 ID
  }

  // 随机选择一句名言（从随机句子数组中）
  getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  // 打字机效果主函数
  type() {
    if (this.isDeleting) {
      // 删除模式
      this.element.textContent = this.currentQuote.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
      
      if (this.currentCharIndex === 0) {
        // 删除完成，切换到下一句
        this.isDeleting = false;
        this.currentQuote = this.getRandomQuote();
        
        this.timeoutId = setTimeout(() => this.type(), this.pauseAfterDelete);
        return;
      }
      
      this.timeoutId = setTimeout(() => this.type(), this.deletingSpeed);
    } else {
      // 打字模式
      this.element.textContent = this.currentQuote.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
      
      if (this.currentCharIndex === this.currentQuote.length) {
        // 打字完成，标记已显示第一句话
        if (this.currentQuote === this.firstQuote) {
          this.hasShownFirstQuote = true;
        }
        
        // 暂停后开始删除
        this.isDeleting = true;
        this.timeoutId = setTimeout(() => this.type(), this.pauseTime);
        return;
      }
      
      this.timeoutId = setTimeout(() => this.type(), this.typingSpeed);
    }
  }
  
  // 停止打字机效果
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  // 启动打字机效果
  start() {
    // 总是从第一句话开始
    this.currentQuote = this.firstQuote;
    this.hasShownFirstQuote = false;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.type();
  }
}

// 初始化打字机效果（通用函数，消除重复代码）
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    // 如果已经存在打字机实例，先停止它
    if (typingElement.typingEffectInstance) {
      typingElement.typingEffectInstance.stop();
    }
    // 创建新的打字机实例
    const typingEffect = new TypingEffect(typingElement, firstQuote, backendQuotes);
    typingElement.typingEffectInstance = typingEffect;
    typingEffect.start();
  }
}

// 初始化函数（延迟执行，不阻塞渲染）
function init() {
  // 使用 requestIdleCallback 延迟执行，不阻塞关键渲染路径
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initTypingEffect();
    }, { timeout: 2000 });
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(initTypingEffect, 200);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 如果使用 PJAX，需要在页面切换时重新初始化
document.addEventListener('pjax:complete', () => {
  // 使用 requestAnimationFrame 确保 DOM 已更新
  requestAnimationFrame(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initTypingEffect();
      }, { timeout: 500 });
    } else {
      setTimeout(initTypingEffect, 100);
    }
  });
});

