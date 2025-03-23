// 知识分类模块JS功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否包含知识分类模块
    if (!document.getElementById('knowledge-category-module')) return;
    
    // 初始化知识分类管理功能
    initKnowledgeCategoryModule();
});

// 初始化知识分类模块
function initKnowledgeCategoryModule() {
    console.log('知识分类模块初始化');
    
    // 绑定事件处理器
    bindCategoryEvents();
    
    // 初始化树形结构
    initCategoryTree();
}

// 绑定知识分类相关事件
function bindCategoryEvents() {
    const moduleContainer = document.getElementById('knowledge-category-module');
    if (!moduleContainer) return;
    
    // 新增分类按钮点击
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            openCategoryModal('add');
        });
    }
    
    // 全部展开按钮点击
    const expandAllBtn = document.getElementById('expand-all-btn');
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            expandAllCategories();
        });
    }
    
    // 全部折叠按钮点击
    const collapseAllBtn = document.getElementById('collapse-all-btn');
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() {
            collapseAllCategories();
        });
    }
    
    // 保存分类按钮点击
    const saveCategoryBtn = document.getElementById('save-category-btn');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', function() {
            saveCategory();
        });
    }
    
    // 确认删除按钮点击
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteCategory();
        });
    }
    
    // 使用事件委托处理树节点操作
    const categoryTree = document.querySelector('.category-tree');
    if (categoryTree) {
        categoryTree.addEventListener('click', function(e) {
            // 处理展开/折叠点击
            if (e.target.closest('.tree-toggle')) {
                const toggleIcon = e.target.closest('.tree-toggle');
                const treeItem = toggleIcon.closest('.tree-item');
                toggleCategory(treeItem);
                e.stopPropagation();
                return;
            }
            
            // 处理分类标签点击 (选中分类)
            if (e.target.closest('.tree-label')) {
                const treeItem = e.target.closest('.tree-item');
                selectCategory(treeItem);
                e.stopPropagation();
                return;
            }
            
            // 处理添加子分类按钮点击
            if (e.target.closest('button[title="添加子分类"]')) {
                const treeItem = e.target.closest('.tree-item');
                const categoryId = getCategoryId(treeItem);
                const categoryName = treeItem.querySelector('.tree-label').textContent;
                openCategoryModal('add', categoryId, categoryName);
                e.stopPropagation();
                return;
            }
            
            // 处理编辑分类按钮点击
            if (e.target.closest('button[title="编辑分类"]')) {
                const treeItem = e.target.closest('.tree-item');
                const categoryId = getCategoryId(treeItem);
                openCategoryModal('edit', categoryId);
                e.stopPropagation();
                return;
            }
            
            // 处理删除分类按钮点击
            if (e.target.closest('button[title="删除分类"]')) {
                const treeItem = e.target.closest('.tree-item');
                const categoryId = getCategoryId(treeItem);
                confirmDeleteCategory(categoryId);
                e.stopPropagation();
                return;
            }
        });
    }
}

// 初始化树形结构
function initCategoryTree() {
    // 初始化时默认展开第一级
    const firstLevelItems = document.querySelectorAll('.tree-root > .tree-item');
    firstLevelItems.forEach(item => {
        const children = item.querySelector('.tree-children');
        if (children) {
            children.style.display = 'block';
        }
    });
    
    // 默认选中第一个分类
    const firstCategory = document.querySelector('.tree-root > .tree-item:first-child');
    if (firstCategory) {
        selectCategory(firstCategory);
    }
}

// 展开或折叠分类
function toggleCategory(treeItem) {
    const children = treeItem.querySelector('.tree-children');
    const toggleIcon = treeItem.querySelector('.tree-toggle i');
    
    if (children) {
        if (children.style.display === 'none' || !children.style.display) {
            // 展开
            children.style.display = 'block';
            toggleIcon.className = 'bi bi-caret-down-fill';
        } else {
            // 折叠
            children.style.display = 'none';
            toggleIcon.className = 'bi bi-caret-right-fill';
        }
    }
}

