// 检测今天是否写代码的脚本
// 通过检查 GitHub 提交记录来判断今天是否写代码

(function() {
  // 获取今天的日期（格式：YYYY-MM-DD）
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 检查今天是否有 GitHub 提交
  async function checkTodayCommits() {
    try {
      // 使用 GitHub API 检查今天的提交
      // 注意：这里需要替换为你的 GitHub 用户名和仓库名
      const username = 'ahzlll'; // 替换为你的 GitHub 用户名
      const repo = 'ahzlll.github.io'; // 替换为你的仓库名
      const today = getTodayDate();
      
      const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits?since=${today}T00:00:00Z&per_page=1`;
      
      const response = await fetch(apiUrl);
      
      // 如果响应状态不是 200，说明 API 调用失败（可能是 403 权限问题或 404 等）
      if (!response.ok) {
        // 静默处理错误，不输出到控制台，直接使用备用方案
        return checkLocalStorage();
      }
      
      const commits = await response.json();
      return commits.length > 0;
    } catch (error) {
      // 静默处理错误，不输出到控制台，直接使用备用方案
      // 如果 GitHub API 失败，使用备用方案：检查本地存储
      return checkLocalStorage();
    }
  }

  // 备用方案：检查本地存储
  function checkLocalStorage() {
    const today = getTodayDate();
    const lastCheck = localStorage.getItem('lastCodeDate');
    return lastCheck === today;
  }

  // 更新代码状态（带重试机制）
  async function updateCodeStatus(retryCount = 0, maxRetries = 10) {
    // 优先查找新的状态元素
    let statusElement = document.getElementById('code-status');
    
    // 如果新元素不存在，尝试查找旧的公告元素（兼容旧版本）
    if (!statusElement) {
      const announcementElement = document.querySelector('.announcement_content');
      if (announcementElement && !announcementElement.querySelector('div')) {
        // 旧版本：直接更新整个公告内容
        statusElement = announcementElement;
      }
    }
    
    // 如果元素不存在且还有重试次数，则延迟重试
    if (!statusElement) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          updateCodeStatus(retryCount + 1, maxRetries);
        }, 100);
      }
      return;
    }

    const hasCodeToday = await checkTodayCommits();
    
    const messages = {
      hasCode: [
        '今天写代码了，我真棒！✨',
        '今天也在努力敲代码，继续加油！💪',
        '代码使我快乐，今天又是充实的一天🎉',
        '今天写了不少代码，感觉自己棒棒哒🌟',
        '今天代码写得不错，给自己点个赞👍'
      ],
      noCode: [
        '今天有点懒，还没写代码... 😴',
        '今天偷懒了，明天要加油！💤',
        '今天没写代码，有点愧疚... 😅',
        '今天休息一下，明天继续努力！🌙',
        '今天没写代码，但明天会补上的！⏰'
      ]
    };

    const messageList = hasCodeToday ? messages.hasCode : messages.noCode;
    const randomMessage = messageList[Math.floor(Math.random() * messageList.length)];
    
    // 如果是新的状态元素，只更新文本；如果是旧的公告元素，更新整个内容
    if (statusElement.id === 'code-status') {
      statusElement.textContent = randomMessage;
    } else {
      statusElement.innerHTML = randomMessage;
    }
    
    // 如果今天有代码，更新本地存储
    if (hasCodeToday) {
      localStorage.setItem('lastCodeDate', getTodayDate());
    }
  }

  // 初始化函数（延迟执行，不阻塞渲染）
  function init() {
    // 等待 DOM 完全加载后再执行
    if (document.readyState === 'complete') {
      // 页面已完全加载，直接执行
      updateCodeStatus();
    } else {
      // 等待页面完全加载
      window.addEventListener('load', () => {
        // 使用 requestAnimationFrame 确保 DOM 已渲染
        requestAnimationFrame(() => {
          updateCodeStatus();
        });
      });
    }
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 如果使用 PJAX，需要在页面切换时重新执行
  document.addEventListener('pjax:complete', () => {
    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      // 延迟执行，确保 PJAX 替换的 DOM 已完全渲染
      setTimeout(() => {
        updateCodeStatus();
      }, 100);
    });
  });
})();

