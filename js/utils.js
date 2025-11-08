// 公共工具函数 - 用于优化代码，消除重复

/**
 * 延迟执行函数（使用 requestIdleCallback 或 setTimeout 降级）
 * @param {Function} callback - 要执行的函数
 * @param {number} timeout - 超时时间（毫秒）
 * @param {number} fallbackDelay - 降级延迟时间（毫秒）
 */
function deferExecution(callback, timeout = 2000, fallbackDelay = 200) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, fallbackDelay);
  }
}

/**
 * 页面初始化函数（支持 DOMContentLoaded 和 PJAX）
 * @param {Function} initCallback - 初始化回调函数
 * @param {Function} pjaxCallback - PJAX 完成后的回调函数（可选）
 */
function initOnReady(initCallback, pjaxCallback = null) {
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCallback);
  } else {
    initCallback();
  }

  // 如果使用 PJAX，需要在页面切换时重新初始化
  if (pjaxCallback || initCallback) {
    document.addEventListener('pjax:complete', () => {
      requestAnimationFrame(() => {
        const callback = pjaxCallback || initCallback;
        deferExecution(callback, 500, 100);
      });
    });
  }
}

// 导出函数（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { deferExecution, initOnReady };
}

