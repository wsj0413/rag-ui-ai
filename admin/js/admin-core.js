// 管理后台核心JS文件
document.addEventListener('DOMContentLoaded', function() {
    // 全局变量和配置
    window.CONFIG = {
        apiBaseUrl: 'api/v1',
        defaultPageSize: 20,
        toastDuration: 3000,
        dateFormat: 'YYYY-MM-DD',
        defaultLang: 'zh-CN'
    };

    // 绑定通用事件处理器
    bindCommonEventHandlers();
});

// 根据当前页面加载特定模块的函数
function loadModuleSpecificFunctions() {
    // 获取当前页面模块ID
    const modulePanel = document.querySelector('.module-panel.active');
    if (!modulePanel) {
        console.log('未找到活动的模块面板');
        return;
    }
    
    const moduleId = modulePanel.id;
    console.log('初始化模块功能:', moduleId);
    
    // 根据不同模块加载特定功能
    switch(moduleId) {
        case 'doc-list-module':
            if (typeof initDocumentListModule === 'function') {
                initDocumentListModule();
            } else {
                console.log('未找到函数: initDocumentListModule');
            }
            break;
        case 'knowledge-manage-module':
            if (typeof initKnowledgeManage === 'function') {
                initKnowledgeManage();
            } else {
                console.log('未找到函数: initKnowledgeManage');
            }
            break;
        case 'knowledge-category-module':
            if (typeof initKnowledgeCategoryModule === 'function') {
                initKnowledgeCategoryModule();
            } else {
                console.log('未找到函数: initKnowledgeCategoryModule');
            }
            break;
        case 'permission-matrix-module':
            if (typeof initPermissionMatrixModule === 'function') {
                initPermissionMatrixModule();
            } else {
                console.log('未找到函数: initPermissionMatrixModule');
            }
            break;
        case 'knowledge-trends-module':
            if (typeof initKnowledgeTrendsModule === 'function') {
                initKnowledgeTrendsModule();
            } else {
                console.log('未找到函数: initKnowledgeTrendsModule');
            }
            break;
        case 'system-params-module':
            if (typeof initSystemParamsModule === 'function') {
                initSystemParamsModule();
            } else {
                console.log('未找到函数: initSystemParamsModule');
            }
            break;
        case 'search-results-module':
            if (typeof initSearchResultsModule === 'function') {
                initSearchResultsModule();
            } else {
                console.log('未找到函数: initSearchResultsModule');
            }
            break;
        case 'doc-detail-module':
            if (typeof initDocDetailModule === 'function') {
                initDocDetailModule();
            } else {
                console.log('未找到函数: initDocDetailModule');
            }
            break;
        default:
            console.log('无需初始化特定功能的模块:', moduleId);
    }
}

// 绑定通用事件处理器
function bindCommonEventHandlers() {
    // 表单提交前验证
    const forms = document.querySelectorAll('form.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
    
    // 确认操作对话框
    const confirmActions = document.querySelectorAll('[data-confirm]');
    confirmActions.forEach(element => {
        element.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm') || '确定要执行此操作吗？';
            if (!confirm(message)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    // 返回上一页按钮
    const backButtons = document.querySelectorAll('.btn-back');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    });
}

// 通用的toast消息提示函数
window.showToast = function(message, type = 'success') {
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

// 通用的HTTP请求函数
window.apiRequest = async function(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.apiBaseUrl}/${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': localStorage.getItem('auth-token') || ''
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        
        // 处理未授权错误
        if (response.status === 401) {
            localStorage.removeItem('auth-token');
            window.location.href = '/admin/login.html';
            return null;
        }
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || '请求失败');
        }
        
        return result;
    } catch (error) {
        console.error('API请求错误:', error);
        showToast(error.message || '服务器连接错误', 'error');
        return null;
    }
}

// 模拟API请求的函数（开发测试用）
function mockApiRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve) => {
        console.log(`Mock API ${method} 请求: ${endpoint}`, data);
        
        setTimeout(() => {
            // 根据不同的endpoint返回不同的模拟数据
            let responseData = { success: true, message: '操作成功' };
            
            if (endpoint.includes('documents') && method === 'GET') {
                responseData.data = getMockDocuments();
            } else if (endpoint.includes('permissions') && method === 'GET') {
                responseData.data = getMockPermissions();
            } else if (endpoint.includes('stats') && method === 'GET') {
                responseData.data = getMockStats();
            }
            
            resolve(responseData);
        }, 300); // 模拟网络延迟
    });
}

// 获取模拟文档数据
function getMockDocuments() {
    return [
        {
            id: 1,
            name: 'API接口设计规范文档',
            category: '技术文档',
            creator: '张明',
            createTime: '2023-12-20',
            updateTime: '2023-12-20',
            status: 'published',
            viewCount: 239
        },
        {
            id: 2,
            name: '微服务架构设计文档',
            category: '技术文档',
            creator: '李华',
            createTime: '2023-11-15',
            updateTime: '2023-11-15',
            status: 'published',
            viewCount: 186
        },
        {
            id: 3,
            name: 'RESTful API最佳实践培训课件',
            category: '培训资料',
            creator: '王刚',
            createTime: '2023-10-08',
            updateTime: '2023-10-08',
            status: 'published',
            viewCount: 152
        },
        {
            id: 4,
            name: '前端API调用规范',
            category: '技术文档',
            creator: '赵明',
            createTime: '2023-09-22',
            updateTime: '2023-09-22',
            status: 'draft',
            viewCount: 98
        },
        {
            id: 5,
            name: '项目资源分配表',
            category: '管理文档',
            creator: '陈晨',
            createTime: '2023-09-15',
            updateTime: '2023-09-15',
            status: 'review',
            viewCount: 76
        }
    ];
}

