// ============================================================
// 🏠 LEARN WITH MS. THÚY – Home Page
// ============================================================

// ===== CONFIG =====
const ITEMS_PER_PAGE = 10;
const ARTICLES_URL = 'data/articles.json';

// ===== STATE =====
let allArticles = [];
let filteredArticles = [];
let currentPage = 1;
let currentLevel = 'all';
let currentSort = 'newest';
let currentSearch = '';

// ===== DOM ELEMENTS =====
const lessonsGrid = document.getElementById('lessons-grid');
const emptyState = document.getElementById('empty-state');
const pagination = document.getElementById('pagination');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const levelFilter = document.getElementById('level-filter');
const sortSelect = document.getElementById('sort-select');
const themeToggle = document.getElementById('theme-toggle');

// ===== INITIALIZE =====
async function init() {
    loadTheme();
    setupThemeToggle();
    setupSearch();
    setupFilter();
    setupSort();
    await loadArticles();
}

// ===== THEME MANAGEMENT =====
function loadTheme() {
    const savedTheme = localStorage.getItem('msThuy_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('msThuy_theme', newTheme);
    });
}

// ===== LOAD ARTICLES =====
async function loadArticles() {
    showSkeletons();
    
    try {
        const response = await fetch(ARTICLES_URL);
        if (!response.ok) throw new Error('Failed to load articles');
        allArticles = await response.json();
        
        // Sort by date descending by default
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        applyFilters();
    } catch (error) {
        console.error('Error loading articles:', error);
        lessonsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">⚠️</div>
                <h3>Unable to load lessons</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// ===== SHOW SKELETON LOADING =====
function showSkeletons() {
    let html = '';
    for (let i = 0; i < 6; i++) {
        html += `
            <div class="lesson-card" style="opacity:1;transform:none;animation:none;">
                <div class="card-thumbnail skeleton" style="aspect-ratio:16/9;"></div>
                <div class="card-body">
                    <div class="skeleton" style="height:20px;width:80%;margin-bottom:8px;"></div>
                    <div class="skeleton" style="height:14px;width:100%;margin-bottom:6px;"></div>
                    <div class="skeleton" style="height:14px;width:60%;"></div>
                </div>
            </div>
        `;
    }
    lessonsGrid.innerHTML = html;
}

// ===== SEARCH =====
function setupSearch() {
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        clearSearchBtn.classList.toggle('show', value.length > 0);
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentSearch = value.trim().toLowerCase();
            currentPage = 1;
            applyFilters();
        }, 300);
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.classList.remove('show');
        currentSearch = '';
        currentPage = 1;
        applyFilters();
        searchInput.focus();
    });
}

// ===== FILTER =====
function setupFilter() {
    levelFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            levelFilter.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            currentLevel = e.target.dataset.level;
            currentPage = 1;
            applyFilters();
        }
    });
}

// ===== SORT =====
function setupSort() {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        applyFilters();
    });
}

// ===== APPLY FILTERS & RENDER =====
function applyFilters() {
    let results = [...allArticles];
    
    // Filter by level
    if (currentLevel !== 'all') {
        results = results.filter(a => a.level === currentLevel);
    }
    
    // Filter by search
    if (currentSearch) {
        results = results.filter(a => {
            const searchText = `${a.title} ${a.description} ${(a.tags || []).join(' ')}`.toLowerCase();
            return searchText.includes(currentSearch);
        });
    }
    
    // Sort
    switch (currentSort) {
        case 'newest':
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            results.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            results.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
        case 'az':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    filteredArticles = results;
    renderResults();
}

// ===== RENDER RESULTS =====
function renderResults() {
    const total = filteredArticles.length;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredArticles.slice(start, end);
    
    // Update results count
    if (total === 0) {
        resultsCount.textContent = 'No lessons found';
    } else {
        const showing = Math.min(end, total);
        resultsCount.textContent = `Showing ${start + 1}–${showing} of ${total} lesson${total > 1 ? 's' : ''}`;
    }
    
    // Render cards or empty state
    if (total === 0) {
        lessonsGrid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        lessonsGrid.innerHTML = pageItems.map((article, i) => 
            renderCard(article, i)
        ).join('');
    }
    
    // Render pagination
    renderPagination(totalPages);
}

// ===== RENDER CARD =====
function renderCard(article, index) {
    const tagsHTML = (article.tags || []).slice(0, 3).map(tag => 
        `<span class="card-tag">#${tag}</span>`
    ).join('');
    
    const viewsFormatted = article.views >= 1000 
        ? (article.views / 1000).toFixed(1) + 'K' 
        : article.views;
    
    const dateFormatted = new Date(article.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    
    return `
        <a href="lesson.html?id=${article.id}" class="lesson-card" style="animation-delay:${index * 0.05}s">
            <div class="card-thumbnail">
                <img src="${article.thumbnail}" alt="${article.title}" loading="lazy" 
                     onerror="this.style.display='none'">
                <span class="card-level ${article.level}">${article.level}</span>
                <span class="card-duration">⏱ ${article.duration || '—'}</span>
                <div class="card-play-icon">▶</div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${article.title}</h3>
                <p class="card-description">${article.description}</p>
                <div class="card-tags">${tagsHTML}</div>
                <div class="card-meta">
                    <span class="card-meta-item">📅 ${dateFormatted}</span>
                    <span class="card-meta-item">👁 ${viewsFormatted}</span>
                    <span class="card-meta-item">❓ ${article.questions || 0}</span>
                </div>
            </div>
        </a>
    `;
}

// ===== RENDER PAGINATION =====
function renderPagination(totalPages) {
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Prev button
    html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">‹</button>`;
    
    // Page numbers with smart ellipsis
    const pages = getPaginationRange(currentPage, totalPages);
    pages.forEach(p => {
        if (p === '...') {
            html += `<span class="page-btn" style="cursor:default;border:none;background:transparent;">…</span>`;
        } else {
            html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
        }
    });
    
    // Next button
    html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">›</button>`;
    
    pagination.innerHTML = html;
    
    // Add click handlers
    pagination.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                currentPage = page;
                renderResults();
                window.scrollTo({ top: document.querySelector('.toolbar-section').offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

// Smart pagination range (e.g., 1 ... 4 5 6 ... 10)
function getPaginationRange(current, total) {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i);
        }
    }
    
    let prev;
    for (const i of range) {
        if (prev) {
            if (i - prev === 2) {
                rangeWithDots.push(prev + 1);
            } else if (i - prev > 2) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        prev = i;
    }
    
    return rangeWithDots;
}

// ===== START =====
document.addEventListener('DOMContentLoaded', init);
