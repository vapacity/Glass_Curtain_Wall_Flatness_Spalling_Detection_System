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
            <el-image style="width: 400px; height: 200px" :src="scope.row.inputImg" :fit="'cover'"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="outputImg" label="检测图">
          <template #default="scope">
            <el-image style="width: 400px; height: 200px" :src="scope.row.outputImg" :fit="'cover'"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="report" label="详细说明">
          <template #default="scope">
            <el-button type="primary" @click="viewReport(scope.row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="检测报告">
          <template #default="scope">
            <el-button type="primary" text @click="downloadReport(scope.row)">下载报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" title="玻璃平整度检测报告" width="80%">
      <div v-if="responsedata.length > 0">
          <el-table
          :data="responsedata"
          border
          style="width: 100%"
          >
          <el-table-column label="玻璃原图" width="250">
              <template #default="scope"> <img :src="scope.row.outputUrl" alt="原图" style="width: 100%; height: auto;" />
              </template>
          </el-table-column>

          <el-table-column label="算法结果" width="350">
              <template #default="scope"> <div v-for="(analysis, index) in scope.row.analyses" :key="index">
                  <img :src="analysis.url" alt="算法结果" style="width: 100px; height: auto; margin-right: 10px;" />
              </div>
              </template>
          </el-table-column>

          <el-table-column label="算法批注">
              <template #default="scope"> <div v-for="(analysis, index) in scope.row.analyses" :key="index">
                  <p>{{ analysis.analysis }}</p>
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
import { flatnessAPI } from "../../router/axios";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import '../../assets/fonts/simhei-normal'

const router = useRouter();
const backToMain = () => {
  router.push("/");
};

const parentBorder = ref(true);
const tableData = ref([]);
const responsedata = ref([]); // 报告数据
const dialogVisible = ref(false); // 控制显示弹窗

const viewReport = (id) => {
  flatnessAPI
    .post(`/report?id=${id}`, {})
    .then((response) => {
        console.log('检测报告：', response.data.result);
        responsedata.value = response.data.result.map(item => ({
            ...item,
        }));
        dialogVisible.value = true;
    })
    .catch((error) => {
      ElMessage.error('报告获取失败');
      console.error('报告获取失败：', error);
    });
};

onMounted(async() => {
  //从localstorage获取token
  // const authToken = localStorage.getItem('authToken');
  // if(!authToken)
  // {
  //   ElMessage.error('请先登录');
  //   return;
  // }
  // console.log("authToken:",authToken);
  // // 解析token获取用户信息
  // const decoded =iwtDecode(authToken);
  // console.log("user name:",decoded.username);

  try {
    const response = await flatnessAPI.get(`/history?username=zwj`);

    // 使用 Promise.all 来并发处理所有数据
    const processedTableData = await Promise.all(
        response.data.history.map((item) => {
          return {
            id: item.id,
            time: item.timestamp || '',
            result: item.result == 0 ? "不平整" : "平整",
            inputImg: item.inputImg,   // 直接使用返回的图片 URL
            outputImg: item.outputImg,
          };
        })
    );

    // 将处理后的数据赋值给 tableData
    tableData.value = processedTableData;

  } catch (error) {
    ElMessage.error('获取历史失败');
    console.error("获取历史失败", error);
  }
});

  // 报告下载
  const downloadReport = async (row) => {
  const doc = new jsPDF();
  doc.setFont("simhei");
  const marginLeft = 10;
  let y = 10;

  doc.setFontSize(16);
  doc.text("幕墙脉动——玻璃幕墙平整度检测报告", marginLeft, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`检测时间: ${row.time}`, marginLeft, y);
  y += 10;
  doc.text(`识别结果: ${row.result}`, marginLeft, y);
  y += 10;

  // 加载原图
  const inputImg = await loadImage(row.inputImg);
  const outputImg = await loadImage(row.outputImg);

  // 将图片插入PDF（按比例缩放）
  const imgWidth = 180;
  const imgHeight = (inputImg.height / inputImg.width) * imgWidth;
  doc.text("原图：", marginLeft, y);
  y += 5;
  doc.addImage(inputImg, 'JPEG', marginLeft, y, imgWidth, imgHeight);
  y += imgHeight + 5;

  doc.text("检测图像：", marginLeft, y);
  y += 5;
  doc.addImage(outputImg, 'JPEG', marginLeft, y, imgWidth, imgHeight);

  doc.save(`检测报告_${row.time}.pdf`);
};

// 将图片URL转为Image对象
const loadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.src = url;
  });
};
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