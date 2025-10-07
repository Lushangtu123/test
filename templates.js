// 代码模板库
const CodeTemplates = {
    // 基础模板
    basic: {
        name: '空白页面',
        description: '最基础的HTML页面',
        html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新页面</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
        css: `body {
    margin: 0;
    padding: 20px;
    font-family: Arial, sans-serif;
}`,
        js: `console.log('页面已加载');`
    },

    // 响应式卡片
    card: {
        name: '响应式卡片',
        description: '现代化的卡片布局',
        html: `<div class="card-container">
    <div class="card">
        <div class="card-image">
            <div class="image-placeholder">📸</div>
        </div>
        <div class="card-content">
            <h2 class="card-title">卡片标题</h2>
            <p class="card-description">这是一个精美的卡片组件，可以用来展示各种内容。</p>
            <button class="card-button">了解更多</button>
        </div>
    </div>
    <div class="card">
        <div class="card-image">
            <div class="image-placeholder">🎨</div>
        </div>
        <div class="card-content">
            <h2 class="card-title">设计精美</h2>
            <p class="card-description">采用现代化的设计理念，提供最佳的用户体验。</p>
            <button class="card-button">查看详情</button>
        </div>
    </div>
</div>`,
        css: `.card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.card-image {
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-placeholder {
    font-size: 64px;
}

.card-content {
    padding: 20px;
}

.card-title {
    margin: 0 0 10px 0;
    color: #333;
}

.card-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
}

.card-button {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
}

.card-button:hover {
    background: #5568d3;
}`,
        js: `document.querySelectorAll('.card-button').forEach(button => {
    button.addEventListener('click', function() {
        alert('按钮被点击了！');
    });
});`
    },

    // 导航栏
    navbar: {
        name: '响应式导航栏',
        description: '带汉堡菜单的导航栏',
        html: `<nav class="navbar">
    <div class="nav-brand">🚀 MyWebsite</div>
    <div class="nav-toggle" id="navToggle">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <ul class="nav-menu" id="navMenu">
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#services">服务</a></li>
        <li><a href="#contact">联系</a></li>
    </ul>
</nav>
<div class="content">
    <h1>欢迎来到我的网站</h1>
    <p>这是一个响应式导航栏示例</p>
</div>`,
        css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
}

.navbar {
    background: #333;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #667eea;
}

.nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    gap: 4px;
}

.nav-toggle span {
    width: 25px;
    height: 3px;
    background: white;
    transition: all 0.3s ease;
}

.content {
    padding: 3rem 2rem;
    text-align: center;
}

.content h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
}

.content p {
    font-size: 1.2rem;
    color: #666;
}

@media (max-width: 768px) {
    .nav-toggle {
        display: flex;
    }
    
    .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #333;
        flex-direction: column;
        padding: 1rem 0;
        gap: 0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .nav-menu.active {
        max-height: 300px;
    }
    
    .nav-menu li {
        padding: 1rem 2rem;
        border-bottom: 1px solid #444;
    }
}`,
        js: `const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// 点击菜单项后关闭菜单
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});`
    },

    // 表单验证
    form: {
        name: '表单验证',
        description: '带实时验证的表单',
        html: `<div class="form-container">
    <form id="contactForm" class="contact-form">
        <h2>联系我们</h2>
        
        <div class="form-group">
            <label for="name">姓名 *</label>
            <input type="text" id="name" required>
            <span class="error-message"></span>
        </div>
        
        <div class="form-group">
            <label for="email">邮箱 *</label>
            <input type="email" id="email" required>
            <span class="error-message"></span>
        </div>
        
        <div class="form-group">
            <label for="phone">电话</label>
            <input type="tel" id="phone">
            <span class="error-message"></span>
        </div>
        
        <div class="form-group">
            <label for="message">留言 *</label>
            <textarea id="message" rows="5" required></textarea>
            <span class="error-message"></span>
        </div>
        
        <button type="submit" class="submit-btn">提交</button>
    </form>
