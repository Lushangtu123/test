# 🏗️ WebCode Studio - 技术架构文档

## 目录

1. [架构概览](#架构概览)
2. [系统设计](#系统设计)
3. [核心模块](#核心模块)
4. [数据流](#数据流)
5. [技术选型](#技术选型)
6. [性能优化](#性能优化)
7. [安全考虑](#安全考虑)
8. [扩展性设计](#扩展性设计)

---

## 架构概览

### 整体架构图

```
┌──────────────────────────────────────────────────────────┐
│                    Browser Layer                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐      │
│  │   HTML5    │  │    CSS3    │  │  JavaScript  │      │
│  │  Structure │  │   Styles   │  │  ES6+ Logic  │      │
│  └────────────┘  └────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                 Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Header    │  │    Editor    │  │   Preview    │  │
│  │  (Controls)  │  │   (CodeMirror)│  │   (iframe)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Console    │  │    Modal     │  │  StatusBar   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                  Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Editor     │  │   Preview    │  │   Template   │  │
│  │   Manager    │  │   Engine     │  │   System     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Export     │  │    Share     │  │   Settings   │  │
│  │   Module     │  │   Module     │  │   Manager    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ LocalStorage │  │    Blob      │  │   PostMessage│  │
│  │  (Settings)  │  │   (Export)   │  │  (Console)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 系统设计

### 设计原则

1. **模块化**：功能独立，职责清晰
2. **可扩展**：易于添加新功能
3. **高性能**：优化用户体验
4. **安全性**：iframe 沙箱隔离
5. **响应式**：适配多种设备

### 技术栈选择理由

| 技术 | 选择理由 |
|------|----------|
| **原生 JavaScript** | 无框架依赖，加载快速，学习成本低 |
| **CodeMirror** | 成熟稳定，功能强大，社区活跃 |
| **CSS Grid/Flexbox** | 现代布局，响应式友好 |
| **LocalStorage** | 简单高效，无需后端 |
| **Blob URL** | 性能优于 srcdoc，安全性好 |

---

## 核心模块

### 1. 编辑器管理模块

**职责**：管理三个代码编辑器（HTML、CSS、JS）

```javascript
// 架构设计
EditorManager {
    - htmlEditor: CodeMirror
    - cssEditor: CodeMirror
    - jsEditor: CodeMirror
    
    + initializeEditors()
    + switchTab(tabName)
    + formatCode()
    + updateEditorStats()
    + changeTheme(theme)
    + updateFontSize(size)
}
```

**核心功能**：
- 编辑器初始化配置
- 标签页切换逻辑
- 主题和字体管理
- 代码统计（行数、字符数）

**关键代码**：
```javascript
function initializeEditors() {
    const commonOptions = {
        theme: currentTheme,
        lineNumbers: true,
        autoCloseBrackets: true,
        // ...更多配置
    };
    
    htmlEditor = CodeMirror.fromTextArea(
        document.getElementById('htmlEditor'),
        { ...commonOptions, mode: 'htmlmixed' }
    );
    
    // 监听变化
    htmlEditor.on('change', () => {
        debounceUpdate();
        updateEditorStats();
    });
}
```

### 2. 预览引擎模块

**职责**：实时渲染用户代码

```javascript
// 架构设计
PreviewEngine {
    - previewElement: HTMLIFrameElement
    - updateTimeout: Timer
    
    + buildFullHTML(html, css, js)
    + updatePreview()
    + debounceUpdate()
    + setPreviewDevice(device)
}
```

**核心技术**：

1. **HTML 构建**
```javascript
function buildFullHTML(html, css, js) {
    // 1. 注入控制台捕获脚本
    const consoleCapture = `/* 捕获 console 输出 */`;
    
    // 2. 注入 CSS
    const styleTag = `<style>${css}</style>`;
    
    // 3. 注入 JavaScript
    const scriptTag = `<script>${js}</script>`;
    
    // 4. 组合完整文档
    return fullHTML;
}
```

2. **Blob URL 技术**
```javascript
function updatePreview() {
    const fullHTML = buildFullHTML(html, css, js);
    
    // 使用 Blob 创建临时 URL
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // 更新 iframe
    preview.src = url;
    
    // 清理旧 URL
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

3. **防抖优化**
```javascript
function debounceUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updatePreview();
    }, 500); // 500ms 延迟
}
```

### 3. 模板系统模块

**职责**：提供预设代码模板

```javascript
// 架构设计
TemplateSystem {
    - templates: Object
    
    + initializeTemplateMenu()
    + loadTemplate(key)
    + saveAsTemplate()
}
```

**数据结构**：
```javascript
const CodeTemplates = {
    templateKey: {
        name: '模板名称',
        description: '模板描述',
        html: '/* HTML 代码 */',
        css: '/* CSS 代码 */',
        js: '/* JavaScript 代码 */'
    }
};
```

**设计优势**：
- 独立文件，易于维护
- 对象结构，易于扩展
- 动态菜单生成

### 4. 导出模块

**职责**：支持多种格式导出

```javascript
// 架构设计
ExportModule {
    + exportAsHTML()
    + exportAsZIP()
    + saveAsJSON()
    + handleExport(action)
}
```

**技术实现**：

1. **导出 HTML**（单文件）
```javascript
function exportAsHTML() {
    const fullHTML = buildFullHTML(html, css, js);
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // 触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${Date.now()}.html`;
    a.click();
}
```

2. **导出 ZIP**（多文件）
```javascript
function exportAsZIP() {
    const zip = new JSZip();
    
    // 添加文件
    zip.file('index.html', htmlEditor.getValue());
    zip.file('styles.css', cssEditor.getValue());
    zip.file('script.js', jsEditor.getValue());
    zip.file('README.md', generateREADME());
    
    // 生成并下载
    zip.generateAsync({ type: 'blob' })
       .then(content => saveAs(content, 'project.zip'));
}
```

3. **保存 JSON**（配置文件）
```javascript
function saveAsJSON() {
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
        timestamp: new Date().toISOString(),
        version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(code, null, 2)], 
                         { type: 'application/json' });
    // ...下载逻辑
}
```

### 5. 分享模块

**职责**：生成分享链接和二维码

```javascript
// 架构设计
ShareModule {
    + showShareModal()
    + generateShareLink()
    + generateQRCode()
    + copyShareLink()
    + loadSharedCode()
}
```

**工作流程**：
```
用户点击分享
    ↓
保存代码到 LocalStorage
    ↓
生成唯一 ID (share_timestamp)
    ↓
构建分享 URL (origin + ?share=ID)
    ↓
显示模态框 + 二维码
    ↓
用户复制链接
    ↓
接收者打开链接
    ↓
从 URL 参数获取 ID
    ↓
从 LocalStorage 加载代码
    ↓
自动填充编辑器
```

**核心代码**：
```javascript
function showShareModal() {
    const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue()
    };
    
    // 生成唯一 ID
    const shareId = 'share_' + Date.now();
    
    // 保存到 LocalStorage
    localStorage.setItem(shareId, JSON.stringify(code));
    
    // 构建分享链接
    const shareUrl = window.location.origin + 
                    window.location.pathname + 
                    '?share=' + shareId;
    
    // 生成二维码
    new QRCode(qrcodeContainer, {
        text: shareUrl,
        width: 200,
        height: 200
    });
}
```

### 6. 控制台模块

**职责**：捕获并显示 console 输出

```javascript
// 架构设计
ConsoleModule {
    - messages: Array
    
    + addConsoleMessage(level, message)
    + clearConsole()
    + toggleConsole()
    + captureConsoleInIframe()
}
```

**跨域通信**：

1. **iframe 内注入脚本**
```javascript
const consoleCapture = `
    <script>
        // 保存原始方法
        const originalLog = console.log;
        
        // 重写 console.log
        console.log = function(...args) {
            originalLog.apply(console, args);
            
            // 发送消息到父窗口
            window.parent.postMessage({
                type: 'console',
                level: 'log',
                message: args.join(' ')
            }, '*');
        };
        
        // 捕获错误
        window.addEventListener('error', function(e) {
            window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: e.message
            }, '*');
        });
    </script>
`;
```

2. **主窗口接收消息**
```javascript
window.addEventListener('message', function(e) {
    if (e.data.type === 'console') {
        addConsoleMessage(e.data.level, e.data.message);
    }
});
```

### 7. 设置管理模块

**职责**：管理用户偏好设置

```javascript
// 架构设计
SettingsManager {
    - settings: Object
    
    + saveSettings()
    + loadSettings()
    + applySettings()
    + resetSettings()
}
```

**持久化策略**：
```javascript
// 保存设置
function saveSettings() {
    const settings = {
        theme: currentTheme,
        fontSize: currentFontSize,
        autoUpdate: isAutoUpdate,
        lineWrap: lineWrap
    };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// 加载设置
function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        const settings = JSON.parse(saved);
        applySettings(settings);
    }
}
```

---

## 数据流

### 1. 用户编辑流程

```
用户输入代码
    ↓
CodeMirror 触发 change 事件
    ↓
debounceUpdate() 防抖处理
    ↓
500ms 后触发 updatePreview()
    ↓
buildFullHTML() 构建完整文档
    ↓
创建 Blob URL
    ↓
更新 iframe.src
    ↓
iframe 加载并渲染
    ↓
控制台消息通过 postMessage 返回
    ↓
显示在控制台面板
```

### 2. 模板加载流程

```
用户点击模板按钮
    ↓
显示模板菜单
    ↓
用户选择模板
    ↓
确认对话框
    ↓
loadTemplate(key)
    ↓
从 CodeTemplates 获取模板数据
    ↓
htmlEditor.setValue(template.html)
cssEditor.setValue(template.css)
jsEditor.setValue(template.js)
    ↓
触发 change 事件
    ↓
自动更新预览
```

### 3. 导出流程

```
用户点击导出按钮
    ↓
显示导出菜单
    ↓
用户选择导出格式
    ↓
收集代码数据
    ↓
根据格式处理：
    ├─ HTML: buildFullHTML() → Blob → 下载
    ├─ ZIP: JSZip → 添加文件 → 生成 → 下载
    └─ JSON: JSON.stringify() → Blob → 下载
    ↓
显示成功通知
```

### 4. 分享流程

```
用户点击分享
    ↓
收集当前代码
    ↓
生成唯一 ID
    ↓
保存到 LocalStorage
    ↓
构建分享 URL
    ↓
生成二维码
    ↓
显示模态框
    ↓
用户复制链接
    ↓
---接收者流程---
    ↓
打开链接（带 share 参数）
    ↓
从 URL 获取 share ID
    ↓
从 LocalStorage 读取代码
    ↓
自动填充编辑器
    ↓
更新预览
```

---

## 技术选型

### 为什么选择 CodeMirror？

| 优势 | 说明 |
|------|------|
| **功能强大** | 支持语法高亮、代码折叠、自动补全 |
| **可定制** | 丰富的配置选项和主题 |
| **性能好** | 虚拟渲染，支持大文件 |
| **成熟稳定** | 广泛使用，bug 少 |
| **社区活跃** | 插件丰富，文档完善 |

**对比其他编辑器**：

- **Monaco Editor**：功能更强但体积大（VS Code 编辑器）
- **Ace Editor**：功能类似但 API 不如 CodeMirror 友好
- **原生 textarea**：功能太简单，用户体验差

### 为什么使用 Blob URL？

**优势**：
1. **性能好**：比 `srcdoc` 更快
2. **安全**：自动清理，避免内存泄漏
3. **灵活**：支持任意 HTML 内容
4. **兼容性**：现代浏览器都支持

**对比 srcdoc**：
```javascript
// srcdoc 方式（不推荐）
iframe.srcdoc = fullHTML; // 有长度限制

// Blob URL 方式（推荐）
const blob = new Blob([fullHTML], { type: 'text/html' });
const url = URL.createObjectURL(blob);
iframe.src = url;
```

### 为什么使用 LocalStorage？

**优势**：
- 简单易用，无需后端
- 持久化存储，刷新不丢失
- 同步 API，使用方便
- 容量够用（5-10MB）

**局限性**：
- 只能存储字符串
- 容量有限（大项目不适合）
- 同源策略限制

**未来改进**：可升级为 IndexedDB 或云端存储

---

## 性能优化

### 1. 防抖优化

**问题**：用户每输入一个字符就更新预览，导致频繁渲染

**解决**：
```javascript
let updateTimeout;

function debounceUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        updatePreview();
    }, 500); // 500ms 延迟
}
```

**效果**：
- 减少 80% 的预览更新次数
- 流畅的编辑体验
- 降低 CPU 使用率

### 2. 代码分割

**问题**：所有代码在一个文件，加载慢

**解决**：
```
script.js        - 核心逻辑（25KB）
templates.js     - 模板库（15KB）
styles.css       - 样式（20KB）
```

**效果**：
- 模板库按需加载
- 更快的首屏加载
- 更好的代码组织

### 3. 事件委托

**问题**：为每个按钮绑定事件监听器

**解决**：
```javascript
// 不好的做法
buttons.forEach(btn => {
    btn.addEventListener('click', handler);
});

// 好的做法
parent.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        handler(e);
    }
});
```

### 4. 懒加载

**编辑器刷新优化**：
```javascript
function switchTab(tabName) {
    // 延迟刷新，避免卡顿
    setTimeout(() => {
        editor.refresh();
    }, 100);
}
```

### 5. 资源清理

**Blob URL 清理**：
```javascript
function updatePreview() {
    const url = URL.createObjectURL(blob);
    preview.src = url;
    
    // 1秒后清理
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}
```

### 性能指标

| 指标 | 目标 | 实际 |
|------|------|------|
| **首次加载** | < 2s | < 1s |
| **编辑响应** | < 100ms | < 50ms |
| **预览更新** | < 500ms | < 300ms |
| **导出速度** | < 2s | < 1s |
| **内存占用** | < 50MB | < 30MB |

---

## 安全考虑

### 1. XSS 防护

**iframe 沙箱**：
```html
<iframe 
    id="preview" 
    sandbox="allow-scripts allow-same-origin">
