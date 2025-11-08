// Busuanzi 统计修复脚本 - 简化版
// 修复异常大的统计数据，添加数据验证和格式化

(function() {
  'use strict';

  // ========== 存储键名 ==========
  const STORAGE_KEYS = {
    SITE_UV: 'busuanzi_site_uv',
    SITE_PV: 'busuanzi_site_pv',
    PAGE_PV: 'busuanzi_page_pv_',
    VISIT_DATE: 'busuanzi_visit_date'
  };

  // ========== 生成10-20之间的初始值 ==========
  function generateInitialValue(elementId) {
    const seed = elementId.charCodeAt(0) + elementId.charCodeAt(elementId.length - 1);
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return Math.floor(10 + normalized * 11); // 10-20之间的整数
  }

  // ========== 获取或初始化统计数据 ==========
  function getOrInitCount(key, elementId) {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      const num = parseInt(stored);
      if (!isNaN(num) && num >= 0) {
        return num;
      }
    }
    const initialValue = generateInitialValue(elementId);
    localStorage.setItem(key, initialValue.toString());
    return initialValue;
  }

  // ========== 增加统计数据 ==========
  function incrementCount(key) {
    const current = parseInt(localStorage.getItem(key) || '0');
    const newValue = current + 1;
    localStorage.setItem(key, newValue.toString());
    return newValue;
  }

  // ========== 检查是否是新的访客 ==========
  function isNewVisitor() {
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem(STORAGE_KEYS.VISIT_DATE);

    if (lastVisitDate !== today) {
      localStorage.setItem(STORAGE_KEYS.VISIT_DATE, today);
      return true;
    }
    return false;
  }

  // ========== 检查是否是新的页面访问 ==========
  function isNewPageVisit(pageKey) {
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem(pageKey + '_date');

    if (lastVisitDate !== today) {
      localStorage.setItem(pageKey + '_date', today);
      return true;
    }
    return false;
  }

  // ========== 数字格式化函数 ==========
  function formatNumber(num) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return (num / 1000).toFixed(1) + 'k';
    } else if (num < 100000000) {
      return (num / 10000).toFixed(1) + 'w';
    } else {
      return (num / 100000000).toFixed(1) + '亿';
    }
  }

  // ========== 处理访问统计 ==========
  function handleVisitStats() {
    // 站点浏览量（每次访问都增加）
    incrementCount(STORAGE_KEYS.SITE_PV);

    // 站点访客数（每天只算一次）
    if (isNewVisitor()) {
      incrementCount(STORAGE_KEYS.SITE_UV);
    }

    // 页面浏览量（每个页面每天只算一次）
    const pagePath = window.location.pathname;
    const pageKey = STORAGE_KEYS.PAGE_PV + pagePath;
    if (isNewPageVisit(pageKey)) {
      incrementCount(pageKey);
    }
  }

  // ========== 检查数值是否异常大 ==========
  function isAbnormalValue(value) {
    // 将字符串转换为数字（移除格式化字符如 k, w, 亿等）
    const numStr = value.toString().replace(/[kKwW亿万千]/g, '');
    const num = parseFloat(numStr);
    // 如果数值大于 10000，认为是异常大的值（不蒜子服务器返回的真实累计值）
    return !isNaN(num) && num > 10000;
  }

  // ========== 更新统计数据显示 ==========
  function updateStatsDisplay() {
    // 更新站点访客数
    const siteUV = document.getElementById('busuanzi_value_site_uv');
    if (siteUV) {
      // 移除加载图标检查，直接更新（因为我们已经有了本地存储的数据）
      const count = getOrInitCount(STORAGE_KEYS.SITE_UV, 'busuanzi_value_site_uv');
      siteUV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }

    // 更新站点浏览量
    const sitePV = document.getElementById('busuanzi_value_site_pv');
    if (sitePV) {
      // 移除加载图标检查，直接更新（因为我们已经有了本地存储的数据）
      const count = getOrInitCount(STORAGE_KEYS.SITE_PV, 'busuanzi_value_site_pv');
      sitePV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }

    // 更新页面浏览量
    const pagePV = document.getElementById('busuanzi_value_page_pv');
    if (pagePV) {
      // 移除加载图标检查，直接更新（因为我们已经有了本地存储的数据）
      const pagePath = window.location.pathname;
      const pageKey = STORAGE_KEYS.PAGE_PV + pagePath;
      const count = getOrInitCount(pageKey, 'busuanzi_value_page_pv');
      pagePV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }
  }

  // ========== 设置 MutationObserver 监听浏览量元素变化 ==========
  let observerInstance = null;
  
  function setupMutationObserver() {
    // 如果已经存在观察者，先断开
    if (observerInstance) {
      observerInstance.disconnect();
    }

    // 创建 MutationObserver 来监听元素内容变化
    observerInstance = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // 获取被观察的元素（mutation.target 是观察的元素本身）
        const target = mutation.target;
        if (!target || !target.id) return;

        const elementId = target.id;
        
        // 检查是否是浏览量相关的元素
        if (elementId === 'busuanzi_value_site_uv') {
          const currentValue = target.textContent.trim();
          // 如果值异常大，立即用本地存储的值覆盖
          if (isAbnormalValue(currentValue)) {
            const count = getOrInitCount(STORAGE_KEYS.SITE_UV, 'busuanzi_value_site_uv');
            target.textContent = count >= 1000 ? formatNumber(count) : count.toString();
          }
        } else if (elementId === 'busuanzi_value_site_pv') {
          const currentValue = target.textContent.trim();
          if (isAbnormalValue(currentValue)) {
            const count = getOrInitCount(STORAGE_KEYS.SITE_PV, 'busuanzi_value_site_pv');
            target.textContent = count >= 1000 ? formatNumber(count) : count.toString();
          }
        } else if (elementId === 'busuanzi_value_page_pv') {
          const currentValue = target.textContent.trim();
          if (isAbnormalValue(currentValue)) {
            const pagePath = window.location.pathname;
            const pageKey = STORAGE_KEYS.PAGE_PV + pagePath;
            const count = getOrInitCount(pageKey, 'busuanzi_value_page_pv');
            target.textContent = count >= 1000 ? formatNumber(count) : count.toString();
          }
        }
      });
    });

    // 观察所有浏览量元素
    function observeElements() {
      const siteUV = document.getElementById('busuanzi_value_site_uv');
      const sitePV = document.getElementById('busuanzi_value_site_pv');
      const pagePV = document.getElementById('busuanzi_value_page_pv');

      if (siteUV && observerInstance) {
        observerInstance.observe(siteUV, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }

      if (sitePV && observerInstance) {
        observerInstance.observe(sitePV, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }

      if (pagePV && observerInstance) {
        observerInstance.observe(pagePV, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }

    // 立即尝试观察
    observeElements();

    // 如果元素还没加载，延迟观察
    setTimeout(observeElements, 500);
    setTimeout(observeElements, 1000);
    setTimeout(observeElements, 2000);
  }

  // ========== 监听 busuanzi 加载完成 ==========
  function waitForBusuanzi() {
    let attempts = 0;
    const maxAttempts = 30; // 最多等待3秒

    const checkElements = () => {
      attempts++;

      const siteUV = document.getElementById('busuanzi_value_site_uv');
      const sitePV = document.getElementById('busuanzi_value_site_pv');
      const pagePV = document.getElementById('busuanzi_value_page_pv');

      // 如果元素存在，直接更新显示（使用我们的本地存储数据）
      // 不再等待 busuanzi 加载，因为我们使用本地存储
      if (siteUV || sitePV || pagePV) {
        updateStatsDisplay();
        return;
      }

      // 如果元素不存在，继续等待（可能还在加载中）
      if (attempts < maxAttempts) {
        setTimeout(checkElements, 100);
      } else {
        // 超时了，尝试最后一次更新
        updateStatsDisplay();
      }
    };

    checkElements();
  }

  // ========== 初始化函数 ==========
  function init() {
    // 处理访问统计
    handleVisitStats();

    // 设置 MutationObserver 监听浏览量元素变化
    setupMutationObserver();

    // 等待 busuanzi 加载完成后更新显示
    waitForBusuanzi();

    // 额外延迟更新，确保一切正常
    setTimeout(updateStatsDisplay, 2000);
    setTimeout(updateStatsDisplay, 5000);
  }

  // ========== 页面加载完成后执行 ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ========== 支持 PJAX ==========
  // 监听 PJAX 完成事件
  document.addEventListener('pjax:complete', function() {
    // PJAX 切换后，需要等待新内容加载完成
    // 使用更长的延迟确保 DOM 完全更新
    setTimeout(() => {
      // 重新设置 MutationObserver（因为 DOM 已更新）
      setupMutationObserver();
      
      // 重新查找元素，因为 PJAX 切换后 DOM 已更新
      const siteUV = document.getElementById('busuanzi_value_site_uv');
      const sitePV = document.getElementById('busuanzi_value_site_pv');
      const pagePV = document.getElementById('busuanzi_value_page_pv');
      
      // 如果元素存在，处理访问统计并更新显示
      if (siteUV || sitePV || pagePV) {
        // 先处理访问统计
        handleVisitStats();
        
        // 立即更新一次显示
        updateStatsDisplay();
        
        // 然后等待 busuanzi 加载完成或直接更新显示
        waitForBusuanzi();
        
        // 额外延迟更新，确保一切正常
        setTimeout(updateStatsDisplay, 500);
        setTimeout(updateStatsDisplay, 1000);
        setTimeout(updateStatsDisplay, 2000);
      } else {
        // 如果没有找到元素，尝试多次查找（可能元素还没加载）
        let retryCount = 0;
        const maxRetries = 10;
        
        const retryFind = () => {
          retryCount++;
          const retryUV = document.getElementById('busuanzi_value_site_uv');
          const retryPV = document.getElementById('busuanzi_value_site_pv');
          const retryPagePV = document.getElementById('busuanzi_value_page_pv');
          
          if (retryUV || retryPV || retryPagePV) {
            // 找到了元素，重新设置 MutationObserver
            setupMutationObserver();
            // 处理访问统计并更新显示
            handleVisitStats();
            updateStatsDisplay();
            waitForBusuanzi();
            setTimeout(updateStatsDisplay, 500);
            setTimeout(updateStatsDisplay, 1000);
          } else if (retryCount < maxRetries) {
            // 还没找到，继续重试
            setTimeout(retryFind, 100);
          }
          // 如果重试次数用完还没找到，说明页面可能没有浏览量元素，不做处理
        };
        
        retryFind();
      }
    }, 100);
  });
})();
