// 管理后台前端交互JS
document.addEventListener('DOMContentLoaded', function() {
    // 初始化菜单交互
    initSidebar();
    
    // 模块页面加载处理
    initModuleLoading();
    
    // 初始化面包屑导航
    updateBreadcrumb();
});

// 初始化侧边栏交互功能
function initSidebar() {
    // 侧边栏收缩/展开
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }
    
    // 菜单展开/折叠
    const menuItems = document.querySelectorAll('.menu-item.has-submenu > .menu-link');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parent = this.parentElement;
            
            // 关闭其他已展开的菜单
            if (!parent.classList.contains('open')) {
                const openMenus = document.querySelectorAll('.menu-item.has-submenu.open');
                openMenus.forEach(menu => {
                    if (menu !== parent && !menu.contains(parent) && !parent.contains(menu)) {
                        menu.classList.remove('open');
                    }
                });
            }
            
            parent.classList.toggle('open');
        });
    });
    
    // 三级菜单交互
    const subMenuItems = document.querySelectorAll('.submenu-item.has-submenu > .submenu-link');
    subMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const parent = this.parentElement;
            parent.classList.toggle('open');
        });
    });
}

// 初始化模块加载功能
function initModuleLoading() {
    // 获取所有模块链接
    const moduleLinks = document.querySelectorAll('[data-module]');
    
    // 为每个链接添加点击事件
    moduleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取模块ID
            const moduleId = this.getAttribute('data-module');
            
            // 加载模块内容
            loadModule(moduleId);
            
            // 更新活动菜单状态
            updateActiveMenu(this);
            
            // 更新面包屑
            updateBreadcrumb(this);
        });
    });
}

// 加载模块内容
async function loadModule(moduleId) {
    try {
        // 显示加载状态
        const moduleContent = document.getElementById('module-content');
        moduleContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div><p class="mt-3">正在加载模块内容...</p></div>';
        
        // 构建模块HTML文件路径
        const modulePath = `modules/${moduleId}.html`;
        
        console.log('正在加载模块:', modulePath);
        
        // 加载模块HTML内容
        const response = await fetch(modulePath);
        
        if (!response.ok) {
            throw new Error(`无法加载模块 ${moduleId}: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // 更新页面内容
        moduleContent.innerHTML = html;
        
        // 添加active类，确保模块显示
        const modulePanel = document.querySelector(`#${moduleId}-module`);
        if (modulePanel) {
            modulePanel.classList.add('active');
        }
        
        // 加载模块特定的JS文件
        loadModuleJS(moduleId);
        
    } catch (error) {
        console.error('加载模块出错:', error);
        document.getElementById('module-content').innerHTML = `
            <div class="alert alert-danger m-4" role="alert">
                <h4 class="alert-heading">加载模块失败</h4>
                <p>${error.message}</p>
                <hr>
                <p class="mb-0">请稍后重试或联系系统管理员。</p>
            </div>
        `;
    }
}

// 加载模块特定的JS文件
function loadModuleJS(moduleId) {
    // 检查是否已经加载过
    const existingScript = document.querySelector(`script[src="js/modules/${moduleId}.js"]`);
    if (existingScript) {
        // 如果已加载，直接初始化
        setTimeout(() => {
            if (typeof loadModuleSpecificFunctions === 'function') {
                loadModuleSpecificFunctions();
            }
        }, 100);
        return;
    }
    
    // 创建并添加脚本元素
    const script = document.createElement('script');
    script.src = `js/modules/${moduleId}.js`;
    
    // 脚本加载成功后初始化模块功能
    script.onload = () => {
        console.log(`模块JS文件加载成功: ${moduleId}.js`);
        if (typeof loadModuleSpecificFunctions === 'function') {
            setTimeout(() => {
                loadModuleSpecificFunctions();
            }, 100);
        }
    };
    
    script.onerror = () => console.error(`模块JS文件加载失败: ${moduleId}.js`);
    document.body.appendChild(script);
}

// 更新活动菜单状态
function updateActiveMenu(clickedLink) {
    // 清除所有活动状态
    document.querySelectorAll('.menu-item.active, .submenu-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前点击链接的活动状态
    let menuItem = clickedLink.closest('.submenu-item') || clickedLink.closest('.menu-item');
    menuItem.classList.add('active');
    
    // 如果是子菜单项，也设置父级菜单为活动状态
    const parentMenu = clickedLink.closest('.submenu') ? clickedLink.closest('.menu-item.has-submenu') : null;
    if (parentMenu) {
        parentMenu.classList.add('active');
    }
}

// 更新面包屑导航
function updateBreadcrumb(clickedLink) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    // 如果没有点击链接，则显示默认面包屑
    if (!clickedLink) {
        breadcrumb.innerHTML = `<li class="breadcrumb-item"><a href="#">首页</a></li>`;
        return;
    }
    
    // 构建面包屑路径
    let items = [];
    
    // 添加首页
    items.push(`<li class="breadcrumb-item"><a href="#">首页</a></li>`);
    
    // 添加父级菜单
    const parentMenu = clickedLink.closest('.submenu');
    if (parentMenu) {
        const parentLink = parentMenu.previousElementSibling;
        if (parentLink && parentLink.classList.contains('menu-link')) {
            const parentText = parentLink.querySelector('span').textContent;
            items.push(`<li class="breadcrumb-item"><a href="#">${parentText}</a></li>`);
        }
        
        // 如果是三级菜单，添加二级菜单
        const grandParentMenu = parentMenu.classList.contains('level-three') ? parentMenu.parentElement.closest('.submenu') : null;
        if (grandParentMenu) {
            const grandParentLink = grandParentMenu.previousElementSibling;
            if (grandParentLink && grandParentLink.classList.contains('submenu-link')) {
                const linkText = grandParentLink.querySelector('span').textContent;
                items.splice(2, 0, `<li class="breadcrumb-item"><a href="#">${linkText}</a></li>`);
            }
        }
    }
    
    // 添加当前页面
    const currentText = clickedLink.querySelector('span').textContent;
    items.push(`<li class="breadcrumb-item active" aria-current="page">${currentText}</li>`);
    
    // 更新面包屑HTML
    breadcrumb.innerHTML = items.join('');
}

// 显示提示消息
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container') || (() => {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
        return container;
    })();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
} 