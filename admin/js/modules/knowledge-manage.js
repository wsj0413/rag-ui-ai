// 知识库管理模块JS功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否包含知识库管理模块
    if (!document.getElementById('knowledge-manage-module')) return;
    
    // 初始化知识库管理功能
    initKnowledgeManage();
});

function initKnowledgeManage() {
    console.log('知识库管理模块初始化');
    
    // 绑定事件处理器
    bindKnowledgeManageEvents();
    
    // 加载知识库列表
    loadKnowledgeBases();
}

// 加载知识库列表数据
async function loadKnowledgeBases(filters = {}, page = 1, pageSize = 10) {
    // 显示加载状态
    const listContainer = document.querySelector('.knowledge-list-table tbody');
    if (listContainer) {
        listContainer.innerHTML = '<tr><td colspan="8" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div></td></tr>';
    }
    
    try {
        // 构建查询参数
        const queryParams = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            ...filters
        });
        
        // 实际项目中调用API
        // const response = await apiRequest(`knowledge-bases?${queryParams}`);
        
        // 使用模拟数据 - 数据已在HTML中预设，这里模拟异步加载
        setTimeout(() => {
            const mockSuccess = true;
            
            if (mockSuccess) {
                // 移除加载提示，HTML中已包含模拟数据行
                if (listContainer) {
                    // 这里保留HTML中的预设数据
                }
                
                // 初始化表格相关功能
                initTableFeatures();
            } else {
                if (listContainer) {
                    listContainer.innerHTML = '<tr><td colspan="8" class="text-center py-4">加载知识库列表失败，请重试</td></tr>';
                }
            }
        }, 500);
    } catch (error) {
        console.error('加载知识库列表错误:', error);
        if (listContainer) {
            listContainer.innerHTML = '<tr><td colspan="8" class="text-center py-4">加载知识库列表时发生错误</td></tr>';
        }
    }
}

// 初始化表格相关功能
function initTableFeatures() {
    // 全选/取消全选
    const selectAllCheckbox = document.getElementById('select-all-knowledge');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const knowledgeCheckboxes = document.querySelectorAll('.knowledge-select');
            knowledgeCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            updateBatchActionBar();
        });
    }
    
    // 更新批量操作栏状态
    updateBatchActionBar();
}

// 绑定知识库管理相关事件
function bindKnowledgeManageEvents() {
    const moduleContainer = document.getElementById('knowledge-manage-module');
    if (!moduleContainer) return;
    
    // 创建知识库按钮点击
    const createKnowledgeBaseBtn = document.getElementById('create-knowledge-base-btn');
    if (createKnowledgeBaseBtn) {
        createKnowledgeBaseBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('createKnowledgeBaseModal'));
            modal.show();
        });
    }
    
    // 保存知识库按钮点击
    const saveKnowledgeBtn = document.getElementById('save-knowledge-btn');
    if (saveKnowledgeBtn) {
        saveKnowledgeBtn.addEventListener('click', function() {
            saveKnowledgeBase();
        });
    }
    
    // 导入知识库按钮点击
    const importKnowledgeBaseBtn = document.getElementById('import-knowledge-base-btn');
    if (importKnowledgeBaseBtn) {
        importKnowledgeBaseBtn.addEventListener('click', function() {
            alert('导入知识库功能将在后续版本中提供');
        });
    }
    
    // 知识库搜索按钮点击
    const searchBtn = document.getElementById('knowledge-search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const keyword = document.getElementById('knowledge-search-input').value.trim();
            
            // 如果有搜索关键词，则执行搜索
            if (keyword) {
                loadKnowledgeBases({ keyword: keyword });
            }
        });
    }
    
    // 知识库搜索输入框回车事件
    const searchInput = document.getElementById('knowledge-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = this.value.trim();
                if (keyword) {
                    loadKnowledgeBases({ keyword: keyword });
                }
            }
        });
    }
    
    // 监听单个知识库选择状态变化
    moduleContainer.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('knowledge-select')) {
            updateBatchActionBar();
            
            // 更新全选框状态
            const selectAllCheckbox = document.getElementById('select-all-knowledge');
            const knowledgeCheckboxes = document.querySelectorAll('.knowledge-select');
            const checkedBoxes = document.querySelectorAll('.knowledge-select:checked');
            
            if (selectAllCheckbox) {
                if (knowledgeCheckboxes.length === checkedBoxes.length) {
                    selectAllCheckbox.checked = true;
                    selectAllCheckbox.indeterminate = false;
                } else if (checkedBoxes.length === 0) {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                } else {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = true;
                }
            }
        }
    });
    
    // 批量操作按钮点击
    const batchActionButtons = document.querySelectorAll('.batch-actions button');
    batchActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const selectedIds = getSelectedKnowledgeIds();
            
            if (selectedIds.length === 0) {
                showToast('请至少选择一个知识库', 'warning');
                return;
            }
            
            switch (action) {
                case 'delete':
                    confirmBatchDelete(selectedIds);
                    break;
                case 'disable':
                    confirmBatchDisable(selectedIds);
                    break;
                case 'export':
                    batchExport(selectedIds);
                    break;
                default:
                    console.log(`执行批量${action}操作`, selectedIds);
            }
        });
    });
    
    // 单个知识库操作按钮事件委托
    const tableBody = document.querySelector('.knowledge-list-table tbody');
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (!button) return;
            
            const row = button.closest('tr');
            const knowledgeId = row.querySelector('.knowledge-select').value;
            
            if (button.title === '查看详情') {
                viewKnowledgeBase(knowledgeId);
            } else if (button.title === '编辑配置') {
                editKnowledgeBase(knowledgeId);
            } else if (button.title === '停用' || button.title === '启用') {
                toggleKnowledgeBaseStatus(knowledgeId, button.title === '启用');
            }
        });
    }
    
    // 分页按钮点击
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const page = this.textContent;
            if (!isNaN(page)) {
                loadKnowledgeBases({}, parseInt(page));
            }
        });
    });
}

