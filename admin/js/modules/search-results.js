// 搜索结果模块JS功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面是否包含搜索结果模块
    if (!document.getElementById('search-results-module')) return;
    
    // 初始化搜索结果功能
    initSearchResultsModule();
});

// 初始化搜索结果模块
function initSearchResultsModule() {
    console.log('搜索结果模块初始化');
    
    // 从URL参数获取查询关键词
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    
    if (keyword) {
        // 设置搜索关键词到搜索框
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = keyword;
        }
        
        // 加载搜索结果
        loadSearchResults(keyword);
    }
    
    // 绑定事件处理器
    bindSearchEvents();
    
    // 初始化过滤器
    initFilters();
    
    // 初始化知识图谱
    initKnowledgeGraph();
}

// 加载搜索结果数据
async function loadSearchResults(keyword, filters = {}, page = 1, sortBy = 'relevance') {
    try {
        // 显示加载状态
        const resultsContainer = document.querySelector('.search-results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div><p class="mt-2">正在检索数据...</p></div>';
        }
        
        // 更新搜索信息
        updateSearchInfo(keyword);
        
        // 构建查询参数
        const queryParams = new URLSearchParams({
            keyword: keyword,
            page: page,
            sortBy: sortBy,
            ...filters
        });
        
        // 实际项目中调用API
        // const response = await apiRequest(`search?${queryParams}`);
        
        // 使用模拟数据 - 模拟异步加载
        setTimeout(() => {
            // 模拟搜索结果数据
            const searchResults = {
                total: 24,
                page: page,
                totalPages: 3,
                results: [
                    {
                        id: 1,
                        title: 'API接口设计规范文档',
                        content: '...在API接口设计中，所有的请求路径应使用<em>RESTful</em>风格。要求使用名词复数表示资源集合，例如/users、/documents，资源命名使用小写字母，多个单词间用短横线...',
                        author: '张工',
                        department: '研发部',
                        lastModified: '2023-06-02',
                        fileType: 'DOC',
                        relevance: 92,
                        highlights: ['API', 'RESTful', '接口设计']
                    },
                    {
                        id: 2,
                        title: 'RESTful API最佳实践指南',
                        content: '<em>RESTful</em> API设计要求API请求必须包含以下认证头部：Authorization: Bearer {token}, API-Key: {api_key}。所有开发人员需遵循统一的错误码处理方式...',
                        author: '李工',
                        department: '研发部',
                        lastModified: '2023-05-10',
                        fileType: 'PDF',
                        relevance: 88,
                        highlights: ['RESTful', 'API设计', '认证']
                    },
                    {
                        id: 3,
                        title: '前后端接口规范',
                        content: '...前端调用<em>API</em>接口时，需要处理的状态码包括：400（请求参数错误）、401（未授权）、403（禁止访问）、404（资源不存在）、429（请求过于频繁）、500（服务器内部错误）...',
                        author: '王工',
                        department: '研发部',
                        lastModified: '2023-04-15',
                        fileType: 'MD',
                        relevance: 78,
                        highlights: ['API', '状态码', '前后端']
                    },
                    {
                        id: 4,
                        title: '微服务架构设计文档',
                        content: '...微服务之间的通信应采用<em>RESTful</em> <em>API</em>方式，服务拆分原则是根据业务领域模型进行拆分，保证服务内部高内聚，服务之间低耦合...',
                        author: '赵工',
                        department: '架构组',
                        lastModified: '2023-03-22',
                        fileType: 'DOCX',
                        relevance: 75,
                        highlights: ['微服务', 'RESTful API', '架构设计']
                    },
                    {
                        id: 5,
                        title: 'API错误码标准定义',
                        content: '...本文档定义了公司内部<em>API</em>接口使用的标准错误码体系，包括HTTP标准错误码和业务自定义错误码...',
                        author: '刘工',
                        department: '研发部',
                        lastModified: '2023-02-18',
                        fileType: 'PDF',
                        relevance: 70,
                        highlights: ['API', '错误码', '标准']
                    },
                    {
                        id: 6,
                        title: 'API文档自动生成工具使用指南',
                        content: '...使用Swagger/OpenAPI规范来自动生成<em>API</em>文档，项目中的Controller需要添加适当的注解以支持文档生成...',
                        author: '杨工',
                        department: '开发工具组',
                        lastModified: '2023-01-05',
                        fileType: 'PDF',
                        relevance: 65,
                        highlights: ['API文档', 'Swagger', 'OpenAPI']
                    },
                    {
                        id: 7,
                        title: 'GraphQL vs RESTful API对比分析',
                        content: '...本文对比了<em>RESTful</em> <em>API</em>和GraphQL两种API设计风格的优缺点，并提供了适用场景建议...',
                        author: '周工',
                        department: '研发部',
                        lastModified: '2022-12-12',
                        fileType: 'PPTX',
                        relevance: 62,
                        highlights: ['GraphQL', 'RESTful API', '对比分析']
                    },
                    {
                        id: 8,
                        title: 'API性能优化最佳实践',
                        content: '...<em>API</em>性能优化策略，包括缓存设计、数据库查询优化、异步处理等技术措施...',
                        author: '吴工',
                        department: '性能测试组',
                        lastModified: '2022-11-20',
                        fileType: 'PDF',
                        relevance: 60,
                        highlights: ['API', '性能优化', '缓存']
                    }
                ]
            };
            
            // 渲染搜索结果
            renderSearchResults(searchResults);
            
            // 更新搜索统计信息
            updateSearchStats(searchResults.total, keyword);
            
            // 更新分页
            updatePagination(searchResults.page, searchResults.totalPages);
            
        }, 800);
        
    } catch (error) {
        console.error('加载搜索结果出错:', error);
        
        const resultsContainer = document.querySelector('.search-results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="alert alert-danger">搜索结果加载失败，请重试</div>';
        }
    }
}

