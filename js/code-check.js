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
      if (response.ok) {
        const commits = await response.json();
        return commits.length > 0;
      }
      return false;
    } catch (error) {
      console.log('GitHub API 检查失败，使用备用方案:', error);
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

  // 更新公告内容
  async function updateAnnouncement() {
    const announcementElement = document.querySelector('.announcement_content');
    if (!announcementElement) return;

    const hasCodeToday = await checkTodayCommits();
    
    const messages = {
      hasCode: [
        '今天写代码了，我真棒！✨',
        '今天也在努力敲代码，继续加油！💪',
        '代码使我快乐，今天又是充实的一天！🎉',
        '今天写了不少代码，感觉自己棒棒哒！🌟',
        '代码写得不错，给自己点个赞！👍'
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
    
    announcementElement.innerHTML = randomMessage;
    
    // 如果今天有代码，更新本地存储
    if (hasCodeToday) {
      localStorage.setItem('lastCodeDate', getTodayDate());
    }
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAnnouncement);
  } else {
    updateAnnouncement();
  }

  // 如果使用 PJAX，需要在页面切换时重新执行
  if (window.pjax) {
    document.addEventListener('pjax:complete', updateAnnouncement);
  }
})();

