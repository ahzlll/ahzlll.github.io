// 固定的第一句话
const firstQuote = "世界越来越糟，但至少还有Git可以回退";

// Ahz Hong 个人博客打字机效果句子库（随机显示）
const backendQuotes = [
  "代码是写给人看的，只是偶尔在机器上运行",
  "好的代码应该像好的散文一样优雅 ✧",
  "可读性 > 性能 > 简洁性",
  "世界在加速崩塌，而我还在写代码 (╯︵╰)",
  "未来是一片灰暗，但代码里还有光 ✨",
  "我在代码里寻找救赎，却只找到bug (╥﹏╥)",
  "我在深夜敲代码，思考这个世界的意义 (◕‿◕)",
  "未来会好吗？我不知道，但代码会一直运行 ♡",
  "我在代码里逃避现实，却发现现实也在代码里 (╯_╰)",
  "我在代码里寻找答案，却只找到更多问题 (╥﹏╥)",
  "我在深夜写代码，也在写自己的故事",
  "代码里寻找意义，却发现意义在过程",
  "存在的本质是什么？也许只是内存中的地址",
  "时间是一条单向链表，无法回退",
  "活在静谧的十三月里 ✨",
  "在时间的褶皱里，我拾起一片月光",
  "风穿过指缝，带走了一些未说出口的话",
  "雨落在窗台上，像时间一样安静地流逝",
  "记忆是时间的琥珀，封存着那些回不去的瞬间 ✧",
  "我在文字的缝隙里，寻找另一个自己",
  "那些散落的时光，像花瓣一样飘落在记忆里",
  "喧闹任其喧闹，自由我自为之",
  "可以是木讷的树，也可以是自由的风",
  "为庸常生活而歌，为赴死浪漫而活",
  "内心丰盈者，独行也如众",
  "去看海，远也去，晚也去，一个人也去",
  "我摊开手，允许一切流走",
  "万物与我，都是自由诗",
  "人们谈着自由，话里全是枷锁",
  "落日沉溺于橘色的海，晚风沦陷于赤诚的爱",
  "去追逐原野的风，去揽住萤火的光",
  "往前走啊，想什么呢 ✧"
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
    this.usedQuotes = []; // 已使用过的句子索引
    this.lastQuoteIndex = -1; // 上一次使用的句子索引，避免连续重复
  }

  // 获取下一个句子（确保所有句子都显示过，且不会连续重复）
  getNextQuote() {
    // 如果所有句子都已使用过，重置列表
    if (this.usedQuotes.length >= this.quotes.length) {
      this.usedQuotes = [];
    }
    
    // 获取未使用的句子索引
    const availableIndices = [];
    for (let i = 0; i < this.quotes.length; i++) {
      if (!this.usedQuotes.includes(i) && i !== this.lastQuoteIndex) {
        availableIndices.push(i);
      }
    }
    
    // 如果没有可用的（除了上一个），则从所有未使用的句子中选择
    if (availableIndices.length === 0) {
      for (let i = 0; i < this.quotes.length; i++) {
        if (!this.usedQuotes.includes(i)) {
          availableIndices.push(i);
        }
      }
    }
    
    // 从可用索引中随机选择
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    this.usedQuotes.push(randomIndex);
    this.lastQuoteIndex = randomIndex;
    
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
        this.currentQuote = this.getNextQuote();
        
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
    // 重置已使用句子列表和上一个句子索引
    this.usedQuotes = [];
    this.lastQuoteIndex = -1;
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

