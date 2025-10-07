// ============================================
// WebCode Studio - 专业在线代码编辑器
// Version: 2.0
// ============================================

// 全局变量
let htmlEditor, cssEditor, jsEditor;
let isAutoUpdate = true;
let updateTimeout;
let currentTheme = 'monokai';
let currentFontSize = 14;
let consoleMessages = [];

// 应用配置
const APP_CONFIG = {
    AUTO_SAVE_KEY: 'webcode-studio-autosave',
    SETTINGS_KEY: 'webcode-studio-settings',
    UPDATE_DELAY: 500
};

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadSettings();
    initializeEditors();
    initializeEventListeners();
    initializeTemplateMenu();
    loadAutoSave();
    updatePreview();
    updateStatus('应用已加载完成', 'success');
    
    // 自动保存
    setInterval(autoSave, 30000); // 每30秒自动保存
}

// ============================================
// 编辑器初始化
// ============================================

function initializeEditors() {
    const commonOptions = {
        theme: currentTheme,
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };

    // HTML编辑器
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
        ...commonOptions,
        mode: 'htmlmixed',
        autoCloseTags: true
    });

    // CSS编辑器
    cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
        ...commonOptions,
        mode: 'css'
    });

    // JavaScript编辑器
    jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
        ...commonOptions,
        mode: 'javascript'
    });

    // 设置字体大小
    updateFontSize(currentFontSize);

    // 监听编辑器变化
    htmlEditor.on('change', () => {
        debounceUpdate();
        updateEditorStats();
    });
    cssEditor.on('change', () => {
        debounceUpdate();
        updateEditorStats();
    });
    jsEditor.on('change', () => {
        debounceUpdate();
        updateEditorStats();
    });

    // 初始统计
    updateEditorStats();
}

// ============================================
// 事件监听器
// ============================================

function initializeEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // 主要功能按钮
    document.getElementById('runBtn').addEventListener('click', updatePreview);
    document.getElementById('formatBtn').addEventListener('click', formatCode);
    document.getElementById('loadBtn').addEventListener('click', loadCode);
    document.getElementById('shareBtn').addEventListener('click', showShareModal);

    // 导出菜单
    const exportMenu = document.getElementById('exportMenu');
    exportMenu.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.dataset.action;
            handleExport(action);
            exportMenu.classList.remove('show');
        });
    });

    // 设置菜单
    document.getElementById('themeSelect').addEventListener('change', function() {
        changeTheme(this.value);
    });

    document.getElementById('fontSizeSelect').addEventListener('change', function() {
        updateFontSize(parseInt(this.value));
    });

    document.getElementById('autoUpdateCheckbox').addEventListener('change', function() {
        isAutoUpdate = this.checked;
        if (this.checked) {
            updatePreview();
        }
    });

    document.getElementById('lineWrapCheckbox').addEventListener('change', function() {
        const wrap = this.checked;
        htmlEditor.setOption('lineWrapping', wrap);
        cssEditor.setOption('lineWrapping', wrap);
        jsEditor.setOption('lineWrapping', wrap);
    });

    // 预览控制
    document.getElementById('deviceMobileBtn').addEventListener('click', () => setPreviewDevice('mobile'));
    document.getElementById('deviceTabletBtn').addEventListener('click', () => setPreviewDevice('tablet'));
    document.getElementById('deviceDesktopBtn').addEventListener('click', () => setPreviewDevice('desktop'));
    document.getElementById('refreshBtn').addEventListener('click', updatePreview);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

    // 控制台
    document.getElementById('clearConsoleBtn').addEventListener('click', clearConsole);
    document.getElementById('toggleConsoleBtn').addEventListener('click', toggleConsole);

    // 模态框
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });

    // 文件输入
    document.getElementById('fileInput').addEventListener('change', handleFileLoad);

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    handleExport('save-json');
                    break;
                case 'r':
                    e.preventDefault();
                    updatePreview();
                    break;
                case 'Enter':
                    e.preventDefault();
                    updatePreview();
                    break;
            }
        }
    });

    // 分享模态框
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyShareLink);
    }
}

// ============================================
// 模板管理
// ============================================

function initializeTemplateMenu() {
    const templateMenu = document.getElementById('templateMenu');
    
    Object.entries(CodeTemplates).forEach(([key, template]) => {
        const btn = document.createElement('button');
        btn.textContent = template.name;
        btn.title = template.description;
        btn.addEventListener('click', () => loadTemplate(key));
        templateMenu.appendChild(btn);
    });
}

function loadTemplate(templateKey) {
    const template = CodeTemplates[templateKey];
    if (!template) return;

    if (confirm(`确定要加载模板"${template.name}"吗？当前代码将被替换。`)) {
        htmlEditor.setValue(template.html);
        cssEditor.setValue(template.css);
        jsEditor.setValue(template.js);
        updatePreview();
        showNotification(`模板"${template.name}"已加载`, 'success');
    }
}