// 更新批量操作栏显示状态
function updateBatchActionBar() {
    const selectedCount = document.querySelectorAll('.knowledge-select:checked').length;
    const batchActions = document.querySelector('.batch-actions');
    
    if (batchActions) {
        if (selectedCount > 0) {
            batchActions.style.opacity = '1';
            batchActions.style.pointerEvents = 'auto';
        } else {
            batchActions.style.opacity = '0.5';
            batchActions.style.pointerEvents = 'none';
        }
    }
}

// 获取选中的知识库ID
function getSelectedKnowledgeIds() {
    const checkboxes = document.querySelectorAll('.knowledge-select:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 保存知识库
function saveKnowledgeBase() {
    const form = document.getElementById('create-knowledge-form');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // 获取表单数据
    const knowledgeData = {
        name: document.getElementById('knowledge-name').value,
        description: document.getElementById('knowledge-desc').value,
        category: document.getElementById('knowledge-category').value,
        icon: document.getElementById('knowledge-icon').value,
        settings: {
            versioning: document.getElementById('enable-versioning').checked,
            comments: document.getElementById('enable-comments').checked,
            export: document.getElementById('enable-export').checked
        }
    };
    
    // 实际项目中调用API
    // apiRequest('knowledge-bases', 'POST', knowledgeData)
    
    // 模拟保存操作
    console.log('保存知识库数据:', knowledgeData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('createKnowledgeBaseModal'));
    if (modal) {
        modal.hide();
    }
    
    // 显示成功提示
    showToast('知识库创建成功');
    
    // 重新加载知识库列表
    loadKnowledgeBases();
}

// 查看知识库详情
function viewKnowledgeBase(id) {
    console.log('查看知识库详情:', id);
    window.location.href = `knowledge-detail.html?id=${id}`;
}

// 编辑知识库
function editKnowledgeBase(id) {
    console.log('编辑知识库:', id);
    window.location.href = `knowledge-edit.html?id=${id}`;
}

// 切换知识库状态
function toggleKnowledgeBaseStatus(id, enable) {
    const action = enable ? '启用' : '停用';
    
    if (confirm(`确定要${action}该知识库吗？`)) {
        console.log(`${action}知识库:`, id);
        
        // 实际项目中调用API
        // apiRequest(`knowledge-bases/${id}/status`, 'PATCH', { enabled: enable })
        
        // 模拟操作成功
        const row = document.querySelector(`.knowledge-select[value="${id}"]`).closest('tr');
        const statusBadge = row.querySelector('.badge');
        const statusButton = row.querySelector('.btn-outline-danger, .btn-outline-success');
        
        if (enable) {
            statusBadge.className = 'badge bg-success';
            statusBadge.textContent = '已启用';
            statusButton.className = 'btn btn-sm btn-outline-danger';
            statusButton.title = '停用';
        } else {
            statusBadge.className = 'badge bg-secondary';
            statusBadge.textContent = '已禁用';
            statusButton.className = 'btn btn-sm btn-outline-success';
            statusButton.title = '启用';
        }
        
        showToast(`知识库已成功${action}`);
    }
}

// 确认批量删除
function confirmBatchDelete(ids) {
    if (confirm(`确定要删除选中的 ${ids.length} 个知识库吗？此操作不可恢复。`)) {
        console.log('批量删除知识库:', ids);
        
        // 实际项目中调用API
        // apiRequest('knowledge-bases/batch-delete', 'POST', { ids })
        
        // 模拟删除成功
        ids.forEach(id => {
            const row = document.querySelector(`.knowledge-select[value="${id}"]`).closest('tr');
            row.remove();
        });
        
        showToast(`已成功删除 ${ids.length} 个知识库`);
        
        // 更新计数
        updateKnowledgeCount(-ids.length);
    }
}

// 确认批量禁用
function confirmBatchDisable(ids) {
    if (confirm(`确定要禁用选中的 ${ids.length} 个知识库吗？`)) {
        console.log('批量禁用知识库:', ids);
        
        // 实际项目中调用API
        // apiRequest('knowledge-bases/batch-status', 'PATCH', { ids, enabled: false })
        
        // 模拟操作成功
        ids.forEach(id => {
            const row = document.querySelector(`.knowledge-select[value="${id}"]`).closest('tr');
            const statusBadge = row.querySelector('.badge');
            const statusButton = row.querySelector('.btn-outline-danger, .btn-outline-success');
            
            statusBadge.className = 'badge bg-secondary';
            statusBadge.textContent = '已禁用';
            statusButton.className = 'btn btn-sm btn-outline-success';
            statusButton.title = '启用';
        });
        
        showToast(`已成功禁用 ${ids.length} 个知识库`);
    }
}

// 批量导出
function batchExport(ids) {
    console.log('批量导出知识库:', ids);
    
    // 实际项目中调用API
    // window.location.href = `api/v1/knowledge-bases/export?ids=${ids.join(',')}`;
    
    // 模拟导出操作
    showToast(`正在导出 ${ids.length} 个知识库，请稍候...`);
    
    setTimeout(() => {
        showToast('知识库导出完成，请在下载中心查看');
    }, 2000);
}

// 更新知识库计数
function updateKnowledgeCount(change) {
    const countElement = document.querySelector('.stat-cards .stat-number:first-child');
    if (countElement) {
        const currentCount = parseInt(countElement.textContent);
        if (!isNaN(currentCount)) {
            countElement.textContent = currentCount + change;
        }
    }
} 