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
  "这个世界的悲伤，只有编译器能理解",
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
  "这个世界的悲伤，只有循环能表达",
  "我在代码里寻找答案，却只找到更多问题",
  "世界越来越冷漠，但代码还有温度 ♡",
  "人类的未来充满变数，就像动态类型",
  "我在深夜调试，也在调试自己的人生",
  "世界在改变，但代码的逻辑不会变",
  "这个世界的痛苦，只有递归能理解",
  "我在代码里寻找意义，却发现意义在代码之外",
  "世界变得复杂，但代码可以简化一切",
  "人类的未来像异步操作，不知道何时完成",
  "我在深夜思考，代码能改变世界吗 (◕‿◕)",
  "世界在崩溃，但至少还有版本控制 ✧",
  "这个世界的悲伤，只有异常处理能捕获",
  "我在代码里寻找真相，却发现真相很残酷 (╥﹏╥)"
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
        
        setTimeout(() => this.type(), this.pauseAfterDelete);
        return;
      }
      
      setTimeout(() => this.type(), this.deletingSpeed);
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
        setTimeout(() => this.type(), this.pauseTime);
        return;
      }
      
      setTimeout(() => this.type(), this.typingSpeed);
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
    const typingEffect = new TypingEffect(typingElement, firstQuote, backendQuotes);
    typingEffect.start();
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTypingEffect);
} else {
  initTypingEffect();
}

// 如果使用 PJAX，需要在页面切换时重新初始化
if (window.pjax) {
  document.addEventListener('pjax:complete', initTypingEffect);
}

