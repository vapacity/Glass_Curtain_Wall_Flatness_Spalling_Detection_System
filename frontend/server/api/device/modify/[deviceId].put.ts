// ~/server/api/device/addDevice.ts
import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/device';
/**
 * 接口名称：修改设备信息接口
 * 接口定义：此接口用于处理修改指定设备信息的请求。
 * 输入：
 *   - deviceId: 从URL中提取的设备ID，用于标识要修改的设备，数据类型为 string
 *   - query: 从请求体中提取的设备信息，包含要更新的字段，数据类型为 object
 * 输出：
 *   - 在修改成功的情况下：
 *     - success: true 表示修改成功，数据类型为 boolean
 *     - data: 修改后的设备信息，数据类型为 object
 *   - 在修改失败的情况下：
 *     - error: 包含修改失败的原因，数据类型为 string
 */
export default defineEventHandler(async (event: any) => {
  try {
    // 从请求中提取设备信息
    const query = await readBody(event)
    console.log('query: ', query)

    // 从URL中提取deviceId参数
    const deviceId = getRouterParam(event, 'deviceId')

    // 进行数据验证 ...
    // 可以添加一些验证逻辑，确保接收到的数据是有效的

    // 发起POST请求到原始设备API
    const headers = {
      'Accept': '*/*',
      'Host': '47.120.50.113:8090',
      'Connection': 'keep-alive'
    };
    // 发起POST请求到原始设备API
    const response:any = await axios.put(`${BASE_URL}/modify/${deviceId}`, null, { params: query, headers });

    // 检查响应状态码
    if (response.status === 200) {
      // 设备添加成功
      return { success: true, data: response.data };
    } else {
      // 设备添加失败
      throw new Error('Failed to add device');
    }
  } catch (error: any) {
    // 设置状态码并返回错误信息
    event.res.statusCode = error.response?.status || 500;
    return { error: error.message };
  }
});
