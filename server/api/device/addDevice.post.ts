// ~/server/api/device/addDevice.ts
import axios from 'axios';
import { defineEventHandler } from 'h3';

const BASE_URL = 'http://111.231.168.12:8180/api/device';
/**
 * 接口名称：添加设备接口
 * 接口定义：此接口用于处理添加新设备的请求。
 * 输入：
 *   - query: 从请求体中提取的设备信息，包含要添加的新设备的数据，数据类型为 object
 * 输出：
 *   - 在添加成功的情况下：
 *     - success: true 表示添加成功，数据类型为 boolean
 *     - data: 添加后的设备信息，数据类型为 object
 *   - 在设备ID已存在的情况下：
 *     - error: 包含设备ID已存在的错误信息，数据类型为 string
 *   - 在添加失败的情况下：
 *     - error: 包含添加失败的原因，数据类型为 string
 */
export default defineEventHandler(async (event: any) => {
  try {
    // 从请求中提取设备信息
    const query = await readBody(event)
    console.log('query: ', query)

    // 进行数据验证 ...
    // 可以添加一些验证逻辑，确保接收到的数据是有效的

    // 发起POST请求到原始设备API
    const headers = {
      'Accept': '*/*',
      'Host': '47.120.50.113:8090',
      'Connection': 'keep-alive'
    };
    // 发起POST请求到原始设备API
    const response:any = await axios.post(`${BASE_URL}/addDevice`, null, { params: query, headers });
    // const response:any = await axios.post(`${BASE_URL}/addDevice`, deviceInfo);

    // 检查响应状态码
    if (response.status === 200) {
      // 设备添加成功
      return { success: true, data: response.data };
    } else if (response.status === 409) {
      // 设备ID已存在
      throw new Error('Invalid device ID! Please try again!');
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