// 展开所有分类
function expandAllCategories() {
    const allChildren = document.querySelectorAll('.tree-children');
    const allToggles = document.querySelectorAll('.tree-toggle i');
    
    allChildren.forEach(child => {
        child.style.display = 'block';
    });
    
    allToggles.forEach(toggle => {
        if (!toggle.closest('.invisible')) {
            toggle.className = 'bi bi-caret-down-fill';
        }
    });
    
    showToast('已展开所有分类');
}

// 折叠所有分类
function collapseAllCategories() {
    const allChildren = document.querySelectorAll('.tree-children');
    const allToggles = document.querySelectorAll('.tree-toggle i');
    
    allChildren.forEach(child => {
        child.style.display = 'none';
    });
    
    allToggles.forEach(toggle => {
        if (!toggle.closest('.invisible')) {
            toggle.className = 'bi bi-caret-right-fill';
        }
    });
    
    showToast('已折叠所有分类');
}

// 选择分类
function selectCategory(treeItem) {
    // 移除所有选中状态
    document.querySelectorAll('.tree-item-header').forEach(header => {
        header.classList.remove('active');
    });
    
    // 添加选中状态
    const header = treeItem.querySelector('.tree-item-header');
    header.classList.add('active');
    
    // 获取分类信息并显示详情
    const categoryId = getCategoryId(treeItem);
    const categoryName = treeItem.querySelector('.tree-label').textContent;
    
    loadCategoryDetails(categoryId, categoryName);
}

// 获取分类ID（模拟实现，实际项目中应从数据属性中获取）
function getCategoryId(treeItem) {
    // 根据节点在树中的位置模拟一个ID
    const categoryName = treeItem.querySelector('.tree-label').textContent;
    return categoryName.replace(/\s+/g, '-').toLowerCase();
}

// 加载分类详情
function loadCategoryDetails(categoryId, categoryName) {
    const detailsContainer = document.getElementById('category-details');
    if (!detailsContainer) return;
    
    // 显示加载状态
    detailsContainer.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div></div>';
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 模拟分类详情数据
        const categoryDetails = getMockCategoryDetails(categoryId, categoryName);
        
        // 更新详情显示
        renderCategoryDetails(detailsContainer, categoryDetails);
    }, 500);
}

// 获取模拟分类详情
function getMockCategoryDetails(categoryId, categoryName) {
    // 根据分类ID和名称生成模拟数据
    const createdDate = '2023-01-15';
    let docCount = 0;
    let description = '';
    let path = '';
    
    // 根据分类名称设置不同的模拟数据
    switch (categoryName) {
        case '技术文档':
            docCount = 125;
            description = '包含各类技术规范、设计文档、接口说明等技术相关文档';
            path = '/技术文档';
            break;
        case '接口文档':
            docCount = 56;
            description = '系统各模块的API接口说明文档，包括参数、返回值等详细说明';
            path = '/技术文档/接口文档';
            break;
        case 'REST API设计规范':
            docCount = 18;
            description = '公司内部REST API设计标准规范，包含命名规则、状态码使用、安全认证等内容';
            path = '/技术文档/接口文档/REST API设计规范';
            break;
        case 'WebSocket接口规范':
            docCount = 12;
            description = 'WebSocket接口设计与实现规范，包含连接管理、消息格式、心跳机制等内容';
            path = '/技术文档/接口文档/WebSocket接口规范';
            break;
        case '架构设计':
            docCount = 38;
            description = '系统架构设计相关文档，包括整体架构、模块设计、数据流转等内容';
            path = '/技术文档/架构设计';
            break;
        case '开发规范':
            docCount = 31;
            description = '前后端开发规范文档，包括代码风格、命名规则、注释规范等内容';
            path = '/技术文档/开发规范';
            break;
        case '管理文档':
            docCount = 87;
            description = '项目管理、任务分配、会议记录等管理相关文档';
            path = '/管理文档';
            break;
        case '培训资料':
            docCount = 64;
            description = '技术培训、新员工培训、业务知识培训等资料';
            path = '/培训资料';
            break;
        default:
            docCount = Math.floor(Math.random() * 100);
            description = `${categoryName}相关文档集合`;
            path = `/${categoryName}`;
    }
    
    return {
        id: categoryId,
        name: categoryName,
        description: description,
        path: path,
        createdDate: createdDate,
        lastModified: '2023-06-02',
        createdBy: '张工',
        docCount: docCount,
        childCategories: getCategoryChildCount(categoryId),
        permissions: ['管理员', '开发人员', '产品经理']
    };
}

