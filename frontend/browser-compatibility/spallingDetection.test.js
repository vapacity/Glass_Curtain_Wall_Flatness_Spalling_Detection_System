// 爆裂检测页面浏览器兼容性测试
import { browserConfig } from './browser-test-config.js';

export const spallingDetectionTests = {
  pageName: '爆裂检测页面',
  testUrl: '/spallingDetection',
  
  // 功能测试用例
  functionalTests: [
    {
      id: 'SPD-001',
      name: '页面加载测试',
      description: '验证页面是否能在各浏览器中正常加载',
      steps: [
        '打开爆裂检测页面',
        '检查页面标题是否显示',
        '检查主要UI元素是否渲染'
      ],
      expectedResults: [
        '页面正常加载，无JavaScript错误',
        '显示"本地上传"分隔线',
        '显示上传区域和按钮'
      ],
      criticalBrowsers: ['所有']
    },
    
    {
      id: 'SPD-002', 
      name: '图片上传功能测试',
      description: '测试文件上传功能的兼容性',
      steps: [
        '点击上传区域或拖拽图片',
        '选择JPG/PNG格式图片',
        '上传大小不同的图片（<50MB）'
      ],
      expectedResults: [
        '能够选择文件',
        '显示文件预览',
        '上传进度正常显示',
        'FormData API正常工作'
      ],
      criticalBrowsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      knownIssues: {
        'Mobile Safari': '拖拽上传可能不支持，需使用点击上传',
        'Android Chrome': '大文件上传可能较慢'
      }
    },
    
    {
      id: 'SPD-003',
      name: '图片预览功能测试',
      description: '测试Blob URL创建和图片预览',
      steps: [
        '上传图片后查看预览',
        '删除图片并重新上传'
      ],
      expectedResults: [
        'URL.createObjectURL正常工作',
        '图片预览正常显示',
        '删除功能正常'
      ],
      criticalBrowsers: ['所有'],
      requiredAPIs: ['Blob', 'URL.createObjectURL']
    },
    
    {
      id: 'SPD-004',
      name: '检测功能测试',
      description: '测试爆裂检测核心功能',
      steps: [
        '上传图片',
        '点击"开始检测"按钮',
        '等待检测完成'
      ],
      expectedResults: [
        '进度条动画流畅',
        'axios请求正常发送',
        '检测结果正确显示',
        '处理后的图片正常加载'
      ],
      criticalBrowsers: ['所有'],
      requiredAPIs: ['Promise', 'async/await', 'XMLHttpRequest/fetch']
    },
    
    {
      id: 'SPD-005',
      name: 'UI响应式测试',
      description: '测试不同屏幕尺寸下的显示效果',
      steps: [
        '在不同视口尺寸下查看页面',
        '测试移动端触摸交互'
      ],
      expectedResults: [
        '布局自适应不同屏幕',
        '按钮大小适合触摸操作',
        '图片缩放比例正确'
      ],
      criticalBrowsers: ['所有移动端浏览器']
    },
    
    {
      id: 'SPD-006',
      name: 'Element Plus组件兼容性',
      description: '测试UI组件库的浏览器兼容性',
      steps: [
        '检查所有Element Plus组件渲染',
        '测试弹窗、提示、按钮等交互'
      ],
      expectedResults: [
        'ElButton正常显示和点击',
        'ElMessage提示正常弹出',
        'ElProgress进度条动画流畅',
        'ElUpload上传组件正常工作'
      ],
      criticalBrowsers: ['所有']
    }
  ],
  
  // CSS兼容性测试
  cssTests: [
    {
      property: 'flexbox',
      selectors: ['.main-container', '.upload-container', '.scrollbar-container'],
      criticalBrowsers: ['所有']
    },
    {
      property: 'gap',
      selectors: ['.uploaded-image-preview', '.scrollbar-container'],
      fallback: '使用margin作为备选方案',
      criticalBrowsers: ['Safari <14.1']
    },
    {
      property: 'border-radius',
      selectors: ['.upload-container'],
      criticalBrowsers: ['所有']
    }
  ],
  
  // JavaScript API兼容性测试
  jsAPITests: [
    {
      api: 'FormData',
      usage: '文件上传',
      polyfillNeeded: false,
      criticalBrowsers: ['所有现代浏览器']
    },
    {
      api: 'Blob',
      usage: '图片处理和下载',
      polyfillNeeded: false,
      criticalBrowsers: ['所有现代浏览器']
    },
    {
      api: 'URL.createObjectURL',
      usage: '创建图片预览URL',
      polyfillNeeded: false,
      criticalBrowsers: ['所有现代浏览器']
    },
    {
      api: 'Promise/async/await',
      usage: '异步操作',
      polyfillNeeded: true,
      polyfillFor: ['IE11'],
      criticalBrowsers: ['所有现代浏览器']
    }
  ],
  
  // 性能测试
  performanceTests: [
    {
      metric: '页面加载时间',
      target: '<3秒',
      conditions: '正常网络条件下'
    },
    {
      metric: '图片上传响应',
      target: '<500ms开始上传',
      conditions: '50MB以下图片'
    },
    {
      metric: '检测结果返回',
      target: '<15秒',
      conditions: '包含网络请求和图片处理'
    }
  ],
  
  // 兼容性修复建议
  compatibilityFixes: {
    'Safari日期格式化': {
      issue: 'Safari对某些日期格式解析可能失败',
      fix: '使用标准ISO格式或date-fns库',
      code: `// 使用标准格式
const date = new Date().toISOString();`
    },
    '移动端文件上传': {
      issue: '某些移动浏览器不支持拖拽上传',
      fix: '提供明确的点击上传选项',
      implemented: true
    },
    'CSS Grid降级': {
      issue: '旧版浏览器不支持Grid',
      fix: '使用Flexbox作为降级方案',
      code: `@supports not (display: grid) {
  .container { display: flex; flex-wrap: wrap; }
}`
    }
  }
};