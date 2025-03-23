// 文档详情模块JS功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否包含文档详情模块
    if (!document.getElementById('doc-detail-module')) return;
    
    // 初始化文档详情功能
    initDocumentDetailModule();
});

// 初始化文档详情模块
function initDocumentDetailModule() {
    console.log('文档详情模块初始化');
    
    // 获取文档ID（从URL参数中）
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('id');
    
    if (!docId) {
        showToast('文档ID无效，请返回文档列表重新选择', 'error');
        return;
    }
    
    // 加载文档详情数据
    loadDocumentDetails(docId);
    
    // 初始化标签页切换
    initTabNavigation();
    
    // 初始化版本历史时间轴
    initVersionTimeline();
    
    // 初始化权限设置
    initPermissionMatrix();
}

// 加载文档详情数据
async function loadDocumentDetails(docId) {
    try {
        // 显示加载状态
        const docTitleElement = document.querySelector('.doc-title');
        if (docTitleElement) {
            docTitleElement.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status"><span class="visually-hidden">加载中...</span></div> 加载文档中...';
        }
        
        // 实际项目中调用API
        // const response = await apiRequest(`documents/${docId}`);
        
        // 使用模拟数据 - 模拟异步加载
        setTimeout(() => {
            const mockSuccess = true;
            
            if (mockSuccess) {
                // 更新文档元数据和内容
                updateDocumentMetadata({
                    title: 'API接口设计规范文档',
                    creator: '张工',
                    createTime: '2023-04-15',
                    lastModifier: '李工',
                    lastModifyTime: '2023-06-02',
                    size: '256KB',
                    format: 'Markdown',
                    viewCount: 325,
                    downloadCount: 78
                });
                
                // 添加页面事件监听器
                bindDocDetailEvents();
            } else {
                showToast('加载文档失败，请重试', 'error');
            }
        }, 800);
    } catch (error) {
        console.error('加载文档详情出错:', error);
        showToast('加载文档时发生错误', 'error');
    }
}

// 更新文档元数据显示
function updateDocumentMetadata(metadata) {
    // 更新文档标题
    const docTitleElement = document.querySelector('.doc-title');
    if (docTitleElement) {
        docTitleElement.textContent = metadata.title;
    }
    
    // 更新文档元数据卡片
    const metadataElements = {
        creator: document.getElementById('doc-creator'),
        createTime: document.getElementById('doc-create-time'),
        lastModifier: document.getElementById('doc-modifier'),
        lastModifyTime: document.getElementById('doc-modify-time'),
        size: document.getElementById('doc-size'),
        format: document.getElementById('doc-format'),
        viewCount: document.getElementById('doc-views'),
        downloadCount: document.getElementById('doc-downloads')
    };
    
    // 设置元数据显示
    for (const [key, element] of Object.entries(metadataElements)) {
        if (element && metadata[key]) {
            element.textContent = metadata[key];
        }
    }
}

// 初始化标签页导航
function initTabNavigation() {
    const tabLinks = document.querySelectorAll('.doc-nav-tabs .nav-link');
    const tabContents = document.querySelectorAll('.tab-content .tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有标签页的活动状态
            tabLinks.forEach(tabLink => tabLink.classList.remove('active'));
            tabContents.forEach(tabContent => tabContent.classList.remove('active', 'show'));
            
            // 设置当前点击的标签页为活动状态
            this.classList.add('active');
            
            // 获取目标标签页ID并设置为活动状态
            const targetId = this.getAttribute('data-bs-target');
            const targetTab = document.querySelector(targetId);
            if (targetTab) {
                targetTab.classList.add('active', 'show');
            }
        });
    });
}

// 初始化版本历史时间轴
function initVersionTimeline() {
    const timelineContainer = document.querySelector('.version-timeline');
    if (!timelineContainer) return;
    
    // 实际项目中应通过API获取版本历史数据
    // 这里使用模拟数据
    const versionHistory = [
        {
            version: 'V3.0',
            date: '2023-06-02',
            author: '李工',
            changes: '更新API认证部分，补充错误码说明',
            active: true
        },
        {
            version: 'V2.5',
            date: '2023-05-18',
            author: '王工',
            changes: '添加WebSocket接口示例',
            active: false
        },
        {
            version: 'V2.0',
            date: '2023-04-30',
            author: '张工',
            changes: '重构文档结构，添加RESTful设计原则',
            active: false
        },
        {
            version: 'V1.0',
            date: '2023-04-15',
            author: '张工',
            changes: '初始版本',
            active: false
        }
    ];
    
    renderVersionTimeline(versionHistory);
    
    // 绑定版本比较事件
    bindVersionCompareEvents(versionHistory);
}