</div>`,
        css: `.form-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.contact-form {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    width: 100%;
    max-width: 500px;
}

.contact-form h2 {
    margin: 0 0 30px 0;
    color: #333;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e4e8;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

.form-group input.error,
.form-group textarea.error {
    border-color: #f44336;
}

.form-group input.success,
.form-group textarea.success {
    border-color: #4CAF50;
}

.error-message {
    display: block;
    color: #f44336;
    font-size: 12px;
    margin-top: 5px;
    min-height: 18px;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s ease;
}

.submit-btn:hover {
    background: #5568d3;
}

.submit-btn:active {
    transform: scale(0.98);
}`,
        js: `const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');

// 验证函数
function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    if (!phone) return true; // 可选字段
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

// 显示错误
function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.add('error');
    input.classList.remove('success');
    errorMessage.textContent = message;
}

// 显示成功
function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.add('success');
    input.classList.remove('error');
    errorMessage.textContent = '';
}

// 实时验证
nameInput.addEventListener('blur', () => {
    if (!validateName(nameInput.value)) {
        showError(nameInput, '姓名至少需要2个字符');
    } else {
        showSuccess(nameInput);
    }
});

emailInput.addEventListener('blur', () => {
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, '请输入有效的邮箱地址');
    } else {
        showSuccess(emailInput);
    }
});

phoneInput.addEventListener('blur', () => {
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        showError(phoneInput, '请输入有效的手机号码');
    } else {
        showSuccess(phoneInput);
    }
});

messageInput.addEventListener('blur', () => {
    if (!validateMessage(messageInput.value)) {
        showError(messageInput, '留言至少需要10个字符');
    } else {
        showSuccess(messageInput);
    }
});

// 表单提交
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    if (!validateName(nameInput.value)) {
        showError(nameInput, '姓名至少需要2个字符');
        isValid = false;
    } else {
        showSuccess(nameInput);
    }
    
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, '请输入有效的邮箱地址');
        isValid = false;
    } else {
        showSuccess(emailInput);
    }
    
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        showError(phoneInput, '请输入有效的手机号码');
        isValid = false;
    } else if (phoneInput.value) {
        showSuccess(phoneInput);
    }
    
    if (!validateMessage(messageInput.value)) {
        showError(messageInput, '留言至少需要10个字符');
        isValid = false;
    } else {
        showSuccess(messageInput);
    }
    
    if (isValid) {
        alert('表单提交成功！\\n\\n' + 
              '姓名：' + nameInput.value + '\\n' +
              '邮箱：' + emailInput.value + '\\n' +
              '电话：' + phoneInput.value + '\\n' +
              '留言：' + messageInput.value);
        form.reset();
        // 清除所有验证状态
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.classList.remove('success', 'error');
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
    }
});`
    },

    // 动画效果
    animation: {
        name: '动画效果',
        description: 'CSS动画和过渡效果',
        html: `<div class="animation-container">
    <h1 class="fade-in">欢迎来到动画世界</h1>
    
    <div class="boxes">
        <div class="box bounce">Bounce</div>
        <div class="box rotate">Rotate</div>
        <div class="box pulse">Pulse</div>
        <div class="box shake">Shake</div>
    </div>
    
    <div class="interactive-section">
        <h2>交互动画</h2>
        <button class="animated-btn" id="triggerBtn">点击我</button>
        <div class="circle" id="circle"></div>
    </div>
</div>`,
        css: `body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.animation-container {
    padding: 40px 20px;
    text-align: center;
}

h1 {
    color: white;
    font-size: 3rem;
    margin-bottom: 40px;
}

/* 淡入动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 1s ease-out;
}

/* 盒子容器 */
.boxes {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 60px;
}

