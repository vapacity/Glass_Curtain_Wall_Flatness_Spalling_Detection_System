<template>
  <div class="browser-test-container">
    <h1>浏览器兼容性测试</h1>
    
    <div class="test-controls">
      <el-button type="primary" @click="runTests" :loading="testing">
        {{ testing ? '测试中...' : '开始测试' }}
      </el-button>
      
      <el-button @click="viewReport" :disabled="!testCompleted">
        查看测试报告
      </el-button>
      
      <el-button @click="clearResults" type="danger">
        清除结果
      </el-button>
    </div>

    <div v-if="currentTest" class="current-test">
      <h3>正在测试：{{ currentTest }}</h3>
      <el-progress :percentage="progress" :status="progressStatus"></el-progress>
    </div>

    <div v-if="testResults" class="quick-summary">
      <h2>测试摘要</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="总测试数" :value="testResults.summary.totalTests" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="通过" :value="testResults.summary.passed" :value-style="{ color: '#67c23a' }" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="失败" :value="testResults.summary.failed" :value-style="{ color: '#f56c6c' }" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="警告" :value="testResults.summary.warnings" :value-style="{ color: '#e6a23c' }" />
        </el-col>
      </el-row>
    </div>

    <div v-if="testResults" class="test-details">
      <h2>详细结果</h2>
      
      <el-collapse v-model="activeNames">
        <el-collapse-item title="浏览器信息" name="browser">
          <p><strong>浏览器：</strong>{{ testResults.browser.name }} {{ testResults.browser.version }}</p>
          <p><strong>视口：</strong>{{ testResults.browser.viewport.width }}x{{ testResults.browser.viewport.height }}</p>
          <p><strong>用户代理：</strong>{{ testResults.browser.userAgent }}</p>
        </el-collapse-item>
        
        <el-collapse-item title="API兼容性" name="api">
          <el-tag 
            v-for="api in allAPIs" 
            :key="api.name"
            :type="api.supported ? 'success' : 'danger'"
            style="margin: 5px"
          >
            {{ api.name }}: {{ api.supported ? '✓' : '✗' }}
          </el-tag>
        </el-collapse-item>
        
        <el-collapse-item title="功能测试结果" name="functional">
          <el-table :data="allFunctionalTests" style="width: 100%">
            <el-table-column prop="page" label="页面" width="180" />
            <el-table-column prop="name" label="测试名称" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="warnings" label="警告" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

const testing = ref(false);
const testCompleted = ref(false);
const currentTest = ref('');
const progress = ref(0);
const testResults = ref(null);
const activeNames = ref(['browser', 'api', 'functional']);

const progressStatus = computed(() => {
  if (progress.value === 100) return 'success';
  if (progress.value > 0) return '';
  return 'exception';
});

const allAPIs = computed(() => {
  if (!testResults.value) return [];
  const apis = [];
  testResults.value.tests.forEach(test => {
    test.apiTests.forEach(api => {
      apis.push({ name: api.api, supported: api.supported });
    });
  });
  return apis;
});

const allFunctionalTests = computed(() => {
  if (!testResults.value) return [];
  const tests = [];
  testResults.value.tests.forEach(pageTest => {
    pageTest.functionalTests.forEach(test => {
      tests.push({
        page: pageTest.page,
        name: test.name,
        status: test.status,
        warnings: test.warnings?.join(', ') || '-'
      });
    });
  });
  return tests;
});

const getStatusType = (status) => {
  switch (status) {
    case 'passed': return 'success';
    case 'failed': return 'danger';
    case 'warning': return 'warning';
    default: return 'info';
  }
};

const runTests = async () => {
  testing.value = true;
  progress.value = 0;
  testCompleted.value = false;
  
  try {
    // 动态导入测试脚本
    const { runBrowserCompatibilityTests } = await import('/tests/browser-compatibility/run-tests.js');
    
    // 模拟进度
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 10;
        updateCurrentTest();
      }
    }, 500);
    
    // 运行测试
    const results = await runBrowserCompatibilityTests();
    
    clearInterval(progressInterval);
    progress.value = 100;
    testResults.value = results;
    testCompleted.value = true;
    
    ElMessage.success('兼容性测试完成！');
    
  } catch (error) {
    ElMessage.error(`测试失败：${error.message}`);
    console.error('测试错误：', error);
  } finally {
    testing.value = false;
    currentTest.value = '';
  }
};

const updateCurrentTest = () => {
  const tests = [
    '检查浏览器版本...',
    '测试API支持...',
    '验证CSS兼容性...',
    '测试文件上传功能...',
    '检查响应式布局...',
    '验证组件渲染...'
  ];
  const index = Math.floor(progress.value / 15);
  currentTest.value = tests[index] || '完成测试...';
};

const viewReport = () => {
  // 在新窗口打开报告
  window.open('/tests/browser-compatibility/test-report-template.html', '_blank');
};

const clearResults = () => {
  testResults.value = null;
  testCompleted.value = false;
  progress.value = 0;
  localStorage.removeItem('browserCompatibilityReport');
  ElMessage.info('测试结果已清除');
};
</script>

<style scoped>
.browser-test-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.current-test {
  margin: 30px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.quick-summary {
  margin: 30px 0;
}

.test-details {
  margin: 30px 0;
}
</style>