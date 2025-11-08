// 模块标题背景图片（固定）
(function() {
  // 各模块对应的背景图片
  const moduleBackgrounds = {
    'home': '/img/header-bg.jpg',           // 首页
    'post': '/img/bbb.jpg',           // 文章页
    'tags': '/img/ccc.png',           // 标签页
    'categories': '/img/ddd.jpg',     // 分类页
    'link': '/img/eee.jpg',           // 友链页
    'archive': '/img/ccc.png',        // 归档页（使用首页图片）
    'default': '/img/header-bg.jpg'         // 默认（其他页面）
  };

  // 根据页面类型设置对应的背景图片
  function setModuleBackground() {
    const pageHeader = document.getElementById('page-header');
    
    if (!pageHeader) {
      // 如果元素不存在，延迟重试
      setTimeout(setModuleBackground, 50);
      return;
    }
    
    // 获取页面类型
    let pageType = 'default';
    
    // 通过 page-header 的 class 判断
    if (pageHeader.classList.contains('full_page')) {
      pageType = 'home';
    } else if (pageHeader.classList.contains('post-bg')) {
      pageType = 'post';
    } else {
      // 通过 body-wrap 的 class 判断
      const bodyWrap = document.getElementById('body-wrap');
      if (bodyWrap) {
        if (bodyWrap.classList.contains('type-tags')) {
          pageType = 'tags';
        } else if (bodyWrap.classList.contains('type-categories')) {
          pageType = 'categories';
        } else if (bodyWrap.classList.contains('type-link')) {
          pageType = 'link';
        } else if (bodyWrap.classList.contains('page') && !bodyWrap.classList.contains('post')) {
          // 判断是否为归档页（通过 URL 或其他方式）
          const path = window.location.pathname;
          if (path.includes('/archives') || path === '/archives/') {
            pageType = 'archive';
          }
        }
      }
    }
    
    // 获取对应的背景图片
    const selectedImage = moduleBackgrounds[pageType] || moduleBackgrounds['default'];
    
    // 设置标题区域的背景图片
    pageHeader.style.backgroundImage = `url(${selectedImage})`;
    pageHeader.style.backgroundPosition = 'center center';
    pageHeader.style.backgroundSize = 'cover';
    pageHeader.style.backgroundRepeat = 'no-repeat';
  }

  // 页面加载完成后设置背景
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setModuleBackground);
  } else {
    setModuleBackground();
  }

  // 如果启用了 pjax，在页面切换时也更新背景
  // 使用双重延迟确保 DOM 已经完全更新
  document.addEventListener('pjax:complete', () => {
    // 先等待一帧，再执行
    requestAnimationFrame(() => {
      setTimeout(setModuleBackground, 50);
    });
  });
})();