// ============================================
// 编辑器功能
// ============================================

function switchTab(tabName) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 更新编辑器显示
    document.querySelectorAll('.editor-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // 更新状态栏
    document.getElementById('currentTab').textContent = tabName.toUpperCase();

    // 刷新对应的编辑器
    setTimeout(() => {
        switch(tabName) {
            case 'html':
                htmlEditor.refresh();
                break;
            case 'css':
                cssEditor.refresh();
                break;
            case 'js':
                jsEditor.refresh();
                break;
        }
        updateEditorStats();
    }, 100);
}

function formatCode() {
    // 简单的代码格式化（实际项目中可以集成 prettier 等）
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    
    try {
        switch(activeTab) {
            case 'html':
                htmlEditor.setValue(formatHTML(htmlEditor.getValue()));
                break;
            case 'css':
                cssEditor.setValue(formatCSS(cssEditor.getValue()));
                break;
            case 'js':
                jsEditor.setValue(formatJS(jsEditor.getValue()));
                break;
        }
        showNotification('代码格式化成功', 'success');
    } catch (error) {
        showNotification('格式化失败: ' + error.message, 'error');
    }
}

// 简单的格式化函数
function formatHTML(code) {
    // 基础格式化，实际应用中建议使用专业库
    return code;
}

function formatCSS(code) {
    // 基础格式化
    return code;
}

function formatJS(code) {
    // 基础格式化
    return code;
}

function changeTheme(theme) {
    currentTheme = theme;
    htmlEditor.setOption('theme', theme);
    cssEditor.setOption('theme', theme);
    jsEditor.setOption('theme', theme);
    saveSettings();
    showNotification(`主题已切换到 ${theme}`, 'info');
}

function updateFontSize(size) {
    currentFontSize = size;
    document.querySelectorAll('.CodeMirror').forEach(cm => {
        cm.style.fontSize = size + 'px';
    });
    htmlEditor.refresh();
    cssEditor.refresh();
    jsEditor.refresh();
    saveSettings();
}

function updateEditorStats() {
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    let editor;
    
    switch(activeTab) {
        case 'html':
            editor = htmlEditor;
            break;
        case 'css':
            editor = cssEditor;
            break;
        case 'js':
            editor = jsEditor;
            break;
    }

    if (editor) {
        const lineCount = editor.lineCount();
        const charCount = editor.getValue().length;
        document.getElementById('lineCount').textContent = `行: ${lineCount}`;
        document.getElementById('charCount').textContent = `字符: ${charCount}`;
    }
}

// ============================================
// 预览功能
// ============================================

function debounceUpdate() {
    if (!isAutoUpdate) return;
    
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updatePreview();
    }, APP_CONFIG.UPDATE_DELAY);
}

function updatePreview() {
    try {
        const htmlCode = htmlEditor.getValue();
        const cssCode = cssEditor.getValue();
        const jsCode = jsEditor.getValue();

        // 构建完整的HTML文档
        const fullHTML = buildFullHTML(htmlCode, cssCode, jsCode);

        // 更新iframe - 指定正确的字符编码
        const preview = document.getElementById('preview');
        const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        preview.src = url;
        
        // 清理旧的URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        updateStatus('预览已更新', 'success');
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('预览更新失败:', error);
        updateStatus('预览更新失败: ' + error.message, 'error');
        addConsoleMessage('error', error.message);
    }
}

function buildFullHTML(html, css, js) {
    // 注入控制台捕获代码
    const consoleCapture = `
        <script>
            (function() {
                const originalLog = console.log;
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalInfo = console.info;
                
                window.addEventListener('error', function(e) {
                    window.parent.postMessage({
                        type: 'console',
                        level: 'error',
                        message: e.message + ' (Line: ' + e.lineno + ')'
                    }, '*');
                });
                
                console.log = function(...args) {
                    originalLog.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'log',
                        message: args.map(a => String(a)).join(' ')
                    }, '*');
                };
                
                console.error = function(...args) {
                    originalError.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'error',
                        message: args.map(a => String(a)).join(' ')
                    }, '*');
                };
                
                console.warn = function(...args) {
                    originalWarn.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'warn',
                        message: args.map(a => String(a)).join(' ')
                    }, '*');
                };
                
                console.info = function(...args) {
                    originalInfo.apply(console, args);
                    window.parent.postMessage({
                        type: 'console',
                        level: 'info',
                        message: args.map(a => String(a)).join(' ')
                    }, '*');
                };
            })();
        </script>
    `;

    // 如果HTML已经是完整文档
    if (html.toLowerCase().includes('<!doctype') || html.toLowerCase().includes('<html')) {
        let fullHTML = html;
        
        // 注入CSS
        if (css.trim()) {
            const cssTag = `<style>\n${css}\n</style>`;
            if (fullHTML.includes('</head>')) {
                fullHTML = fullHTML.replace('</head>', cssTag + '\n</head>');
            } else {
                fullHTML = cssTag + '\n' + fullHTML;
            }
        }
        
        // 注入控制台捕获
        if (fullHTML.includes('</head>')) {
            fullHTML = fullHTML.replace('</head>', consoleCapture + '\n</head>');
        } else {
            fullHTML = consoleCapture + '\n' + fullHTML;
        }
        
        // 注入JS
        if (js.trim()) {
            const jsTag = `<script>\n${js}\n</script>`;
            if (fullHTML.includes('</body>')) {
                fullHTML = fullHTML.replace('</body>', jsTag + '\n</body>');
            } else {
                fullHTML = fullHTML + '\n' + jsTag;
            }
        }
        
        return fullHTML;
    } else {
        // 构建基本的HTML结构
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>预览</title>
    ${consoleCapture}
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;
    }
}