// 渲染版本历史时间轴
function renderVersionTimeline(versions) {
    const timelineContainer = document.querySelector('.version-timeline');
    if (!timelineContainer) return;
    
    let html = '';
    
    versions.forEach((version, index) => {
        const isActive = version.active ? 'active' : '';
        const isFirst = index === 0 ? 'first' : '';
        const isLast = index === versions.length - 1 ? 'last' : '';
        
        html += `
            <div class="timeline-item ${isActive} ${isFirst} ${isLast}" data-version="${version.version}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h4 class="timeline-title">
                        ${version.version}
                        <small class="text-muted ms-2">${version.date}</small>
                    </h4>
                    <p>
                        <span class="badge bg-light text-dark">作者: ${version.author}</span>
                        <span class="ms-2">${version.changes}</span>
                    </p>
                    <div class="timeline-actions">
                        <button class="btn btn-sm btn-outline-primary view-version" data-version="${version.version}">
                            查看此版本
                        </button>
                        <button class="btn btn-sm btn-outline-secondary compare-version" data-version="${version.version}">
                            版本比较
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    timelineContainer.innerHTML = html;
}

// 绑定版本比较事件
function bindVersionCompareEvents(versions) {
    // 查看特定版本按钮
    const viewButtons = document.querySelectorAll('.view-version');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const version = this.getAttribute('data-version');
            // 实际项目中应通过API加载特定版本
            showToast(`正在加载 ${version} 版本...`);
        });
    });
    
    // 版本比较按钮
    const compareButtons = document.querySelectorAll('.compare-version');
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedVersion = this.getAttribute('data-version');
            
            // 显示比较选择对话框
            const modal = new bootstrap.Modal(document.getElementById('compareModal'));
            
            // 填充可比较的版本选项
            const targetVersionSelect = document.getElementById('targetVersion');
            if (targetVersionSelect) {
                targetVersionSelect.innerHTML = '';
                
                versions.forEach(version => {
                    if (version.version !== selectedVersion) {
                        const option = document.createElement('option');
                        option.value = version.version;
                        option.textContent = `${version.version} (${version.date})`;
                        targetVersionSelect.appendChild(option);
                    }
                });
            }
            
            // 设置源版本
            const sourceVersionElement = document.getElementById('sourceVersion');
            if (sourceVersionElement) {
                sourceVersionElement.textContent = selectedVersion;
            }
            
            // 比较按钮事件
            const compareBtn = document.getElementById('startCompare');
            if (compareBtn) {
                compareBtn.onclick = function() {
                    const targetVersion = targetVersionSelect.value;
                    
                    // 关闭对话框
                    modal.hide();
                    
                    // 实际项目中应调用版本比较API
                    // 这里模拟比较操作
                    showToast(`正在比较 ${selectedVersion} 和 ${targetVersion} 版本的差异...`);
                    
                    // 切换到比较结果选项卡
                    const compareTab = document.querySelector('a[data-bs-target="#compareTab"]');
                    if (compareTab) {
                        setTimeout(() => {
                            compareTab.click();
                            
                            // 加载比较结果
                            loadCompareResult(selectedVersion, targetVersion);
                        }, 500);
                    }
                };
            }
            
            modal.show();
        });
    });
}

// 加载版本比较结果
function loadCompareResult(sourceVersion, targetVersion) {
    const compareContainer = document.getElementById('compareResult');
    if (!compareContainer) return;
    
    // 显示加载状态
    compareContainer.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div><p class="mt-2">正在生成版本差异...</p></div>';
    
    // 实际项目中应调用API获取比较结果
    // 这里使用模拟数据
    setTimeout(() => {
        compareContainer.innerHTML = `
            <div class="alert alert-info">
                正在比较 <strong>${sourceVersion}</strong> 和 <strong>${targetVersion}</strong> 版本
            </div>
            
            <div class="diff-header">
                <div class="row">
                    <div class="col-6 border-end">
                        <h5>源版本: ${sourceVersion}</h5>
                    </div>
                    <div class="col-6">
                        <h5>目标版本: ${targetVersion}</h5>
                    </div>
                </div>
            </div>
            
            <div class="diff-content">
                <div class="diff-block">
                    <div class="diff-section-header">API请求认证</div>
                    <div class="row">
                        <div class="col-6 border-end diff-old">
                            <pre>所有API请求必须包含以下认证头部：
- Authorization: Bearer {token}
- API-Key: {api_key}</pre>
                        </div>
                        <div class="col-6 diff-new">
                            <pre>所有API请求必须包含以下认证头部：
- Authorization: Bearer {token}
- API-Key: {api_key}
- Request-ID: {uuid}</pre>
                        </div>
                    </div>
                </div>
                
                <div class="diff-block">
                    <div class="diff-section-header">错误码处理</div>
                    <div class="row">
                        <div class="col-6 border-end diff-old">
                            <pre>系统错误码：
- 400：请求参数错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 500：服务器内部错误</pre>
                        </div>
                        <div class="col-6 diff-new">
                            <pre>系统错误码：
- 400：请求参数错误
- 401：未授权
- 403：禁止访问
- 404：资源不存在
- 429：请求过于频繁
- 500：服务器内部错误
- 503：服务暂时不可用</pre>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }, 1500);
}