// 获取子分类数量
function getCategoryChildCount(categoryId) {
    // 模拟根据分类ID返回子分类数量
    const categoryMap = {
        'rest-api设计规范': 0,
        'websocket接口规范': 0,
        '接口文档': 2,
        '架构设计': 3,
        '开发规范': 5,
        '技术文档': 3,
        '管理文档': 4,
        '培训资料': 6
    };
    
    return categoryMap[categoryId] || 0;
}

// 渲染分类详情
function renderCategoryDetails(container, details) {
    container.innerHTML = `
        <div class="category-info">
            <h4 class="mb-3">${details.name}</h4>
            <p class="text-muted">${details.description}</p>
            
            <div class="mb-3">
                <small class="text-muted d-block mb-1">分类路径:</small>
                <div class="bg-light p-2 rounded">${details.path}</div>
            </div>
            
            <div class="row mb-3">
                <div class="col-6">
                    <small class="text-muted d-block mb-1">创建日期:</small>
                    <div>${details.createdDate}</div>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block mb-1">最后修改:</small>
                    <div>${details.lastModified}</div>
                </div>
            </div>
            
            <div class="mb-3">
                <small class="text-muted d-block mb-1">创建人:</small>
                <div>${details.createdBy}</div>
            </div>
            
            <div class="row mb-3">
                <div class="col-6">
                    <small class="text-muted d-block mb-1">文档数量:</small>
                    <div><strong class="text-primary">${details.docCount}</strong> 个文档</div>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block mb-1">子分类:</small>
                    <div><strong class="text-success">${details.childCategories}</strong> 个子分类</div>
                </div>
            </div>
            
            <div class="mb-3">
                <small class="text-muted d-block mb-1">可访问角色:</small>
                <div>
                    ${details.permissions.map(p => `<span class="badge bg-light text-dark me-1">${p}</span>`).join('')}
                </div>
            </div>
            
            <div class="mt-4">
                <button class="btn btn-outline-primary btn-sm me-2">
                    <i class="bi bi-box-arrow-up-right me-1"></i>浏览文档
                </button>
                <button class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-gear me-1"></i>权限设置
                </button>
            </div>
        </div>
    `;
}

// 打开分类编辑模态框
function openCategoryModal(mode, categoryId = null, parentName = null) {
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    const modalTitle = document.getElementById('categoryModalLabel');
    const categoryForm = document.getElementById('category-form');
    const categoryIdInput = document.getElementById('category-id');
    const parentCategorySelect = document.getElementById('parent-category');
    
    // 重置表单
    categoryForm.reset();
    categoryForm.classList.remove('was-validated');
    
    if (mode === 'add') {
        modalTitle.textContent = parentName ? `添加"${parentName}"的子分类` : '添加分类';
        
        // 如果是添加子分类，设置父级分类
        if (categoryId && parentCategorySelect) {
            // 查找匹配的选项
            const options = Array.from(parentCategorySelect.options);
            const matchingOption = options.find(option => option.value === categoryId);
            
            if (matchingOption) {
                matchingOption.selected = true;
            }
        }
        
        if (categoryIdInput) categoryIdInput.value = '';
    } else if (mode === 'edit') {
        modalTitle.textContent = '编辑分类';
        
        if (categoryIdInput) categoryIdInput.value = categoryId;
        
        // 加载分类数据
        loadCategoryForEdit(categoryId);
    }
    
    modal.show();
}