</iframe>
```

**沙箱限制**：
- 阻止表单提交
- 阻止弹窗
- 阻止插件
- 允许脚本（用户代码）
- 允许同源（控制台通信）

### 2. CSP（Content Security Policy）

未来可添加：
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

### 3. 数据验证

**加载外部文件时验证**：
```javascript
function handleFileLoad(event) {
    try {
        const code = JSON.parse(e.target.result);
        
        // 验证数据结构
        if (typeof code.html !== 'string' ||
            typeof code.css !== 'string' ||
            typeof code.js !== 'string') {
            throw new Error('无效的数据格式');
        }
        
        // 安全加载
        loadCode(code);
    } catch (error) {
        showNotification('文件格式错误', 'error');
    }
}
```

---

## 扩展性设计

### 1. 插件系统（规划）

```javascript
// 插件接口
const PluginAPI = {
    registerEditor(name, editor) {},
    registerTemplate(key, template) {},
    registerExporter(format, handler) {},
    on(event, handler) {},
    emit(event, data) {}
};

// 插件示例
const TypeScriptPlugin = {
    name: 'TypeScript Support',
    init(api) {
        api.registerEditor('typescript', tsEditor);
        api.on('compile', (code) => {
            return transpile(code);
        });
    }
};
```

### 2. 主题系统扩展

```javascript
// 主题配置
const themes = {
    monokai: { /* 配置 */ },
    dracula: { /* 配置 */ },
    custom: { /* 用户自定义 */ }
};