// 初始化权限矩阵
function initPermissionMatrix() {
    const permissionMatrix = document.querySelector('.permission-matrix');
    if (!permissionMatrix) return;
    
    // 绑定权限修改事件
    permissionMatrix.addEventListener('change', function(e) {
        if (e.target && e.target.classList.contains('permission-select')) {
            const role = e.target.getAttribute('data-role');
            const permission = e.target.value;
            
            // 实际项目中应调用API更新权限
            console.log(`更新权限: ${role} => ${permission}`);
            showToast(`已更新 ${role} 的权限为 ${getPermissionText(permission)}`);
        }
    });
    
    // 权限修改按钮点击
    const modifyPermBtn = document.getElementById('modify-permissions-btn');
    if (modifyPermBtn) {
        modifyPermBtn.addEventListener('click', function() {
            const permissionControls = document.querySelectorAll('.permission-select');
            const isReadonly = permissionControls[0].disabled;
            
            // 切换权限控件的禁用状态
            permissionControls.forEach(control => {
                control.disabled = !isReadonly;
            });
            
            // 更新按钮文本
            this.textContent = isReadonly ? '保存权限设置' : '修改权限设置';
            
            // 如果是从编辑模式切换回只读模式，表示保存操作
            if (!isReadonly) {
                // 实际项目中应调用API保存权限设置
                showToast('权限设置已保存');
            }
        });
    }
    
    // 添加角色按钮点击
    const addRoleBtn = document.getElementById('add-role-btn');
    if (addRoleBtn) {
        addRoleBtn.addEventListener('click', function() {
            // 显示添加角色对话框
            const modal = new bootstrap.Modal(document.getElementById('addRoleModal'));
            modal.show();
        });
    }
    
    // 确认添加角色按钮点击
    const confirmAddRoleBtn = document.getElementById('confirm-add-role');
    if (confirmAddRoleBtn) {
        confirmAddRoleBtn.addEventListener('click', function() {
            const roleInput = document.getElementById('roleInput');
            const permissionSelect = document.getElementById('permissionSelect');
            
            if (roleInput && permissionSelect && roleInput.value.trim()) {
                const roleName = roleInput.value.trim();
                const permission = permissionSelect.value;
                
                // 实际项目中应调用API添加新角色
                // 这里模拟添加操作
                addRoleToMatrix(roleName, permission);
                
                // 关闭对话框
                const modal = bootstrap.Modal.getInstance(document.getElementById('addRoleModal'));
                modal.hide();
                
                // 清空输入
                roleInput.value = '';
                
                showToast(`已添加角色 ${roleName} 并设置权限为 ${getPermissionText(permission)}`);
            }
        });
    }
}

// 向权限矩阵添加新角色
function addRoleToMatrix(roleName, permission) {
    const permissionMatrix = document.querySelector('.permission-matrix tbody');
    if (!permissionMatrix) return;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${roleName}</td>
        <td>
            <select class="form-select form-select-sm permission-select" data-role="${roleName}" disabled>
                <option value="readonly" ${permission === 'readonly' ? 'selected' : ''}>只读</option>
                <option value="edit" ${permission === 'edit' ? 'selected' : ''}>编辑</option>
                <option value="full" ${permission === 'full' ? 'selected' : ''}>完全控制</option>
                <option value="none" ${permission === 'none' ? 'selected' : ''}>无权限</option>
            </select>
        </td>
    `;
    
    permissionMatrix.appendChild(newRow);
}

// 根据权限值获取对应的文本
function getPermissionText(permission) {
    const permissionTexts = {
        'readonly': '只读',
        'edit': '编辑',
        'full': '完全控制',
        'none': '无权限'
    };
    
    return permissionTexts[permission] || permission;
}

// 绑定文档详情页面事件
function bindDocDetailEvents() {
    // 下载文档按钮点击
    const downloadBtn = document.getElementById('download-doc-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // 实际项目中应调用API下载文档
            showToast('文档下载中，请稍候...');
            
            // 模拟下载操作
            setTimeout(() => {
                showToast('文档下载完成');
            }, 1500);
        });
    }
    
    // 编辑文档按钮点击
    const editBtn = document.getElementById('edit-doc-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const docId = urlParams.get('id');
            
            // 跳转到编辑页面
            window.location.href = `doc-edit.html?id=${docId}&mode=edit`;
        });
    }
    
    // 导出解析结果按钮点击
    const exportBtn = document.getElementById('export-parsed-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // 实际项目中应调用API导出解析结果
            showToast('正在导出解析结果，请稍候...');
            
            // 模拟导出操作
            setTimeout(() => {
                showToast('解析结果导出完成');
            }, 1500);
        });
    }
} 