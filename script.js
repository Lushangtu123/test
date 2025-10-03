// 全局变量
let htmlEditor, cssEditor, jsEditor;
let isAutoUpdate = true;
let updateTimeout;

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeEditors();
    initializeEventListeners();
    updatePreview();
    updateStatus('应用已加载完成');
});

// 初始化代码编辑器
function initializeEditors() {
    // HTML编辑器
    htmlEditor = CodeMirror.fromTextArea(document.getElementById('htmlEditor'), {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    // CSS编辑器
    cssEditor = CodeMirror.fromTextArea(document.getElementById('cssEditor'), {
        mode: 'css',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    // JavaScript编辑器
    jsEditor = CodeMirror.fromTextArea(document.getElementById('jsEditor'), {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    // 监听编辑器变化
    htmlEditor.on('change', debounceUpdate);
    cssEditor.on('change', debounceUpdate);
    jsEditor.on('change', debounceUpdate);
}

// 初始化事件监听器
function initializeEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // 控制按钮
    document.getElementById('runBtn').addEventListener('click', updatePreview);
    document.getElementById('resetBtn').addEventListener('click', resetCode);
    document.getElementById('saveBtn').addEventListener('click', saveCode);
    document.getElementById('loadBtn').addEventListener('click', loadCode);
    document.getElementById('refreshBtn').addEventListener('click', updatePreview);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

    // 文件输入
    document.getElementById('fileInput').addEventListener('change', handleFileLoad);

    // 键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    saveCode();
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
}

// 切换标签页
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
    }, 100);
}

// 防抖更新
function debounceUpdate() {
    if (!isAutoUpdate) return;
    
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updatePreview();
    }, 500);
}

// 更新预览
function updatePreview() {
    try {
        const htmlCode = htmlEditor.getValue();
        const cssCode = cssEditor.getValue();
        const jsCode = jsEditor.getValue();

        // 构建完整的HTML文档
        const fullHTML = buildFullHTML(htmlCode, cssCode, jsCode);

        // 更新iframe
        const preview = document.getElementById('preview');
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        preview.src = url;
        
        // 清理旧的URL
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        updateStatus('预览已更新');
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('预览更新失败:', error);
        updateStatus('预览更新失败: ' + error.message, 'error');
    }
}

// 构建完整的HTML文档
function buildFullHTML(html, css, js) {
    // 如果HTML已经是完整文档，则直接注入CSS和JS
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

// 重置代码
function resetCode() {
    if (confirm('确定要重置所有代码吗？此操作不可撤销。')) {
        const defaultHTML = `<!DOCTYPE html>
<html>
<head>
    <title>测试页面</title>
</head>
<body>
    <h1>欢迎使用实时预览工具！</h1>
    <p>在左侧编辑代码，右侧会实时显示效果。</p>
    <button onclick="changeColor()">点击改变颜色</button>
    <div id="demo">这是一个演示区域</div>
</body>
</html>`;

        const defaultCSS = `body {
    font-family: 'Arial', sans-serif;
    margin: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    text-align: center;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

button {
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 0;
}

button:hover {
    background: #45a049;
    transform: translateY(-2px);
    transition: all 0.3s ease;
}

#demo {
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    border: 2px solid rgba(255,255,255,0.2);
}`;

        const defaultJS = `function changeColor() {
    const demo = document.getElementById('demo');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    demo.style.backgroundColor = randomColor;
    demo.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        demo.style.transform = 'scale(1)';
    }, 200);
}

// 添加一些交互效果
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成！');
    
    // 为演示区域添加点击效果
    const demo = document.getElementById('demo');
    if (demo) {
        demo.addEventListener('click', function() {
            this.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
            setTimeout(() => {
                this.style.boxShadow = 'none';
            }, 300);
        });
    }
});`;

        htmlEditor.setValue(defaultHTML);
        cssEditor.setValue(defaultCSS);
        jsEditor.setValue(defaultJS);
        
        updatePreview();
        updateStatus('代码已重置');
    }
}

// 保存代码
function saveCode() {
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(code, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-code-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    updateStatus('代码已保存');
}

// 加载代码
function loadCode() {
    document.getElementById('fileInput').click();
}

// 处理文件加载
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
            updateStatus('代码已加载');
        } catch (error) {
            updateStatus('文件格式错误', 'error');
        }
    };
    reader.readAsText(file);
}

// 全屏切换
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

// 更新状态
function updateStatus(message, type = 'success') {
    const status = document.getElementById('status');
    status.textContent = message;
    
    // 移除之前的类
    status.classList.remove('error', 'success');
    status.classList.add(type);
    
    // 3秒后恢复默认状态
    setTimeout(() => {
        status.textContent = '准备就绪';
        status.classList.remove('error', 'success');
    }, 3000);
}

// 更新最后更新时间
function updateLastUpdateTime() {
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.textContent = `最后更新: ${new Date().toLocaleTimeString()}`;
}

// 工具函数：格式化代码
function formatCode(code, type) {
    // 这里可以集成代码格式化库
    return code;
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    updateStatus('发生错误: ' + e.message, 'error');
});

// 导出功能（可选）
window.WebCodeEditor = {
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
    updatePreview: updatePreview
};



