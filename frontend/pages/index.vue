<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="首页"></UDashboardNavbar>
      <div class="main-page">
        <UPageGrid class="custom-margin">
          <UPageCard v-for="(module, index) in modulesLine1" :key="index" v-bind="module"
                     @click="checkPermissionAndRedirect(module)" class="hover-effect">
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
          <div></div>
          <div></div>
          <UPageCard v-for="(module, index) in modulesLine2" :key="index" v-bind="module"
                     @click="checkPermissionAndRedirect(module)" class="hover-effect">
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
          <UPageCard v-for="(module, index) in modulesLine3" :key="index" v-bind="module"
                     @click="checkPermissionAndRedirect(module)" class="hover-effect">
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
          <UPageCard v-for="(module, index) in modulesLine4" :key="index" v-bind="module"
                     @click="checkPermissionAndRedirect(module)" class="hover-effect">
            <template #description>
              <span class="line-clamp-2">{{ module.description }}</span>
            </template>
          </UPageCard>
        </UPageGrid>
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup>
import axios from "axios";
import {ref, reactive} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const router = useRouter();
const userAuth = ref({});

definePageMeta({
  middleware: "auth",
});

const getUserAuth = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("/api/account/custom/getPermissions", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    userAuth.value = response.data.data;
    console.log(userAuth.value);
  } catch (error) {
    console.error("Failed to fetch permissions");
    ElMessage.error("获取用户权限失败");
  }
};
getUserAuth();

const modulesLine1 = reactive([
  {
    title: "实时数据检测",
    description: "检测建筑风振数据，及时报告异常风振情况",
    // to: "",
    target_address: "/monitor",
    permissionKey: "access_system_e",
    icon: "i-simple-icons-tailwindcss",
  }
]);

const modulesLine2 = reactive([
  {
    title: "3D建筑模型",
    description: "用于查看3D建筑模型，可视化反映建筑问题",
    // to: "http://localhost:5173",
    target_address: "http://120.46.136.85:5173",
    icon: "i-simple-icons-googlehome",
    permissionKey: "access_system_a",
  },
  {
    title: "石材裂缝检测",
    description: "用于识别建筑石材幕墙表面裂缝",
    target_address: "http://1.92.72.113:5050",
    permissionKey: "access_system_c",
    icon: "i-simple-icons-affinitypublisher",
  },
  {
    title: "石材污渍检测",
    description: "用于识别建筑石材幕墙表面污渍",
    target_address: "/stonedirty/mainpage",
    icon: "i-heroicons-fire",
    permissionKey: "access_system_b",
  },
]);

const modulesLine3 = reactive([
  {
    title: "幕墙材质分割",
    description: "给定一张建筑幕墙图片，分割出其中的各种材质",
    // to: "",
    target_address: "/segment",
    permissionKey: "access_system_f",
    icon: "i-simple-icons-homeassistantcommunitystore",
  },
  {
    title: "玻璃自爆检测",
    description: "通过图片检测玻璃自爆风险",
    //target_address: "/explosion",
    to: "/spallingDetection/index.vue",
    permissionKey: "access_system_d",
    icon: "i-material-symbols-sound-detection-glass-break-sharp",
  },
  {
    title: "玻璃平整度检测",
    description: "给定一张建筑玻璃图片，检测其平整度",
    to: "/smoothnessDetection/index.vue",
    //target_address: "http://111.231.168.12:3000",
    permissionKey: "access_system_g",
    icon: "i-simple-icons-edgeimpulse",
  },
]);

const modulesLine4 = reactive([
  {
    title: "幕墙韧性评估",
    description: "用于查看评估幕墙韧性",
    // to: "",
    target_address: "/segment",
    permissionKey: "access_system_h",
    target_address: "http://111.231.168.12:8999",
    icon: "i-simple-icons-testcafe",
  },
]);

// const modules = reactive([
//   {
//     title: "3D建筑模型",
//     description: "用于查看3D建筑模型，可视化反映建筑问题",
//     // to: "http://localhost:5173",
//     target_address: "http://120.46.136.85:5173",
//     icon: "i-simple-icons-googlehome",
//     permissionKey: "access_system_a",
//   },
//   {
//     title: "石材污渍检测",
//     description: "用于识别建筑石材幕墙表面污渍",
//     target_address: "/stonedirty/mainpage",
//     icon: "i-heroicons-fire",
//     permissionKey: "access_system_b",
//   },
//   {
//     title: "石材裂缝检测",
//     description: "用于识别建筑石材幕墙表面裂缝",
//     target_address: "http://1.92.72.113:5050",
//     permissionKey: "access_system_c",
//     icon: "i-simple-icons-affinitypublisher",
//   },
//   {
//     title: "玻璃自爆检测",
//     description: "通过图片检测玻璃自爆风险",
//     target_address: "/explosion",
//     // to: "https://github.com/nuxt-community/eslint-module",
//     permissionKey: "access_system_d",
//     icon: "i-material-symbols-sound-detection-glass-break-sharp",
//   },
//   {
//     title: "风振数据检测",
//     description: "检测建筑风振数据，及时报告异常风振情况",
//     // to: "",
//     target_address: "/monitor",
//     permissionKey: "access_system_e",
//     icon: "i-simple-icons-tailwindcss",
//   },
//   {
//     title: "幕墙材质分割",
//     description: "给定一张建筑幕墙图片，分割出其中的各种材质",
//     // to: "",
//     target_address: "/segment",
//     permissionKey: "access_system_f",
//     icon: "i-simple-icons-homeassistantcommunitystore",
//   },
//   {
//     title: "玻璃平整度检测",
//     description: "给定一张建筑玻璃图片，检测其平整度",
//     // to: "https://github.com/vueuse/vueuse",
//     target_address: "http://111.231.168.12:3000",
//     permissionKey: "access_system_g",
//     icon: "i-simple-icons-edgeimpulse",
//   },
// ]);

const checkPermissionAndRedirect = (module) => {
  if (userAuth.value.is_superuser || userAuth.value[module.permissionKey]) {
    if (module.title === "3D建筑模型" || module.title === "玻璃平整度检测" || module.title === "石材裂缝检测" || module.title === "幕墙韧性评估") {
      window.location.href = module.target_address; // 使用window.location.href进行跳转
    } else {
      router.push({path: module.target_address}); // 使用router.push进行跳转
    }
  } else {
    ElMessage.error("您没有权限访问此模块");
  }
};
</script>

<style scoped>
.main-page {
  overflow: auto
}

.custom-margin {
  margin: 20px;
}

.hover-effect:hover {
  background-color: #f0f0f0;
  cursor: pointer;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.back-to-main-btn {
  margin: 5px;
  align-self: flex-end;
  /* 对齐到容器的左侧 */
}
</style>