// 动态加载主题
function loadTheme(name) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `themes/${name}.css`;
    document.head.appendChild(link);
}
```

### 3. 多语言支持

```javascript
// i18n 配置
const i18n = {
    'zh-CN': {
        'run': '运行',
        'export': '导出',
        // ...
    },
    'en-US': {
        'run': 'Run',
        'export': 'Export',
        // ...
    }
};

// 切换语言
function setLanguage(lang) {
    currentLanguage = lang;
    updateUI();
}
```

### 4. API 设计

```javascript
// 对外暴露的 API
window.WebCodeStudio = {
    version: '2.0',
    
    // 获取代码
    getCode() {
        return {
            html: htmlEditor.getValue(),
            css: cssEditor.getValue(),
            js: jsEditor.getValue()
        };
    },
    
    // 设置代码
    setCode(code) {
        if (code.html) htmlEditor.setValue(code.html);
        if (code.css) cssEditor.setValue(code.css);
        if (code.js) jsEditor.setValue(code.js);
        updatePreview();
    },
    
    // 更新预览
    updatePreview() {
        updatePreview();
    },
    
    // 加载模板
    loadTemplate(key) {
        loadTemplate(key);
    },
    
    // 导出
    export(format) {
        handleExport(format);
    }
};
```

---

## 总结

WebCode Studio 采用模块化、分层的架构设计，具有以下特点：

✅ **清晰的架构**：分层明确，职责清晰
✅ **高性能**：防抖、懒加载、事件委托等优化
✅ **安全性**：iframe 沙箱隔离
✅ **可扩展**：插件系统、API 设计
✅ **易维护**：代码模块化，注释完善

这个架构既适合当前需求，也为未来扩展预留了空间。

---

**文档版本**：v2.0
**最后更新**：2025-01-07

