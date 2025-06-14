// 浏览器兼容性测试配置
export const browserConfig = {
  // 需要测试的浏览器列表
  browsers: [
    {
      name: 'Chrome',
      versions: ['最新版', '最新版-1', '最新版-2'],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    {
      name: 'Firefox', 
      versions: ['最新版', '最新版-1'],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
    },
    {
      name: 'Safari',
      versions: ['17.0', '16.0', '15.0'],
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    },
    {
      name: 'Edge',
      versions: ['最新版', '最新版-1'],
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    },
    {
      name: 'Mobile Safari (iOS)',
      versions: ['17.0', '16.0'],
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    },
    {
      name: 'Chrome Mobile (Android)',
      versions: ['最新版'],
      userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    }
  ],

  // 测试的视口尺寸
  viewports: [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ],

  // 测试项目
  testItems: {
    // 基础功能测试
    basic: [
      '页面加载',
      '导航功能',
      '按钮点击',
      '表单提交'
    ],
    
    // UI渲染测试
    rendering: [
      'CSS样式渲染',
      'Flexbox布局',
      'Grid布局',
      '响应式设计',
      '图片显示',
      '图标显示',
      '动画效果'
    ],
    
    // JavaScript功能测试
    javascript: [
      'ES6+语法支持',
      'Promise/Async支持',
      'Vue 3特性支持',
      'Element Plus组件',
      'Axios请求',
      '文件上传',
      '进度条显示'
    ],
    
    // 兼容性问题
    compatibility: [
      'Blob对象支持',
      'FormData支持',
      'FileReader API',
      'Canvas API',
      'LocalStorage',
      'SessionStorage'
    ]
  },

  // 已知的兼容性问题
  knownIssues: {
    'IE11': ['不支持ES6+语法', '不支持Vue 3', '不支持现代CSS特性'],
    'Safari <15': ['某些CSS Grid特性支持有限', 'Date格式化可能有差异'],
    'Firefox <100': ['某些CSS自定义属性支持有限'],
    'Mobile': ['文件上传体验可能不同', '触摸事件处理']
  }
};