// 监听来自iframe的控制台消息
window.addEventListener('message', function(e) {
    if (e.data.type === 'console') {
        addConsoleMessage(e.data.level, e.data.message);
    }
});

function setPreviewDevice(device) {
    const previewWrapper = document.querySelector('.preview-wrapper');
    const deviceBtns = document.querySelectorAll('[id^="device"]');
    
    deviceBtns.forEach(btn => btn.classList.remove('active'));
    
    previewWrapper.classList.remove('mobile', 'tablet');
    
    switch(device) {
        case 'mobile':
            previewWrapper.classList.add('mobile');
            document.getElementById('deviceMobileBtn').classList.add('active');
            break;
        case 'tablet':
            previewWrapper.classList.add('tablet');
            document.getElementById('deviceTabletBtn').classList.add('active');
            break;
        case 'desktop':
            document.getElementById('deviceDesktopBtn').classList.add('active');
            break;
    }
    
    showNotification(`切换到${device}视图`, 'info');
}

function toggleFullscreen() {
    const preview = document.getElementById('preview');
    if (preview.requestFullscreen) {
        preview.requestFullscreen();
    } else if (preview.webkitRequestFullscreen) {
        preview.webkitRequestFullscreen();
    } else if (preview.msRequestFullscreen) {
        preview.msRequestFullscreen();
    }
}

// ============================================
// 控制台功能
// ============================================

function addConsoleMessage(level, message) {
    const consoleContent = document.getElementById('consoleContent');
    const line = document.createElement('div');
    line.className = `console-line ${level}`;
    
    const timestamp = new Date().toLocaleTimeString();
    line.textContent = `[${timestamp}] ${message}`;
    
    consoleContent.appendChild(line);
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    consoleMessages.push({ level, message, timestamp });
}

function clearConsole() {
    document.getElementById('consoleContent').innerHTML = '';
    consoleMessages = [];
    showNotification('控制台已清空', 'info');
}

function toggleConsole() {
    const consolePanel = document.getElementById('consolePanel');
    const toggleBtn = document.getElementById('toggleConsoleBtn');
    
    consolePanel.classList.toggle('collapsed');
    toggleBtn.textContent = consolePanel.classList.contains('collapsed') ? '展开' : '收起';
}

// ============================================
// 导出功能
// ============================================

function handleExport(action) {
    switch(action) {
        case 'export-html':
            exportAsHTML();
            break;
        case 'export-zip':
            exportAsZIP();
            break;
        case 'save-json':
            saveAsJSON();
            break;
    }
}

function exportAsHTML() {
    const htmlCode = htmlEditor.getValue();
    const cssCode = cssEditor.getValue();
    const jsCode = jsEditor.getValue();
    
    const fullHTML = buildFullHTML(htmlCode, cssCode, jsCode);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('HTML文件已导出', 'success');
}

function exportAsZIP() {
    if (typeof JSZip === 'undefined') {
        showNotification('ZIP库未加载', 'error');
        return;
    }

    const zip = new JSZip();
    
    zip.file('index.html', htmlEditor.getValue());
    zip.file('styles.css', cssEditor.getValue());
    zip.file('script.js', jsEditor.getValue());
    zip.file('README.md', `# WebCode Studio Project\n\n生成时间: ${new Date().toLocaleString()}\n\n## 使用说明\n\n直接用浏览器打开 index.html 即可预览项目。`);
    
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, `webcode-project-${Date.now()}.zip`);
        showNotification('ZIP文件已导出', 'success');
    });
}