// 加载分类数据用于编辑
function loadCategoryForEdit(categoryId) {
    // 实际项目中应调用API获取分类详情
    // 这里使用模拟数据
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 根据ID获取树节点
        const treeItem = document.querySelector(`.tree-item[data-id="${categoryId}"]`) || 
                          getTreeItemByLabel(categoryId);
        
        if (!treeItem) return;
        
        const categoryName = treeItem.querySelector('.tree-label').textContent;
        
        // 填充表单
        document.getElementById('category-name').value = categoryName;
        
        // 根据分类名称模拟其他字段
        let description = '';
        let icon = 'folder-fill';
        let visible = true;
        
        // 模拟父级分类选择
        let parentValue = '';
        
        const parentItem = treeItem.closest('.tree-children')?.closest('.tree-item');
        if (parentItem) {
            const parentLabel = parentItem.querySelector('.tree-label').textContent;
            const parentId = getCategoryId(parentItem);
            
            // 查找匹配的选项
            const parentCategorySelect = document.getElementById('parent-category');
            const options = Array.from(parentCategorySelect.options);
            const matchingOption = options.find(option => 
                option.textContent.includes(parentLabel) || option.value === parentId
            );
            
            if (matchingOption) {
                matchingOption.selected = true;
            }
        }
        
        // 根据分类名称模拟描述
        switch (categoryName) {
            case '技术文档':
                description = '包含各类技术规范、设计文档、接口说明等技术相关文档';
                break;
            case '接口文档':
                description = '系统各模块的API接口说明文档，包括参数、返回值等详细说明';
                break;
            case 'REST API设计规范':
                description = '公司内部REST API设计标准规范，包含命名规则、状态码使用、安全认证等内容';
                icon = 'file-earmark-text';
                break;
            case 'WebSocket接口规范':
                description = 'WebSocket接口设计与实现规范，包含连接管理、消息格式、心跳机制等内容';
                icon = 'file-earmark-text';
                break;
            default:
                description = `${categoryName}相关文档集合`;
        }
        
        document.getElementById('category-description').value = description;
        
        // 设置图标
        const iconSelect = document.getElementById('category-icon');
        const options = Array.from(iconSelect.options);
        const matchingOption = options.find(option => option.value === icon);
        if (matchingOption) {
            matchingOption.selected = true;
        }
        
        // 设置可见性
        document.getElementById('category-visible').checked = visible;
    }, 300);
}

// 根据标签文本查找树节点
function getTreeItemByLabel(labelText) {
    const treeLabels = document.querySelectorAll('.tree-label');
    for (const label of treeLabels) {
        if (label.textContent.trim() === labelText || 
            getCategoryId({querySelector: () => label}) === labelText) {
            return label.closest('.tree-item');
        }
    }
    return null;
}

// 保存分类
function saveCategory() {
    const form = document.getElementById('category-form');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // 获取表单数据
    const categoryData = {
        id: document.getElementById('category-id').value,
        name: document.getElementById('category-name').value,
        parentId: document.getElementById('parent-category').value,
        icon: document.getElementById('category-icon').value,
        description: document.getElementById('category-description').value,
        visible: document.getElementById('category-visible').checked
    };
    
    console.log('保存分类数据:', categoryData);
    
    // 实际项目中应调用API保存分类
    // 这里模拟保存成功
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    if (modal) {
        modal.hide();
    }
    
    // 显示成功提示
    showToast(categoryData.id ? '分类更新成功' : '分类创建成功');
    
    // 更新UI (实际项目中应重新加载分类树)
    if (!categoryData.id) {
        // 模拟添加新分类
        addCategoryToTree(categoryData);
    } else {
        // 模拟更新分类
        updateCategoryInTree(categoryData);
    }
}

