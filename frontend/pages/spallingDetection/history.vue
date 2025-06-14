<template>
    <div class="main-container">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; margin-right: 5px">
        <el-button type="primary" @click="backToMain">返回主页</el-button>
      </div>
      <div class="demo-image">
        <el-table :data="tableData" :border="parentBorder" style="width: 100%">
          <el-table-column prop="time" label="检测时间">
            <template #default="scope">
              <!-- 显示文字 -->
              <span>{{ scope.row.time }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="识别结果">
            <template #default="scope">
              <!-- 显示文字 -->
              <span>{{ scope.row.result }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inputImg" label="原图">
            <template #default="scope">
              <el-image style="width: 400px; height: 200px" :src="scope.row.inputImg" :fit="'cover'"></el-image>
            </template>
          </el-table-column>

          <el-table-column prop="outputImg" label="检测图">
            <template #default="scope">
              <el-image style="width: 400px; height: 200px" :src="scope.row.outputImg" :fit="'cover'"></el-image>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  import { ElLoading } from "element-plus";
  
  const router = useRouter();
  const backToMain = () => {
    router.push("/");
  };
  
  const parentBorder = ref(true);
  const tableData = ref([]);
  
  onMounted(async() => {
    //从localstorage获取token
    const authToken = localStorage.getItem('authToken');
    if(!authToken)
    {
      ElMessage({
        message: '请先登录后查看历史记录',
        type: 'warning',
        duration: 3000
      });
      return;
    }
    // console.log("authToken:",authToken);
    // // 解析token获取用户信息
    // const decoded =jwtDecode(authToken);
    // console.log("user name:",decoded.username);

    // 显示加载中提示
    const loading = ElLoading.service({
      lock: true,
      text: '正在加载历史记录...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      const response = await axios.get(`http://110.42.214.164:8006/defect/history?username=zwj`, { timeout: 10000 });
      console.log(response);

      // 检查是否有历史记录
      if (!response.data.history || response.data.history.length === 0) {
        ElMessage({
          message: '暂无检测历史记录',
          type: 'info',
          duration: 3000
        });
        loading.close();
        return;
      }

      // 使用 Promise.all 来并发处理所有数据
      const processedTableData = await Promise.all(
          response.data.history.map((item) => {
            return {
              time: item.timestamp || '',
              result: item.result === 0 ? "未爆裂" : "爆裂",
              inputImg: item.inputImg,  // 直接使用返回的图片 URL
              outputImg: item.outputImg,  // 直接使用返回的图片 URL
            };
          })
      );

      // 将处理后的数据赋值给 tableData
      tableData.value = processedTableData;
      loading.close();
      
      ElMessage({
        message: `成功加载 ${processedTableData.length} 条历史记录`,
        type: 'success',
        duration: 2000
      });

    } catch (error) {
      loading.close();
      
      let errorMsg = '获取历史记录失败';
      if (error.response) {
        if (error.response.status === 500) {
          errorMsg = '服务器错误，请稍后重试';
        } else if (error.response.status === 404) {
          errorMsg = '服务未找到，请联系管理员';
        }
      } else if (error.message.includes('timeout')) {
        errorMsg = '请求超时，请检查网络连接';
      } else if (error.message.includes('Network')) {
        errorMsg = '网络连接失败，请检查网络设置';
      }
      
      ElMessage({
        message: errorMsg,
        type: 'error',
        duration: 5000
      });
      console.error("获取历史失败", error);
    }
  });
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 10px;
  }
  
  .demo-image {
    overflow: auto;
  }
  </style>