function saveAsJSON() {
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        timestamp: new Date().toISOString(),
        version: '2.0'
    };

    const blob = new Blob([JSON.stringify(code, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `webcode-project-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showNotification('项目已保存', 'success');
}

function loadCode() {
    document.getElementById('fileInput').click();
}

function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const code = JSON.parse(e.target.result);
            
            if (code.html !== undefined) htmlEditor.setValue(code.html);
            if (code.css !== undefined) cssEditor.setValue(code.css);
            if (code.js !== undefined) jsEditor.setValue(code.js);
            
            updatePreview();
            showNotification('项目已加载', 'success');
        } catch (error) {
            showNotification('文件格式错误', 'error');
        }
    };
    reader.readAsText(file);
    
    // 重置文件输入
    event.target.value = '';
}

// ============================================
// 分享功能
// ============================================

function showShareModal() {
    const modal = document.getElementById('shareModal');
    modal.classList.add('show');
    
    // 生成分享链接（使用localStorage）
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue()
    };
    
    const shareId = 'share_' + Date.now();
    localStorage.setItem(shareId, JSON.stringify(code));
    
    const shareUrl = window.location.origin + window.location.pathname + '?share=' + shareId;
    document.getElementById('shareLink').value = shareUrl;
    
    // 生成二维码
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    
    if (typeof QRCode !== 'undefined') {
        new QRCode(qrcodeContainer, {
            text: shareUrl,
            width: 200,
            height: 200
        });
    } else {
        qrcodeContainer.innerHTML = '<p style="color: #999;">二维码库未加载</p>';
    }
}

function copyShareLink() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    showNotification('链接已复制', 'success');
}

// 加载分享的代码
function loadSharedCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    
    if (shareId) {
        const sharedCode = localStorage.getItem(shareId);
        if (sharedCode) {
            try {
                const code = JSON.parse(sharedCode);
                htmlEditor.setValue(code.html || '');
                cssEditor.setValue(code.css || '');
                jsEditor.setValue(code.js || '');
                updatePreview();
                showNotification('已加载分享的代码', 'info');
            } catch (error) {
                showNotification('加载分享代码失败', 'error');
            }
        }
    }
}

// ============================================
// 自动保存和设置
// ============================================

function autoSave() {
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem(APP_CONFIG.AUTO_SAVE_KEY, JSON.stringify(code));
    } catch (error) {
        console.error('自动保存失败:', error);
    }
}

function loadAutoSave() {
    try {
        const saved = localStorage.getItem(APP_CONFIG.AUTO_SAVE_KEY);
        if (saved) {
            const code = JSON.parse(saved);
            // 只在编辑器为空时加载
            if (htmlEditor.getValue().trim() === '' && 
                cssEditor.getValue().trim() === '' && 
                jsEditor.getValue().trim() === '') {
                // 不覆盖默认内容，除非用户确认
                // htmlEditor.setValue(code.html || '');
                // cssEditor.setValue(code.css || '');
                // jsEditor.setValue(code.js || '');
            }
        }
    } catch (error) {
        console.error('加载自动保存失败:', error);
    }
    
    // 加载分享的代码
    loadSharedCode();
}

function saveSettings() {
    const settings = {
        theme: currentTheme,
        fontSize: currentFontSize,
        autoUpdate: isAutoUpdate
    };
    
    try {
        localStorage.setItem(APP_CONFIG.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('保存设置失败:', error);
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem(APP_CONFIG.SETTINGS_KEY);
        if (saved) {
            const settings = JSON.parse(saved);
            currentTheme = settings.theme || 'monokai';
            currentFontSize = settings.fontSize || 14;
            isAutoUpdate = settings.autoUpdate !== undefined ? settings.autoUpdate : true;
            
            // 应用设置到UI
            document.getElementById('themeSelect').value = currentTheme;
            document.getElementById('fontSizeSelect').value = currentFontSize;
            document.getElementById('autoUpdateCheckbox').checked = isAutoUpdate;
        }
    } catch (error) {
        console.error('加载设置失败:', error);
    }
}

// ============================================
// UI 工具函数
// ============================================

function updateStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
}

function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = `最后更新: ${new Date().toLocaleTimeString()}`;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// 错误处理
// ============================================

window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    updateStatus('发生错误: ' + e.message, 'error');
    addConsoleMessage('error', e.message);
});

// ============================================
// 导出API
// ============================================

window.WebCodeStudio = {
    version: '2.0',
    getCode: () => ({
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue()
    }),
    setCode: (code) => {
        if (code.html !== undefined) htmlEditor.setValue(code.html);
        if (code.css !== undefined) cssEditor.setValue(code.css);
        if (code.js !== undefined) jsEditor.setValue(code.js);
        updatePreview();
    },
    updatePreview: updatePreview,
    loadTemplate: loadTemplate,
    export: handleExport
};

// 添加滑出动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);