// 更新搜索信息
function updateSearchInfo(keyword) {
    const searchInfoElement = document.querySelector('.search-info');
    if (searchInfoElement) {
        searchInfoElement.innerHTML = `搜索 <strong>"${keyword}"</strong> 的结果`;
    }
}

// 更新搜索统计信息
function updateSearchStats(total, keyword) {
    const resultsCountElement = document.querySelector('.results-count');
    if (resultsCountElement) {
        resultsCountElement.innerHTML = `共找到 <strong>${total}</strong> 条与 <strong>"${keyword}"</strong> 相关的结果`;
    }
}

// 渲染搜索结果
function renderSearchResults(searchResults) {
    const resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) return;
    
    if (!searchResults.results || searchResults.results.length === 0) {
        resultsContainer.innerHTML = '<div class="alert alert-warning">没有找到匹配的结果，请尝试其他关键词</div>';
        return;
    }
    
    let html = '';
    
    searchResults.results.forEach(result => {
        // 计算相关性星级（1-5星）
        const relevanceStars = Math.ceil(result.relevance / 20); // 100分制转换为5星制
        let starsHtml = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < relevanceStars) {
                starsHtml += '<i class="bi bi-star-fill text-warning"></i>';
            } else {
                starsHtml += '<i class="bi bi-star text-muted"></i>';
            }
        }
        
        // 构建高亮标签
        let tagsHtml = '';
        if (result.highlights && result.highlights.length > 0) {
            result.highlights.forEach(tag => {
                tagsHtml += `<span class="badge bg-light text-dark me-1">${tag}</span>`;
            });
        }
        
        html += `
            <div class="search-result-item">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="result-title">
                        <i class="bi bi-file-earmark-text me-2 text-primary"></i>
                        <a href="doc-detail.html?id=${result.id}" class="text-decoration-none">${result.title}</a>
                    </h5>
                    <div class="relevance-stars">
                        ${starsHtml}
                        <span class="relevance-score ms-1">${result.relevance}%</span>
                    </div>
                </div>
                
                <div class="result-content">${result.content}</div>
                
                <div class="result-meta">
                    <span class="me-3"><i class="bi bi-person"></i> ${result.author}</span>
                    <span class="me-3"><i class="bi bi-building"></i> ${result.department}</span>
                    <span class="me-3"><i class="bi bi-calendar3"></i> ${result.lastModified}</span>
                    <span class="me-3"><i class="bi bi-file-earmark"></i> ${result.fileType}</span>
                    <span class="result-tags">${tagsHtml}</span>
                </div>
                
                <div class="result-actions mt-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument(${result.id})">
                        <i class="bi bi-eye"></i> 查看
                    </button>
                    <button class="btn btn-sm btn-outline-secondary ms-2" onclick="showKnowledgeGraph(${result.id})">
                        <i class="bi bi-diagram-2"></i> 知识图谱
                    </button>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// 更新分页
function updatePagination(currentPage, totalPages) {
    const paginationElement = document.querySelector('.search-pagination');
    if (!paginationElement) return;
    
    let html = '';
    
    // 上一页按钮
    html += `
        <li class="page-item ${currentPage <= 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">上一页</a>
        </li>
    `;
    
    // 页码按钮
    const maxPages = 5; // 最多显示5个页码
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // 下一页按钮
    html += `
        <li class="page-item ${currentPage >= totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">下一页</a>
        </li>
    `;
    
    paginationElement.innerHTML = html;
    
    // 绑定分页点击事件
    const pageLinks = paginationElement.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.parentElement.classList.contains('disabled')) return;
            
            const page = parseInt(this.getAttribute('data-page'));
            if (!isNaN(page)) {
                const keyword = document.getElementById('search-input').value;
                const filters = getActiveFilters();
                const sortBy = document.querySelector('.sort-option.active').getAttribute('data-sort');
                
                loadSearchResults(keyword, filters, page, sortBy);
            }
        });
    });
}

// 初始化过滤器
function initFilters() {
    // 绑定文件类型过滤器点击事件
    const fileTypeFilters = document.querySelectorAll('.file-type-filter');
    fileTypeFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 切换选中状态
            this.classList.toggle('active');
            
            // 应用过滤器
            applyFilters();
        });
    });
    
    // 绑定部门过滤器点击事件
    const deptFilters = document.querySelectorAll('.dept-filter');
    deptFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 切换选中状态
            this.classList.toggle('active');
            
            // 应用过滤器
            applyFilters();
        });
    });
    
    // 绑定时间范围过滤器点击事件
    const timeFilters = document.querySelectorAll('.time-filter');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除其他时间过滤器的选中状态
            timeFilters.forEach(f => f.classList.remove('active'));
            
            // 设置当前过滤器为选中状态
            this.classList.add('active');
            
            // 应用过滤器
            applyFilters();
        });
    });
    
    // 绑定相关度过滤器点击事件
    const relevanceFilters = document.querySelectorAll('.relevance-filter');
    relevanceFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除其他相关度过滤器的选中状态
            relevanceFilters.forEach(f => f.classList.remove('active'));
            
            // 设置当前过滤器为选中状态
            this.classList.add('active');
            
            // 应用过滤器
            applyFilters();
        });
    });
    
    // 绑定文档标签过滤器点击事件
    const tagFilters = document.querySelectorAll('.tag-filter');
    tagFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 切换选中状态
            this.classList.toggle('active');
            
            // 应用过滤器
            applyFilters();
        });
    });
}

// 应用过滤器
function applyFilters() {
    const keyword = document.getElementById('search-input').value;
    if (!keyword) return;
    
    const filters = getActiveFilters();
    const sortBy = document.querySelector('.sort-option.active').getAttribute('data-sort');
    
    // 重新加载搜索结果
    loadSearchResults(keyword, filters, 1, sortBy);
}

// 获取当前激活的过滤条件
function getActiveFilters() {
    const filters = {};
    
    // 获取文件类型过滤器
    const activeFileTypes = document.querySelectorAll('.file-type-filter.active');
    if (activeFileTypes.length > 0) {
        filters.fileTypes = Array.from(activeFileTypes).map(el => el.getAttribute('data-value')).join(',');
    }
    
    // 获取部门过滤器
    const activeDepts = document.querySelectorAll('.dept-filter.active');
    if (activeDepts.length > 0) {
        filters.departments = Array.from(activeDepts).map(el => el.getAttribute('data-value')).join(',');
    }
    
    // 获取时间范围过滤器
    const activeTimeFilter = document.querySelector('.time-filter.active');
    if (activeTimeFilter) {
        filters.timeRange = activeTimeFilter.getAttribute('data-value');
    }
    
    // 获取相关度过滤器
    const activeRelevanceFilter = document.querySelector('.relevance-filter.active');
    if (activeRelevanceFilter) {
        filters.minRelevance = activeRelevanceFilter.getAttribute('data-value');
    }
    
    // 获取文档标签过滤器
    const activeTagFilters = document.querySelectorAll('.tag-filter.active');
    if (activeTagFilters.length > 0) {
        filters.tags = Array.from(activeTagFilters).map(el => el.getAttribute('data-value')).join(',');
    }
    
    return filters;
}

// 初始化知识图谱
function initKnowledgeGraph() {
    // 实际项目中可能需要加载知识图谱库
    console.log('知识图谱功能初始化');
}

// 绑定搜索事件
function bindSearchEvents() {
    // 搜索表单提交
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = document.getElementById('search-input');
            const keyword = searchInput.value.trim();
            
            if (keyword) {
                // 更新URL，但不重新加载页面
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('keyword', keyword);
                window.history.pushState({}, '', newUrl);
                
                // 加载搜索结果
                loadSearchResults(keyword);
            }
        });
    }
    
    // 排序选项点击
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除其他排序选项的激活状态
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // 设置当前排序选项为激活状态
            this.classList.add('active');
            
            // 获取当前的搜索关键词和过滤器
            const keyword = document.getElementById('search-input').value;
            const filters = getActiveFilters();
            const sortBy = this.getAttribute('data-sort');
            
            // 重新加载搜索结果
            loadSearchResults(keyword, filters, 1, sortBy);
        });
    });
    
    // 高级搜索按钮点击
    const advancedSearchBtn = document.querySelector('.advanced-search-btn');
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 显示高级搜索模态框
            const modal = new bootstrap.Modal(document.getElementById('advancedSearchModal'));
            modal.show();
        });
    }
    
    // 高级搜索表单提交
    const advancedSearchForm = document.getElementById('advanced-search-form');
    if (advancedSearchForm) {
        advancedSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取高级搜索表单数据
            const keyword = document.getElementById('adv-keyword').value.trim();
            const exactPhrase = document.getElementById('adv-exact-phrase').value.trim();
            const excludeWords = document.getElementById('adv-exclude-words').value.trim();
            const fileType = document.getElementById('adv-file-type').value;
            const dateFrom = document.getElementById('adv-date-from').value;
            const dateTo = document.getElementById('adv-date-to').value;
            const author = document.getElementById('adv-author').value.trim();
            
            // 构建高级搜索过滤器
            const advFilters = {};
            
            if (exactPhrase) advFilters.exactPhrase = exactPhrase;
            if (excludeWords) advFilters.excludeWords = excludeWords;
            if (fileType !== 'all') advFilters.fileType = fileType;
            if (dateFrom) advFilters.dateFrom = dateFrom;
            if (dateTo) advFilters.dateTo = dateTo;
            if (author) advFilters.author = author;
            
            // 更新主搜索框的关键词
            const mainSearchInput = document.getElementById('search-input');
            if (mainSearchInput) {
                mainSearchInput.value = keyword;
            }
            
            // 更新URL
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('keyword', keyword);
            window.history.pushState({}, '', newUrl);
            
            // 关闭模态框
            const modal = bootstrap.Modal.getInstance(document.getElementById('advancedSearchModal'));
            modal.hide();
            
            // 加载搜索结果
            loadSearchResults(keyword, advFilters);
        });
    }
}

// 查看文档
function viewDocument(id) {
    window.location.href = `doc-detail.html?id=${id}`;
}

// 显示知识图谱
function showKnowledgeGraph(id) {
    // 获取知识图谱弹窗元素
    const knowledgeGraphPopup = document.getElementById('knowledge-graph-popup');
    if (!knowledgeGraphPopup) return;
    
    // 显示加载状态
    knowledgeGraphPopup.querySelector('.popup-content').innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">加载中...</span></div><p class="mt-2">正在生成知识图谱...</p></div>';
    
    // 显示弹窗
    knowledgeGraphPopup.classList.add('show');
    
    // 实际项目中调用API获取知识图谱数据
    // 这里使用模拟数据
    setTimeout(() => {
        const mockGraphData = {
            title: 'API接口设计规范',
            entities: [
                { id: 1, name: 'RESTful API', type: '核心概念', connections: [2, 3, 5, 7] },
                { id: 2, name: 'HTTP方法', type: '技术规范', connections: [1, 3, 4] },
                { id: 3, name: '状态码', type: '技术规范', connections: [1, 2, 4] },
                { id: 4, name: '错误处理', type: '技术规范', connections: [2, 3, 7] },
                { id: 5, name: '资源命名', type: '最佳实践', connections: [1, 7] },
                { id: 6, name: '认证授权', type: '安全规范', connections: [7, 8] },
                { id: 7, name: 'API设计原则', type: '核心概念', connections: [1, 4, 5, 6] },
                { id: 8, name: 'OAuth 2.0', type: '安全规范', connections: [6] }
            ],
            documents: [
                { id: 1, title: 'API接口设计规范文档', relevance: 100 },
                { id: 2, title: 'RESTful API最佳实践指南', relevance: 85 },
                { id: 3, title: '前后端接口规范', relevance: 75 },
                { id: 5, title: 'API错误码标准定义', relevance: 70 }
            ]
        };
        
        renderKnowledgeGraph(mockGraphData);
    }, 1000);
    
    // 绑定关闭按钮事件
    const closeBtn = knowledgeGraphPopup.querySelector('.popup-close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            knowledgeGraphPopup.classList.remove('show');
        };
    }
}

// 渲染知识图谱
function renderKnowledgeGraph(graphData) {
    const graphContainer = document.querySelector('#knowledge-graph-popup .popup-content');
    if (!graphContainer) return;
    
    let html = `
        <h4 class="text-center mb-4">知识图谱: ${graphData.title}</h4>
        
        <div class="row">
            <div class="col-md-8">
                <div class="knowledge-graph-canvas">
                    <div class="graph-visualization">
                        <!-- 这里在实际项目中应该使用可视化库如D3.js渲染图谱 -->
                        <!-- 这里使用模拟的静态展示 -->
                        <img src="images/mock-knowledge-graph.png" alt="知识图谱" class="img-fluid" style="max-height: 400px;">
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="graph-entities">
                    <h5>实体列表</h5>
                    <ul class="list-group">
    `;
    
    // 添加实体列表
    graphData.entities.forEach(entity => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${entity.name}</strong>
                    <span class="badge bg-light text-dark ms-2">${entity.type}</span>
                </div>
                <span class="badge bg-primary rounded-pill">${entity.connections.length}</span>
            </li>
        `;
    });
    
    html += `
                    </ul>
                </div>
                
                <div class="related-documents mt-4">
                    <h5>相关文档</h5>
                    <ul class="list-group">
    `;
    
    // 添加相关文档列表
    graphData.documents.forEach(doc => {
        html += `
            <li class="list-group-item">
                <div class="d-flex justify-content-between">
                    <a href="doc-detail.html?id=${doc.id}" class="text-decoration-none">${doc.title}</a>
                    <span class="badge bg-success">${doc.relevance}%</span>
                </div>
            </li>
        `;
    });
    
    html += `
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    graphContainer.innerHTML = html;
} 