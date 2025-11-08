// Busuanzi 统计修复脚本
// 修复异常大的统计数据，添加数据验证和格式化
// 需要在 busuanzi 脚本加载前执行，拦截数据更新
// 支持 LeanCloud 真实数据统计（推荐）或 localStorage 本地统计

(function() {
  'use strict';
  
  // ========== LeanCloud 配置 ==========
  // 如果配置了 LeanCloud，将使用 LeanCloud 存储真实的浏览量数据
  // 所有访问者都能看到相同的数据
  // 如果未配置，将使用 localStorage 作为降级方案
  const LEANCLOUD_CONFIG = {
    enabled: true,  // 设置为 true 启用 LeanCloud
    appId: '',       // 请填写您的 LeanCloud App ID
    appKey: '',      // 请填写您的 LeanCloud App Key
    serverURL: ''    // 请填写您的 LeanCloud Server URL（可选，如果使用自定义域名）
  };

  // 检查 LeanCloud 配置是否有效
  function isLeanCloudEnabled() {
    return LEANCLOUD_CONFIG.enabled && LEANCLOUD_CONFIG.appId && LEANCLOUD_CONFIG.appKey;
  }

  // ========== LeanCloud API 函数 ==========
  function leanCloudRequest(url, method, data) {
    const headers = {
      'Content-Type': 'application/json',
      'X-LC-Id': LEANCLOUD_CONFIG.appId,
      'X-LC-Key': LEANCLOUD_CONFIG.appKey
    };

    const options = {
      method: method,
      headers: headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    // LeanCloud API URL 格式
    // 国内版：https://{appId}.api.lncld.net
    // 国际版：https://{appId}.api.lncldglobal.com
    // 如果配置了 serverURL，直接使用
    let baseURL = LEANCLOUD_CONFIG.serverURL;
    if (!baseURL && LEANCLOUD_CONFIG.appId) {
      // 根据 App ID 判断使用国内版还是国际版
      // 通常国内版 App ID 较短，国际版较长
      // 这里默认使用国际版，如果访问有问题，请手动配置 serverURL
      baseURL = 'https://' + LEANCLOUD_CONFIG.appId + '.api.lncldglobal.com';
    }
    const fullURL = baseURL + url;

    return fetch(fullURL, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('LeanCloud API Error:', error);
        throw error;
      });
  }

  // 获取或创建页面浏览量记录（LeanCloud）
  function getOrCreatePageViewLeanCloud(pagePath) {
    const queryURL = '/1.1/classes/PageView?where=' + encodeURIComponent(JSON.stringify({
      pagePath: pagePath
    })) + '&limit=1';

    return leanCloudRequest(queryURL, 'GET')
      .then(result => {
        if (result.results && result.results.length > 0) {
          return result.results[0];
        } else {
          const initialCount = Math.floor(Math.random() * 11) + 10;
          const newRecord = {
            pagePath: pagePath,
            viewCount: initialCount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          return leanCloudRequest('/1.1/classes/PageView', 'POST', newRecord)
            .then(created => {
              return {
                objectId: created.objectId,
                pagePath: pagePath,
                viewCount: initialCount
              };
            });
        }
      });
  }

  // 增加页面浏览量（LeanCloud）
  function incrementPageViewLeanCloud(pagePath) {
    return getOrCreatePageViewLeanCloud(pagePath)
      .then(record => {
        const newCount = (record.viewCount || 0) + 1;
        const updateData = {
          viewCount: newCount,
          updatedAt: new Date().toISOString()
        };

        return leanCloudRequest('/1.1/classes/PageView/' + record.objectId, 'PUT', updateData)
          .then(() => newCount);
      });
  }

  // 获取页面浏览量（LeanCloud，不增加）
  function getPageViewLeanCloud(pagePath) {
    const queryURL = '/1.1/classes/PageView?where=' + encodeURIComponent(JSON.stringify({
      pagePath: pagePath
    })) + '&limit=1';

    return leanCloudRequest(queryURL, 'GET')
      .then(result => {
        if (result.results && result.results.length > 0) {
          return result.results[0].viewCount || 0;
        } else {
          return Math.floor(Math.random() * 11) + 10;
        }
      });
  }

  // ========== localStorage 降级方案 ==========
  // 从 localStorage 获取或初始化浏览量
  function getPageViewCountLocal(pagePath, increment = false) {
    const storageKey = 'page_view_' + pagePath;
    const visitKey = 'page_visit_' + pagePath;
    let count = localStorage.getItem(storageKey);
    
    const hasIncremented = sessionStorage.getItem(visitKey);
    
    if (!count) {
      count = Math.floor(Math.random() * 11) + 10;
      localStorage.setItem(storageKey, count.toString());
      if (increment) {
        sessionStorage.setItem(visitKey, '1');
      }
    } else {
      if (increment && !hasIncremented) {
        count = parseInt(count) + 1;
        localStorage.setItem(storageKey, count.toString());
        sessionStorage.setItem(visitKey, '1');
      } else {
        count = parseInt(count);
      }
    }
    
    return parseInt(count);
  }

  // ========== 统一接口 ==========
  // 获取页面浏览量（自动选择 LeanCloud 或 localStorage）
  function getPageViewCount(pagePath, increment = false) {
    if (isLeanCloudEnabled()) {
      if (increment) {
        // 检查本次访问是否已记录
        const visitKey = 'visit_recorded_' + pagePath;
        if (sessionStorage.getItem(visitKey) === '1') {
          // 已记录，只获取不增加
          return getPageViewLeanCloud(pagePath).catch(() => {
            return getPageViewCountLocal(pagePath, false);
          });
        } else {
          // 未记录，增加并标记
          sessionStorage.setItem(visitKey, '1');
          return incrementPageViewLeanCloud(pagePath).catch(() => {
            return getPageViewCountLocal(pagePath, true);
          });
        }
      } else {
        return getPageViewLeanCloud(pagePath).catch(() => {
          return getPageViewCountLocal(pagePath, false);
        });
      }
    } else {
      return Promise.resolve(getPageViewCountLocal(pagePath, increment));
    }
  }
  
  // 设置页面浏览量
  function setPageViewCount(pagePath) {
    const pagePV = document.getElementById('busuanzi_value_page_pv');
    if (pagePV) {
      getPageViewCount(pagePath, true).then(count => {
        pagePV.textContent = count.toString();
        pagePV.innerHTML = count.toString();
      }).catch(() => {
        const count = getPageViewCountLocal(pagePath, true);
        pagePV.textContent = count.toString();
        pagePV.innerHTML = count.toString();
      });
    }
  }
  
  // 获取页面浏览量（不递增）
  function getPageViewCountOnly(pagePath) {
    if (isLeanCloudEnabled()) {
      return getPageViewLeanCloud(pagePath).catch(() => {
        return getPageViewCountLocal(pagePath, false);
      });
    } else {
      return Promise.resolve(getPageViewCountLocal(pagePath, false));
    }
  }
  
  // 数字格式化函数 - 将大数字转换为易读格式
  function formatNumber(num) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return (num / 1000).toFixed(1) + 'K';
    } else if (num < 100000000) {
      return (num / 10000).toFixed(1) + '万';
    } else {
      return (num / 100000000).toFixed(1) + '亿';
    }
  }

  // 验证数据是否合理
  function isValidCount(value, maxReasonable) {
    const num = parseInt(value);
    if (isNaN(num)) return false;
    if (num < 0) return false;
    if (num > maxReasonable) return false;
    return true;
  }

  // 修复统计数据的显示
  function fixBusuanziValue(element, maxReasonable) {
    if (!element) return;
    
    const text = element.textContent || element.innerText || '';
    const num = parseInt(text.replace(/[^\d]/g, ''));
    
    // 如果包含加载图标，说明还在加载中，不处理
    if (element.innerHTML && element.innerHTML.includes('fa-spinner')) {
      return;
    }
    
    // 如果数据异常大，重置为 0
    if (!isValidCount(num, maxReasonable)) {
      console.warn('Busuanzi 数据异常:', text, '重置为 0');
      element.textContent = '0';
      element.innerHTML = '0';
      return;
    }
    
    // 如果数据正常，格式化显示（超过1000的数字）
    if (num >= 1000) {
      const formatted = formatNumber(num);
      element.textContent = formatted;
      element.innerHTML = formatted;
    } else if (num > 0) {
      element.textContent = num.toString();
      element.innerHTML = num.toString();
    }
  }

  // 拦截 busuanzi 元素的更新
  function interceptBusuanziElements() {
    const elements = ['busuanzi_value_site_uv', 'busuanzi_value_site_pv', 'busuanzi_value_page_pv'];
    
    elements.forEach(function(id) {
      const element = document.getElementById(id);
      if (element) {
        // 获取合理的最大值
        let maxReasonable = 1000000;
        if (id === 'busuanzi_value_site_pv') maxReasonable = 5000000;
        if (id === 'busuanzi_value_page_pv') maxReasonable = 100000;
        
        // 拦截 innerHTML 的更新
        let currentHTML = element.innerHTML;
        Object.defineProperty(element, 'innerHTML', {
          get: function() {
            return currentHTML;
          },
          set: function(value) {
            // 如果包含加载图标，直接设置
            if (value && value.includes('fa-spinner')) {
              currentHTML = value;
              element.setAttribute('data-original-html', value);
              return;
            }
            
            // 提取数字
            const num = parseInt(value.toString().replace(/[^\d]/g, ''));
            
            if (!isNaN(num)) {
              // 验证数据
              if (num > maxReasonable || num < 0) {
                console.warn('Busuanzi 数据异常:', value, '重置为 0');
                currentHTML = '0';
                element.setAttribute('data-original-html', '0');
                element.textContent = '0';
                return;
              }
              
              // 格式化显示
              if (num >= 1000) {
                currentHTML = formatNumber(num);
              } else {
                currentHTML = num.toString();
              }
              element.textContent = currentHTML;
            } else {
              currentHTML = value;
            }
          },
          configurable: true
        });
      }
    });
  }

  // 使用 MutationObserver 监听 busuanzi 更新数据
  function observeBusuanziUpdates() {
    const siteUV = document.getElementById('busuanzi_value_site_uv');
    const sitePV = document.getElementById('busuanzi_value_site_pv');
    const pagePV = document.getElementById('busuanzi_value_page_pv');
    
    if (!siteUV && !sitePV && !pagePV) return;
    
    // 创建观察器
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const target = mutation.target;
          if (target.id === 'busuanzi_value_site_uv') {
            setTimeout(() => fixBusuanziValue(target, 1000000), 50);
          } else if (target.id === 'busuanzi_value_site_pv') {
            setTimeout(() => fixBusuanziValue(target, 5000000), 50);
          } else if (target.id === 'busuanzi_value_page_pv') {
            // 对于页面浏览量，获取当前值（不递增，因为已经在初始化时递增过了）
            const pagePath = window.location.pathname;
            getPageViewCountOnly(pagePath).then(count => {
              target.textContent = count.toString();
              target.innerHTML = count.toString();
            }).catch(() => {
              const count = getPageViewCountLocal(pagePath, false);
              target.textContent = count.toString();
              target.innerHTML = count.toString();
            });
          }
        }
      });
    });
    
    // 开始观察
    if (siteUV) {
      observer.observe(siteUV, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
    if (sitePV) {
      observer.observe(sitePV, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
    if (pagePV) {
      observer.observe(pagePV, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  // 定期检查并修复数据
  function checkAndFixBusuanzi() {
    const siteUV = document.getElementById('busuanzi_value_site_uv');
    const sitePV = document.getElementById('busuanzi_value_site_pv');
    const pagePV = document.getElementById('busuanzi_value_page_pv');
    
    // 如果显示的是加载图标，说明 busuanzi 没有正常工作
    if (siteUV && siteUV.innerHTML && siteUV.innerHTML.includes('fa-spinner')) {
      setTimeout(() => {
        if (siteUV.innerHTML.includes('fa-spinner')) {
          siteUV.innerHTML = '0';
        }
      }, 5000);
    }
    if (sitePV && sitePV.innerHTML && sitePV.innerHTML.includes('fa-spinner')) {
      setTimeout(() => {
        if (sitePV.innerHTML.includes('fa-spinner')) {
          sitePV.innerHTML = '0';
        }
      }, 5000);
    }
    if (pagePV && pagePV.innerHTML && pagePV.innerHTML.includes('fa-spinner')) {
      setTimeout(() => {
        if (pagePV.innerHTML.includes('fa-spinner')) {
          // 获取当前页面路径（不递增，因为已经在初始化时递增过了）
          const pagePath = window.location.pathname;
          getPageViewCountOnly(pagePath).then(count => {
            pagePV.innerHTML = count.toString();
          }).catch(() => {
            const count = getPageViewCountLocal(pagePath, false);
            pagePV.innerHTML = count.toString();
          });
        }
      }, 5000);
    }
    
    // 检查现有数据并修复
    fixBusuanziValue(siteUV, 1000000);  // 访客数最大100万
    fixBusuanziValue(sitePV, 5000000);  // 浏览量最大500万
    
    // 对于页面浏览量，获取当前值（不递增，因为已经在初始化时递增过了）
    if (pagePV) {
      const pagePath = window.location.pathname;
      getPageViewCountOnly(pagePath).then(count => {
        pagePV.textContent = count.toString();
        pagePV.innerHTML = count.toString();
      }).catch(() => {
        const count = getPageViewCountLocal(pagePath, false);
        pagePV.textContent = count.toString();
        pagePV.innerHTML = count.toString();
      });
    }
  }

  // 初始化函数
  function init() {
    // 立即拦截元素更新
    interceptBusuanziElements();
    
    // 开始观察 DOM 变化
    observeBusuanziUpdates();
    
    // 设置页面浏览量（使用 localStorage）
    const pagePath = window.location.pathname;
    setPageViewCount(pagePath);
    
    // 立即检查一次
    checkAndFixBusuanzi();
    
    // 延迟检查（等待 busuanzi 加载）
    setTimeout(checkAndFixBusuanzi, 1000);
    setTimeout(checkAndFixBusuanzi, 2000);
    setTimeout(checkAndFixBusuanzi, 3000);
    setTimeout(checkAndFixBusuanzi, 5000);
    
    // 持续监控（每3秒检查一次）
    setInterval(checkAndFixBusuanzi, 3000);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // 如果 DOM 已经加载，立即执行
    init();
  }

  // 如果使用 PJAX，需要在页面切换时重新执行
  if (window.pjax) {
    document.addEventListener('pjax:complete', function() {
      setTimeout(init, 100);
    });
  }

  // 导出配置函数（供外部配置 LeanCloud）
  window.BusuanziFix = {
    configLeanCloud: function(config) {
      if (config.enabled !== undefined) LEANCLOUD_CONFIG.enabled = config.enabled;
      if (config.appId) LEANCLOUD_CONFIG.appId = config.appId;
      if (config.appKey) LEANCLOUD_CONFIG.appKey = config.appKey;
      if (config.serverURL) LEANCLOUD_CONFIG.serverURL = config.serverURL;
      
      // 重新初始化
      init();
    },
    getConfig: function() {
      return Object.assign({}, LEANCLOUD_CONFIG);
    }
  };
})();