.box {
    width: 120px;
    height: 120px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    font-weight: bold;
    color: #667eea;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

/* 弹跳动画 */
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

.bounce {
    animation: bounce 1s ease-in-out infinite;
}

/* 旋转动画 */
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.rotate {
    animation: rotate 2s linear infinite;
}

/* 脉冲动画 */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.pulse {
    animation: pulse 1s ease-in-out infinite;
}

/* 抖动动画 */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.shake {
    animation: shake 0.5s ease-in-out infinite;
}

/* 交互部分 */
.interactive-section {
    background: rgba(255,255,255,0.1);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.interactive-section h2 {
    color: white;
    margin-bottom: 20px;
}

.animated-btn {
    padding: 15px 40px;
    font-size: 18px;
    border: none;
    border-radius: 50px;
    background: white;
    color: #667eea;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.animated-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.animated-btn:active {
    transform: translateY(0);
}

.circle {
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    margin: 30px auto 0;
    transition: all 0.5s ease;
}

.circle.active {
    transform: scale(1.5) rotate(180deg);
    background: #ffd700;
}`,
        js: `const triggerBtn = document.getElementById('triggerBtn');
const circle = document.getElementById('circle');

triggerBtn.addEventListener('click', () => {
    circle.classList.toggle('active');
    
    // 添加按钮点击效果
    triggerBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        triggerBtn.style.transform = '';
    }, 100);
});

// 给每个盒子添加鼠标悬停效果
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mouseenter', function() {
        this.style.background = '#ffd700';
        this.style.transform = 'scale(1.1)';
    });
    
    box.addEventListener('mouseleave', function() {
        this.style.background = 'white';
        this.style.transform = '';
    });
});

console.log('动画页面已加载！尝试与元素互动吧~');`
    },

    // 加载更多
    loadMore: {
        name: '滚动加载',
        description: '无限滚动和加载更多',
        html: `<div class="content-container">
    <h1>文章列表</h1>
    <div id="articleList" class="article-list"></div>
    <div id="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
    </div>
</div>`,
        css: `body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f5f5f5;
}

.content-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 40px;
}

.article-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.article {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.article h2 {
    color: #667eea;
    margin: 0 0 10px 0;
}

.article .date {
    color: #999;
    font-size: 14px;
    margin-bottom: 15px;
}

.article p {
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.loading {
    text-align: center;
    padding: 40px;
    display: none;
}

.loading.active {
    display: block;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading p {
    color: #999;
    margin: 0;
}`,
        js: `let currentPage = 1;
let isLoading = false;

// 模拟文章数据
function generateArticles(page) {
    const articles = [];
    const start = (page - 1) * 5 + 1;
    
    for (let i = start; i < start + 5; i++) {
        articles.push({
            id: i,
            title: \`文章标题 \${i}\`,
            date: new Date(2025, 0, i).toLocaleDateString('zh-CN'),
            content: \`这是第 \${i} 篇文章的内容。在这里你可以写一些有趣的内容。这个示例展示了如何实现滚动加载更多文章的功能。\`
        });
    }
    
    return articles;
}

// 渲染文章
function renderArticles(articles) {
    const articleList = document.getElementById('articleList');
    
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article';
        articleEl.innerHTML = \`
            <h2>\${article.title}</h2>
            <div class="date">\${article.date}</div>
            <p>\${article.content}</p>
        \`;
        articleList.appendChild(articleEl);
    });
}

// 加载更多
function loadMore() {
    if (isLoading || currentPage > 5) return; // 最多加载5页
    
    isLoading = true;
    const loading = document.getElementById('loading');
    loading.classList.add('active');
    
    // 模拟网络延迟
    setTimeout(() => {
        const articles = generateArticles(currentPage);
        renderArticles(articles);
        currentPage++;
        isLoading = false;
        loading.classList.remove('active');
        
        if (currentPage > 5) {
            loading.innerHTML = '<p style="color: #999;">没有更多内容了</p>';
            loading.style.display = 'block';
        }
    }, 1000);
}

// 监听滚动事件
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    // 距离底部100px时触发加载
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
    }
});

// 初始加载
loadMore();`
    }
};

// 导出模板
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeTemplates;
}

