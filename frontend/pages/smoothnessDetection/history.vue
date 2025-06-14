<template>
  <div class="main-container">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; margin-right: 5px">
      <el-button type="primary" @click="backToMain">返回主页</el-button>
    </div>
    <div class="demo-image">
      <el-table :data="tableData" :border="parentBorder" style="width: 100%">
        <el-table-column prop="id" label="检测ID">
          <template #default="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="检测时间">
          <template #default="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="识别结果">
          <template #default="scope">
            <span>{{ scope.row.result }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inputImg" label="原图">
          <template #default="scope">
            <el-image style="width: 400px; height: 200px; display: block; margin: 0 auto" :src="scope.row.inputImg" :fit="'cover'"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="outputImg" label="检测图">
          <template #default="scope">
            <el-image style="width: 400px; height: 200px; display: block; margin: 0 auto" :src="scope.row.outputImg" :fit="'cover'"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="report" label="详细报告">
          <template #default="scope">
            <el-button type="primary" @click="viewReport(scope.row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 报告弹窗 -->
    <el-dialog v-model="dialogVisible" title="玻璃平整度检测报告" width="80%">
      <div v-if="responsedata.length > 0">
        <el-table :data="responsedata" border style="width: 100%">
          <el-table-column class="row"  label="玻璃分割区域图" >
            <template #default="scope">
              <img :src="scope.row.outputUrl" alt="原图" class="center-image"/>
            </template>
          </el-table-column>

          <el-table-column label="不同算法检测结果">
            <template #default="scope">
              <div class="analysis-container">
                <div class="analysis-item" v-for="(analysis, index) in scope.row.analyses" :key="index">
                  <div class="analysis-img-container">
                    <img :src="analysis.url" alt="算法结果" class="analysis-img" />
                  </div>
                  <div class="analysis-comment">
                    <p>{{ analysis.analysis }}</p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </div>

      <div v-else>
        <p>加载中...</p>
      </div>
    </el-dialog>
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
  const responsedata = ref([]); // 报告数据
  const dialogVisible = ref(false); // 控制显示弹窗

  const viewReport = (id) => {
    axios
        .get(`http://110.42.214.164:8002/flatness/getDetail?username=zwj&outputId=${id}`)
        //.get(`http://localhost:8080/flatness/getDetail?username=zwj&outputId=${id}`)
        .then((response) => {
          console.log('检测报告：', response.data.result);
          // // 输出每个 item 的 outputUrl 和 analyses 数组
          // response.data.result.forEach((item, index) => {
          //   console.log(`item[${index}] outputUrl:`, item.outputUrl);
          //   console.log(`item[${index}] analyses:`, item.analyses); // 打印 analyses 数组
          //   item.analyses.forEach((analysis, i) => {
          //     console.log(` analysis[${i}] url:`, analysis.url);
          //     console.log(` analysis[${i}] analysis:`, analysis.analysis);
          //   });
          // });
          // 将响应数据格式化
          responsedata.value = response.data.result.map(item => ({
            outputUrl: item.outputUrl,
            analyses: item.analyses.map(analysis => ({
              url: analysis.url,
              analysis: analysis.analysis
            }))
          }));
          dialogVisible.value = true;
        })
        .catch((error) => {
          let errorMsg = '获取详细报告失败';
          if (error.response) {
            if (error.response.status === 500) {
              errorMsg = '服务器错误，请稍后重试';
            } else if (error.response.status === 404) {
              errorMsg = '报告未找到，可能已被删除';
            }
          } else if (error.message.includes('timeout')) {
            errorMsg = '获取报告超时，请重试';
          }
          
          ElMessage({
            message: errorMsg,
            type: 'error',
            duration: 4000
          });
          console.error('报告获取失败：', error);
        });
  };


  onMounted(async() => {
    //从localstorage获取token
    // const authToken = localStorage.getItem('authToken');
    // if(!authToken)
    // {
    //   ElMessage({
    //     message: '请先登录后查看历史记录',
    //     type: 'warning',
    //     duration: 3000
    //   });
    //   return;
    // }
    // console.log("authToken:",authToken);
    // // 解析token获取用户信息
    // const decoded =iwtDecode(authToken);
    // console.log("user name:",decoded.username);

    // 显示加载中提示
    const loading = ElLoading.service({
      lock: true,
      text: '正在加载平整度检测历史记录...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    try {
      //const response = await axios.get(`http://110.42.214.164:8002/flatness/history?username=zwj`);
      const response = await axios.get(`http://localhost:8080/flatness/history?username=zwj`);
      
      // 检查是否有历史记录
      if (!response.data.history || response.data.history.length === 0) {
        ElMessage({
          message: '暂无平整度检测历史记录',
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
              id: item.outputId,
              time: item.timestamp || '',
              result: item.result == 0 ? "不平整" : "平整",
              inputImg: item.inputImg,  // 直接使用返回的图片 URL
              outputImg: item.outputImg,
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
      
      let errorMsg = '获取平整度检测历史记录失败';
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

.center-image {
  max-width: 300px;
  max-height: 600px;
  display: block;
  margin: 0 auto;
}

.analysis-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.analysis-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd; /* 添加分隔线 */
}

.analysis-item:last-child {
  border-bottom: none; /* 去除最后一项的底部边界 */
}

.analysis-img-container {
  margin-right: 10px;
}

.analysis-img {
  max-width: 100px;
  max-height: 200px;
  margin-bottom: 8px;
}

.analysis-comment {
  text-align: center;
  word-wrap: break-word;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>

