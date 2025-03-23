// 文档列表模块JS功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否包含文档列表模块
    if (!document.getElementById('doc-list-module')) return;
    
    // 初始化文档列表功能
    initDocumentListModule();
});

// 初始化文档列表模块
function initDocumentListModule() {
    console.log('文档列表模块初始化');
    
    // 绑定事件处理器
    bindDocListEvents();
    
    // 加载文档列表数据
    loadDocuments();
}

// 加载文档列表数据
async function loadDocuments(filters = {}, page = 1, pageSize = 10) {
    // 显示加载状态
    const listContainer = document.querySelector('.doc-list-table tbody');
    if (listContainer) {
        listContainer.innerHTML = '<tr><td colspan="7" class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div></td></tr>';
    }
    
    try {
        // 构建查询参数
        const queryParams = new URLSearchParams({
            page: page,
            pageSize: pageSize,
            ...filters
        });
        
        // 实际项目中调用API
        // const response = await apiRequest(`documents?${queryParams}`);
        
        // 使用模拟数据 - 模拟异步加载
        setTimeout(() => {
            const mockSuccess = true;
            
            if (mockSuccess) {
                // 移除加载提示，使用预设的数据
                if (listContainer) {
                    // 在这里保留HTML中的预设数据行
                }
                
                // 初始化表格相关功能
                initTableFeatures();
            } else {
                if (listContainer) {
                    listContainer.innerHTML = '<tr><td colspan="7" class="text-center py-4">加载文档列表失败，请重试</td></tr>';
                }
            }
        }, 500);
    } catch (error) {
        console.error('加载文档列表出错:', error);
        if (listContainer) {
            listContainer.innerHTML = '<tr><td colspan="7" class="text-center py-4">加载文档列表时发生错误</td></tr>';
        }
    }
}

// 初始化表格相关功能
function initTableFeatures() {
    // 全选/取消全选
    const selectAllCheckbox = document.getElementById('select-all-docs');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const docCheckboxes = document.querySelectorAll('.doc-select');
            docCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            updateBatchActionBar();
        });
    }
    
    // 更新批量操作栏状态
    updateBatchActionBar();
}

// 绑定文档列表相关事件
function bindDocListEvents() {
    const moduleContainer = document.getElementById('doc-list-module');
    if (!moduleContainer) return;
    
    // 新建文档按钮点击
    const createDocBtn = moduleContainer.querySelector('.btn-primary');
    if (createDocBtn) {
        createDocBtn.addEventListener('click', function() {
            window.location.href = 'doc-edit.html?mode=create';
        });
    }
    
    // 高级筛选按钮点击
    const filterBtn = moduleContainer.querySelector('.btn-outline-secondary');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            alert('高级筛选功能将在后续版本中提供');
        });
    }
    
    // 文档搜索按钮点击
    const searchBtn = document.getElementById('doc-search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const keyword = document.getElementById('doc-search-input').value.trim();
            
            // 如果有搜索关键词，则执行搜索
            if (keyword) {
                loadDocuments({ keyword: keyword });
            }
        });
    }
    
    // 文档搜索输入框回车事件
    const searchInput = document.getElementById('doc-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = this.value.trim();
                if (keyword) {
                    loadDocuments({ keyword: keyword });
                }
            }
        });
    }
    
    // 监听单个文档选择状态变化
    moduleContainer.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('doc-select')) {
            updateBatchActionBar();
            
            // 更新全选框状态
            const selectAllCheckbox = document.getElementById('select-all-docs');
            const docCheckboxes = document.querySelectorAll('.doc-select');
            const checkedBoxes = document.querySelectorAll('.doc-select:checked');
            
            if (selectAllCheckbox) {
                if (docCheckboxes.length === checkedBoxes.length) {
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
            const selectedIds = getSelectedDocIds();
            
            if (selectedIds.length === 0) {
                showToast('请至少选择一个文档', 'warning');
                return;
            }
            
            switch (action) {
                case 'delete':
                    confirmBatchDelete(selectedIds);
                    break;
                case 'archive':
                    confirmBatchArchive(selectedIds);
                    break;
                case 'export':
                    batchExport(selectedIds);
                    break;
                default:
                    console.log(`执行批量${action}操作`, selectedIds);
            }
        });
    });
    
    // 单个文档操作按钮事件委托
    const tableBody = document.querySelector('.doc-list-table tbody');
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (!button) return;
            
            const row = button.closest('tr');
            const docId = row.querySelector('.doc-select').value;
            
            if (button.title === '查看详情') {
                viewDocument(docId);
            } else if (button.title === '编辑文档') {
                editDocument(docId);
            } else if (button.title === '删除文档') {
                deleteDocument(docId);
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
                loadDocuments({}, parseInt(page));
            }
        });
    });
}

// 更新批量操作栏显示状态
function updateBatchActionBar() {
    const selectedCount = document.querySelectorAll('.doc-select:checked').length;
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

// 获取选中的文档ID
function getSelectedDocIds() {
    const checkboxes = document.querySelectorAll('.doc-select:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// 查看文档详情
function viewDocument(id) {
    window.location.href = `doc-detail.html?id=${id}`;
}

// 编辑文档
function editDocument(id) {
    window.location.href = `doc-edit.html?id=${id}&mode=edit`;
}

// 删除文档
function deleteDocument(id) {
    if (confirm('确定要删除该文档吗？此操作不可恢复。')) {
        // 实际项目中调用API
        // apiRequest(`documents/${id}`, 'DELETE')
        
        // 模拟删除成功
        const row = document.querySelector(`.doc-select[value="${id}"]`).closest('tr');
        row.remove();
        
        showToast('文档删除成功');
    }
}

// 确认批量删除
function confirmBatchDelete(ids) {
    if (confirm(`确定要删除选中的 ${ids.length} 个文档吗？此操作不可恢复。`)) {
        // 实际项目中调用API
        // apiRequest('documents/batch-delete', 'POST', { ids })
        
        // 模拟删除成功
        ids.forEach(id => {
            const row = document.querySelector(`.doc-select[value="${id}"]`).closest('tr');
            row.remove();
        });
        
        showToast(`已成功删除 ${ids.length} 个文档`);
    }
}

// 确认批量归档
function confirmBatchArchive(ids) {
    if (confirm(`确定要归档选中的 ${ids.length} 个文档吗？`)) {
        // 实际项目中调用API
        // apiRequest('documents/batch-archive', 'POST', { ids })
        
        // 模拟操作成功
        ids.forEach(id => {
            const row = document.querySelector(`.doc-select[value="${id}"]`).closest('tr');
            const statusBadge = row.querySelector('.badge');
            
            if (statusBadge) {
                statusBadge.className = 'badge bg-secondary';
                statusBadge.textContent = '已归档';
            }
        });
        
        showToast(`已成功归档 ${ids.length} 个文档`);
    }
}

// 批量导出
function batchExport(ids) {
    // 实际项目中调用API
    // window.location.href = `api/v1/documents/export?ids=${ids.join(',')}`;
    
    // 模拟导出操作
    showToast(`正在导出 ${ids.length} 个文档，请稍候...`);
    
    setTimeout(() => {
        showToast('文档导出完成，请在下载中心查看');
    }, 2000);
} 