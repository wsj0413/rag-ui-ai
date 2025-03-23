// 主脚本文件
document.addEventListener('DOMContentLoaded', function() {
    initModuleNavigation();
    initChart();
    initDragAndDrop();
});

/**
 * 初始化模块导航功能
 */
function initModuleNavigation() {
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    
    // 为每个侧边栏链接添加点击事件
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有链接的active类
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // 给当前点击的链接添加active类
            this.classList.add('active');
            
            // 获取模块名称
            const moduleName = this.getAttribute('data-module');
            
            // 更新模块标题
            updateModuleTitle(moduleName);
            
            // 显示对应模块内容
            showModule(moduleName);
        });
    });
}

/**
 * 更新模块标题
 * @param {string} moduleName - 模块名称
 */
function updateModuleTitle(moduleName) {
    const titleElement = document.getElementById('current-module-title');
    
    switch(moduleName) {
        case 'home':
            titleElement.textContent = '系统首页';
            break;
        case 'collector':
            titleElement.textContent = '多模态知识采集器';
            break;
        case 'processor':
            titleElement.textContent = '智能知识处理器';
            break;
        case 'search':
            titleElement.textContent = '三维检索系统';
            break;
        case 'permission':
            titleElement.textContent = '动态权限矩阵';
            break;
        case 'operation':
            titleElement.textContent = '知识运营中心';
            break;
        case 'assistant':
            titleElement.textContent = '智能助手集成';
            break;
        default:
            titleElement.textContent = '系统首页';
    }
}

/**
 * 显示指定模块内容
 * @param {string} moduleName - 模块名称
 */
function showModule(moduleName) {
    // 隐藏所有模块
    const allModules = document.querySelectorAll('.module-panel');
    allModules.forEach(module => {
        module.classList.remove('active');
    });
    
    // 检查指定模块是否存在
    const moduleId = `${moduleName}-module`;
    let moduleElement = document.getElementById(moduleId);
    
    // 如果模块已存在，直接显示
    if (moduleElement) {
        moduleElement.classList.add('active');
    } else {
        // 如果模块不存在，动态加载内容
        loadModuleContent(moduleName);
    }
}

/**
 * 动态加载模块内容
 * @param {string} moduleName - 模块名称
 */
