<template>
    <!-- 总布局按钮 -->
    <div class="main-container">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 5px; margin-right: 5px">
        <el-button @click="GoToDash">进入仪表盘</el-button>
        <el-button type="primary" @click="backToMain">返回主页</el-button>
      </div>

      <!-- 上传图片部分 -->
      <el-divider content-position="center">
          本地上传
      </el-divider>
      <div class="upload-container">
        <div v-if="imagePreviewUrl" class="uploaded-image-preview">
          <img :src="imagePreviewUrl" alt="Uploaded Image" class="preview-img" />
          <el-button size="small" type="danger" @click="removeImage">
            删除图片
            <el-icon class="el-icon--right">
              <Close />
            </el-icon>
          </el-button>
        </div>

        <el-upload v-else
          class="upload-demo"
          :action="uploadUrl"
            drag
          :before-upload="beforeUpload"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">拖动文件至区域内或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png files with a size less than 50MB</div>
          </template>
        </el-upload>
      </div>
  
      <!-- 检测按钮 -->
      <el-row :gutter="10">
        <el-col :span="3">
          <el-button type="primary" @click="startDetection">
            开始检测
            <el-icon class="el-icon--right">
              <Upload />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>

      <!-- 检测结果部分 -->
      <el-divider content-position="center">
        检测结果
      </el-divider>

      <el-scrollbar class="scrollbar-container">
        <!-- 文字结果 -->
        <div v-if="ImgResult" class="result-container">
          <div :class="['result', ImgResult === '爆裂' ? 'danger' : 'safe']">
            {{ ImgResult }}
          </div>
        </div>
        <!-- 图片处理结果 -->
        <div v-if="processedImageUrl" class="image-preview">
          <img :src="processedImageUrl" alt="Processed Image" class="preview-img" />
        </div>
      </el-scrollbar>
      
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Upload, Close, UploadFilled } from '@element-plus/icons-vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  // import {jwtDecode} from 'jwt-decode';

  const router = useRouter();
  const downloadImageUrl = ref(''); // 存储上传后的可下载图片路径
  const uploadedFile = ref(null); // 存储上传的文件
  const ImgResult = ref(null); // 爆裂结果
  const imagePreviewUrl = ref(null); // 存储上传图片预览的 URL
  const processedImageUrl = ref(null); // 存储结果图片预览的 URL
  const uploadUrl = ref('http://110.42.214.164:9000/oss/upload/user/upload/'); // 文件上传OSS的 URL
  const filename = ref(''); //上传图片名称

  // 主布局按钮的功能
  const backToMain = () => {
    router.push('/');
  };
  
  const GoToDash = () => {
    router.push({
      name: 'layout',
      params: {
        choice: 'dashboard',
      },
    });
  };

  // 统一当前时间格式
  const getFormattedDate=()=> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 注意：getMonth() 返回的是 0-11
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  // 图片上传至OSS
  const beforeUpload = async (file) => {
    filename.value = getFormattedDate()+'.jpg';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userName', "spalling-detection");
    formData.append('password', "tongji-icw-1805");

    try {
      // 文件名只能包含数字，字母和-
        const response = await axios.post(uploadUrl.value + filename.value, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });
        console.log(`上传成功: ${response.data || '文件已上传'}`);
        downloadImageUrl.value = response.data; 
        uploadedFile.value = file; // 存储上传的文件
        imagePreviewUrl.value = URL.createObjectURL(file); // 创建图片预览的 URL
    } catch (error) {
      ElMessage.error('上传失败');
      console.error('上传失败：', error.response?.data?.message || error.message);
    }

    // 返回 false 会阻止默认的上传行为，交给自定义处理
    return false; 
  };

  // 删除图片
  const removeImage = () => {
    imagePreviewUrl.value = null; // 清空图片预览
    uploadedFile.value = null; // 清空上传的文件
    downloadImageUrl.value = ''; // 清空图片的 URL
    filename = '';
  };

  // 开始检测
  const startDetection = () => {
    //从localstorage获取token
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

    if (!uploadedFile.value) {
        console.error('请先上传图片');
        return;
    }

    // 返回给后端图片下载地址
    let formData = new FormData();
    formData.append('username', "zwj");
    formData.append('url', downloadImageUrl.value);
    console.log("下载原图的url：", downloadImageUrl.value);

    axios
      .post('http://127.0.0.1:8080/defect/classify', formData)
      .then((response) => {
        console.log('检测结果：', response.data);
        ImgResult.value = response.data.result=='defect'?"爆裂":"未爆裂"; // 只提取结果部分
        console.log(ImgResult.value)
        if (ImgResult.value === '爆裂') {
          console.log("12lasdjfklajflkasdjfklasdjflkasjfklasjdfklasj")
            // 如果检测到 defect，调用 process_image 后端 API
            let form = new FormData();
            form.append('username', 'zwj');
            form.append('url', downloadImageUrl.value);
            axios
            .post('http://127.0.0.1:8080/defect/showDefect', form)
            .then((processResponse) => {
                console.log("处理后的图片url：", processResponse.data.downloadUrl); // 后端返回处理后图片的可下载url
                try {
                  // 从oss下载处理后的图片并显示到界面
                  axios.get(processResponse.data.downloadUrl,{
                    responseType: 'blob', // 返回 blob 数据
                  })
                  .then((downloadResponse) => {
                  console.log(downloadResponse.data);
                  processedImageUrl.value = URL.createObjectURL(downloadResponse.data);
                  })
                } catch (error) {
                  ElMessage.error('下载失败');
                  console.error('下载失败：', error.response?.data?.message || error.message);
                }
            })
            .catch((error) => {
              ElMessage.error('处理图片失败');
              console.error('处理图片失败：', error);
            });
        } else {
            // 如果检测到 undefect，直接显示原图
            processedImageUrl.value = imagePreviewUrl.value;
        }
      })
      .catch((error) => {
        ElMessage.error('检测失败');
        console.error('检测失败：', error);
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
  
  /* 上传图片部分 */
  .upload-container {
    padding: 10px;
    background: #f5f7fa;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    text-align: center;
    margin-bottom: 10px;
  }

  .uploaded-image-preview {
    margin-top: 10px;
    display: flex;
    flex-direction: column;  
    justify-content: center;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }

  /* 检测结果部分 */

  .result-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }

  .result {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    padding: 8px 16px;
    border-radius: 8px;
    display: inline-block;
  }

  /* 爆裂时显示为红色背景 */
  .danger {
    background-color: #ffe5e5;
    color: #d32f2f;
    border: 1px solid #f44336;
  }

  /* 未爆裂时显示为绿色背景 */
  .safe {
    background-color: #e8f5e9;
    color: #388e3c;
    border: 1px solid #4caf50;
  }

  .preview-img {
    max-height: 200px;
    width: auto;
    border-radius: 5px;
  }

  .scrollbar-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  </style>
  