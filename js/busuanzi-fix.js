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

  // ========== 更新统计数据显示 ==========
  function updateStatsDisplay() {
    // 更新站点访客数
    const siteUV = document.getElementById('busuanzi_value_site_uv');
    if (siteUV && !siteUV.innerHTML.includes('fa-spinner')) {
      const count = getOrInitCount(STORAGE_KEYS.SITE_UV, 'busuanzi_value_site_uv');
      siteUV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }

    // 更新站点浏览量
    const sitePV = document.getElementById('busuanzi_value_site_pv');
    if (sitePV && !sitePV.innerHTML.includes('fa-spinner')) {
      const count = getOrInitCount(STORAGE_KEYS.SITE_PV, 'busuanzi_value_site_pv');
      sitePV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }

    // 更新页面浏览量
    const pagePV = document.getElementById('busuanzi_value_page_pv');
    if (pagePV && !pagePV.innerHTML.includes('fa-spinner')) {
      const pagePath = window.location.pathname;
      const pageKey = STORAGE_KEYS.PAGE_PV + pagePath;
      const count = getOrInitCount(pageKey, 'busuanzi_value_page_pv');
      pagePV.textContent = count >= 1000 ? formatNumber(count) : count.toString();
    }
  }

  // ========== 监听 busuanzi 加载完成 ==========
  function waitForBusuanzi() {
    let attempts = 0;
    const maxAttempts = 50; // 最多等待5秒

    const checkElements = () => {
      attempts++;

      const siteUV = document.getElementById('busuanzi_value_site_uv');
      const sitePV = document.getElementById('busuanzi_value_site_pv');
      const pagePV = document.getElementById('busuanzi_value_page_pv');

      // 检查是否还有加载图标
      const hasLoadingUV = siteUV && siteUV.innerHTML.includes('fa-spinner');
      const hasLoadingPV = sitePV && sitePV.innerHTML.includes('fa-spinner');
      const hasLoadingPage = pagePV && pagePV.innerHTML.includes('fa-spinner');

      // 如果没有加载图标了，说明 busuanzi 已经更新了数据
      if ((!hasLoadingUV && siteUV) || (!hasLoadingPV && sitePV) || (!hasLoadingPage && pagePV)) {
        // 等待一小段时间确保 busuanzi 完全加载完成
        setTimeout(updateStatsDisplay, 100);
        return;
      }

      // 如果还有加载图标，继续等待
      if (attempts < maxAttempts) {
        setTimeout(checkElements, 100);
      } else {
        // 超时了，直接更新显示
        updateStatsDisplay();
      }
    };

    checkElements();
  }

  // ========== 初始化函数 ==========
  function init() {
    // 处理访问统计
    handleVisitStats();

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
  if (window.pjax) {
    document.addEventListener('pjax:complete', function() {
      setTimeout(init, 100);
    });
  }
})();
