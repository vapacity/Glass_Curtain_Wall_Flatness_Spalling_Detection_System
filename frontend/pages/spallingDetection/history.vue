<template>
    <div class="main-container">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; margin-right: 5px">
        <el-button type="primary" @click="backToMain">返回主页</el-button>
      </div>
      <!-- 检测记录表格 -->
      <div class="demo-image">
        <el-table :data="tableData" :border="parentBorder" style="width: 100%">
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

          <el-table-column label="检测报告">
            <template #default="scope">
              <el-button type="primary" text @click="downloadReport(scope.row)">下载报告</el-button>
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
  import jsPDF from "jspdf";
  import '../../assets/fonts/simhei-normal'
  
  const router = useRouter();

  const backToMain = () => {
    router.push("/");
  };

  // 表格部分
  const parentBorder = ref(true);
  const tableData = ref([]);
  
  onMounted(async() => {
    // //从localstorage获取token
    // const authToken = localStorage.getItem('authToken');
    // if(!authToken)
    // {
    //   ElMessage.error('请先登录');
    //   return;
    // }
    // console.log("authToken:",authToken);
    // // 解析token获取用户信息
    // const decoded =jwtDecode(authToken);
    // console.log("user name:",decoded.username);

    try {
      const response = await axios.get(`http://127.0.0.1:8080/defect/history?username=zwj`, { timeout: 10000 });
      console.log(response);

      // 使用 Promise.all 来并发处理所有数据
      const processedTableData = await Promise.all(
          response.data.history.map((item) => {
            return {
              time: item.timestamp || '',
              result: item.result === 0 ? "未爆裂" : "爆裂",
              inputImg: item.inputImg,  // 直接使用返回的图片 URL
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
    doc.text("幕墙脉动——玻璃幕墙爆裂检测报告", marginLeft, y);
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


