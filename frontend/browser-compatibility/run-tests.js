// 浏览器兼容性测试执行脚本
import { browserConfig } from './browser-test-config.js';
import { spallingDetectionTests } from './spallingDetection.test.js';
import { smoothnessDetectionTests } from './smoothnessDetection.test.js';

// 检测浏览器功能支持
class BrowserCompatibilityTester {
  constructor() {
    this.results = {
      browser: this.detectBrowser(),
      timestamp: new Date().toISOString(),
      tests: []
    };
  }

  // 检测当前浏览器
  detectBrowser() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (ua.indexOf('Edg') > -1) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    }

    return {
      name: browserName,
      version: browserVersion,
      userAgent: ua,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  // 检测API支持
  checkAPISupport(apiName) {
    const apiChecks = {
      'FormData': () => typeof FormData !== 'undefined',
      'Blob': () => typeof Blob !== 'undefined',
      'URL.createObjectURL': () => typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function',
      'Promise': () => typeof Promise !== 'undefined',
      'async/await': () => {
        try {
          eval('(async function() {})');
          return true;
        } catch {
          return false;
        }
      },
      'FileReader': () => typeof FileReader !== 'undefined',
      'LocalStorage': () => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      },
      'SessionStorage': () => {
        try {
          sessionStorage.setItem('test', 'test');
          sessionStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      },
      'IntersectionObserver': () => typeof IntersectionObserver !== 'undefined',
      'Canvas': () => {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
      }
    };

    return apiChecks[apiName] ? apiChecks[apiName]() : false;
  }

  // 检测CSS支持
  checkCSSSupport(property, value) {
    const el = document.createElement('div');
    const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    
    if (value) {
      el.style[camelCase] = value;
      return el.style[camelCase] === value;
    }
    
    return camelCase in el.style;
  }

  // 运行功能测试
  async runFunctionalTest(test) {
    const result = {
      id: test.id,
      name: test.name,
      status: 'pending',
      errors: [],
      warnings: []
    };

    try {
      // 检查必需的API
      if (test.requiredAPIs) {
        for (const api of test.requiredAPIs) {
          if (!this.checkAPISupport(api)) {
            result.warnings.push(`API '${api}' 不支持`);
          }
        }
      }

      // 检查已知问题
      if (test.knownIssues && test.knownIssues[this.results.browser.name]) {
        result.warnings.push(...test.knownIssues[this.results.browser.name]);
      }

      result.status = result.errors.length === 0 ? 'passed' : 'failed';
    } catch (error) {
      result.status = 'error';
      result.errors.push(error.message);
    }

    return result;
  }

  // 运行CSS测试
  runCSSTest(cssTest) {
    const result = {
      property: cssTest.property,
      supported: this.checkCSSSupport(cssTest.property),
      selectors: cssTest.selectors,
      fallback: cssTest.fallback
    };

    if (!result.supported && cssTest.criticalBrowsers.includes(this.results.browser.name)) {
      result.warning = `${cssTest.property} 在 ${this.results.browser.name} 中不支持`;
    }

    return result;
  }

  // 运行所有测试
  async runAllTests() {
    console.log('开始浏览器兼容性测试...');
    console.log(`当前浏览器: ${this.results.browser.name} ${this.results.browser.version}`);

    // 测试爆裂检测页面
    console.log('\n=== 测试爆裂检测页面 ===');
    const spallingResults = {
      page: spallingDetectionTests.pageName,
      functionalTests: [],
      cssTests: [],
      apiTests: []
    };

    for (const test of spallingDetectionTests.functionalTests) {
      const result = await this.runFunctionalTest(test);
      spallingResults.functionalTests.push(result);
      console.log(`${test.name}: ${result.status}`);
    }

    for (const cssTest of spallingDetectionTests.cssTests) {
      const result = this.runCSSTest(cssTest);
      spallingResults.cssTests.push(result);
    }

    for (const apiTest of spallingDetectionTests.jsAPITests) {
      const supported = this.checkAPISupport(apiTest.api);
      spallingResults.apiTests.push({
        api: apiTest.api,
        supported,
        usage: apiTest.usage
      });
    }

    this.results.tests.push(spallingResults);

    // 测试平整度检测页面
    console.log('\n=== 测试平整度检测页面 ===');
    const smoothnessResults = {
      page: smoothnessDetectionTests.pageName,
      functionalTests: [],
      cssTests: [],
      apiTests: []
    };

    for (const test of smoothnessDetectionTests.functionalTests) {
      const result = await this.runFunctionalTest(test);
      smoothnessResults.functionalTests.push(result);
      console.log(`${test.name}: ${result.status}`);
    }

    for (const cssTest of smoothnessDetectionTests.cssTests) {
      const result = this.runCSSTest(cssTest);
      smoothnessResults.cssTests.push(result);
    }

    for (const apiTest of smoothnessDetectionTests.jsAPITests) {
      const supported = this.checkAPISupport(apiTest.api);
      smoothnessResults.apiTests.push({
        api: apiTest.api,
        supported,
        usage: apiTest.usage
      });
    }

    this.results.tests.push(smoothnessResults);

    return this.results;
  }

  // 生成测试报告
  generateReport() {
    const report = {
      ...this.results,
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };

    // 统计结果
    for (const pageTests of report.tests) {
      for (const test of pageTests.functionalTests) {
        report.summary.totalTests++;
        if (test.status === 'passed') report.summary.passed++;
        if (test.status === 'failed') report.summary.failed++;
        if (test.warnings.length > 0) report.summary.warnings += test.warnings.length;
      }
    }

    return report;
  }
}

// 导出测试运行函数
export async function runBrowserCompatibilityTests() {
  const tester = new BrowserCompatibilityTester();
  await tester.runAllTests();
  const report = tester.generateReport();
  
  console.log('\n=== 测试报告摘要 ===');
  console.log(`总测试数: ${report.summary.totalTests}`);
  console.log(`通过: ${report.summary.passed}`);
  console.log(`失败: ${report.summary.failed}`);
  console.log(`警告: ${report.summary.warnings}`);
  
  // 保存报告到localStorage
  localStorage.setItem('browserCompatibilityReport', JSON.stringify(report));
  
  return report;
}

// 如果直接运行脚本
if (typeof window !== 'undefined') {
  window.runBrowserCompatibilityTests = runBrowserCompatibilityTests;
  console.log('浏览器兼容性测试已加载。运行 runBrowserCompatibilityTests() 开始测试。');
}