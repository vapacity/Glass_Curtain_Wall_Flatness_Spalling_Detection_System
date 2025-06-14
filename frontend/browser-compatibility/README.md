# 浏览器兼容性测试指南

## 概述
本目录包含玻璃幕墙检测系统的浏览器兼容性测试套件，专门针对爆裂检测（spallingDetection）和平整度检测（smoothnessDetection）页面。

## 文件结构
```
browser-compatibility/
├── browser-test-config.js      # 浏览器配置和测试项定义
├── spallingDetection.test.js   # 爆裂检测页面测试用例
├── smoothnessDetection.test.js # 平整度检测页面测试用例
├── run-tests.js               # 自动化测试执行脚本
├── test-report-template.html  # 测试报告模板
└── README.md                  # 本文档
```

## 如何运行测试

### 方法1：浏览器控制台运行
1. 在目标浏览器中打开项目
2. 打开开发者工具（F12）
3. 在控制台中运行：
```javascript
// 加载测试脚本
const script = document.createElement('script');
script.type = 'module';
script.src = '/tests/browser-compatibility/run-tests.js';
document.head.appendChild(script);

// 等待加载完成后运行
setTimeout(() => {
  runBrowserCompatibilityTests();
}, 1000);
```

### 方法2：集成到项目中
在需要测试的页面添加：
```html
<script type="module">
  import { runBrowserCompatibilityTests } from '/tests/browser-compatibility/run-tests.js';
  
  // 添加测试按钮
  const testButton = document.createElement('button');
  testButton.textContent = '运行兼容性测试';
  testButton.onclick = runBrowserCompatibilityTests;
  document.body.appendChild(testButton);
</script>
```

### 方法3：手动测试流程
1. 按照测试用例文档逐项检查
2. 记录每个测试项的结果
3. 填写测试报告

## 测试覆盖范围

### 浏览器版本
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+
- Mobile Safari (iOS 15+)
- Chrome Mobile (Android)

### 主要测试项
1. **功能测试**
   - 页面加载
   - 文件上传
   - 图片预览
   - 检测功能
   - 报告显示

2. **API兼容性**
   - FormData
   - Blob/File API
   - Promise/async/await
   - Canvas API
   - LocalStorage

3. **CSS兼容性**
   - Flexbox
   - Grid
   - Gap属性
   - 现代CSS特性

4. **响应式设计**
   - 桌面端（1920x1080）
   - 平板端（768x1024）
   - 移动端（375x667）

## 已知兼容性问题

### Safari特殊处理
- 日期格式化需使用ISO标准格式
- 某些CSS Grid特性在Safari 15以下版本支持有限

### 移动端适配
- 文件拖拽上传在移动端不支持
- 触摸事件需特殊处理
- 弹窗尺寸需要响应式调整

### 性能优化建议
- 大图片上传前进行压缩
- 使用WebP格式优化图片大小
- 实现图片懒加载

## 查看测试报告
1. 运行测试后，结果会保存在localStorage
2. 打开 `test-report-template.html` 查看详细报告
3. 报告包含：
   - 测试环境信息
   - 功能测试结果
   - API支持情况
   - CSS兼容性
   - 改进建议

## 持续集成建议
可以将这些测试集成到CI/CD流程中：
```yaml
# 示例：GitHub Actions
- name: Browser Compatibility Test
  uses: actions/setup-node@v3
  with:
    node-version: '18'
- run: npm test:browser-compat
```

## 贡献指南
如发现新的兼容性问题：
1. 在相应的测试文件中添加测试用例
2. 更新已知问题列表
3. 提供修复方案或降级策略

## 支持
如有问题，请联系开发团队或查看项目文档。