// 获取模拟权限数据
function getMockPermissions() {
    return {
        roles: ['系统管理员', '部门经理', '开发人员', '测试人员', '设计人员', '普通用户'],
        permissions: [
            { name: '查看文档', category: '知识库管理' },
            { name: '创建文档', category: '知识库管理' },
            { name: '编辑文档', category: '知识库管理' },
            { name: '删除文档', category: '知识库管理' },
            { name: '批量导入', category: '知识库管理' },
            { name: '管理用户', category: '权限管理' },
            { name: '管理角色', category: '权限管理' },
            { name: '配置权限', category: '权限管理' },
            { name: '查看访问日志', category: '权限管理' },
            { name: '查看分析报表', category: '数据分析' },
            { name: '导出报表', category: '数据分析' },
            { name: '配置分析指标', category: '数据分析' },
            { name: '修改系统参数', category: '系统设置' },
            { name: '备份与还原', category: '系统设置' }
        ],
        matrix: {
            '系统管理员': { '查看文档': 'full', '创建文档': 'full', '编辑文档': 'full', '删除文档': 'full', '批量导入': 'full', '管理用户': 'full', '管理角色': 'full', '配置权限': 'full', '查看访问日志': 'full', '查看分析报表': 'full', '导出报表': 'full', '配置分析指标': 'full', '修改系统参数': 'full', '备份与还原': 'full' },
            '部门经理': { '查看文档': 'full', '创建文档': 'full', '编辑文档': 'full', '删除文档': 'full', '批量导入': 'full', '管理用户': 'partial', '管理角色': 'none', '配置权限': 'none', '查看访问日志': 'full', '查看分析报表': 'full', '导出报表': 'full', '配置分析指标': 'partial', '修改系统参数': 'none', '备份与还原': 'none' },
            '开发人员': { '查看文档': 'full', '创建文档': 'full', '编辑文档': 'partial', '删除文档': 'none', '批量导入': 'partial', '管理用户': 'none', '管理角色': 'none', '配置权限': 'none', '查看访问日志': 'none', '查看分析报表': 'partial', '导出报表': 'none', '配置分析指标': 'none', '修改系统参数': 'none', '备份与还原': 'none' },
            '测试人员': { '查看文档': 'full', '创建文档': 'full', '编辑文档': 'partial', '删除文档': 'none', '批量导入': 'none', '管理用户': 'none', '管理角色': 'none', '配置权限': 'none', '查看访问日志': 'none', '查看分析报表': 'partial', '导出报表': 'none', '配置分析指标': 'none', '修改系统参数': 'none', '备份与还原': 'none' },
            '设计人员': { '查看文档': 'full', '创建文档': 'full', '编辑文档': 'partial', '删除文档': 'none', '批量导入': 'none', '管理用户': 'none', '管理角色': 'none', '配置权限': 'none', '查看访问日志': 'none', '查看分析报表': 'partial', '导出报表': 'none', '配置分析指标': 'none', '修改系统参数': 'none', '备份与还原': 'none' },
            '普通用户': { '查看文档': 'partial', '创建文档': 'none', '编辑文档': 'none', '删除文档': 'none', '批量导入': 'none', '管理用户': 'none', '管理角色': 'none', '配置权限': 'none', '查看访问日志': 'none', '查看分析报表': 'none', '导出报表': 'none', '配置分析指标': 'none', '修改系统参数': 'none', '备份与还原': 'none' }
        }
    };
}

// 获取模拟统计数据
function getMockStats() {
    return {
        docCount: {
            total: 2547,
            new: 389,
            byType: {
                '技术文档': 892,
                '管理文档': 637,
                '业务文档': 510,
                '培训资料': 382,
                '其他': 126
            }
        },
        searchStats: {
            total: 4218,
            topKeywords: [
                { keyword: 'API', count: 280 },
                { keyword: '微服务', count: 230 },
                { keyword: '设计规范', count: 190 },
                { keyword: '接口文档', count: 180 },
                { keyword: '前端开发', count: 150 },
                { keyword: '测试', count: 120 }
            ]
        },
        userStats: {
            active: 156,
            total: 187,
            byDepartment: {
                '研发部': 68,
                '产品部': 42,
                '设计部': 24,
                '测试部': 21,
                '市场部': 18,
                '其他': 14
            }
        },
        trends: {
            visits: [320, 380, 375, 410, 390, 450, 480, 440],
            searches: [250, 280, 270, 340, 350, 380, 410, 390],
            docsCreated: [15, 22, 18, 24, 20, 28, 30, 25]
        }
    };
} 