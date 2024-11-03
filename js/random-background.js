// 模块标题背景图片（固定）- 优化版本
(function() {
  'use strict';

  // 构建图片路径（确保路径正确）
  const getImagePath = (imagePath) => {
    // 如果已经是绝对路径，直接返回
    return imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  };

  // 各模块对应的背景图片（使用绝对路径，从网站根目录开始）
  const moduleBackgrounds = {
    'home': '/img/header-bg.jpg',
    'post': '/img/ddd.jpg',
    'tags': '/img/ccc.png',
    'categories': '/img/bbb.jpg',
    'link': '/img/eee.jpg',
    'archive': '/img/ccc.png',
    'default': '/img/header-bg.jpg'
  };

  // 缓存 DOM 元素和页面类型
  let cachedPageHeader = null;
  let cachedPageType = null;

  // 获取页面类型（缓存结果）
  function getPageType() {
    if (cachedPageType !== null) {
      return cachedPageType;
    }

    const pageHeader = document.getElementById('page-header');
    if (!pageHeader) {
      return 'default';
    }

    let pageType = 'default';

    if (pageHeader.classList.contains('full_page')) {
      pageType = 'home';
    } else if (pageHeader.classList.contains('post-bg')) {
      pageType = 'post';
    } else {
      const bodyWrap = document.getElementById('body-wrap');
      if (bodyWrap) {
        if (bodyWrap.classList.contains('type-tags')) {
          pageType = 'tags';
        } else if (bodyWrap.classList.contains('type-categories')) {
          pageType = 'categories';
        } else if (bodyWrap.classList.contains('type-link')) {
          pageType = 'link';
        } else if (bodyWrap.classList.contains('page') && !bodyWrap.classList.contains('post')) {
          const path = window.location.pathname;
          if (path.includes('/archives') || path === '/archives/') {
            pageType = 'archive';
          }
        }
      }
    }

    cachedPageType = pageType;
    return pageType;
  }

  // 使用 Intersection Observer 延迟加载背景图片
  function setModuleBackgroundLazy() {
    const pageHeader = document.getElementById('page-header');
    
    if (!pageHeader) {
      // 如果元素不存在，使用 requestIdleCallback 延迟重试
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setTimeout(setModuleBackgroundLazy, 100);
        }, { timeout: 1000 });
      } else {
        setTimeout(setModuleBackgroundLazy, 100);
      }
      return;
    }

    cachedPageHeader = pageHeader;

    // 使用 Intersection Observer 检测元素是否可见
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 元素可见时加载背景图片
            loadBackgroundImage();
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '50px' // 提前 50px 开始加载
      });

      observer.observe(pageHeader);
    } else {
      // 不支持 Intersection Observer 时直接加载
      loadBackgroundImage();
    }
  }

  // 加载背景图片
  function loadBackgroundImage() {
    const pageHeader = cachedPageHeader || document.getElementById('page-header');
    if (!pageHeader) return;

    const pageType = getPageType();
    const selectedImage = moduleBackgrounds[pageType] || moduleBackgrounds['default'];
    const imagePath = getImagePath(selectedImage);

    // 预加载图片，避免闪烁
    const img = new Image();
    img.onload = () => {
      // 图片加载完成后再设置背景
      pageHeader.style.backgroundImage = `url(${imagePath})`;
      pageHeader.style.backgroundPosition = 'center center';
      pageHeader.style.backgroundSize = 'cover';
      pageHeader.style.backgroundRepeat = 'no-repeat';
      // 添加加载完成的类，可用于 CSS 动画
      pageHeader.classList.add('bg-loaded');
    };
    img.onerror = () => {
      // 图片加载失败时使用默认背景
      pageHeader.style.backgroundImage = `url(${getImagePath(moduleBackgrounds['default'])})`;
      pageHeader.style.backgroundPosition = 'center center';
      pageHeader.style.backgroundSize = 'cover';
      pageHeader.style.backgroundRepeat = 'no-repeat';
    };
    img.src = imagePath;
  }

  // 初始化函数（延迟执行，不阻塞渲染）
  function init() {
    // 使用 requestIdleCallback 延迟执行，不阻塞关键渲染路径
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setModuleBackgroundLazy();
      }, { timeout: 2000 });
    } else {
      // 降级方案：使用 setTimeout
      setTimeout(setModuleBackgroundLazy, 0);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 如果启用了 pjax，在页面切换时也更新背景
  document.addEventListener('pjax:complete', () => {
    // 清除缓存
    cachedPageHeader = null;
    cachedPageType = null;
    
    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setModuleBackgroundLazy();
        }, { timeout: 500 });
      } else {
        setTimeout(setModuleBackgroundLazy, 50);
      }
    });
  });
})();