function loadModuleContent(moduleName) {
    // 创建模块容器
    const moduleContainer = document.createElement('div');
    moduleContainer.id = `${moduleName}-module`;
    moduleContainer.className = 'module-panel active';
    
    // 添加加载中的提示
    moduleContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">正在加载内容...</p></div>';
    
    // 将容器添加到模块内容区域
    const moduleContent = document.getElementById('module-content');
    moduleContent.appendChild(moduleContainer);
    
    // 使用fetch加载模块内容
    fetch(`modules/${moduleName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应失败');
            }
            return response.text();
        })
        .then(html => {
            moduleContainer.innerHTML = html;
            
            // 根据不同模块初始化特定功能
            switch(moduleName) {
                case 'collector':
                    initDragAndDrop();
                    break;
                case 'operation':
                    initHeatmap();
                    break;
                case 'search':
                    initSearchSystem();
                    break;
                case 'assistant':
                    initChatAssistant();
                    break;
            }
        })
        .catch(error => {
            moduleContainer.innerHTML = `<div class="alert alert-danger" role="alert">
                加载模块内容失败: ${error.message}
            </div>`;
        });
}

/**
 * 初始化知识趋势图表
 */
function initChart() {
    // 图表初始化已在HTML页面中完成
}

/**
 * 初始化拖放上传功能
 */
function initDragAndDrop() {
    // 查找上传区域元素
    const dropZone = document.querySelector('.drop-zone');
    if (!dropZone) return;
    
    // 拖动进入区域时
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone-active');
    });
    
    // 拖动离开区域时
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drop-zone-active');
    });
    
    // 放置文件时
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone-active');
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // 点击上传区域时
    dropZone.addEventListener('click', () => {
        const fileInput = document.querySelector('.file-input');
        if (fileInput) {
            fileInput.click();
        }
    });
    
    // 通过文件输入框选择文件时
    const fileInput = document.querySelector('.file-input');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            handleFiles(files);
        });
    }
}

/**
 * 处理上传的文件
 * @param {FileList} files - 上传的文件列表
 */
function handleFiles(files) {
    if (!files.length) return;
    
    // 更新进度条显示
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        progressBar.parentElement.classList.remove('d-none');
    }
    
    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // 显示上传成功的文件列表
            setTimeout(() => {
                if (progressBar) {
                    progressBar.parentElement.classList.add('d-none');
                }
                
                const fileList = document.querySelector('.file-list');
                if (fileList) {
                    // 清空现有列表
                    fileList.innerHTML = '';
                    
                    // 添加上传的文件到列表
                    Array.from(files).forEach(file => {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'file-item d-flex align-items-center p-2 border-bottom';
                        
                        let fileIcon = 'bi-file-earmark';
                        if (file.type.includes('pdf')) {
                            fileIcon = 'bi-file-earmark-pdf';
                        } else if (file.type.includes('word')) {
                            fileIcon = 'bi-file-earmark-word';
                        } else if (file.type.includes('image')) {
                            fileIcon = 'bi-file-earmark-image';
                        }
                        
                        fileItem.innerHTML = `
                            <i class="bi ${fileIcon} me-2 fs-4"></i>
                            <div class="file-info flex-grow-1">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size text-muted">${formatFileSize(file.size)}</div>
                            </div>
                            <span class="badge bg-success">已上传</span>
                        `;
                        
                        fileList.appendChild(fileItem);
                    });
                    
                    if (fileList.parentElement) {
                        fileList.parentElement.classList.remove('d-none');
                    }
                }
            }, 500);
        }
    }, 200);
}

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小(字节)
 * @returns {string} 格式化后的文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 初始化热力图功能
 */
function initHeatmap() {
    const heatmapContainer = document.getElementById('heatmap');
    if (!heatmapContainer) return;
    
    // 这里应该集成第三方热力图库
    // 使用模拟数据
    setTimeout(() => {
        heatmapContainer.innerHTML = '<div class="text-center p-5"><img src="https://via.placeholder.com/800x400?text=知识热力图" class="img-fluid" alt="热力图示例"></div>';
    }, 1000);
}

/**
 * 初始化搜索系统
 */
function initSearchSystem() {
    const searchForm = document.querySelector('.search-form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const searchInput = searchForm.querySelector('input[name="searchKeyword"]');
        const searchType = searchForm.querySelector('select[name="searchType"]');
        
        if (searchInput && searchType) {
            const keyword = searchInput.value.trim();
            const type = searchType.value;
            
            if (keyword) {
                performSearch(keyword, type);
            }
        }
    });
}

/**
 * 执行搜索操作
 * @param {string} keyword - 搜索关键词
 * @param {string} type - 搜索类型
 */
function performSearch(keyword, type) {
    // 显示搜索结果区域并添加加载指示
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-3">正在搜索...</p></div>';
        searchResults.classList.remove('d-none');
    }
    
    // 模拟搜索延迟
    setTimeout(() => {
        if (searchResults) {
            // 生成模拟搜索结果
            let resultHTML = `
                <div class="alert alert-info">
                    找到 6 个与 "${keyword}" 相关的结果 (${type}搜索)
                </div>
                <div class="list-group">
            `;
            
            for (let i = 1; i <= 6; i++) {
                resultHTML += `
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">搜索结果 ${i}: ${keyword}相关文档</h5>
                            <small>相关度: ${95 - i * 5}%</small>
                        </div>
                        <p class="mb-1">这是一个关于"${keyword}"的示例文档，包含了相关信息和详细描述。</p>
                        <small>文档类型: PDF | 创建时间: 2023-10-${i}</small>
                    </a>
                `;
            }
            
            resultHTML += '</div>';
            searchResults.innerHTML = resultHTML;
            
            // 添加到搜索历史
            addSearchHistory(keyword, type, 6);
        }
    }, 1500);
}

/**
 * 添加搜索历史记录
 * @param {string} keyword - 搜索关键词
 * @param {string} type - 搜索类型
 * @param {number} count - 结果数量
 */
function addSearchHistory(keyword, type, count) {
    const historyTable = document.querySelector('.history-table tbody');
    if (!historyTable) return;
    
    // 创建新的历史记录行
    const row = document.createElement('tr');
    
    // 格式化当前时间
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    
    // 设置行内容
    row.innerHTML = `
        <td>${keyword}</td>
        <td>${type}</td>
        <td>${timeString}</td>
        <td>${count}</td>
        <td><button class="btn btn-sm btn-outline-primary re-search-btn">重新搜索</button></td>
    `;
    
    // 添加到表格顶部
    if (historyTable.firstChild) {
        historyTable.insertBefore(row, historyTable.firstChild);
    } else {
        historyTable.appendChild(row);
    }
    
    // 为重新搜索按钮添加事件
    const reSearchBtn = row.querySelector('.re-search-btn');
    if (reSearchBtn) {
        reSearchBtn.addEventListener('click', function() {
            // 填充搜索表单并触发搜索
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                const searchInput = searchForm.querySelector('input[name="searchKeyword"]');
                const searchType = searchForm.querySelector('select[name="searchType"]');
                
                if (searchInput && searchType) {
                    searchInput.value = keyword;
                    searchType.value = type;
                    
                    // 滚动到表单位置
                    searchForm.scrollIntoView({ behavior: 'smooth' });
                    
                    // 触发提交事件
                    setTimeout(() => {
                        searchForm.dispatchEvent(new Event('submit'));
                    }, 500);
                }
            }
        });
    }
}

/**
 * 初始化聊天助手
 */
function initChatAssistant() {
    const chatForm = document.querySelector('.chat-form');
    if (!chatForm) return;
    
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const messageInput = chatForm.querySelector('input[name="message"]');
        if (messageInput && messageInput.value.trim()) {
            sendMessage(messageInput.value.trim());
            messageInput.value = '';
        }
    });
}

/**
 * 发送消息到聊天助手
 * @param {string} message - 用户消息
 */
function sendMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    // 添加用户消息
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(userMessage);
    
    // 滚动到最新消息
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 显示助手正在输入指示
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message assistant-message typing';
    typingIndicator.innerHTML = '<p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
    chatMessages.appendChild(typingIndicator);
    
    // 滚动到正在输入指示
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 模拟助手回复延迟
    setTimeout(() => {
        // 移除正在输入指示
        chatMessages.removeChild(typingIndicator);
        
        // 添加助手回复
        const assistantResponse = getAssistantResponse(message);
        const assistantMessage = document.createElement('div');
        assistantMessage.className = 'message assistant-message';
        assistantMessage.innerHTML = `<p>${assistantResponse}</p>`;
        chatMessages.appendChild(assistantMessage);
        
        // 滚动到最新消息
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

/**
 * 获取助手回复内容
 * @param {string} message - 用户消息
 * @returns {string} 助手回复
 */
function getAssistantResponse(message) {
    // 简单的关键词回复逻辑
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('hello')) {
        return '你好！我是企业知识助手，有什么可以帮助你的吗？';
    } else if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
        return '我可以帮助你查找文档、回答问题、生成内容等。请告诉我你需要什么帮助？';
    } else if (lowerMessage.includes('文档') || lowerMessage.includes('document')) {
        return '您需要查找什么文档呢？请提供关键词或文档类型，我会帮您找到相关内容。';
    } else if (lowerMessage.includes('感谢') || lowerMessage.includes('thank')) {
        return '不客气，很高兴能帮到您！如果还有其他问题，随时可以问我。';
    } else {
        return '我理解您的问题是关于"' + message + '"的。正在为您查找相关信息，请稍候...';
    }
} 