// 添加分类到树形结构
function addCategoryToTree(categoryData) {
    let parentElement;
    
    if (categoryData.parentId) {
        // 查找父级分类
        const parentItem = getTreeItemByLabel(categoryData.parentId);
        
        if (parentItem) {
            // 查找或创建子分类容器
            let childrenContainer = parentItem.querySelector('.tree-children');
            
            if (!childrenContainer) {
                childrenContainer = document.createElement('ul');
                childrenContainer.className = 'tree-children';
                parentItem.appendChild(childrenContainer);
                
                // 更新父级的折叠图标
                const parentToggle = parentItem.querySelector('.tree-toggle');
                if (parentToggle) {
                    parentToggle.classList.remove('invisible');
                    parentToggle.querySelector('i').className = 'bi bi-caret-down-fill';
                }
            }
            
            parentElement = childrenContainer;
        } else {
            // 如果找不到父级，添加到根目录
            parentElement = document.querySelector('.tree-root');
        }
    } else {
        // 顶级分类添加到根目录
        parentElement = document.querySelector('.tree-root');
    }
    
    if (parentElement) {
        // 创建新的分类项
        const newItem = document.createElement('li');
        newItem.className = 'tree-item';
        newItem.setAttribute('data-id', categoryData.name.replace(/\s+/g, '-').toLowerCase());
        
        // 根据是否是叶子节点设置不同的HTML
        const isLeaf = categoryData.icon !== 'folder-fill';
        const toggleClass = isLeaf ? 'invisible' : '';
        const iconClass = isLeaf ? 'bi-file-earmark-text' : 'bi-folder-fill text-warning';
        
        newItem.innerHTML = `
            <div class="tree-item-header">
                <span class="tree-toggle ${toggleClass}">
                    <i class="bi bi-caret-right-fill"></i>
                </span>
                <i class="bi ${iconClass} me-2"></i>
                <span class="tree-label">${categoryData.name}</span>
                <span class="badge bg-primary ms-2">0</span>
                <div class="tree-actions">
                    <button class="btn btn-sm btn-outline-primary" title="添加子分类">
                        <i class="bi bi-plus-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" title="编辑分类">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="删除分类">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        parentElement.appendChild(newItem);
        
        // 确保父元素是显示的
        if (parentElement.className === 'tree-children') {
            parentElement.style.display = 'block';
        }
    }
}

// 更新树中的分类
function updateCategoryInTree(categoryData) {
    const treeItem = getTreeItemByLabel(categoryData.id);
    
    if (treeItem) {
        // 更新标签
        const treeLabel = treeItem.querySelector('.tree-label');
        if (treeLabel) {
            treeLabel.textContent = categoryData.name;
        }
        
        // 更新图标
        const treeIcon = treeItem.querySelector('.tree-item-header > i.bi');
        if (treeIcon) {
            const iconClass = categoryData.icon === 'folder-fill' ? 
                              'bi-folder-fill text-warning' : 
                              'bi-file-earmark-text';
            treeIcon.className = `bi ${iconClass} me-2`;
        }
        
        // 如果分类详情正在显示，则更新详情
        const selectedHeader = document.querySelector('.tree-item-header.active');
        if (selectedHeader && selectedHeader === treeItem.querySelector('.tree-item-header')) {
            loadCategoryDetails(categoryData.id, categoryData.name);
        }
    }
}

// 确认删除分类
function confirmDeleteCategory(categoryId) {
    const treeItem = getTreeItemByLabel(categoryId);
    if (!treeItem) return;
    
    const categoryName = treeItem.querySelector('.tree-label').textContent;
    
    // 显示确认对话框
    const confirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    
    // 存储要删除的分类ID
    document.getElementById('deleteConfirmModal').setAttribute('data-category-id', categoryId);
    
    // 更新确认文本
    const modalBody = document.querySelector('#deleteConfirmModal .modal-body');
    if (modalBody) {
        modalBody.innerHTML = `
            <p>确定要删除"${categoryName}"分类吗？此操作将同时删除其下所有子分类。</p>
            <p class="text-danger"><strong>注意：</strong> 该操作不可恢复！</p>
        `;
    }
    
    confirmModal.show();
}

// 删除分类
function deleteCategory() {
    const modal = document.getElementById('deleteConfirmModal');
    const categoryId = modal.getAttribute('data-category-id');
    
    if (!categoryId) return;
    
    const treeItem = getTreeItemByLabel(categoryId);
    if (!treeItem) return;
    
    // 实际项目中应调用API删除分类
    console.log('删除分类:', categoryId);
    
    // 模拟删除成功
    treeItem.remove();
    
    // 关闭确认对话框
    const confirmModal = bootstrap.Modal.getInstance(modal);
    if (confirmModal) {
        confirmModal.hide();
    }
    
    // 显示成功提示
    showToast('分类删除成功');
    
    // 更新分类详情区域
    const detailsContainer = document.getElementById('category-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-arrow-left-circle fs-2"></i>
                <p class="mt-2">请从左侧选择一个分类查看详情</p>
            </div>
        `;
    }
}

// 在admin-core.js中已定义的showToast函数，这里仅为兼容性提供一个简单实现
function showToast(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
} 